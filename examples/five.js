const { createExec } = require('lib-shell');
const exec = createExec({
  plain: true,
  info: false,
  noTrailingNewline: true
});

// now there is no need to!

exec('echo "hello world!"' /*, { info: true } */);

// "hello world!"