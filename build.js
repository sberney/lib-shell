const Builder = require('systemjs-builder');
const builder = new Builder('./', 'config.js');

builder.buildStatic('index.js', 'dist/lib-shell.js', {
  format: 'cjs',
  minify: false,
  globalName: 'LibShell'
}).
then(() => {
  console.log('Done.');
}).
catch(error => {
  console.error('Failed to build.');
  console.error(error);
});