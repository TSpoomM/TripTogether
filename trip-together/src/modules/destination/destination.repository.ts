import { prisma } from "@/infrastructure/db/prisma";
import type { CreateDestinationInput } from "./destination.types";

export class DestinationRepository {
    async create(data: CreateDestinationInput) {
        return prisma.destination.create({
            data: {
                tripId: data.tripId,
                proposedById: data.proposedById,
                placeName: data.placeName,
                description: data.description,
                estimatedBudget: data.estimatedBudget,
                category: data.category,
            },
            include: {
                proposedBy: true,
                trip: true,
            },
        });
    }

    async findByTripId(tripId: string) {
        return prisma.destination.findMany({
            where: { tripId },
            include: {
                proposedBy: true,
                votes: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}