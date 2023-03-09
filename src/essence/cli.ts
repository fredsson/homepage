import * as path from 'path';
import * as fs from 'fs/promises';
import { Dirent } from 'fs';

import * as esbuild from 'esbuild'
import { Component } from './component';
import { isDefined } from './core';


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

async function ensureProjectDistDirectories(pageName: string, pagesPath: string): Promise<Dirent[]> {
  const pages = await walkDirectory(pagesPath);

  await fs.mkdir(path.join('dist', pageName), { recursive: true });

  const pageDirectories = pages.filter(d => d.isDirectory());
  await Promise.all(pageDirectories
    .map(async d => {
      await fs.mkdir(path.join('dist', pageName, 'out', d.name), { recursive: true });
      await fs.mkdir(path.join('dist', pageName, 'js', d.name), { recursive: true });
    })
  );

  return pageDirectories;
}

async function main(rootPath: string, name: string): Promise<void> {
  console.log('generating website for', name);

  await fs.rm(path.join('dist', name), {recursive: true, force: true});

  const pagesPath = path.join(rootPath, 'pages');
  const pageDirectories = await ensureProjectDistDirectories(name, pagesPath);
  const components = await Promise.all(pageDirectories.map(dirent => Component.load(rootPath, dirent.name)));

  const bundleEntries = await Promise.all(components.map(async component => {
    const jsTargetDirectory = path.join('dist', name, 'js');
    await component.transformForBrowser();
    return await component.saveForBundling(jsTargetDirectory);
  }));

  await esbuild.build({
    bundle: true,
    splitting: true,
    chunkNames: 'chunks/[hash].[name]',
    entryPoints: bundleEntries.filter(isDefined),
    outdir: `dist/${name}/out`,
    format: 'esm'
  });

  await Promise.all(components.map(async c => {
    await c.saveForBrowser(`dist/${name}/out`);
  }));

  console.log('website generation done..');
}

const rootPath = process.argv[2];
const name = process.argv[3];
main(rootPath, name);
