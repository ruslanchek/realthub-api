import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/property')
  getProperties() {
    return this.appService.getProperties();
  }

  @Get('/property/:id')
  getProperty(@Param() params: { id: string }) {
    return this.appService.getProperty(params.id);
  }
}
