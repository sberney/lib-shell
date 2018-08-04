const { exec } = require('lib-shell');
exec('echo "hello world!"', { plain: true });

// "hello world!"
//
// shell exited, code 0.