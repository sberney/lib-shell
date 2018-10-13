const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../polyfill-index');
const concat = require('async-concat-stream');

// eight.js

describe('exit: true', () => {

  // todo: can't run because it exits the node tests :)
  // ... but we can directly spawn a process and check its exit code.

  xit('totally exits the node process', async () => {

    const result = await exec('exit 9', {
      exit: true,
      stdio: { stdout: concat() }
    }).
    catch(err => Promise.resolve(err));

    expect(result).to.be.an.instanceOf(Error);
    expect(typeof result.code).to.equal('number');
    expect(result.code).to.equal(9);
  });
});
