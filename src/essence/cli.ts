import * as path from 'path';
import * as fs from 'fs/promises';
import { Dirent, FSWatcher, watch } from 'fs';

import * as esbuild from 'esbuild'
import { Component } from './component';
import { isDefined } from './core';

const watchers: FSWatcher[] = [];

async function walkDirectory(rootPath: string): Promise<Dirent[]> {
  const rootEntries = await fs.readdir(rootPath, { withFileTypes: true });

  const directories = rootEntries;

  const e = (await Promise.all(rootEntries
    .filter(e => e.isDirectory())
    .map(e => path.join(rootPath, e.name))
    .map(entryPath => walkDirectory(entryPath)))).flat();

  return directories.concat(e);
}

async function findAllPageDirectories(pagesPath: string): Promise<Dirent[]> {
  const pages = await walkDirectory(pagesPath);

  return pages.filter(d => d.isDirectory());
}

let isRunning = false;
let newChanges = false;

async function main(rootPath: string, name: string): Promise<void> {
  console.log('generating website for', name);

  await fs.rm(path.join('dist'), {recursive: true, force: true});
  await fs.mkdir(path.join('dist'), { recursive: true });

  await fs.rm(path.join('out', name), {recursive: true, force: true});
  await fs.mkdir(path.join('out', name), { recursive: true });

  const pagesPath = path.join(rootPath, 'pages');
  const pageDirectories = await findAllPageDirectories(pagesPath);
  const components = await Promise.all(pageDirectories.map(dirent => Component.load(rootPath, dirent.name)));

  const bundleEntries = await Promise.all(components.map(async component => {
    const jsTargetDirectory = path.join('out', name, 'js');
    await component.transformForBrowser();
    return await component.saveForBundling(jsTargetDirectory);
  }));

  await esbuild.build({
    bundle: true,
    splitting: true,
    chunkNames: 'chunks/[hash].[name]',
    entryPoints: bundleEntries.filter(isDefined),
    outdir: `out/${name}/bundle`,
    format: 'esm'
  });

  const hasGlobalStyles = (await fs.stat('src/styles.css')).isFile();

  await Promise.all(components.map(async c => {
    await c.saveForBrowser(`out/${name}/bundle`, hasGlobalStyles);
  }));

  await fs.cp(path.join('assets'), 'dist/assets', {recursive: true});
  await fs.cp(path.join('out', name, 'bundle/'), 'dist/', {recursive: true});
  await fs.cp('out/essence/essence.js', 'dist/essence.js');
  if (hasGlobalStyles) {
    await fs.cp('src/styles.css', 'dist/styles.css');
  }

  // create final dist directory
  //   add assets directory
  //   add essence.js
  //   add everything from project/out directory
  //   add _redirects
  //   add robots.txt
  //   add sitemap (link it in the robots.txt)

  // would be nice with a command that runs this command and then starts a webserver running in the final dist directory
  // would be nice with a command to auto generate a component

  console.log('website generation done..');

  if (newChanges) {
    newChanges = false;
    await main(rootPath, name);
  }

  isRunning = false;
}

function watchForChanges(rootPath: string, name: string) {
  watchers.push(watch('src', {recursive: true}, (ev, filename) => {
    if (isRunning) {
      newChanges = true;
      return;
    }
    isRunning = true;
    main(rootPath, name);
  }));

  watchers.push(watch('assets', {recursive: true}, (ev, filename) => {
    if (isRunning) {
      newChanges = true;
      return;
    }
    isRunning = true;
    main(rootPath, name);
  }));
}

const rootPath = process.argv[2];
const name = process.argv[3];
main(rootPath, name);

watchForChanges(rootPath, name);

process.on('exit', () => {
  watchers.forEach(w => w.close());
});

