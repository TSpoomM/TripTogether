import { z } from "zod";
import { DestinationRepository } from "./destination.repository";
import { prisma } from "@/infrastructure/db/prisma";
import { canModifyTrip } from "@/domain/rules/trip.rules";

const createDestinationSchema = z.object({
    tripId: z.string().min(1, "Trip ID is required"),
    proposedById: z.string().min(1, "User ID is required"),
    placeName: z.string().min(1, "Place name is required"),
    description: z.string().optional(),
    estimatedBudget: z.number().optional(),
    category: z.string().optional(),
});

export class DestinationService {
    constructor(
        private readonly destinationRepository = new DestinationRepository()
    ) { }

    async createDestination(input: unknown) {
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

        return this.destinationRepository.create(parsed);
    }

    async getDestinationsByTripId(tripId: string) {
        if (!tripId) {
            throw new Error("Trip ID is required");
        }

        return this.destinationRepository.findByTripId(tripId);
    }
}