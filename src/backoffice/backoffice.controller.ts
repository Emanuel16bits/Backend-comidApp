import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../backoffice/decorators/roles.decorator';
import { RolesGuard } from '../backoffice/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('backoffice')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BackofficeController {
  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  getDashboard() {
    return {
      users: 0,
      orders: 0,
      restaurants: 0,
    };
  }

  @Get('status')
  @Roles(UserRole.ADMIN)
  getStatus() {
    return {
      status: 'Backoffice operativo',
      timestamp: new Date().toISOString(),
    };
  }
}
