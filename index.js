const tools = [
  './exec.js'
];

module.exports = Object.assign({}, ...(tools.map(require)));