const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../polyfill-index');
const concat = require('async-concat-stream');

// two.js

describe('plain: true', () => {
  it('does not have prefixed output', async () => {
    const stream = concat();

    await exec('echo "hello world!"', {
      plain: true,
      stdio: { stdout: stream }
    });
    stream.end();

    expect(await stream.promise).to.equal(
      [
        '"hello world!"',
        '',
        'shell exited, code 0.',
        ''
      ].join(EOL)
    );
  });
});
