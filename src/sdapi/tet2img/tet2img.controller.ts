import { Body, Controller, Logger, Post } from '@nestjs/common';
import axios from 'axios';
import type { Client as C } from '@gradio/client';

// 文生图
@Controller('txt2img')
export class Tet2imgController {
  @Post()
  async text2img(
    @Body()
    body: {
      sampler_index: string;
      restore_faces: boolean;
      enable_hr: boolean;
      prompt: string;
      batch_size: number;
      seed: number;
      negative_prompt?: string;
      cfg_scale: number;
      steps: number;
      width: number;
      height: number;
    },
  ) {
    body.width > 1024 ? (body.width = 1024) : body.width;
    body.height > 1024 ? (body.height = 1024) : body.height;
    body.steps > 25 ? (body.steps = 25) : body.height;
    body.cfg_scale > 20 ? (body.cfg_scale = 20) : body.cfg_scale;

    try {
      const { Client } = await eval("import('@gradio/client')");

      const client = (await Client.connect(
        'https://prodia-fast-stable-diffusion.hf.space/',
      )) as C;
      const result = await client.predict(0, [
        body.prompt, // 提示词
        body.negative_prompt ?? '', //反向提示词
        process.env.model, //模型
        body.steps ?? 20, // Sampling Steps
        body.sampler_index ?? 'DPM++ 2M Karras', // Sampling Method
        body.cfg_scale ?? 7, // CFG Scale
        body.width ?? 512, //width
        body.height ?? 512, // Height
        body.seed ?? -1, // Seed
      ]);

      const images = [];

      for (const image of result.data as Array<{ url: string }>) {
        Logger.log('文生图', image.url);
        if (image && image.url) {
          const res = await axios
            .get(image.url, {
              responseType: 'arraybuffer',
            })
            .then((res) => res.data)
            .catch((err) => err);

          // buff 转 base64
          const base64 = Buffer.from(res).toString('base64');

          images.push(base64);
        }
      }

      return {
        images,
        parameters: {
          prompt: body.prompt,
          negative_prompt: body.negative_prompt,
        },
        info: JSON.stringify({
          prompt: body.prompt,

          negative_prompt: body.negative_prompt,

          seed: body.seed,
        }),
      };
    } catch (error) {
      return error;
    }
  }
}
