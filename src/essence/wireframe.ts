import * as path from 'path';
import * as fs from 'fs/promises';
import { getWireframeForPage } from './content';
import { ConstructableComponent } from './component';


function generateInitScript(component: ConstructableComponent): string {
  return `
    <script type="module">
      import {di, ComponentManager} from '/essence.js';
      import {${component.constructorName}} from './${component.name}.js';

      const componentManager = di.get(ComponentManager);
      componentManager.changeToComponent(${component.constructorName});
    </script>
  `;
}

export class ComponentWireframe {
  public static async loadForComponent(rootDirectory: string, componentName: string) {
    const wireframe = await getWireframeForPage(rootDirectory, componentName);
    return new ComponentWireframe(wireframe.htmlContent, wireframe.cssContent);
  }

  private constructor(private htmlContent: string, private cssContent: string) {
  }

  public async transformForBrowser(component: ConstructableComponent): Promise<void> {
    // TODO: might want to use jsdom to remove some of the hardcoded values here
    const [topContent, contentAfterHead] = this.htmlContent.split('</head>');

    const [topBodyContent, contentAfterBody] = contentAfterHead.split('</body>');

    // TODO: get title, description and other meta from .meta file
    this.htmlContent = topContent.replace('${TITLE}', component.name) +
      `  <style>${this.cssContent}</style>\n` +
      `</head>` +
      topBodyContent +
      `   ${generateInitScript(component)}
    </body>` + contentAfterBody;

    // attach css to the head (inline to ensure loaded fast)
    // attach <script type="module" src="essence.js"></script>
    // attach init script <script>essence.componentManager.changeComponent(Home);
    /*<script>
      import {di} from "essence"; // make sure essence is loaded
      import {Home} from './home'; // make sure component is loaded

      di.componentManager.changeToComponent(Home); // change to component using framework

    </script>*/
    // attach <script type="module">import {Home} from "./home.js"; import {} from "essence.js" </script>
  }

  public async save(targetDirectory: string): Promise<void> {
    await fs.writeFile(path.join(targetDirectory, `index.html`), this.htmlContent, { encoding: 'utf-8' });
  }
}
