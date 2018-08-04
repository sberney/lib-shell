const process = require('process');
const { exec: nodeExec } = require('child_process');
const { injectPrefixing, makePrefix } = require('./prefix');

const tryFn = (fn, default_) => {
  try {
    fn();
  }
  catch (ignore) {
    return default_;
  }
};
const tryCall = method => obj =>
  tryFn(() => obj[method](), obj);
const str = tryCall('toString');

const exec = (command, opts={}) => new Promise((resolve, reject) => {
  const { workingDirectory, noprefix } = opts;

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

  const child = nodeExec(command, {
    shell: true
  });

  if (noprefix) {
    throw new Error('noprefix is not yet implemented'); // todo
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
});

module.exports = { exec };