import { platform } from 'os';
import { exec, spawn, ExecException } from 'child_process';

type DetectResult = {
  status: boolean,
  err?: ExecException | null,
  stdout?: string,
  stderr?: string
}

const detectCommand = (command: string): Promise<DetectResult> => {
  return new Promise<DetectResult>((resolve) => {
    exec(command, (err, stdout, stderr) => {
      resolve({ status: !err && !stderr && !!stdout, err, stderr, stdout });
    });
  });
};

export type PackageCmd = 'npm' | 'yarn' | 'pnpm';

const defaultOrders: PackageCmd[] = ['yarn', 'npm', 'pnpm'];

type DetectCli = Record<PackageCmd, boolean>

export const detectCmd = (): Promise<DetectCli> => {
  return new Promise<DetectCli>((resolve) => {
    Promise.all([
      detectCommand('npm -v'),
      detectCommand('yarn -v'),
      detectCommand('pnpm -v'),
    ]).then(([npm, yarn, pnpm]) => {
      resolve({
        npm : npm.status,
        yarn: yarn.status,
        pnpm: pnpm.status,
      });
    });
  });
};

export const selectCmd = async (orders?: PackageCmd[]): Promise<PackageCmd | undefined> => {
  const cli = await detectCmd();
  return (orders == null || !Array.isArray(orders) || orders.length <= 0 ? defaultOrders : orders).find((cmd) => cli[cmd]);
};

export const installDeps = (dir: string, cmd: PackageCmd): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    process.chdir(dir);
    const _cmd = `${cmd}${platform() === 'win32' ? '.cmd' : ''}`;
    const ps = spawn(_cmd, ['install'], { stdio: 'inherit', cwd: dir });
    ps.on('close', (code) => {
      if (code !== 0) {
        reject()
      } else {
        resolve();
      }
    });
  });
};
