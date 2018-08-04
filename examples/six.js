const { exec } = require('../index');

const sequence = () =>
  Promise.resolve().
  then(() => exec('echo operation1', { prefix: 'one' })).
  then(() => exec('echo operation2', { prefix: 'two' })).
  then(() => exec('echo operation3', { prefix: 'three' })).
  then(() => Promise.all([
    exec('echo operation4a', { prefix: 'four-a' }),
    exec('echo operation4b', { prefix: 'four-b' })
  ])).
  catch(err => {
    whatever();
    throw err;
  });


function whatever () { }
sequence();

// [one] operation1
// [one]
// [one] shell exited, code 0.
// [two] operation2
// [two]
// [two] shell exited, code 0.
// [three] operation3
// [three]
// [three] shell exited, code 0.
// [four-a] operation4a
// [four-a]
// [four-a] shell exited, code 0.
// [four-b] operation4b
// [four-b]
// [four-b] shell exited, code 0.