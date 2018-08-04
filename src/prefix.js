const { infoAddender } = require('./info-addender');
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

const injectPrefixing = (opts={}) => child => {
  const { info } = opts;
  const prefix = makePrefix(opts);
  const pipe = prefixedStream(prefix);
  const formatInfo = message => `${EOL}${prefix}${message}${EOL}`;
  const appendInfo = infoAddender(opts, formatInfo);

  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  appendInfo(child);
};

module.exports = { prefixedStream, makePrefix, injectPrefixing, formatter };