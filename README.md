![Node.js CI](https://github.com/sberney/lib-shell/workflows/Node.js%20CI/badge.svg)

# `lib-shell`

Do you want to use JavaScript to automate your build process? Or does your build process involve running ... errm ... *anything* other than JavaScript? ...

... You're going to need to `lib-shell`!

-------

Of course, you *can* use node's `exec` and `spawn` (this is the *correct* approach) to run command line scripts,
but they are annoying. Why did they even bother writing them? To be clear, the problem with these libraries is that
their API isn't very user friendly.

## Why lib-shell

### Simplicity and robustness

Using `lib-shell`, you don't need to know anything at all about those inconvenient built-in utilities,
unless you really want to. `lib-shell` exports an `exec` function which low-cerimoniously executes whatever command
you pass it, and returns a promise which completes when the command completes.

`lib-shell` is an API built around the underlying `exec` and `spawn` commands. It's platform agnostic: it runs on
windows, linux, and mac. It comes with multiple built versions of the code targeting various versions of node.js.

#### Errors

If something goes wrong, `lib-shell` returns a rejected promise. This is great, because it let's you respond to
the success and failure of your commands.

Unfortunately, if something goes wrong, the rejected promise doesn't contain text of the error,
because it's hard to determine what the text of the error actually is.
A lot of programs print their error messages to stdout instead of stderr, and a lot of programs print things that
aren't critical errors to stderr. So a record of stderr wouldn't be universally helpful. And a printout of the
entirety of stdout and stderr wouldn't be especially useful in most simple scenarios.

`lib-shell` pipes stdout and stderr messages without keeping any information about their contents. By default,
these are piped to the calling process, eg to the console where you can see them and inspect them with your eyes.
However you can pipe to something else, and keep a record of every piece of information, and then pipe the content
on to the console, if you really want the body of the output to scan for keywords and failure reasons.


### Build Sequencing

Those node built-in don't even use promises. Nobody wants to know about `exit` events. They want `Promise`'s! They want to do this:

```js
const build = () =>
  Promise.resolve().
  then(() => operation1()).
  then(() => operation2()).
  then(() => finishUp()).
  catch(err => figureItOut());
```

Now you can! All without writing any code.


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

*Note,* parallel processing can write mixed up junk to the command line.
In general, `lib-shell` will print out intelligent output, although usually
it looks more like the following:

```js
// [one] operation1
// [three] operation3
// [two] operation2
// [two]
// [four-b] operation4b
// [four-a] operation4a
// [four-a]
// [two] shell exited, code 0.
// [one]
// [four-a] shell exited, code 0.
// [four-b] shell exited, code 0.
// [one] shell exited, code 0.
// [three]
// [four-b]
// [three] shell exited, code 0.
```

Which is totally fine and still intelligible. In fact, this is pretty much the desired
way for output to be printed in most cases -- in the order that the events occurred.

***However**, just like parallel processes which print only part of a line at a time,
the current implementation has occasional newline issues, where labels are mismatched.
`lib-shell` will still work well in these circumstances, in part for which it was designed.*

One interesting possibility for a feature idea is support for buffering for this multiplexing scenario.


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

These kinds of messages add a lot of stylishness and professionalism to your abysmal failure!

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

"Latest Node" usage requires `node >= 10.14.1`.

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
var shell = require('lib-shell/dist/lib-shell.es5.min.js');
shell.exec('echo "hello world!"');
```

### Copy and paste

If you have a project where it is too inconvenient to install a utility like `lib-shell` before you actually start the build itself, you can use the **standalone**, pre-built file `dist/lib-shell.js`. It's not transpiled to es5, so you still need a modern `node` installation. If you want the transpiled one, grab that copy instead.

It's commited to the git repo, so you can just download it from here. Or you can go `npm i -g lib-shell` and grab it from there.


## Build

```bash
git clone git@github.com:sberney/lib-shell.git
cd lib-shell
yarn install
yarn build
```

Puts the output in `dist/`.


# Links

[npm](https://www.npmjs.com/package/lib-shell)


## TODOs

* discuss colorization
  * Basically, things you run auto-detect their environment. Often the program you're running has a `--ansi` option or `--color` or something like that. If it doesn't, it's not super clear what to do about it.
  * `child_process.spawn` has a `stdio` option that `exec` does not. Perhaps we should look into that.
* better multiplexing

## License

MIT