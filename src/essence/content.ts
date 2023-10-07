import * as path from 'path';
import * as fs from 'fs/promises';

interface WireframeContent {
  htmlContent: string;
  cssContent: string;
}

function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export async function getOptionalFile(path: string): Promise<string | undefined> {
  try {
    return await fs.readFile(path, { encoding: 'utf-8' });
  } catch (_) {
  }
  return undefined;
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
    throw new Error("Could not find wireframe content!, please ensure you have provided a wireframe somewhere in the project hierarchy.");
  }

  return {
    htmlContent,
    cssContent
  };
}
