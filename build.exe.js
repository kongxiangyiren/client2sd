const { execSync } = require('child_process');
const { rmSync, copyFileSync, renameSync } = require('fs');

let runName = process.platform === 'win32' ? 'hello.exe' : 'hello';

rmSync(`./${runName}`, {
  recursive: true,
  force: true,
});
copyFileSync(process.execPath, runName);
execSync(
  `npx postject ${runName} NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`,
);

rmSync(`./dist`, {
  recursive: true,
  force: true,
});

renameSync(`./build`, `./dist`);
renameSync(`./${runName}`, `./dist/${runName}`);

// 删除多余
if (process.platform === 'linux') {
  rmSync('./dist/build/deps/lib/libtensorflow.so.2.9.1', {
    recursive: true,
    force: true,
  });

  rmSync('./dist/build/deps/lib/libtensorflow_framework.so.2.9.1', {
    recursive: true,
    force: true,
  });
} else if (process.platform === 'win32') {
  rmSync('./dist/build/deps', { recursive: true, force: true });
} else if (process.platform === 'darwin') {
  rmSync('./dist/build/deps/lib/libtensorflow.2.7.0.dylib', {
    recursive: true,
    force: true,
  });

  rmSync('./dist/build/deps/lib/libtensorflow_framework.2.7.0.dylib', {
    recursive: true,
    force: true,
  });
}
