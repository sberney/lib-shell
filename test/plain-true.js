const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../index');
const concat = require('async-concat-stream');
const echo = require('./lib/echo');

// two.js

describe('plain: true', () => {
  test('does not have prefixed output', async () => {
    const stream = concat();

    await exec(echo('hello world!'), {
      plain: true,
      stdio: { stdout: stream }
    });
    stream.end();

    expect(await stream.promise).to.equal(
      [
        'hello world!',
        '',
        'shell exited, code 0.',
        ''
      ].join(EOL)
    );
  });
});
