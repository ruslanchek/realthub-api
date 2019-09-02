import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Module({
  providers: [PropertiesService],
})
export class PropertiesModule {}
