import { Get, Post, Patch, Delete, Controller, UseGuards, Query, Body, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BooksService } from './books.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'generated/prisma/enums';
import { BookQueryDto } from './dto/book-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('Books')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.USER)
    @ApiOperation({ summary: 'Get All Books' })
    @ApiResponse({ status: 200, description: 'Books Retrieved Successfully' })
    findAll(@Query() query: BookQueryDto) {
        return this.booksService.findAll(query)
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    @ApiOperation({ summary: 'Get a book by ID' })
    @ApiResponse({ status: 200, description: 'Books Retrieved Successfully' })
    @ApiResponse({ status: 404, description: 'Book Not Found' })
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(id)
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a Book' })
    @ApiResponse({ status: 200, description: 'Books Created Successfully' })
    @ApiResponse({ status: 409, description: 'ISBN Already Exists' })
    create(@Body() createBookDto: CreateBookDto) {
        return this.booksService.create(createBookDto)
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update a Book' })
    @ApiResponse({ status: 200, description: 'Book Updated Successfully' })
    @ApiResponse({ status: 404, description: 'Book Not Found' })
    update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.update(id, updateBookDto)
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Remove a Book' })
    @ApiResponse({ status: 200, description: 'Book Removed Successfully' })
    @ApiResponse({ status: 404, description: 'Book Not Found' })
    @ApiResponse({ status: 409, description: 'Book has ACTIVE borrowings' })
    remove(@Param('id') id: string,) {
        return this.booksService.remove(id)
    }
}