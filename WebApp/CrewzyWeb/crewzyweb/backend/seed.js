import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with Roles, Permissions and Users...');

    // 1. Creăm Permisiunile
    const allAccess = await prisma.permission.upsert({
        where: { name: 'ALL_ACCESS' },
        update: {},
        create: { name: 'ALL_ACCESS', description: 'Can do everything' },
    });

    const readEvents = await prisma.permission.upsert({
        where: { name: 'READ_EVENTS' },
        update: {},
        create: { name: 'READ_EVENTS', description: 'Can only view events' },
    });

    // 2. Creăm Rolurile și le legăm de permisiuni
    const adminRole = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: {
            name: 'Admin',
            permissions: { connect: [{ id: allAccess.id }] }
        },
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'User' },
        update: {},
        create: {
            name: 'User',
            permissions: { connect: [{ id: readEvents.id }] }
        },
    });

    // 3. Creăm 2 useri de test
    await prisma.user.upsert({
        where: { email: 'admin@crewzy.com' },
        update: {},
        create: {
            email: 'admin@crewzy.com',
            name: 'Boss Admin',
            password: 'password123',
            roleId: adminRole.id
        },
    });

    await prisma.user.upsert({
        where: { email: 'user@crewzy.com' },
        update: {},
        create: {
            email: 'user@crewzy.com',
            name: 'Normal User',
            password: 'password123',
            roleId: userRole.id
        },
    });

    console.log('Seeding finished!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });