const { expect } = require('chai');
const path = require('path');
const { EOL } = require('os');
const concat = require('async-concat-stream');
const echo = require('./echo');

const createBuildSanityTest = ({ buildName, requirePath }) => {

  describe(buildName, () => {

    let LibShell;
    beforeAll(() => {
      LibShell = require(path.resolve('./test', requirePath));
    });

    test('exports function exec', () => {
      expect(typeof LibShell.exec).to.equal('function');
    });

    test('exports function createExec', () => {
      expect(typeof LibShell.createExec).to.equal('function');
    });

    test('exec performs basic functionality', async () => {
      const stream = concat();

      await LibShell.exec(echo('hello world!'), {
        stdio: { stdout: stream }
      });
      stream.end();

      expect(await stream.promise).to.equal(
        [
          '[shell] hello world!',
          '[shell] ',
          '[shell] shell exited, code 0.',
          ''
        ].join(EOL)
      );
    });
  });
};

module.exports = { createBuildSanityTest };