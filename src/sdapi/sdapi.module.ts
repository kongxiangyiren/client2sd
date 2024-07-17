import { Module, SetMetadata } from '@nestjs/common';
import { MODULE_PATH } from '@nestjs/common/constants';
import { Tet2imgController } from './tet2img/tet2img.controller';
import { Img2imgController } from './img2img/img2img.controller';
import { OptionsController } from './options/options.controller';
import { SdModelsController } from './sd-models/sd-models.controller';

@SetMetadata(MODULE_PATH, 'sdapi/v1')
@Module({
  controllers: [
    Tet2imgController,
    Img2imgController,
    OptionsController,
    SdModelsController,
  ],
})
export class SdapiModule {}
