import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionService } from './services/permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RemovePermissionDto } from './dto/remove-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@catalog/auth/entities/user.entity';

@ApiTags('Permission')
@Controller('permission')
@UseGuards(JwtAuthGuard)
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
  getAccesses(@GetUser() user: User) {
    if (user.isAdmin) {
      return {
        message: `admin user has full access to all services`,
      };
    }
    return this.permissionService.getAccesses(user.id);
  }
  @Get(':id')
  listUserAccess(@Param('id') id: string) {
    return this.permissionService.getAccesses(id);
  }
}
