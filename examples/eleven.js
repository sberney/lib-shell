const { exec } = require('../index');
exec('exit -1', {
  exit: true,
  failureBanner: `Build failed. Try checking out a fresh copy and building it from scratch. If that doesn't work, email tech@ITsupport.utopiacorp.net.`,
  prefixedBanner: true
});

//