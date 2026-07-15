import type { RollupOptions } from 'rollup';
import { resolvePackage, projectRoot } from '../content';

export const getFullRollupOptions = async (): Promise<RollupOptions> => {
  const pkg = await resolvePackage(projectRoot);
  const external = [
    ...Object.keys(pkg?.dependencies || {}),
  ];

  return {
    external,
  };
};
