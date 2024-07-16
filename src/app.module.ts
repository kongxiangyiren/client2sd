import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SdapiModule } from './sdapi/sdapi.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    SdapiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
