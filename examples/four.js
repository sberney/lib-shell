const { exec } = require('lib-shell');
exec('echo "hello world!"', {
  plain: true,
  info: false,
  noTrailingNewline: true
});

// "hello world!"