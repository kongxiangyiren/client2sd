const nsfwjsApi = require('nsfwjs-api');
const { join } = require('path');
const { rmSync, cpSync } = require('fs');
nsfwjsApi.UseModel = true;
nsfwjsApi.model = join(process.cwd(), 'build/model');

//   copy模型文件夹, UseModel为false时无效
// 模型文件 https://github.com/infinitered/nsfwjs/tree/master/models/inception_v3
nsfwjsApi.cpModel();

cpSync('./.env', './build/.env');
cpSync('./public', './build/public', {
  recursive: true,
  force: true,
});

// 删除多余
if (process.platform === 'linux') {
  rmSync('./build/build/deps/lib/libtensorflow.so.2.9.1', {
    recursive: true,
    force: true,
  });

  rmSync('./build/build/deps/lib/libtensorflow_framework.so.2.9.1', {
    recursive: true,
    force: true,
  });
} else if (process.platform === 'win32') {
  rmSync('./build/build/deps', { recursive: true, force: true });
} else if (process.platform === 'darwin') {
  rmSync('./build/build/deps/lib/libtensorflow.2.7.0.dylib', {
    recursive: true,
    force: true,
  });

  rmSync('./build/build/deps/lib/libtensorflow_framework.2.7.0.dylib', {
    recursive: true,
    force: true,
  });
}

rmSync('./build/build/lib/napi-v9', { recursive: true, force: true });
rmSync('./build/build/prebuilds', { recursive: true, force: true });
