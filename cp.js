const { cpSync, existsSync } = require('fs');
if (
  process.platform === 'win32' &&
  existsSync('./node_modules/@tensorflow/tfjs-node/deps/lib/tensorflow.dll')
) {
  cpSync(
    './node_modules/@tensorflow/tfjs-node/deps/lib/tensorflow.dll',
    './node_modules/@tensorflow/tfjs-node/lib/napi-v8/tensorflow.dll',
  );
}
