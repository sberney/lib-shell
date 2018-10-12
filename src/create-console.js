const { EOL } = require('os');
const { withStdio } = require('./with-stdio');

const createConsole = (opts={}) => {
  const { stdout, stderr } = withStdio(opts);

  return {
    log(...args) {
      const string = args.join(' ');
      stdout.write(`${string}${EOL}`);
    },
    error(...args) {
      const string = args.join(' ');
      stderr.write(`${string}${EOL}`)
    }
  }
}

module.exports = { createConsole }