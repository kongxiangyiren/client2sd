import { Body, Controller, Logger, Post } from '@nestjs/common';
import axios from 'axios';
import { client } from 'node-gradio-client';
import * as FormData from 'form-data';
import nsfwjsApi from '../nsfwjs';
import { readFileSync } from 'fs';
import { join } from 'path';

// 图生图
@Controller('img2img')
export class Img2imgController {
  @Post()
  async img2img(
    @Body()
    body: {
      sampler_index: string;
      init_images: string[];
      restore_faces: boolean;
      enable_hr: boolean;
      prompt: string;
      batch_size: number;
      seed: number;
      negative_prompt: string;
      cfg_scale: number;
      steps: number;
      width: number;
      height: number;
      denoising_strength: number;
    },
  ) {
    try {
      body.width > 1024 ? (body.width = 1024) : body.width;
      body.height > 1024 ? (body.height = 1024) : body.height;
      body.steps > 25 ? (body.steps = 25) : body.height;
      body.cfg_scale > 20 ? (body.cfg_scale = 20) : body.cfg_scale;
      body.denoising_strength > 1
        ? (body.denoising_strength = 1)
        : body.denoising_strength;
      // console.log(body.init_images);

      const formdata = new FormData();

      formdata.append(
        'files',
        Buffer.from(body.init_images[0].split(',')[1], 'base64'),
        {
          filename:
            'image.' +
            body.init_images[0]
              .split(',')[0]
              .split(':')[1]
              .split(';')[0]
              .split('/')[1],
          contentType: body.init_images[0]
            .split(',')[0]
            .split(':')[1]
            .split(';')[0],
        },
      );
      // console.log(formdata);

      const img = await axios({
        method: 'post',
        url: 'https://zugas-fast-stable-diffusion.hf.space/upload',
        headers: {
          'Content-Type': formdata.getHeaders()['content-type'],
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
        data: formdata,
      }).catch((err) => err);
      if (img instanceof Error) {
        return img;
      }

      const app = await client(
        'https://zugas-fast-stable-diffusion.hf.space/',
      );
      const result = await app.predict(1, [
        {
          meta: { _type: 'gradio.FileData' },
          mime_type: body.init_images[0]
            .split(',')[0]
            .split(':')[1]
            .split(';')[0],
          orig_name:
            'image.' +
            body.init_images[0]
              .split(',')[0]
              .split(':')[1]
              .split(';')[0]
              .split('/')[1],
          path: img.data[0],
          url:
            'https://zugas-fast-stable-diffusion.hf.space/file=' + img.data[0],
        },
        body.denoising_strength ?? 0.7, // Denoising Strength
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
        if (image && image.url) {
          Logger.log(image.url, '图生图');
          const res = await axios
            .get(image.url, {
              responseType: 'arraybuffer',
            })
            .then((res) => res.data)
            .catch((err) => err);

          const nsfwRes = await nsfwjsApi
            .identificationOfPictures(res)
            .catch((err) => err);

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
