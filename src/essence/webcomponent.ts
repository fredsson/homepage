import { getOptionalFile } from './content';
import { isDefined } from './core';
import { DependencyResolver } from './tools/dependency-resolver';
import * as fs from 'fs/promises';

import * as path from 'path';
import * as esbuild from 'esbuild';

const INIT_REPLACE = `init(root) {
  this.state.eventAbortController = new AbortController();

  let config = this.config();
  (config.inputs || []).forEach(input => {
    const element = root.querySelector(input.selector);
    if (!element) {
      console.error('could not find element with selector: ', input.selector)
      return;
    }

    element.addEventListener('input', input.change, {signal: this.state.eventAbortController.signal});
  });

  (config.events || []).forEach(ev => {
    const element = root.querySelector(ev.selector);
    if (!element) {
      console.error('could not find element with selector: ', ev.selector)
      return;
    }
    element.addEventListener(ev.event, ev.callback, {signal: this.state.eventAbortController.signal});
  });

  (config.bindings || []).forEach(binding => {
    const element = root.querySelector(binding.selector);
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

export class WebComponent {
  public static async load(rootDirectory: string, componentName: string): Promise<WebComponent> {
    const componentPath = path.join(rootDirectory, 'components', componentName, componentName);

    const [tsSource, htmlSource, cssSource] = await Promise.all([
      getOptionalFile(`${componentPath}.ts`),
      getOptionalFile(`${componentPath}.html`),
      getOptionalFile(`${componentPath}.css`),
    ]);

    if (!isDefined(tsSource) || !isDefined(htmlSource)) {
      throw new Error('Component must have a ts and html source!');
    }

    return new WebComponent(componentName, tsSource, htmlSource, cssSource);
  }

  public readonly className: string;

  private jsSource: string | undefined;

  private dependencyResolver = new DependencyResolver();

  private constructor(
    private name: string,
    private tsSource: string,
    private htmlSource: string,
    private cssSource: string | undefined
  ) {
    this.className = this.findClassNameFromTsSource(tsSource);
  }

  public async transformForBrowser(): Promise<void> {
    const inject = this.dependencyResolver.resolveForSource(this.tsSource);
    if (isDefined(inject)) {
      const startOfTsClass = this.tsSource.indexOf('export class');
      const endOfTsClass = this.tsSource.indexOf('{', startOfTsClass) + 1;
      const classDefinition = this.tsSource.substring(startOfTsClass, endOfTsClass);

      this.tsSource = this.tsSource.replace(classDefinition, `${classDefinition}\n  ${inject}`);
    }

    const componentTagName = this.findTagNameFromClassName(this.className);
    this.tsSource += `\n\n
    export const init = (deps) => {
      customElements.define('${componentTagName}', class ${this.className}Component extends HTMLElement {
        public component;

        constructor() {
          super();
          this.component = new ${this.className}(deps);
        }

        connectedCallback() {
          const shadowRoot = this.attachShadow({mode:"open"});

          shadowRoot.innerHTML = this.component.content;

          const style = document.createElement('style');
          style.innerHTML = this.component.style;
          shadowRoot.appendChild(style);


          this.component.init(shadowRoot);
        }

        disconnectedCallback() {
          this.component.destroy();
        }
      });
    };
    `;

    const transformResult = await esbuild.transform(this.tsSource, {platform: "browser", loader: "ts"});

    // attach component html to js file
    const startOfClass = `export class ${this.className} {`;
    let replacementCode: string;
    if (isDefined(this.cssSource) && this.cssSource.length > 0) {
      replacementCode = `${startOfClass}\n  content = \`${this.htmlSource}\`;\n  style = \`${this.cssSource}\`;\n  state = {};`;
    } else {
      replacementCode = `${startOfClass}\n  content = \`${this.htmlSource}\`;\n  state = {};`;
    }
    const jsWithAttachedHtml = transformResult.code.replace(startOfClass, replacementCode);

    // patch components with essence setup (config -> eventListeners)
    this.jsSource = jsWithAttachedHtml
      .replace('init() {', INIT_REPLACE)
      .replace('destroy() {', DESTROY_REPLACE);
  }

  public async saveForBundling(targetDirectory: string): Promise<string | undefined> {
    if (!isDefined(this.jsSource)) {
      console.warn(`Did not save component ${this.name} since source is empty. Did you forget to transform first?`);
      return Promise.resolve(undefined);
    }

    const outputDirectory = path.join(targetDirectory, this.name);
    await fs.mkdir(outputDirectory, { recursive: true });

    const targetPath = path.join(outputDirectory, this.name + '.js');
    await fs.writeFile(targetPath, this.jsSource, { encoding: 'utf-8' });
    return targetPath;
  }



  private findClassNameFromTsSource(tsSource: string): string {
    const distanceToStart = 'export class'.length
    const startOfClassName = tsSource.indexOf('export class') + distanceToStart;
    const endOfClassName = ['{', 'extends', 'implements']
      .map(e => tsSource.indexOf(e, startOfClassName))
      .filter(i => i >= 0)
      .sort((a,b) => a-b)[0];

    return tsSource.substring(startOfClassName, endOfClassName).trim();
  }

  private findTagNameFromClassName(className: string): string {
    return `app-${className.toLocaleLowerCase()}`;
  }
}
