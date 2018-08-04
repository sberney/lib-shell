# lib-shell

Do you want to use JavaScript to automate your build process? Does your build process involve running ... well ... anything other than JavaScript? ... You're going to need to `lib-shell`!

You can use node's `exec` and `spawn` (this is the *correct* approach), but they are annoying. Why did they even bother writing them? Use `lib-shell`, you don't need to know anything at all about those built-in utilities, unless you really want to.

## Sequencing, 1

Plus, those built-ins don't even use promises. Nobody wants to know about `exit` events. How does anyone do anything without promises? Everybody just wants to do this:

```js
const build = () =>
  Promise.resolve().
  then(() => operation1()).
  then(() => operation2()).
  then(() => finishUp()).
  catch(err => figureItOut());
```

## Examples, 1

Nobody wants to know about node's `exec`. Instead, just go,

```js
const { exec } = require('lib-shell');
exec('echo "hello world!"');

// [shell] "hello world!"
// [shell]
// [shell] shell exited, code 0.
```

Don't like having `[shell] ` prepended to the output? Tell it to be `plain`!

```js
const { exec } = require('lib-shell');
exec('echo "hello world!"', { plain: true });

// "hello world!"
//
// shell exited, code 0.
```

Don't like knowing about why the process ended?

```js
const { exec } = require('lib-shell');
exec('echo "hello world!"', { plain: true, info: false }); 
// "hello world!"
//
```

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

# Complicated sequencing

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

# Reason codes

Perhaps you need more than just a catch handler at the end of a promise chain. Perhaps you need the exit code. Or some reason, any reason, why your script didn't work.

The **error messages** in the `catch` handler have properties assigned to them. Assuming they are caused by shell operation and not by `lib-shell` (shock) or your code, there will be one of these properties defined:

Property | Type   | Description
---------|--------|-----------------------
code     | number | Exit code. 0 is ok, anything else is an error. The process exited on its own.
signal   | number | When your process was killed by an interrupt. Which signal killed your process.

You don't get both.

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

# YourScript.js's Exit code

You can always exit node without any help:

```js
const process = require('process');  // a node built-in
process.exit(99);  // exit code 99. This will terminate your script!
```

But if you want, you can specify the `exit: true` property, to tell your shell command to error this script if it fails.

```js
const { exec } = require('lib-shell');
exec('exit 9', {
  exit: true
});

// [shell] shell exited, code 9.
//
```

# Exit banner, outro

Say you want to provide a helpful message when your build script fails, like "Build failed. Try checking out a fresh copy and building it from scratch. If that doesn't work, email tech@ITsupport.utopiacorp.net." These kinds of messages add a lot of professionalism to the styling of your failure.

```js
const { exec } = require('lib-shell');
exec('exit -1', {
  exit: true,
  failureBanner: `Build failed. Try checking out a fresh copy and building it from scratch. If that doesn't work, email tech@ITsupport.utopiacorp.net.`
});

// [shell] shell exited, code 4294967295.
//
// Build failed. Try checking out a fresh copy and building it from scratch. If that doesn't work, email tech@ITsupport.utopiacorp.net.
//
```

# Tricks

## MaxBuffer

For a long running process that really dumps a lot of console output, the `node` buffer size is way too small. Node's default buffer size is `200 * 1024` **bytes**. You can change this to whatever you want, say x5:

```js
const { exec } = require('lib-shell');
exec('echo "hello world"', { maxBuffer: 1000 * 1024 });
```

And in fact, any option supported by node's `exec` options API can be supplied here. That's all `maxBuffer` is.

But you'd probably much rather just do this.

```js
const { exec } = require('lib-shell');
exec('echo "hello world"', { xbuffer: 5 });
// note: x4 wasn't big enough, increased buffer size to x5
```

Regardless, the two options are incompatible with each other, and if you try to use them together, it will throw an error.

## Another Trick

I haven't thought of one yet, but this section needs at least two subheadings to be a real section.

# TODO

* discuss colorization
* copy examples into readme


# Options

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

## Extended Options

Anything node's exec supports. Examples:

Options           | Default    | Note
----------------- |------------|--------------
maxBuffer         | 200 * 1024 | Incompatible with `xbuffer`
