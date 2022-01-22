import { CreateServiceVersionDto } from './dto/create-service-version.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  createService(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }
  @Post('version')
  createServiceVersion(
    @Body() createServiceVersionDto: CreateServiceVersionDto,
  ) {
    return this.serviceService.createServiceVersion(createServiceVersionDto);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findServiceById(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  removeService(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}
