const tools = [
  './src/exec.js'
];

module.exports = Object.assign({}, ...(tools.map(require)));