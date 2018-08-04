const once = require('lodash/once');
const { EOL } = require('os');


const replaceEol = prefix => data =>
  data.replace(/\r\n|\r|\n/g, `${EOL}${prefix}`);

const formatter = prefix => {
  const replaceEol2 = replaceEol(prefix);
  return str => 
    `${prefix}${replaceEol2(str)}`;
};


const prefixedStream = prefix => (sourceStream, destStream) => {
  const prepend = once(() =>
    destStream.write(prefix));
  const replaceEol2 = replaceEol(prefix);

  sourceStream.on('data', data => {
    prepend();
    destStream.write(replaceEol2(data));
  });
};

const makePrefix = (opts={}) => {
  const { prefix } = opts;
  const defaultPrefix = 'shell';
  return `[${prefix || defaultPrefix}] `;
};

const injectPrefixing = prefix => subprocess => {
  const pipe = prefixedStream(prefix);
  pipe(subprocess.stdout, process.stdout);
  pipe(subprocess.stderr, process.stderr);

  const formatInfo = message => `${EOL}${prefix}${message}${EOL}`;

  subprocess.on('exit', (code, signal) => {
    if (code === null) {
      process.stdout.write(formatInfo(
        `shell killed via signal ${signal.toString()}.`));
    } else {
      process.stdout.write(formatInfo(
        `shell exited, code ${code.toString()}.`));
    }
  });
};

module.exports = { prefixedStream, makePrefix, injectPrefixing, formatter };