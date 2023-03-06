import * as path from 'path';
import * as fs from 'fs/promises';
import * as esbuild from 'esbuild'


const INIT_REPLACE = `init() {
  let config = this.config();
  const inputSignals = (config.inputs || []).map(input => {
    const element = document.querySelector(input.selector);
    if (!element) {
      console.error('could not find element with selector: ', input.selector)
      return;
    }

    signal = (new AbortController()).signal;

    element.addEventListener('input', input.change, {signal});

    return signal;
  });

  const eventSignals = (config.events || []).map(ev => {
    const element = document.querySelector(ev.selector);
    if (!element) {
      console.error('could not find element with selector: ', ev.selector)
      return;
    }
    signal = (new AbortController()).signal;
    element.addEventListener(ev.event, ev.callback, {signal});

    return signal;
  });

  state.eventListenerSignals = inputSignals.concat(eventSignals);

  (config.bindings || []).forEach(binding => {
    const element = document.querySelector(binding.selector);
    if (!element) {
      console.error('could not find element with selector:', binding.selector);
      return;
    }

    let statePropertyName = binding.propertyName + '_state';

    state = {
      ...state,
      [statePropertyName]: state[binding.propertyName],
      get [binding.propertyName]() {
        return state[statePropertyName];
      },
      set [binding.propertyName](value) {
        state[statePropertyName] = value;
        element.innerText = value;
      }
    };
  });
`;

const DESTROY_REPLACE = `destroy() {
  state.eventListenerSignals.forEach(signal => signal.abort());
`;

interface WireframeContent {
  htmlContent: string;
  cssContent: string;
}

function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

async function getOptionalFile(path: string): Promise<string | undefined> {
  try {
    return await fs.readFile(path, { encoding: 'utf-8' });
  } catch (_) {
  }
  return undefined;
}

async function generateHtmlFile(rootPath: string, pageName: string, wireframe: WireframeContent): Promise<void> {
  // TODO: maybe use AST/tokens to make it easier to add/replace things in the wireframe (use xml library since html is just xml+)
  const [topContent, contentAfterHead] = wireframe.htmlContent.split('</head>');

  const [topBodyContent, contentAfterBody] = contentAfterHead.split('</body>');

  // TODO: get title, description and other meta from .meta file
  const finalContent = topContent.replace('${TITLE}', pageName) +
    `  <style>${wireframe.cssContent}</style>\n` +
    `</head>` +
    topBodyContent +
    `   <script src="../essence.js"></script>
        <script>componentManager.changeComponent(router.urlForComponent('${pageName}'), '${pageName}');</script>
  </body>` + contentAfterBody;

  await fs.writeFile(path.join('dist', rootPath, pageName, `index.html`), finalContent, { encoding: 'utf-8' });
}

async function generateJsFile(rootPath: string, pageName: string, componentHtml: string, componentJs: string): Promise<void> {
  let result = ``;

  const patchedInitJs = componentJs.replace('init() {', INIT_REPLACE);
  const patchedDestroyJs = patchedInitJs.replace('destroy() {', DESTROY_REPLACE);


  result += `${patchedDestroyJs}`;

  const data = await esbuild.transform(result, {
    platform: "browser",
    format: "iife",
    loader: 'js'
  });

  await fs.writeFile(path.join('dist', rootPath, pageName, `${pageName}.js`), data.code, { encoding: 'utf-8' });
}

export async function getWireframeForPage(rootPath: string, pageName: string): Promise<WireframeContent> {
  const pagesPath = path.join(rootPath, 'pages');

  const htmlContent = await (async () => {
    const pageHtml = await getOptionalFile(path.join(pagesPath, pageName, 'wireframe.html'));
    if (isDefined(pageHtml)) {
      return pageHtml;
    }

    const pagesHtml = await getOptionalFile(path.join(pagesPath, 'wireframe.html'));
    if (isDefined(pagesHtml)) {
      return pagesHtml;
    }

    return await getOptionalFile(path.join(rootPath, 'wireframe.html'));
  })();

  const cssContent = await (async () => {
    const pageCss = await getOptionalFile(path.join(pagesPath, pageName, 'wireframe.css'));
    if (isDefined(pageCss)) {
      return pageCss;
    }

    const pagesCss = await getOptionalFile(path.join(pagesPath, 'wireframe.css'));
    if (isDefined(pagesCss)) {
      return pagesCss;
    }

    return await getOptionalFile(path.join(rootPath, 'wireframe.css'));
  })();

  if (!isDefined(htmlContent) || !isDefined(cssContent)) {
    return Promise.reject("Could not find wireframe content!, please ensure you have provided a wireframe somewhere in the project hierarchy.");
  }

  return {
    htmlContent,
    cssContent
  };
}

export async function generatePrerenderedPage(
  rootPath: string,
  pageName: string,
  componentHtml: string,
  componentJs: string,
  wireframe: WireframeContent
): Promise<void> {
  await generateHtmlFile(rootPath, pageName, wireframe);
  await generateJsFile(rootPath, pageName, componentHtml, componentJs);
}