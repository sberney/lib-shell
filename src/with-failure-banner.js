const { EOL } = require('os');

const { makePrefix, formatter } = require('./prefix');
const { createConsole } = require('./create-console');

const withFailureBanner = (opts={}, operation) => {
  const { plain, failureBanner, prefixedBanner } = opts;
  const solace = createConsole(opts);

  if (failureBanner) {
    return operation.
    catch(error => {

      const banner = `${EOL}${failureBanner}${EOL}`;
      if (plain || prefixedBanner !== true) {
        const format = formatter();
        solace.log(format(banner));
      } else {
        const format = formatter(makePrefix(opts));
        solace.log(format(banner));
      }

      throw error;
    });
  } else {
    return operation;
  }
}

module.exports = { withFailureBanner };