const omit = require('lodash/omit');
const path = require('path');
const process = require('process');
const { exec: nodeExec } = require('child_process');
const { injectPrefixing, makePrefix } = require('./prefix');
const { tryCall } = require('./try');
const { withExit } = require('./with-exit');
const { withFailureBanner } = require('./with-failure-banner');
const { withVerbose } = require('./with-verbose');

const str = tryCall('toString');

const loadedAddins = [
  withVerbose,
  withFailureBanner,
  withExit
];
const withAddins = (opts={}, operation, addins=loadedAddins) => {
  if (!addins || !addins.length)
    return operation;

  const [ withAddin, ...rest ] = addins;
  return withAddins(opts, withAddin(opts, operation), rest);
}

const exec = (command, opts={}) => withAddins(opts, new Promise((resolve, reject) => {
  const { workingDirectory, plain } = opts;

  const currentDirectory = path.resolve('./');
  if (workingDirectory)
    process.chdir(path.resolve(currentDirectory, workingDirectory));

  const goBack = () => {
    try {
      if (workingDirectory)
        process.chdir(currentDirectory);
    }
    catch(error) {
      console.error('Could not change back to initial directory.');
    }
  };

  const child = nodeExec(command, Object.assign({
    shell: true
  }, omit(opts, [
    'workingDirectory',
    'prefix',
    'plain'
  ])));

  if (plain) {
    child.stdout.on('data', data => process.stdout.write(data));
    child.stderr.on('data', data => process.stderr.write(data));
  } else {
    const pipeToStd = injectPrefixing(makePrefix(opts));
    pipeToStd(child);
  }

  //
  // returns status of child process to our caller.
  child.on('exit', (code, signal) => {
    goBack();

    if (code) {
      let error = new Error(`failed with code: ${str(code)}`);
      reject(Object.assign(error, { code }));
    } else if (signal) {
      let error = new Error(`failed with signal: ${str(signal)}`);
      reject(Object.assign(error, { signal }));
    } else {
      resolve();
    }
  });
}));

const createExec = opts => (command, more) =>
  exec(command, Object.assign({}, opts, more));

module.exports = { exec, createExec };