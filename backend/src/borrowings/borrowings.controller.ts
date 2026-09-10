import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { type AuthenticatedUser, CurrentUser } from '../auth/decorators/currentUser.decorator';
import { BorrowingsService } from './borrowings.service';
import { CreateBorrowingDto } from './dto/createBorrowing.dto';
import { BorrowingQueryDto } from './dto/borrowingQuery.dto';

@ApiTags('Borrowings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('borrowings')
export class BorrowingsController {
    constructor(private readonly borrowingsService: BorrowingsService) { }

    @Post()
    @Roles(UserRole.USER)
    @ApiOperation({ summary: 'Borrow a book' })
    @ApiResponse({ status: 201, description: 'Book borrowed successfully' })
    @ApiResponse({ status: 404, description: 'Book not found' })
    @ApiResponse({ status: 409, description: 'Book unavailable or user already has an active borrowing' })
    create(@CurrentUser() user: AuthenticatedUser, @Body() createBorrowingDto: CreateBorrowingDto) {
        return this.borrowingsService.create(user.id, createBorrowingDto);
    }

    @Patch(':id/return')
    @Roles(UserRole.USER)
    @ApiOperation({ summary: 'Return a borrowed book' })
    @ApiResponse({ status: 200, description: 'Book returned successfully' })
    @ApiResponse({ status: 403, description: 'User can only return their own borrowing' })
    @ApiResponse({ status: 404, description: 'Borrowing not found' })
    @ApiResponse({ status: 409, description: 'Borrowing has already been returned' })
    returnBook(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.borrowingsService.returnBook(user.id, id)
    }

    @Get('me')
    @Roles(UserRole.USER)
    @ApiOperation({ summary: 'Get current user borrowing history' })
    @ApiResponse({ status: 200, description: 'Borrowing history retrieved successfully' })
    findMyBorrowings(@CurrentUser() user: AuthenticatedUser, @Query() query: BorrowingQueryDto) {
        return this.borrowingsService.findMyBorrowings(user.id, query);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all borrowing activity' })
    @ApiResponse({ status: 200, description: 'Borrowing activity retrieved successfully' })
    findAll(@Query() query: BorrowingQueryDto) {
        return this.borrowingsService.findAll(query);
    }
}