import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type AuthenticatedUser, CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DashboardService } from './dashboard.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }
    @Get()
    @Roles(UserRole.ADMIN, UserRole.USER)
    @ApiOperation({ summary: 'Get Dashboard Data for the current user' })
    @ApiResponse({ status: 200, description: 'Return Admin Statistics or user dashboard data based on the authenticated role' })
    getDashboard(@CurrentUser() user: AuthenticatedUser) {
        return this.dashboardService.getDashboard(user.id, user.role)
    }
}
