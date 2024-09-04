const nsfwjsApi = require('nsfwjs-api');
const { join, parse } = require('path');
const { rmSync, cpSync, renameSync } = require('fs');
const { globSync } = require('glob');
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

function libRename(libs) {
  for (let item of libs) {
    for (let i = 0; i < libs.length; i++) {
      if (
        item.name !== libs[i].name &&
        item.name.indexOf(libs[i].name) !== -1
      ) {
        renameSync(join(item.dir, item.base), join(item.dir, libs[i].base));
      }
    }
  }
}

// 删除多余
if (process.platform === 'linux') {
  const s = globSync('build/build/deps/lib/*');

  let libs = [];
  for (let i = 0; i < s.length; i++) {
    libs.push(parse(s[i]));
  }
  libRename(libs);
} else if (process.platform === 'win32') {
  rmSync('./build/build/deps', { recursive: true, force: true });
} else if (process.platform === 'darwin') {
  const s = globSync('build/build/deps/lib/*.dylib');

  let libs = [];
  for (let i = 0; i < s.length; i++) {
    libs.push(parse(s[i]));
  }
  libRename(libs);
}

rmSync('./build/build/lib/napi-v9', { recursive: true, force: true });
rmSync('./build/build/prebuilds', { recursive: true, force: true });
