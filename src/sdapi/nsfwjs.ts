import * as nsfwjsApi from 'nsfwjs-api';
import { join } from 'path';
// @ts-expect-error
nsfwjsApi.UseModel = true;
// 模型位置 默认运行文件夹下model, UseModel为false时无效
// @ts-expect-error
nsfwjsApi.model = join(process.cwd(), 'model');

//   copy模型文件夹, UseModel为false时无效
// 模型文件 https://github.com/infinitered/nsfwjs/tree/master/models/inception_v3
nsfwjsApi.cpModel();
// @ts-expect-error
nsfwjsApi.topk = 1;

export default nsfwjsApi;
