import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from 'generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboard(userId: string, role: string) {
        if (role === UserRole.ADMIN) { return this.getAdminDashboard() }
        if (role === UserRole.USER) { return this.getUserDashboard(userId) }
        else throw new ForbiddenException("Insufficent Permissions")
    }

    async getAdminDashboard() {
        const [totalBooks, totalCopiesResult, availableCopiesResult, totalUsers, activeBorrowings] = await Promise.all([
            this.prisma.book.count({ where: { deletedAt: null } }),
            this.prisma.book.aggregate({ where: { deletedAt: null }, _sum: { totalCopies: true } }),
            this.prisma.book.aggregate({ where: { deletedAt: null }, _sum: { availableCopies: true } }),
            this.prisma.user.count(),
            this.prisma.borrowing.count({ where: { status: 'ACTIVE' } })
        ]);

        const totalCopies = totalCopiesResult._sum.totalCopies ?? 0;
        const availableCopies = availableCopiesResult._sum.availableCopies ?? 0;

        return {
            totalBooks, totalCopies, availableCopies, totalUsers, activeBorrowings,
            borrowedCopies: totalCopies - availableCopies
        }
    }
    async getUserDashboard(userId: string) {
        const [currentBooks, activeCount, recentHistory] = await Promise.all([
            this.prisma.borrowing.findMany({
                where: { userId, status: 'ACTIVE' },
                include: { book: { select: { id: true, title: true, author: true, isbn: true, category: true } } },
                orderBy: { borrowedAt: 'desc' }
            }),

            this.prisma.borrowing.count({ where: { userId, status: 'ACTIVE' } }),

            this.prisma.borrowing.findMany({
                where: { userId },
                include: { book: { select: { id: true, title: true, author: true, isbn: true, category: true } } },
                orderBy: { borrowedAt: 'desc' }, take: 5
            })
        ])

        return { currentBooks, activeCount, recentHistory }
    }
} 