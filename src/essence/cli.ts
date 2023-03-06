import * as path from 'path';
import * as fs from 'fs/promises';
import { Dirent } from 'fs';
import { generatePrerenderedPage, getWireframeForPage } from './content';

import * as esbuild from 'esbuild'


/**
 * @param {string} rootPath
 * @returns {Promise<Dirent[]>}
 */
async function walkDirectory(rootPath: string): Promise<Dirent[]> {
  const rootEntries = await fs.readdir(rootPath, { withFileTypes: true });

  const directories = rootEntries;

  const e = (await Promise.all(rootEntries
    .filter(e => e.isDirectory())
    .map(e => path.join(rootPath, e.name))
    .map(entryPath => walkDirectory(entryPath)))).flat();

  return directories.concat(e);
}

async function ensureProjectDistDirectories(rootPath: string, pagesPath: string): Promise<Dirent[]> {
  const pages = await walkDirectory(pagesPath);

  await fs.mkdir(path.join('dist', rootPath), { recursive: true });

  const pageDirectories = pages.filter(d => d.isDirectory());
  await Promise.all(pageDirectories
    .map(d => fs.mkdir(path.join('dist', rootPath, d.name), { recursive: true }))
  );

  return pageDirectories;
}

async function main(rootPath: string): Promise<void> {
  console.log('generating website for', rootPath);

  const pagesPath = path.join(rootPath, 'pages');
  const pageDirectories = await ensureProjectDistDirectories(rootPath, pagesPath);

  pageDirectories.forEach(async dirent => {
    try {
      const componentPath = path.join(pagesPath, dirent.name, `${dirent.name}`);

      const componentTs = await fs.readFile(`${componentPath}.ts`, { encoding: 'utf-8' });

      const componentJs = await esbuild.transform(componentTs, {platform: "browser", loader: "ts"});

      const wireframe = await getWireframeForPage(rootPath, dirent.name);
      const componentHtml = await fs.readFile(path.join(pagesPath, dirent.name, `${dirent.name}.html`), { encoding: 'utf-8' });
      await generatePrerenderedPage(rootPath, dirent.name, componentHtml, componentJs.code, wireframe);

      console.log('website generation done..');
    } catch(error) {
      console.error(error);
    }
  });
}

const rootPath = process.argv[2];
main(rootPath);