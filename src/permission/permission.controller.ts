import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GetUser } from '../common/decorators/user.decorator';
import { User } from '../auth/entities/user.entity';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionService } from './services/permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RemovePermissionDto } from './dto/remove-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@Controller('permission')
@UseGuards(AdminGuard)
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('grant')
  grantAccess(
    @Body() createPermissionDto: CreatePermissionDto,
    @GetUser() user: User,
  ) {
    if (user.isAdmin && user.id === createPermissionDto.userId) {
      return {
        message: `admin user already has full access to all services`,
      };
    }
    return this.permissionService.grantAccess(createPermissionDto);
  }

  @Post('remove')
  removeAccess(
    @Body() removePermissionDto: RemovePermissionDto,
    @GetUser() user: User,
  ) {
    if (user.isAdmin && user.id === removePermissionDto.userId) {
      return {
        message: `cannot remove admin user from accessing a service`,
      };
    }
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
