const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../index');
const concat = require('async-concat-stream');

// eleven.js

describe('prefixedBanner: true', () => {
  test('prefixes the failure banner', async () => {
    const stream = concat();

    await exec('exit 1', {
      stdio: { stdout: stream, stderr: stream },
      prefixedBanner: true,
      failureBanner: `
Build failed.
Try checking out a fresh copy and building it from scratch.
If that doesn't work, email tech@ITsupport.utopiacorp.net. `
    }).
    catch(err => Promise.resolve(err));
    stream.end();

    expect(await stream.promise).to.equal(
      [
        '',
        '[shell] shell exited, code 1.',
        '[shell] ',
        '[shell] ', // todo: unexpected newline
        '[shell] Build failed.',
        '[shell] Try checking out a fresh copy and building it from scratch.',
        "[shell] If that doesn't work, email tech@ITsupport.utopiacorp.net. ",
        '[shell] ',
        ''
      ].join(EOL)
    );
  });
});
