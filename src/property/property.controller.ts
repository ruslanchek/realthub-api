import { Controller, Get, Param } from '@nestjs/common';
import { PropertyService } from './property.service';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  getProperties() {
    return this.propertyService.getProperties();
  }

  @Get(':id')
  getProperty(@Param() params: { id: string }) {
    return this.propertyService.getProperty(params.id);
  }
}
