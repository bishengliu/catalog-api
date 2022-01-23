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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  FilterServicesDto,
  CreateServiceVersionDto,
  CreateServiceDto,
  UpdateServiceDto,
} from './dto';
import { ServiceService } from './services/service.service';

@Controller('service')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // create a service
  @Post()
  createService(
    @GetUser('id') userId: string,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.serviceService.createService(userId, createServiceDto);
  }
  // append versions to a service
  @Post('version')
  createServiceVersion(
    @GetUser('id') userId: string,
    @Body() createServiceVersionDto: CreateServiceVersionDto,
  ) {
    return this.serviceService.createServiceVersion(
      userId,
      createServiceVersionDto,
    );
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
    return this.serviceService.findOneService(id);
  }

  // update a service
  @Patch(':id')
  updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.updateService(id, updateServiceDto);
  }

  // remove a service
  @Delete(':id')
  removeService(@Param('id') id: string) {
    return this.serviceService.removeService(id);
  }
}
