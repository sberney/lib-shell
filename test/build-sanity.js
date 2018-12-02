const { createBuildSanityTest } = require('./lib/build-sanity');

createBuildSanityTest({
  buildName: 'es6 build (main)',
  requirePath: '../dist/lib-shell.js'
});