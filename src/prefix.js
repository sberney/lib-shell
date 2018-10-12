const { EOL } = require('os');

const once = require('lodash/once');

const { infoAddender } = require('./info-addender');
const { withStdio } = require('./with-stdio');


const replaceEol = prefix => data =>
  data.replace(/\r\n|\r|\n/g, `${EOL}${prefix}`);

const formatter = (prefix='') => {
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

const injectPrefixing = (opts={}) => child => {
  const { stdout, stderr } = withStdio(opts);

  //const { info } = opts;  // todo: remove?
  const prefix = makePrefix(opts);
  const pipe = prefixedStream(prefix);
  const formatInfo = message => `${EOL}${prefix}${message}${EOL}`;
  const appendInfo = infoAddender(opts, formatInfo);

  pipe(child.stdout, stdout);
  pipe(child.stderr, stderr);
  appendInfo(child);
};

module.exports = { prefixedStream, makePrefix, injectPrefixing, formatter };