import { build } from 'vite';
import { getModuleBuildConfig, getFullBuildConfig } from './options';
import { run } from './utils';
import { mkdir } from 'fs/promises';
import { outDir, projectRoot } from './content';
import {
  genTypesDefinitions,
  copyStyles,
  buildComponentScss,
  copyPackageJSON,
} from './tasks';
import { copy } from 'fs-extra';
import { join } from 'node:path';

const init = async () => {
  await run('pnpm run clean');
  // 创建dist目录
  await mkdir(outDir, { recursive: true });
};

export const copyFiles = async () => {
  return Promise.all([
    copyPackageJSON(),
    copy(join(projectRoot, 'README.md'), join(outDir, 'README.md')),
    copy(join(projectRoot, 'typings', 'global.d.ts'), join(outDir, 'global.d.ts')),
  ]);
};

const main = async () => {
  await init();
  copyFiles();
  getFullBuildConfig().then(build);
  getFullBuildConfig(false).then(build);
  getModuleBuildConfig().then(build);
  genTypesDefinitions();
  copyStyles();
  buildComponentScss();
};
main();
