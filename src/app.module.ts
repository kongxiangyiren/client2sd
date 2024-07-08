import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SdapiModule } from './sdapi/sdapi.module';

@Module({
  imports: [SdapiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
