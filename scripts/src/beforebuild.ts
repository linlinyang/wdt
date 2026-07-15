// 预构建项目依赖包
import fs from 'node:fs/promises';
import nodePath from 'node:path';
import fg from 'fast-glob';
import concurrently from 'concurrently';

const build = async () => {
  const paths = await fg.glob('./**/package.json', {
    ignore: [
      '**/node_modules/**',
    ],
  });
  const commands: string[] = [];
  try {
    await Promise.all(paths.map(async (path) => {
      const pkgStr = await fs.readFile(path, 'utf-8');
      const pkg = JSON.parse(pkgStr);
      if (pkg.prescript) {
        commands.push(`pnpm -C ${ nodePath.dirname(path) } ${ pkg.prescript }`);
      }
    }));
    // 并行预构建项目依赖项目
    concurrently(commands);
  } catch (error) {
    console.error(error);
  }
};

build();
