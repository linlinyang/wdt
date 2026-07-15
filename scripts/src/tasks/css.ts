import { copy, ensureDir } from 'fs-extra';
import glob from 'fast-glob';
import {
  stylePackagesDir,
  componentPackagesDir,
  comStyleOutDir,
  esOutDir
} from '../content';
import { join } from 'node:path';
import { compileAsync, type Importer, type ImporterResult} from 'sass';
import { readFile, writeFile } from 'fs/promises';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// 复制scss工具方法
export const copyStyles = async () => {
  const paths = await glob('**/*.scss', {
    cwd: stylePackagesDir,
    absolute: true,
  });
  const targetDir = join(esOutDir, 'styles');
  await Promise.all(paths.map((path) => {
    const matchedPath = path.match(/src\/(?<extPath>.*)$/);
    if (!matchedPath) return Promise.resolve();
    const { extPath } = matchedPath.groups!;
    const targetPath = join(targetDir, extPath);
    return copy(path, targetPath);
  }));
};

// 拷贝组件源码scss
const copySourceComScss = async () => {
  const paths = await glob('**/*.scss', {
    cwd: join(componentPackagesDir, 'src', 'styles'),
    absolute: true,
  });
  const targetDir = join(comStyleOutDir, 'src');
  await Promise.all(paths.map((path) => {
    const matchedPath = path.match(/styles\/(?<extPath>.*)$/);
    if (!matchedPath) return Promise.resolve();
    const { extPath } = matchedPath.groups!;
    const targetPath = join(targetDir, extPath);
    return copy(path, targetPath);
  }));
};

const aliasParser: Importer<'async'> = {
  canonicalize: (url: string): URL => {
    if (url.startsWith('@wdt/styles')) {
      return new URL(join(stylePackagesDir, 'src', 'index.scss'));
    }
    return new URL(url);
  },
  load: async (canonicalUrl: URL): Promise<ImporterResult | null> => {
    const contents = await readFile(canonicalUrl.href, 'utf-8');
    return {
      contents,
      syntax: 'scss',
    };
  },
};

const buildScss = async () => {
  const paths = await glob('*.scss', {
    cwd: join(componentPackagesDir, 'src', 'styles'),
    absolute: true,
    onlyFiles: true,
  });
  await Promise.all(paths.map(async (path) => {
    const result = await compileAsync(path, {
      importers: [aliasParser],
    });
    const fileName = path.match(/(?<filename>[^/\\]*?)\.scss$/);
    if (!fileName) return;
    const { filename } = fileName.groups!;
    postcss([autoprefixer({
      cascade: false,
      overrideBrowserslist: ['last 1 versions'],
      grid: true,
    }), cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
      }]
    })]).process(result.css, {
      from: path,
    }).then(({ css }) => {
      writeFile(join(comStyleOutDir, `${ filename }.css`), css);
    });
  }));
};

export const buildComponentScss = async () => {
  await ensureDir(comStyleOutDir);
  copySourceComScss();
  buildScss();
};
