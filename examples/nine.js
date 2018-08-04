const { exec } = require('../index');
exec('exit -1', {
  exit: true,
  //failureBanner: `Build failed. Try checking out a fresh copy and building it from scratch. If that doesn't work, email tech@ITsupport.utopiacorp.net.`
  failureBanner: `
Build failed.
Try checking out a fresh copy and building it from scratch.
If that doesn't work, email tech@ITsupport.utopiacorp.net. `
});

// [shell] shell exited, code 4294967295.
//
// Build failed.
// Try checking out a fresh copy and building it from scratch.
// If that doesn't work, email tech@ITsupport.utopiacorp.net.
//
