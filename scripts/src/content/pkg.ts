export const PKG_PREFIX = '@wdt';
export const PKG_NAME = 'wdt';

import { readFile } from 'node:fs/promises';
import type { PackageJson } from 'type-fest';
import { join } from 'node:path';

/**
 * 解析package.json文件
 * @param path package.json文件路径
 * @returns package.json对象
 * 
 * @example
 * const pkg = await resolvePackage('../src/package.json');
 * const pkg = await resolvePackage('../src');
 * 
 * => {
 *  name: 'package-name',
 *  version: '1.0.0',
 *  description: 'description',
 *  author: 'author-name',
 *  ...
 * }
 */
export const resolvePackage = async (path: string): Promise<null | PackageJson> => {
  try {
    const extPath = path.endsWith('.json') ? path : join(path, 'package.json');
    const pkg = await readFile(extPath, 'utf-8');
    return JSON.parse(pkg) as PackageJson;
  } catch {
    return null;
  }
};
