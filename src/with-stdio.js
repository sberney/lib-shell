
const withStdio = (opts={}) => {
  const { stdio } = opts;

  let stdin, stdout, stderr;
  if (stdio instanceof Array) {
    [ stdin, stdout, stderr ] = stdio;
  } else if (typeof stdio === 'object') {
    stdin = stdio.stdin;
    stdout = stdio.stdout;
    stderr = stdio.stderr;
  }

  //console.log(stdin, stdout, stderr);
  return { stdin, stdout, stderr };
};

module.exports = { withStdio };