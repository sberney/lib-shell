const { createBuildSanityTest } = require('./lib/build-sanity');

createBuildSanityTest({
  buildName: 'cjs build',
  requirePath: '../dist/lib-shell.cjs.js'
});