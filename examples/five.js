const { createExec } = require('../index');
const exec = createExec({
  plain: true,
  info: false
});

// now there is no need to!

exec('echo "hello world!"' /*, { info: true } */);

// "hello world!"
//