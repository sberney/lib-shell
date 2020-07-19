const { expect } = require('chai');
const concat = require('async-concat-stream');
const { PassThrough } = require('stream');
const { exec } = require('../index');
const { withStdio } = require('../src/with-stdio.js');
const echo = require('./lib/echo');

describe('stdio', () => {
  test('transforms an array', () => {
    const one = withStdio({
      stdio: ['one', 'two', 'three']
    }, false);
    const two = withStdio({
      stdio: {
        stdin: 'one',
        stdout: 'two',
        stderr: 'three'
      }
    }, false);

    expect(one).to.deep.equal(two);
  });
});

describe('stdio mock streamtest', () => {
  test('does what I want', async () => {
    const stream = concat();

    await exec(echo('hello world!'), {
      stdio: {
        //stdout: process.stdout,
        stdout: stream,
        stderr: process.stderr,
        stdin: process.stdin
      },
    });
    stream.end();

    expect(await stream.promise).to.match(/hello world/);
  });
});


// todo: should I even have a test like this?

//describe('stdio argument', () => {
//
//  test('it accepts an array', () => {
//
//    //let emitter = new Emitter;
//    exec(echo('hello world!'), {
//      stdio: {
//        stdin: 'in',
//        stdout: 'out',
//        stderr: 'err'
//      },
//      //testEmitter: emitter
//      //stdio: [,
//      //  'in',
//      //  'out',
//      //  'err'
//      //]
//    });
//
//    //expect(emitter).to.include('in\nout\nerr');
//    expect(true).to.be.true;  // stdio not impl
//  });
//
//});

describe('stdio fork pipe', () => {
  test('pipes to two streams', async () => {
    const stream1 = concat();
    const stream2 = concat();

    const stream = new PassThrough;
    stream.pipe(stream1);
    stream.pipe(stream2);

    await exec(echo('hello world!'), {
      stdio: {
        stdout: stream
      },
    });

    stream1.end();
    stream2.end();
    const string1 = await stream1.promise;
    const string2 = await stream2.promise;

    expect(string1).to.match(/hello world/);
    expect(string1.toString()).to.equal(string2.toString());
  });
});