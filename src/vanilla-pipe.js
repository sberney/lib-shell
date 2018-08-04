const { infoAddender } = require('./info-addender');
const { EOL } = require('os');

const pipeToStdFactory = (opts={}) => child => {
  const formatInfo = message => `${EOL}${message}${EOL}`;
  const addendInfo = infoAddender(opts, formatInfo);

  child.stdout.on('data', data => process.stdout.write(data));
  child.stderr.on('data', data => process.stderr.write(data));
  addendInfo(child);
};

module.exports = { pipeToStdFactory };