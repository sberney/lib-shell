const { EOL } = require('os');

const infoAddender = (opts={}, formatInfo) => child => {
  const { info } = opts;

  if (info !== false) {
    child.on('exit', (code, signal) => {
      if (code === null) {
        process.stdout.write(formatInfo(
          `shell killed via signal ${signal.toString()}.`));
      } else {
        process.stdout.write(formatInfo(
          `shell exited, code ${code.toString()}.`));
      }
    });
  }

};

module.exports = { infoAddender };