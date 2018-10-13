const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../polyfill-index');
const concat = require('async-concat-stream');

// ten.js

describe('verbose: true', () => {

  // todo: can we print this out?
  // this is another instance where we may have to run
  // in another explicit node process.

  xit('prints extra error information', async () => {
    const stream = concat();

    await exec('exit 9', {
      stdio: { stdout: stream },
      exit: true,
      verbose: true
    });
    stream.end();

    //expect(await stream.promise).to.equal(
    //  [
    //    '[shell] "hello world!"',
    //    '[shell] ',
    //    '[shell] shell exited, code 0.',
    //    ''
    //  ].join(EOL)
    //);
  });
});
