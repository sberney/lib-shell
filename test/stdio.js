const { expect } = require('chai');
const MemoryStream = require('memorystream');
const concat = require('async-concat-stream');
const { exec } = require('../index');
const { withStdio } = require('../src/with-stdio.js');

describe('stdio', () => {
  it('transforms an array', () => {
    const one = withStdio({
      stdio: ['one', 'two', 'three']
    });
    const two = withStdio({
      stdio: {
        stdin: 'one',
        stdout: 'two',
        stderr: 'three'
      }
    });

    expect(one).to.deep.equal(two);
  });
});

describe('stdio mock streamtest', () => {
  it('does what I want', async () => {
    const stream = concat();

    await exec('echo "hello world"', {
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
//  it('it accepts an array', () => {
//
//    //let emitter = new Emitter;
//    exec('echo "hello world"', {
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