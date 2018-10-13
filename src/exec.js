import path from 'path';
import process from 'process';
import { exec as nodeExec } from 'child_process';

import omit from 'lodash/omit';

import { pipeToStdFactory } from './vanilla-pipe';
import { injectPrefixing } from './prefix';
import { tryCall } from './try';
import { xbufferTransform } from './xbuffer-transform';
import { withExit } from './with-exit';
import { withFailureBanner } from './with-failure-banner';
import { withVerbose } from './with-verbose';

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

export const exec = (command, opts={}) => withAddins(opts, new Promise((resolve, reject) => {
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

export const createExec = opts => (command, more) =>
  exec(command, Object.assign({}, opts, more));