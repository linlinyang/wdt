import {
  projectRoot,
  packagesDir,
  componentPackagesDir,
  PKG_NAME,
  resolvePackage,
  wdtPackagesDir,
  esOutDir,
  libOutDir,
} from '../content';
import { mergeConfig, type UserConfig, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { getFullRollupOptions } from './rollup';
import glob from 'fast-glob';
import { join } from 'node:path';

export const getFullBuildConfig = async (minify = true, config: UserConfig = {}): Promise<UserConfig> => {
  const pkg = await resolvePackage(projectRoot);
  const rollupOptions = await getFullRollupOptions();

  return mergeConfig(defineConfig({
    build: {
      rollupOptions,
      lib: {
        entry: join(wdtPackagesDir, 'index.ts'),
        fileName: `index.full${ minify ? '.min' : '' }`,
        formats: ['es'],
      },
      sourcemap: true,
      minify,
      target: 'esnext',
      outDir: libOutDir,
      emptyOutDir: false,
    },
    plugins: [
      vue(),
      vueJsx(),
    ],
    define: {
      __VERSION__: JSON.stringify(pkg?.version),
    }
  }), config);
};

const getModuleEntry = async (
  paths: string[],
): Promise<Record<string, string>> => paths.reduce<Record<string, string>>((acc, path) => {
  const relativePath = path.slice(packagesDir.length + 1);
  const trimedSrcPath = relativePath.replace(/\/src\//, '/');
  const noExtPath = trimedSrcPath.replace(/\.(ts|vue)$/, '');
  const pkgRegExp = new RegExp(`^${ PKG_NAME }/`);
  const pkgTrimedPath = noExtPath.replace(pkgRegExp, '');
  acc[pkgTrimedPath] = path;
  return acc;
}, Object.create(null));

export const getModuleBuildConfig = async (config: UserConfig = {}): Promise<UserConfig> => {
  const pkg = await resolvePackage(projectRoot);
  const rollupOptions = await getFullRollupOptions();
  const paths = await glob(['**/index.ts'], {
    absolute: true,
    onlyFiles: true,
    cwd: packagesDir,
    ignore: [
      '**/__tests__/**',
      '**/typings/**',
      '**/styles/**',
      '**/node_modules/**',
    ],
  });
  const entry = await getModuleEntry(paths);

  return mergeConfig(defineConfig({
    build: {
      rollupOptions,
      lib: {
        entry,
        formats: ['es'],
      },
      sourcemap: true,
      target: 'esnext',
      outDir: esOutDir,
      emptyOutDir: false,
    },
    plugins: [
      vue(),
      vueJsx(),
    ],
    define: {
      __VERSION__: JSON.stringify(pkg?.version),
    }
  }), config);
};

export const getScssBuildConfig = async (config: UserConfig = {}): Promise<UserConfig> => {
  return mergeConfig(defineConfig({
    build: {
      lib: {
        entry: join(componentPackagesDir, 'src', 'styles', 'index.scss')
      }
    }
  }), config);
};
