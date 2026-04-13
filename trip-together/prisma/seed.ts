import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    const passwordHash = await bcrypt.hash("123456", 10);

    await prisma.user.upsert({
        where: { email: "owner@plansphere.com" },
        update: {},
        create: {
            name: "Trip Owner",
            email: "owner@plansphere.com",
            passwordHash,
            role: UserRole.TRIP_OWNER,
        },
    });

    await prisma.user.upsert({
        where: { email: "member@plansphere.com" },
        update: {},
        create: {
            name: "Member User",
            email: "member@plansphere.com",
            passwordHash,
            role: UserRole.MEMBER,
        },
    });

    await prisma.user.upsert({
        where: { email: "admin@plansphere.com" },
        update: {},
        create: {
            name: "Admin User",
            email: "admin@plansphere.com",
            passwordHash,
            role: UserRole.ADMIN,
        },
    });

    console.log("Seed completed");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });