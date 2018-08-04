const { exec } = require('../index');
exec('echo "hello world!"', { plain: true });

// "hello world!"
//
// shell exited, code 0.