import { spawn } from 'child_process';
import { projectRoot } from '../content';
import chalk from 'chalk';

export const run = (command: string, cwd: string = projectRoot) => {
  const [cmd, ...args] = command.split(' ');
  console.info(`run: ${ chalk.green(`${ cmd } ${ args.join(' ') }`) }`);
  
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, {
      shell: process.platform === 'win32',
      cwd,
      stdio: 'inherit',
    });

    const onProcessExit = () => child.kill('SIGHUP');

    child.on('close', (code) => {
      process.off('exit', onProcessExit);

      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed of ${ command } with exit code ${ code }`));
      }
    });

    process.on('exit', onProcessExit);
  });
};
