const { expect } = require('chai');
const { EOL } = require('os');
const { exec } = require('../index');
const concat = require('async-concat-stream');

// seven.js

describe('status code access', () => {
  it('exposes the correct status code', async () => {

    const result = await exec('exit 1', {
      stdio: { stdout: concat() }
    }).
    catch(err => Promise.resolve(err));

    expect(result).to.be.an.instanceOf(Error);
    expect(typeof result.code).to.equal('number');
    expect(result.code).to.equal(1);
  });
});
