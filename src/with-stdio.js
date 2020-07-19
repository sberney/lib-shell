import process from 'process';

const withDefault = (value, default_) => {
  if (typeof value === 'undefined')
    return default_;

  return value;
}

const validateStream = (streamName, stream) => {
  if (stream === null)
    return;  // null is a special value, indicating the stream is /dev/null

  if (!stream)
    throw new Error(`specified ${streamName} is not a valid stream object.`);

  if (typeof stream.write !== 'function')
    throw new Error(`specified ${streamName} does not have a valid write() function.`);
};

export const withStdio = (opts={}) => {
  const { stdio } = opts;

  let stdin  = process.stdin;
  let stdout = process.stdout;
  let stderr = process.stderr;

  if (stdio instanceof Array) {
    [ stdin, stdout, stderr ] = stdio;
  } else if (typeof stdio === 'object') {
    stdin = withDefault(stdio.stdin, stdin);
    stdout = withDefault(stdio.stdout, stdout);
    stderr = withDefault(stdio.stderr, stderr);
  }

  // Fail fast, notify the user if they've got a bad setup.
  validateStream('stdout', stdout);
  validateStream('stderr', stderr);
  validateStream('stdin', stdin);

  return { stdin, stdout, stderr };
};