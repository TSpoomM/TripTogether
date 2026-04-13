import { prisma } from "@/infrastructure/db/prisma";
import type { CreateTripInput } from "./trip.types";

export class TripRepository {
    async create(data: CreateTripInput) {
        return prisma.trip.create({
            data: {
                title: data.title,
                description: data.description,
                ownerId: data.ownerId,
                members: {
                    create: {
                        userId: data.ownerId,
                    },
                },
            },
        });
    }

    async findAll() {
        return prisma.trip.findMany({
            include: {
                owner: true,
                members: true,
                destinations: true,
            },
            orderBy: {
                createdAt: "desc",
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
}