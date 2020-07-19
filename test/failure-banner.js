const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../index');
const concat = require('async-concat-stream');

// nine.js

describe('failure banner', () => {
  test('prints the failure banner', async () => {
    const stream = concat();

    await exec('exit 1', {
      stdio: { stdout: stream, stderr: stream },
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
        '',
        '', // todo: unexpected newline
        'Build failed.',
        'Try checking out a fresh copy and building it from scratch.',
        "If that doesn't work, email tech@ITsupport.utopiacorp.net. ",
        '',
        ''  // todo: unexpected newline
      ].join(EOL)
    );
  });
});
