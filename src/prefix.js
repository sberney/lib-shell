import { EOL } from 'os';

import once from 'lodash-es/once';

import { infoAddender } from './info-addender';
import { withStdio } from './with-stdio';


const replaceEol = prefix => data =>
  data.replace(/\r\n|\r|\n/g, `${EOL}${prefix}`);

export const formatter = (prefix='') => {
  const replaceEol2 = replaceEol(prefix);
  return str => 
    `${prefix}${replaceEol2(str)}`;
};


// Multiplexing -- 

// if there are several invocations of exec(),
// then we want to keep track of the global newline state,
// and the newline state of each process.
// So one solution is a shared state between exec()s.
// Unfortunately, I have a gut dislike of this approach done wrong.

// Another idea is to add newline-flushed buffers
// in front of every exec. This way, we don't
// need shared state, because each write is newline-complete.
// Unfortunately, this doesn't work with certain loading screens, . . . .

// "All of the above" is also a choice.

// We could also implement some crazy ncurses-style
// screen rewriting -- where lines are printed in shared state order,
// but then rearranged after the fact into sequential-looking output.
// I might like this for myself, but I doubt other people will.


export const prefixedStream = prefix => (sourceStream, destStream) => {
  const prepend = once(() =>
    destStream.write(prefix));
  const replaceEol2 = replaceEol(prefix);

  sourceStream.on('data', data => {
    prepend();
    destStream.write(replaceEol2(data));
  });
};

export const makePrefix = (opts={}) => {
  const { prefix } = opts;
  const defaultPrefix = 'shell';
  return `[${prefix || defaultPrefix}] `;
};

export const injectPrefixing = (opts={}) => child => {
  const { stdout, stderr } = withStdio(opts);

  //const { info } = opts;  // todo: remove?
  const prefix = makePrefix(opts);
  const pipe = prefixedStream(prefix);
  const formatInfo = message => `${EOL}${prefix}${message}${EOL}`;
  const appendInfo = infoAddender(opts, formatInfo);

  pipe(child.stdout, stdout);
  pipe(child.stderr, stderr);
  appendInfo(child);
};