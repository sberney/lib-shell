const process = require('process');

// platform agnostic echo command
const echo = message => (process.platform === 'win32') ? `echo ${message}` : `echo "${message}"`;
module.exports = echo;