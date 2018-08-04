const once = require('lodash/once');
const { EOL } = require('os');

export const prefixedStream = prefix => (sourceStream, destStream) => {
  const prepend = once(() =>
    destStream.write(prefix));
  const replaceEol = data =>
    data.replace(/\r\n|\r|\n/g, `${EOL}${prefix}`);

  sourceStream.on('data', data => {
    prepend();
    destStream.write(replaceEol(data));
  });
};

export const makePrefix = (opts={}) => {
  const { prefix } = opts;
  const defaultPrefix = 'shell';
  return `[${prefix || defaultPrefix}]`;
};

export const injectPrefixing = prefix => subprocess => {
  const pipe = prefixedStream(prefix);
  pipe(subprocess.stdout, process.stdout);
  pipe(subprocess.stderr, process.stderr);

  const formatInfo = message => `${EOL}${prefix}${message}${EOL}`;

  subprocess.on('exit', (code, signal) => {
    if (code === null) {
      process.stdout.write(formatInfo(
        `process killed via signal ${signal.toString()}.`));
    } else {
      process.stdout.write(formatInfo(
        `process exited, code ${code.toString()}.`));
    }
  });
};

const makeStreamNice = (subprocess, opts={}) => {
  const pipeToStd = injectPrefixing(makePrefix(opts));
  pipeToStd(subprocess);

  // exec

  // return a promise indicating whether the command succeeded
}
