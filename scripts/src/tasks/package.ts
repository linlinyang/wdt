import { isNil } from 'lodash-es';
import { resolvePackage, projectRoot, outDir, wdtPackagesDir } from '../content';
import { join } from 'node:path';
import { writeFile } from 'fs/promises';

// 复制去除无效字段的package.json
export const copyPackageJSON = async () => {
  const pkg = await resolvePackage(projectRoot);
  const wdtPkg = await resolvePackage(wdtPackagesDir);
  if (isNil(wdtPkg)) {
    return;
  }

  const mergedPkg = Object.assign(wdtPkg, {
    dependencies: pkg?.dependencies,
    devDependencies: pkg?.devDependencies,
  });

  await writeFile(join(outDir, 'package.json'), JSON.stringify(mergedPkg, null, 2), 'utf-8');
};
