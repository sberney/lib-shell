const path = require('path');
const process = require('process');
const { exec: nodeExec } = require('child_process');

const omit = require('lodash/omit');

const { pipeToStdFactory } = require('./vanilla-pipe');
const { injectPrefixing } = require('./prefix');
const { tryCall } = require('./try');
const { xbufferTransform } = require('./xbuffer-transform');
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
};

const loadedTransforms = [
  xbufferTransform
];
const transformOpts = (opts={}, transforms=loadedTransforms) => {
  if (!transforms || !transforms.length)
    return opts;

  const { exit } = opts;
  const [ transform, ...rest ] = transforms;
  try {
    return transformOpts(transform(opts), rest);
  } catch (error) {
    if (exit) {
      console.error(error); // otherwise it gets swallowed
    }
    throw error;
  }
};

const exec = (command, opts={}) => withAddins(opts, new Promise((resolve, reject) => {
  const { workingDirectory, plain } = transformOpts(opts);

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
    'plain',
    'info',
    'noTrailingNewline',
    'xbuffer',
    'exit',
    'failureBanner',
    'prefixedBanner',
    'verbose'
  ])));

  if (plain) {
    const pipeToStd = pipeToStdFactory(opts);
    pipeToStd(child);
  } else {
    const pipeToStd = injectPrefixing(opts);
    pipeToStd(child);
  }

  //
  // returns status of child process to our caller.
  child.on('exit', (code, signal) => {
    goBack();

    if (code) {
      const error = new Error(`failed with code: ${str(code)}`);
      reject(Object.assign(error, { code }));
    } else if (signal) {
      const error = new Error(`failed with signal: ${str(signal)}`);
      reject(Object.assign(error, { signal }));
    } else {
      resolve();
    }
  });
}));

const createExec = opts => (command, more) =>
  exec(command, Object.assign({}, opts, more));

module.exports = { exec, createExec };