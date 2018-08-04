// DEFUNCT: no trailing newline doesn't work

const { exec } = require('../index');
exec('echo "hello world!"', {
  plain: true,
  info: false,
  noTrailingNewline: true
});

// "hello world!"