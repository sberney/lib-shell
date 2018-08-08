const { expect } = require('chai');
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