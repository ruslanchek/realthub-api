import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/property')
  getProperties() {
    return this.appService.getProperties();
  }

  @Get('/property/:id')
  getProperty() {
    return this.appService.getProperty('1');
  }
}
