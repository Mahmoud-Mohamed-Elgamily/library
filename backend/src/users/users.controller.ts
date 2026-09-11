import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get All Registered Users' })
    @ApiResponse({ status: 200, description: 'Registered Users Retrieved Successfully!' })
    @ApiResponse({ status: 403, description: 'Only Admins Can View Registered Users' })
    findAll() { return this.usersService.findAll }
}