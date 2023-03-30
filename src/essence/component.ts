import * as path from 'path';
import * as fs from 'fs/promises';
import * as esbuild from 'esbuild';

import { getOptionalFile } from './content';
import { isDefined } from './core';
import { ComponentWireframe } from './wireframe';
import { DependencyResolver } from './tools/dependency-resolver';

const INIT_REPLACE = `init() {
  this.state.eventAbortController = new AbortController();

  let config = this.config();
  (config.inputs || []).forEach(input => {
    const element = document.querySelector(input.selector);
    if (!element) {
      console.error('could not find element with selector: ', input.selector)
      return;
    }

    element.addEventListener('input', input.change, {signal: this.state.eventAbortController.signal});
  });

  (config.events || []).forEach(ev => {
    const element = document.querySelector(ev.selector);
    if (!element) {
      console.error('could not find element with selector: ', ev.selector)
      return;
    }
    element.addEventListener(ev.event, ev.callback, {signal: this.state.eventAbortController.signal});
  });

  (config.bindings || []).forEach(binding => {
    const element = document.querySelector(binding.selector);
    if (!element) {
      console.error('could not find element with selector:', binding.selector);
      return;
    }

    let statePropertyName = binding.propertyName + '_state';

    this.state = {
      ...this.state,
      [statePropertyName]: this.state[binding.propertyName],
      get [binding.propertyName]() {
        return this.state[statePropertyName];
      },
      set [binding.propertyName](value) {
        this.state[statePropertyName] = value;
        element.innerText = value;
      }
    };
  });
`;

const DESTROY_REPLACE = `destroy() {
  this.state.eventAbortController.abort();
`;

export interface ConstructableComponent {
  name: string;
  constructorName: string;
}

export class Component {
  public static async load(rootDirectory: string, componentName: string): Promise<Component> {
    const componentPath = path.join(rootDirectory, 'pages', componentName, componentName);

    const [tsSource, htmlSource, cssSource] = await Promise.all([
      getOptionalFile(`${componentPath}.ts`),
      getOptionalFile(`${componentPath}.html`),
      getOptionalFile(`${componentPath}.css`),
    ]);

    if (!isDefined(tsSource) || !isDefined(htmlSource)) {
      throw new Error('Component must have a ts and html source!');
    }

    return new Component(
      componentName,
      tsSource,
      htmlSource,
      cssSource,
      await ComponentWireframe.loadForComponent(rootDirectory, componentName)
    );
  }

  public readonly constructorName: string;

  private jsSource: string | undefined;

  private dependencyResolver = new DependencyResolver();

  private constructor(
    public readonly name: string,
    private tsSource: string,
    private htmlSource: string,
    private cssSource: string | undefined,
    private wireframe: ComponentWireframe
  ) {
    this.constructorName = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }

  /**
   * Transform this component to something that can be loaded in the browser and used with essence
   */
  public async transformForBrowser(): Promise<void> {
    // add inject points based on constructor
    const inject = this.dependencyResolver.resolveForSource(this.tsSource);
    if (isDefined(inject)) {
      const startOfTsClass = this.tsSource.indexOf('export class');
      const endOfTsClass = this.tsSource.indexOf('{', startOfTsClass) + 1;
      const tsClass = this.tsSource.substring(startOfTsClass, endOfTsClass);

      this.tsSource = this.tsSource.replace(tsClass, `${tsClass}\n  ${inject}`);
    }

    // transform ts to js
    const transformResult = await esbuild.transform(this.tsSource, {platform: "browser", loader: "ts"});

    // attach component html to js file
    const startOfClass = `export class ${this.constructorName} {`;
    const jsWithAttachedHtml = transformResult.code.replace(startOfClass, `${startOfClass}\n  content = \`${this.htmlSource}\`;state = {}`);

    // patch components with essence setup (config -> eventListeners)
    this.jsSource = jsWithAttachedHtml
      .replace('init() {', INIT_REPLACE)
      .replace('destroy() {', DESTROY_REPLACE);
  }

  /**
   * Saves the final js file so that it can be used in the bundling with esbuild later
   */
  public async saveForBundling(targetDirectory: string): Promise<string | undefined> {
    if (!isDefined(this.jsSource)) {
      console.warn(`Did not save component ${this.name} since source is empty. Did you forget to transform first?`);
      return Promise.resolve(undefined);
    }

    const outputDirectory = this.buildOutputPath(targetDirectory);
    await fs.mkdir(outputDirectory, { recursive: true });

    const targetPath = path.join(outputDirectory, this.name + '.js');
    await fs.writeFile(targetPath, this.jsSource, { encoding: 'utf-8' });
    return targetPath;
  }

  /**
   * Saves html file containing wireframe and script for loading component
   */
  public async saveForBrowser(targetDirectory: string): Promise<void> {
    await this.wireframe.transformForBrowser(this);
    await this.wireframe.save(this.buildOutputPath(targetDirectory));
  }

  private buildOutputPath(targetDirectory: string): string {
    if (this.name.includes('home')) {
      return targetDirectory;
    }

    return path.join(targetDirectory, this.name);
  }
}
