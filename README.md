# `lib-shell`

Do you want to use JavaScript to automate your build process? Or does your build process involve running ... errm ... *anything* other than JavaScript? ...

... You're going to need to `lib-shell`!

-------

Of course, you *can* use node's `exec` and `spawn` (this is the *correct* approach), but they are annoying. Why did they even bother writing them?

## Why lib-shell

### Simplicity and robustness

Using `lib-shell`, you don't need to know anything at all about those boring built-in utilities, unless you really want to.


### Build Sequencing

Those built-in tools don't even use promises. Nobody wants to know about `exit` events. They want `Promise`'s! They want to do this:

```js
const build = () =>
  Promise.resolve().
  then(() => operation1()).
  then(() => operation2()).
  then(() => finishUp()).
  catch(err => figureItOut());
```


## Examples

### Examples: 1 to n

Ready to get started with `shell` nirvana?

Just go,

```js
const { exec } = require('lib-shell');
exec('echo "hello world!"');

// [shell] "hello world!"
// [shell]
// [shell] shell exited, code 0.
```

----

Don't like having `[shell] ` prepended to the output? Tell it to be `plain`!

```js
const { exec } = require('lib-shell');
exec('echo "hello world!"', { plain: true });

// "hello world!"
//
// shell exited, code 0.
```

----

Don't like knowing about why the process ended?

```js
const { exec } = require('lib-shell');
exec('echo "hello world!"', { plain: true, info: false }); 
// "hello world!"
//
```

----

Are you tired of writing all that stuff?

```js
const { createExec } = require('lib-shell');
const exec = createExec({
  plain: true,
  info: false
});

// now there is no need to!

exec('echo "hello world!"' /*, { info: true } */);

// "hello world!"
//
```

### Complicated sequencing

Formatting options are nice, but not useful when you're making a build system. What is useful is knowing whether the operation you have performed has succeeded or not. And promises.

```js
const { exec } = require('lib-shell');

const sequence = () =>
  Promise.resolve().
  then(() => exec('operation1', { prefix: 'one' })).
  then(() => exec('operation2', { prefix: 'two' })).
  then(() => exec('operation3', { prefix: 'three' })).
  then(() => Promise.all([
    exec('operation4a', { prefix: 'four-a' }),
    exec('operation4b', { prefix: 'four-b' })
  ])).
  catch(err => {
    whatever();
    throw;
  });

// [one] operation1
// [one]
// [one] shell exited, code 0.
// [two] operation2
// [two]
// [two] shell exited, code 0.
// [three] operation3
// [three]
// [three] shell exited, code 0.
// [four-a] operation4a
// [four-a]
// [four-a] shell exited, code 0.
// [four-b] operation4b
// [four-b]
// [four-b] shell exited, code 0.
```

## Exit codes, errors, and workflow

Perhaps you need more than just a catch handler at the end of a promise chain. Perhaps you need the exit code. Or some reason, any reason, why your script didn't work.

The **error messages** in the `catch` handler have properties assigned to them. Assuming they are caused by shell operation and not by `lib-shell` (shock) or your code, there will be one of these properties defined:

#### Error Object's Properties Table

Property | Type   | Description
---------|--------|-----------------------
code     | number | An **exit code**, which means that the process exited on its own. `0` indicates everything is ok; any other number is an error.
signal   | number | Happens when your process was killed by an interrupt. Its value is which **signal** killed your process.

You don't get both a code and signal.

#### Example Usage

If we get `exit 0`, the promise resolves. Otherwise the promise rejects.

```js
const { exec } = require('lib-shell');
exec('exit 1').
catch(err => {
  console.log(`code was ${err.code}; typeof ${typeof err.code}`);
});

//
// [shell] shell exited, code 1.
// code was 1; typeof number
```

### Signalling an Exit Code

If the build script you're writing plugs into anything at all, you might want your build script to return a specific exit code at a specific time.

You can always exit node without any help:

```js
const process = require('process');  // a node built-in
process.exit(99);  // exit code 99. This will terminate your script!
```

But if you want, you can specify the `exit: true` property, to tell your shell command to pass through any error code if it fails.

```js
const { exec } = require('lib-shell');
exec('exit 9', {
  exit: true
});

// [shell] shell exited, code 9.
//
```
If you set `exit: true`, your script is over. We just call `process.exit()` for you at the appropriate time.

## Exit banner

Say you want to provide a helpful message when your build script fails, like this:

> Build failed. Try checking out a fresh copy and building it from scratch. If that doesn't work, email tech@ITsupport.utopiacorp.net.

These kinds of messages add a lot of stylishness and professionalism to the your abysmal failure!

```js
const { exec } = require('lib-shell');
exec('exit -1', {
  exit: true,
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
```

## Options

### All Options

Options           | Default    | Note
----------------- |------------|--------------
workingDirectory  | cwd        | Directory in which to run the command
prefix            | shell      | Prefix output with bracketed [custom]
plain             | false      |
info              | true       | Addend status code
xbuffer           | 1          | Incompatible with `maxBuffer`
exit              | false      | Very terminal
failureBanner     | undefined  | Add frustrating message for users, denying culpability
prefixedBanner    | false      | Change the way failureBanner prints. Adds prefix.
verbose           | false      | Always [... repeatedly] console.log the error message

### Even More Options

Anything node's exec supports. Examples:

Options           | Default      | Note
----------------- |--------------|--------------
maxBuffer         | `200 * 1024` | Incompatible with `xbuffer`

#### User Story

For a long running process, one that dumps *a lot* of console output, node's buffer size is **way** too small. The default buffer size is `200 * 1024` **bytes**. With `lib-shell`, **you can** change this to whatever you want, say `5x`:

```js
const { exec } = require('lib-shell');
exec('echo "hello world"', { maxBuffer: 1000 * 1024 });
```

And in fact, **any option** supported by node's `child_process.exec()` options API can be supplied here. That's all `maxBuffer` is.

But you'd probably much rather just do this.

```js
const { exec } = require('lib-shell');

// note: x4 wasn't big enough, increased buffer size to x5
exec('echo "hello world"', { xbuffer: 5 });
```

Regardless, the two options are incompatible with each other, and if you try to use them together, it will throw an error.


## Installation and Usage

### Latest Node

"Latest Node" usage requires `node >= 8.11.1`.

```bash
npm install lib-shell
```

```js
const { exec } = require('lib-shell');
exec('echo "hello word!"');
```

### Older Node

We transpile this project for you!

```bash
npm install lib-shell
```

```js
var shell = require('lib-shell/dist');
shell.exec('echo "hello world!"');
```

### Copy and paste

If you have a project where it is too inconvenient to install a utility like `lib-shell` before you actually start the build itself, you can use the **standalone**, pre-built file `lib-shell/dist.js`.

It's commited to the git repo, so you can just download it from here. Or you can go `npm i -g lib-shell` and grab it from there.


## Build

```bash
git clone git@github.com:sberney/lib-shell.git
cd lib-shell
yarn install
yarn build
```

Puts the output in `dist/`.


## TODOs

* discuss colorization
  * Basically, things you run auto-detect their environment. Often the program you're running has a `--ansi` option or `--color` or something like that. If it doesn't, it's not super clear what to do about it.
  * `child_process.spawn` has a `stdio` option that `exec` does not. Perhaps we should look into that.

## License

MIT