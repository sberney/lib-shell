const { expect } = require('chai');
const { EOL } = require('os');
const { createExec } = require('../index');
const concat = require('async-concat-stream');
const echo = require('./lib/echo');

// five.js

describe('createExec', () => {
  test('automatically applies creation options', async () => {
    const stream = concat();

    const exec = createExec({
      plain: true,
      info: false
    });

    await exec(echo('hello world!'), {
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

  test('allows override of creation options', async () => {
    const stream = concat();

    const exec = createExec({
      plain: true,
      info: false
    });

    await exec(echo('hello world!'), {
      stdio: { stdout: stream },
      info: true
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
