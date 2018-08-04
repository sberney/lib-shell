const { exec } = require('../index');
exec('exit 9', {
  exit: true
});

// [shell] shell exited, code 9.
//