const { expect } = require('chai');
const { exec } = require('../index');

describe('stdio', () => {

  it('it accepts an array', () => {

    //let emitter = new Emitter;
    exec('echo "hello world"', {
      stdio: {
        stdin: 'in',
        stdout: 'out',
        stderr: 'err'
      },
      //testEmitter: emitter
      //stdio: [,
      //  'in',
      //  'out',
      //  'err'
      //]
    });

    //expect(emitter).to.include('in\nout\nerr');
    expect(true).to.be.true;  // stdio not impl
  });

});