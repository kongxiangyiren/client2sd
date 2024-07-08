import { Module, SetMetadata } from '@nestjs/common';
import { MODULE_PATH } from '@nestjs/common/constants';
import { Tet2imgController } from './tet2img/tet2img.controller';

@SetMetadata(MODULE_PATH, 'sdapi/v1')
@Module({
  controllers: [Tet2imgController],
})
export class SdapiModule {}
