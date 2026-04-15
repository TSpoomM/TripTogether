import { z } from "zod";
import { DestinationRepository } from "./destination.repository";
import { prisma } from "@/infrastructure/db/prisma";
import { canModifyTrip } from "@/domain/rules/trip.rules";

const createDestinationSchema = z.object({
    tripId: z.string().min(1, "Trip ID is required"),
    placeName: z.string().min(1, "Place name is required"),
    description: z.string().optional(),
    estimatedBudget: z.number().optional(),
    category: z.string().optional(),
});

export class DestinationService {
    constructor(
        private readonly destinationRepository = new DestinationRepository()
    ) { }

    async createDestination(input: unknown, userId: string) {
        const parsed = createDestinationSchema.parse(input);

        const trip = await prisma.trip.findUnique({
            where: { id: parsed.tripId },
        });

        if (!trip) {
            throw new Error("Trip not found");
        }

        if (!canModifyTrip(trip.status)) {
            throw new Error("Cannot add destination to a finalized trip");
        }

        const membership = await prisma.tripMember.findUnique({
            where: {
                tripId_userId: {
                    tripId: parsed.tripId,
                    userId,
                },
            },
        });

        if (!membership && trip.ownerId !== userId) {
            throw new Error("Only trip members can propose destinations");
        }

        return this.destinationRepository.create({
            ...parsed,
            proposedById: userId,
        });
    }

    async getDestinationsByTripId(tripId: string, userId: string) {
        if (!tripId) {
            throw new Error("Trip ID is required");
        }

        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            select: { ownerId: true },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }

        const membership = await prisma.tripMember.findUnique({
            where: {
                tripId_userId: {
                    tripId,
                    userId,
                },
            },
        });

        if (!membership && trip.ownerId !== userId) {
            throw new Error("Only trip members can view destinations");
        }

        return this.destinationRepository.findByTripId(tripId);
    }
}