const { EOL } = require('os');
const { makePrefix, formatter } = require('./prefix');

const withFailureBanner = (opts={}, operation) => {
  const { plain, failureBanner, prefixedBanner } = opts;

  if (failureBanner) {
    return operation.
    catch(error => {

      const banner = `${EOL}${failureBanner}${EOL}`;
      if (plain || prefixedBanner !== true) {
        console.log(banner);
      } else {
        const format = formatter(makePrefix(opts));
        console.log(format(banner));
      }

      throw error;
    });
  } else {
    return operation;
  }
}

module.exports = { withFailureBanner };