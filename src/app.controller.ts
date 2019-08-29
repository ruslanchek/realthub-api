import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/property')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getProperties() {
    return this.appService.getProperties();
  }

  @Get(':id')
  getProperty(@Param() params: { id: string }) {
    return this.appService.getProperty(params.id);
  }
}
