import { Body, Controller, Logger, Post } from '@nestjs/common';
import axios from 'axios';
import { client } from 'node-gradio-client';

import nsfwjsApi from '../nsfwjs';
import { readFileSync } from 'fs';
import { join } from 'path';

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
      const app = await client(
        'https://prodia-fast-stable-diffusion.hf.space/',
      );
      const result = await app.predict(0, [
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
        Logger.log(image.url, '文生图');
        if (image && image.url) {
          const res = await axios
            .get(image.url, {
              responseType: 'arraybuffer',
            })
            .then((res) => res.data)
            .catch((err) => err);

          const nsfwRes = await nsfwjsApi
            .identificationOfPictures(res)
            .catch((err) => err);

          if (!nsfwRes || nsfwRes.code !== 200) {
            return false;
          }

          if (nsfwRes.code === 200 && nsfwRes.msg) {
            for (const item of nsfwRes.msg) {
              if (
                item.className &&
                (item.className === 'Hentai' ||
                  item.className === 'Porn' ||
                  item.className === 'Sexy')
              ) {
                if (
                  item.probability >
                  (isNaN(Number(process.env.probability))
                    ? Number(process.env.probability)
                    : 0.3)
                ) {
                  return {
                    images: [
                      Buffer.from(
                        readFileSync(join(process.cwd(), '/public/nsfw.png')),
                      ).toString('base64'),
                    ],
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
                }
              } else if (!item.className || !item.probability) {
                return false;
              }
            }
          }
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
