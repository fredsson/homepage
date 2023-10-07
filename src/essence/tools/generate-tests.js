const glob = require('glob');
const fs = require('fs/promises');
const path = require('path');
const esbuild = require('esbuild');

function runTestsForPattern(pattern) {
  glob.glob(pattern).then(async files => {
    await fs.rm('dist/test', {recursive: true, force: true});
    await fs.mkdir('dist/test', {recursive: true});

    const filesUnderTest = files.map(f => f.replace('.spec', ''));
    filesUnderTest.forEach(async f => {
      const content = await fs.readFile(f, {encoding: 'utf-8'});

      const transpiledContent = await esbuild.transform(content, {format: 'esm', loader: 'ts'});

      const segments = f.split('/');
      const filename = segments[segments.length - 1].replace('.ts', '.js');
      await fs.writeFile(path.join('dist/test', filename), transpiledContent.code, {encoding: 'utf-8'});
    });

    const loadedTestFiles = await Promise.all(files.map(f => fs.readFile(f, {encoding: 'utf-8'})));

    const transpiledTests = await Promise.all(loadedTestFiles.map(f => esbuild.transform(f, {format: 'esm', loader: 'ts'})));

    await fs.writeFile('dist/test/test-entry.js', transpiledTests.map(t => t.code).join(''), {encoding: 'utf-8'});
  });
}

const file = process.argv[2];
if (file) {
  runTestsForPattern(file);
} else {
  runTestsForPattern('src/**/*.spec.ts');
}


