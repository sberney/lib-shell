const { expect } = require('chai');
const { EOL } = require('os');
const { createExec } = require('../index');
const concat = require('async-concat-stream');

// six.js

const sequence = exec =>
  Promise.resolve().
  then(() => exec('echo operation1', { prefix: 'one' })).
  then(() => exec('echo operation2', { prefix: 'two' })).
  then(() => exec('echo operation3', { prefix: 'three' })).
  then(() => Promise.all([
    exec('echo operation4a', { prefix: 'four-a' }),
    exec('echo operation4b', { prefix: 'four-b' })
  ]));


describe('multiplexing', () => {
  // todo: this is not possible with true concurrency.
  // we can make it appear this way though,
  // !! or we can just ensure line endings and prefixes are in appropriate spots.
  // or for testing, we can just check the output of each statement.

  xit('prints output in order', async () => {
    const stream = concat();

    await sequence(createExec({
      stdio: { stdout: stream }
    }));
    stream.end();

    expect(await stream.promise).to.equal(
      [
        '[one] operation1',
        '[one] ',
        '[one] shell exited, code 0.',
        '[two] operation2',
        '[two] ',
        '[two] shell exited, code 0.',
        '[three] operation3',
        '[three] ',
        '[three] shell exited, code 0.',
        '[four-a] operation4a',
        '[four-a] ',
        '[four-a] shell exited, code 0.',
        '[four-b] operation4b',
        '[four-b] ',
        '[four-b] shell exited, code 0.',
        ''
      ].join(EOL)
    );
  });
});
