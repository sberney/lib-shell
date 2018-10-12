const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../index');
const concat = require('async-concat-stream');

// one.js

describe('basic functionality', () => {
  it('prefixes, addends, and execs', async () => {
    const stream = concat();

    await exec('echo "hello world!"', {
      stdio: { stdout: stream }
    });
    stream.end();

    expect(await stream.promise).to.equal(
      [
        '[shell] "hello world!"',
        '[shell] ',
        '[shell] shell exited, code 0.',
        ''
      ].join(EOL)
    );
  });
});
