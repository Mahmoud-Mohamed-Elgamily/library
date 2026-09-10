import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@email.com' },
        update: { passwordHash: adminPassword, role: 'ADMIN' },
        create: { name: 'Library Admin', email: 'admin@email.com', passwordHash: adminPassword, role: 'ADMIN' }
    })

    const user = await prisma.user.upsert({
        where: { email: 'user@email.com' },
        update: { passwordHash: userPassword, role: 'USER' },
        create: { name: 'Library User', email: 'user@email.com', passwordHash: userPassword, role: 'USER' }
    })

    console.log(`Admin: ${admin.email}`);
    console.log(`User: ${user.email}`)
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});