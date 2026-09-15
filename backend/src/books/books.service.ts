import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookQueryDto } from './dto/book-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
    constructor(private readonly prisma: PrismaService) { }
    async create(createBookDto: CreateBookDto) {
        const { title, author, isbn, category, totalCopies } = createBookDto;

        const existingBook = await this.prisma.book.findUnique({
            where: { isbn }
        })
        if (existingBook) {
            throw new ConflictException(
                'A book with this ISBN already exists'
            )
        }
        return this.prisma.book.create({
            data: {
                title, author, isbn, category, totalCopies, availableCopies: totalCopies,
            }
        })
    }

    async findAll(query: BookQueryDto) {
        const search = query.search?.trim()
        return this.prisma.book.findMany({
            where: {
                deletedAt: null,
                ...(search ? {
                    OR: [{ title: { contains: search, mode: "insensitive", } },
                    { author: { contains: search, mode: "insensitive", } },
                    { isbn: { contains: search, mode: "insensitive", } }]
                } : {})
            }, orderBy: { createdAt: 'desc' }
        })
    }

    async findOne(id: string) {
        const book = await this.prisma.book.findFirst({
            where: { id, deletedAt: null }
        })
        if (!book) {
            throw new NotFoundException('Book not found')
        }
        return book;
    }

    async update(id: string, updateBookDto: UpdateBookDto) {
        const existingBook = await this.prisma.book.findFirst({ where: { id, deletedAt: null } })

        if (!existingBook) {
            throw new NotFoundException("Book Not Found")
        }

        if (updateBookDto.isbn && updateBookDto.isbn !== existingBook.isbn) {
            const isbnExists = await this.prisma.book.findUnique({
                where: { isbn: updateBookDto.isbn }
            })

            if (isbnExists) {
                throw new ConflictException("A book with this ISBN already exists")
            }
        }

        let availableCopies = existingBook.availableCopies;

        if (updateBookDto.totalCopies !== undefined) {
            const borrowedCopies = existingBook.totalCopies - existingBook.availableCopies;

            if (updateBookDto.totalCopies < borrowedCopies) {
                throw new ConflictException("Total copies cannot be less than the number of borrowed copies")
            }

            availableCopies = updateBookDto.totalCopies - borrowedCopies;
        }

        return this.prisma.book.update({
            where: { id },
            data: { ...updateBookDto, availableCopies, }
        })
    }

    async remove(id: string) {
        const existingBook = await this.prisma.book.findFirst({
            where: { id, deletedAt: null }
        })

        if (!existingBook) {
            throw new NotFoundException("Book Not Found")
        }

        const activeBorrowing = await this.prisma.borrowing.findFirst({
            where: { bookId: id, status: 'ACTIVE', }
        })

        if (activeBorrowing) {
            throw new ConflictException("Cannot Remove a book with active borrowings")
        }

        return this.prisma.book.update({ where: { id }, data: { deletedAt: new Date() } })
    }
}
