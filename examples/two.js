const { exec } = require('../dist/index');
exec('echo "hello world!"', { plain: true });

// "hello world!"
//
// shell exited, code 0.