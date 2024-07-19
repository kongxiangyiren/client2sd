import { Body, Controller, Get, Post } from '@nestjs/common';

// 查询当前配置
@Controller('options')
export class OptionsController {
  @Get()
  getOptions() {
    return {
      sd_model_checkpoint: process.env.model,
      sd_vae: '',
    };
  }

  //  更换模型
  @Post()
  replacementModel(@Body() body: { sd_model_checkpoint: string }) {
    process.env.model = body.sd_model_checkpoint;
    return null;
  }
}
