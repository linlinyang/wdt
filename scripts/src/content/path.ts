import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

// 当前文件路径
const currentDir = dirname(fileURLToPath(import.meta.url));
// 当前自动化脚本目录
export const scriptsDir = join(currentDir, '..');
// 当前项目根目录
export const projectRoot = join(scriptsDir, '..', '..');
// package目录
export const packagesDir = join(projectRoot, 'packages');
// wdt包目录
export const wdtPackagesDir = join(packagesDir, 'wdt');
// 组件包目录
export const componentPackagesDir = join(packagesDir, 'components');
// style包目录
export const stylePackagesDir = join(packagesDir, 'styles');
// 输出目录
export const outDir = join(projectRoot, 'dist');
// es 输出目录
export const esOutDir = join(outDir, 'es');
// lib 输出目录
export const libOutDir = join(outDir, 'lib');
// types输出目录
export const typesOutDir = join(outDir, 'types');
// 组件css输出目录
export const comStyleOutDir = join(esOutDir, 'theme');
