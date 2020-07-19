import { EOL } from 'os';

import { infoAddender } from './info-addender';
import { withStdio } from './with-stdio';

export const pipeToStdFactory = (opts={}) => child => {
  const { stdout, stderr, stdin } = withStdio(opts);
  const formatInfo = message => `${EOL}${message}${EOL}`;
  const addendInfo = infoAddender(opts, formatInfo);

  if (stdin)
    stdin.pipe(child.stdin);
  else
    require('process').stdin.pipe(child.stdin);

  child.stdout.on('data', data => stdout && stdout.write(data));
  child.stderr.on('data', data => stderr && stderr.write(data));
  addendInfo(child);
};