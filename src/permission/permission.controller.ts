import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/user.decorator';
import { PermissionService } from './services/permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RemovePermissionDto } from './dto/remove-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  grantAccess(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.grantAccess(createPermissionDto);
  }

  @Post()
  removeAccess(@Body() removePermissionDto: RemovePermissionDto) {
    return this.permissionService.removeAccess(removePermissionDto);
  }
  @Get()
  getAccesses(@GetUser('id') userId: string) {
    return this.permissionService.getAccesses(userId);
  }
  @Get(':id')
  listUserAccess(@Param('id') id: string) {
    return this.permissionService.getAccesses(id);
  }
}
