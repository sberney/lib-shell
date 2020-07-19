import { PassThrough } from 'stream';
import { exec } from '../index';
import { stdin } from 'process';


const main = async () => {

  /*
  console.log('using default stdin -- process.stdin');

  await exec('./waiting-for-keypress.sh', {
    plain: true,
    info: false,
    noTrailingNewline: true
  });
  */


  console.log("using custom stdin -- keyboard won't do anything. waits 11 seconds.");
  const stream = new PassThrough;

  exec('./waiting-for-keypress.sh', {
    plain: true,
    info: false,
    noTrailingNewline: true,
    stdio: { stdin: stream }
  });

  setTimeout(() => {
    console.log('Going to send enter press');
    stream.write('\n');
  }, 11 * 1000);

};

main();