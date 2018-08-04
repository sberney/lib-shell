const { exec } = require('../index');
exec('echo "hello world!"', { plain: true, info: false }); 

// "hello world!"
//