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

rmSync('./build/build/lib/napi-v9', { recursive: true, force: true });
rmSync('./build/build/prebuilds', { recursive: true, force: true });
