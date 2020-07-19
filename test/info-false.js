const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../index');
const concat = require('async-concat-stream');
const echo = require('./lib/echo');

// three.js

describe('info: false', () => {
  test('does not addend the exit status', async () => {
    const stream = concat();

    await exec(echo('hello world!'), {
      plain: true,
      info: false,
      stdio: { stdout: stream }
    });
    stream.end();

    expect(await stream.promise).to.equal(
      [
        'hello world!',
        ''
      ].join(EOL)
    );
  });
});
