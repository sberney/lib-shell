const { infoAddender } = require('./info-addender');
const { EOL } = require('os');
const { withStdio } = require('./with-stdio');

const pipeToStdFactory = (opts={}) => child => {
  const { stdout, stderr } = withStdio(opts);
  const formatInfo = message => `${EOL}${message}${EOL}`;
  const addendInfo = infoAddender(opts, formatInfo);

  child.stdout.on('data', data => stdout.write(data));
  child.stderr.on('data', data => stderr.write(data));
  addendInfo(child);
};

module.exports = { pipeToStdFactory };