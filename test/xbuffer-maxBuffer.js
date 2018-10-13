const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../polyfill-index');
const concat = require('async-concat-stream');

// twelve.js

describe('xbuffer with maxBuffer', () => {
  it("doesn't allow both options simultaneously", async () => {
    const stream = concat();

    const result = await exec('echo "hello world!"', {
      xbuffer: 0.01,
      maxBuffer: 10,
      stdio: { stdout: stream, stderr: stream }
    }).
    catch(err => err);
    stream.end();

    expect(await result).to.be.an.instanceof(Error);
    expect(await result).to.match(/Cannot set both/);
  });
});
