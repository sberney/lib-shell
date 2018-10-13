const { expect } = require('chai');
const { EOL } = require('os');
const { exec, createExec } = require('../dist/lib-shell.cjs.js');
const concat = require('async-concat-stream');

// one.js

describe('cjs build', () => {
  it('exports function exec', () => {
    expect(typeof exec).to.equal('function');
  });

  it('exports function createExec', () => {
    expect(typeof createExec).to.equal('function');
  });

  it('exec performs basic functionality', async () => {
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
