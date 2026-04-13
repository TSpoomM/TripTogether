import { prisma } from "@/infrastructure/db/prisma";
import type { CreateTripInput } from "./trip.types";


function generateInviteCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export class TripRepository {
    async create(data: CreateTripInput) {
        return prisma.trip.create({
            data: {
                title: data.title,
                description: data.description,
                ownerId: data.ownerId,
                inviteCode: generateInviteCode(),
                members: {
                    create: {
                        userId: data.ownerId,
                    },
                },
            },
            include: {
                owner: true,
                members: true,
            },
        });
    }

    async findAllByUserId(userId: string) {
        return prisma.trip.findMany({
            where: {
                OR: [
                    { status: "OPEN" },
                    { ownerId: userId },
                    {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            include: {
                owner: true,
                members: true,
                destinations: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }

    async findById(id: string) {
        return prisma.trip.findUnique({
            where: { id },
            include: {
                owner: true,
                members: {
                    include: {
                        user: true,
                    },
                },
                destinations: {
                    include: {
                        votes: true,
                    },
                },
            },
        });
    }

    async finalizeTrip(id: string) {
        return prisma.trip.update({
            where: { id },
            data: {
                status: "FINALIZED",
            },
        });
    }
}