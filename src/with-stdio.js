const process = require('process');

const withStdio = (opts={}) => {
  const { stdio } = opts;

  let stdin  = process.stdin,
      stdout = process.stdout,
      stderr = process.stderr;
  if (stdio instanceof Array) {
    [ stdin, stdout, stderr ] = stdio;
  } else if (typeof stdio === 'object') {
    stdin = stdio.stdin;
    stdout = stdio.stdout;
    stderr = stdio.stderr;
  }

  return { stdin, stdout, stderr };
};

module.exports = { withStdio };