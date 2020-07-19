import { expect } from 'chai';
import { EOL } from 'os';
import concat from 'async-concat-stream';
import { exec } from '../index';
import echo from './lib/echo';

// one.js

describe('basic functionality', () => {
  test('prefixes, addends, and execs', async () => {
    const stream = concat();

    await exec(echo('hello world!'), {
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
