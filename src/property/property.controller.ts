import { Controller, Get, Param } from '@nestjs/common';
import { PropertyService } from './property.service';
import { IApiResponse } from '../interfaces/common';
import { IProperty } from './property.interfaces';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  getProperties(): IApiResponse<IProperty[]> {
    return this.propertyService.getProperties();
  }

  @Get(':id')
  getProperty(@Param() params: { id: string }): IApiResponse<IProperty> {
    return this.propertyService.getProperty(params.id);
  }
}
