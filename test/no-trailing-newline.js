const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../index');
const concat = require('async-concat-stream');

// four.js

describe('noTrailingNewline: true', () => {
  xit('has no trailing newline', async () => {  // "defunct", see four.js
    const stream = concat();

    await exec('echo "hello world!"', {
      plain: true,
      info: false,
      noTrailingNewline: true,
      stdio: { stdout: stream }
    });
    stream.end();

    expect(await stream.promise).to.equal(
      [
        '"hello world!"'
      ].join(EOL)
    );
  });
});
