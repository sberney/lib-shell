const { expect } = require('chai');
const { EOL } = require('os');
const { createExec } = require('../index');
const concat = require('async-concat-stream');

// five.js

describe('createExec', () => {
  it('automatically applies creation options', async () => {
    const stream = concat();

    const exec = createExec({
      plain: true,
      info: false
    });

    await exec('echo "hello world!"', {
      stdio: { stdout: stream }
    });
    stream.end();

    expect(await stream.promise).to.equal(
      [
        '"hello world!"',
        ''
      ].join(EOL)
    );
  });

  it('allows override of creation options', async () => {
    const stream = concat();

    const exec = createExec({
      plain: true,
      info: false
    });

    await exec('echo "hello world!"', {
      stdio: { stdout: stream },
      info: true
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
