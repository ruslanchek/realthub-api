import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/properties')
  getProperties() {
    return this.appService.getProperties();
  }

  @Get('/properties/:id')
  getProperty() {
    return this.appService.getProperty('1');
  }
}
