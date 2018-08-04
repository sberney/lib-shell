const process = require('process');

const withExit = (opts={}, operation) => {
  const { exit } = opts;

  if (exit) {
    return operation.
    catch(error => {
      process.exit(error && error.code || 1);
    });
  } else {
    return operation;
  }
}

module.exports = { withExit };