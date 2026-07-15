import { run } from "../utils";
import { typesOutDir, PKG_NAME } from "../content";
import { join, dirname } from "node:path";
import glob from "fast-glob";
import { readFile, writeFile } from "node:fs/promises";
import { ensureDir, remove } from "fs-extra";

const contentRewrite = (id: string) => id
  // 工作空间包名称替换
  .replaceAll('@wdt/', 'wdt/');

const pathRewrite = (id: string) => id
  // 路径去除src
  .replace('/src/', '/')
  // 源文件拷贝至dist根目录
  .replace(new RegExp(`/types/packages(/${ PKG_NAME })*`), '/es');

export const genTypesDefinitions = async () => {
  await run('pnpm exec vue-tsc -p tsconfig.build.json');
  const typesDir = join(typesOutDir, 'packages');
  const filePaths = await glob('**/*.d.ts', {
    cwd: typesDir,
    absolute: true,
  });
  const rewritePs = filePaths.map(async (path) => {
    const content = await readFile(path, 'utf-8');
    const destPath = pathRewrite(path);
    const destDir = dirname(destPath);
    await ensureDir(destDir);
    await writeFile(destPath, contentRewrite(content), 'utf-8');
  });
  await Promise.all(rewritePs);
  await remove(typesOutDir);
};
