import { withStdio } from './with-stdio';

export const infoAddender = (opts={}, formatInfo) => child => {
  const { stdout } = withStdio(opts);
  const { info } = opts;

  if (info !== false) {
    child.on('exit', (code, signal) => {
      if (code === null) {
        stdout.write(formatInfo(
          `shell killed via signal ${signal.toString()}.`));
      } else {
        stdout.write(formatInfo(
          `shell exited, code ${code.toString()}.`));
      }
    });
  }

};