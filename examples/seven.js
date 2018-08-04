const { exec } = require('../index');
exec('exit 1').
catch(err => {
  console.log(`code was ${err.code}; typeof ${typeof err.code}`);
});

//
// [shell] shell exited, code 1.
// code was 1; typeof number