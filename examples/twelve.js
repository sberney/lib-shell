const { exec } = require('../index');
exec('exit 1', {
  exit: true,
  xbuffer: 0.01,
  maxBuffer: 10
});

//