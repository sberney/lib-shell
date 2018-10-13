import process from 'process';

export const withStdio = (opts={}) => {
  const { stdio } = opts;

  let stdin  = process.stdin;
  let stdout = process.stdout;
  let stderr = process.stderr;

  if (stdio instanceof Array) {
    [ stdin, stdout, stderr ] = stdio;
  } else if (typeof stdio === 'object') {
    stdin = stdio.stdin;
    stdout = stdio.stdout;
    stderr = stdio.stderr;
  }

  return { stdin, stdout, stderr };
};