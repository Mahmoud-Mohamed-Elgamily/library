import { ConflictException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BorrowingStatus, Prisma, } from '../../generated/prisma/client';
import { CreateBorrowingDto } from './dto/createBorrowing.dto';
import { BorrowingQueryDto } from './dto/borrowingQuery.dto';

@Injectable()
export class BorrowingsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, createBorrowingDto: CreateBorrowingDto) {
        const { bookId } = createBorrowingDto;
        return this.prisma.$transaction(async (tx) => {
            const book = await tx.book.findUnique({ where: { id: bookId } })

            if (!book) throw new NotFoundException("Book Not Found")

            const activeBorrowing = await tx.borrowing.findFirst({ where: { userId, bookId, status: BorrowingStatus.ACTIVE } })

            if (activeBorrowing) throw new ConflictException("You already have an active borrowing for this book")

            const updatedBook = await tx.book.updateMany({ where: { id: bookId, availableCopies: { gt: 0 } }, data: { availableCopies: { decrement: 1 } } })

            if (updatedBook.count === 0) throw new ConflictException("The Book is Currently Unavailable")

            try {
                return await tx.borrowing.create({ data: { userId, bookId, status: 'ACTIVE' }, include: { book: true } })
            }
            catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                    throw new ConflictException("You already have an active borrowing for this book")
                }

                throw error;
            }
        })
    }

    async returnBook(userId: string, borrowingId: string,) {
        return this.prisma.$transaction(async (tx) => {
            const borrowing = await tx.borrowing.findUnique({
                where: { id: borrowingId },
                include: { book: true }
            });

            if (!borrowing) throw new NotFoundException('Borrowing not found');


            if (borrowing.userId !== userId) throw new ForbiddenException('You can only return your own borrowings');


            const updatedBorrowing = await tx.borrowing.updateMany({
                where: { id: borrowingId, userId, status: BorrowingStatus.ACTIVE, returnedAt: null },
                data: { status: BorrowingStatus.RETURNED, returnedAt: new Date() }
            });

            if (updatedBorrowing.count === 0) throw new ConflictException('This borrowing has already been returned');

            await tx.book.update({
                where: { id: borrowing.bookId },
                data: { availableCopies: { increment: 1 } }
            });

            return tx.borrowing.findUnique({
                where: { id: borrowingId },
                include: { book: true },
            });
        });
    }
}
