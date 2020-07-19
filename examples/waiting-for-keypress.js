import { PassThrough } from 'stream';
import { exec } from '../index';
import { stdin } from 'process';


const plain = false;

const main = async () => {

  // First - check out default functionality
  console.log('using default stdin -- process.stdin');
  await exec('./waiting-for-keypress.sh', {
    plain,
    info: false,
    noTrailingNewline: true
  });

  // Secondly - check out custom override of stdin functionality
  console.log("\nusing custom stdin -- keyboard won't do anything. waits 11 seconds.");
  const stream = new PassThrough;

  setTimeout(() => {
    console.log('Going to send enter press');
    stream.write('\n');
  }, 11 * 1000);

  await exec('./waiting-for-keypress.sh', {
    plain,
    info: false,
    noTrailingNewline: true,
    stdio: { stdin: stream }
  });

  // Thirdly - validate that setting null means stdin just can't occur at all
  console.log('\nusing null stdin -- this will never complete');
  await exec('./waiting-for-keypress.sh', {
    plain,
    info: false,
    noTrailingNewline: true,
    stdio: { stdin: null }
  });
};

main();