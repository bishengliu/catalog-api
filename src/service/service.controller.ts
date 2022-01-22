import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  FilterServicesDto,
  CreateServiceVersionDto,
  CreateServiceDto,
  UpdateServiceDto,
} from './dto';
import { ServiceService } from './service.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('service')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // create a service
  @Post()
  createService(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }
  // append versions to a service
  @Post('version')
  createServiceVersion(
    @Body() createServiceVersionDto: CreateServiceVersionDto,
  ) {
    return this.serviceService.createServiceVersion(createServiceVersionDto);
  }

  // search/filter service
  @Post('search')
  searchServices(@Body() filterServicesDto: FilterServicesDto) {
    return this.serviceService.filterServices(filterServicesDto);
  }

  // retrieve all services
  @Get()
  findAllServices(@Param('offset') offset: number) {
    return this.serviceService.findAllServices(offset);
  }

  // retrieve a service including all its versions
  @Get(':id')
  findServiceById(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  // update a service
  @Patch(':id')
  updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, updateServiceDto);
  }

  // remove a service
  @Delete(':id')
  removeService(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }
}
