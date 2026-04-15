import { z } from "zod";
import { TripRepository } from "./trip.repository";
import { prisma } from "@/infrastructure/db/prisma";

const createTripSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
});

const joinTripSchema = z.object({
    inviteCode: z.string().min(1),
});

const finalizeTripSchema = z.object({
    tripId: z.string().min(1),
});

const deleteTripSchema = z.object({
    tripId: z.string().min(1),
});

const leaveTripSchema = z.object({
    tripId: z.string().min(1),
});

export class TripService {
    constructor(private readonly tripRepository = new TripRepository()) { }

    async createTrip(input: unknown, userId: string) {
        const parsed = createTripSchema.parse(input);
        return this.tripRepository.create({ ...parsed, ownerId: userId });
    }

    async getTrips(userId: string) {
        return this.tripRepository.findAllByUserId(userId);
    }

    async getTripById(id: string) {
        if (!id) {
            throw new Error("Trip ID is required");
        }
        return this.tripRepository.findById(id);
    }

    async joinTrip(input: unknown, userId: string) {
        const parsed = joinTripSchema.parse(input);

        const trip = await prisma.trip.findUnique({
            where: { inviteCode: parsed.inviteCode },
        });

        if (!trip) {
            throw new Error("Invalid invite code");
        }

        if (trip.status === "FINALIZED") {
            throw new Error("Cannot join finalized trip");
        }

        const existing = await prisma.tripMember.findUnique({
            where: {
                tripId_userId: {
                    tripId: trip.id,
                    userId,
                },
            },
        });

        if (existing) {
            throw new Error("You are already in this trip");
        }

        await prisma.tripMember.create({
            data: {
                tripId: trip.id,
                userId,
            },
        });

        return trip;
    }

    async finalizeTrip(input: unknown, userId: string) {
        const parsed = finalizeTripSchema.parse(input);

        const trip = await prisma.trip.findUnique({
            where: { id: parsed.tripId },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        if (trip.ownerId !== userId) {
            throw new Error("Only trip owner can finalize");
        }
        if (trip.status === "FINALIZED") {
            throw new Error("Trip is already finalized");
        }

        return this.tripRepository.finalizeTrip(trip.id);
    }

    async deleteTrip(input: unknown, userId: string) {
        const parsed = deleteTripSchema.parse(input);
        const trip = await prisma.trip.findUnique({
            where: { id: parsed.tripId },
            select: { ownerId: true },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        if (trip.ownerId !== userId) {
            throw new Error("Only trip owner can delete this trip");
        }

        await prisma.trip.delete({
            where: { id: parsed.tripId },
        });

        return { deleted: true };
    }

    async leaveTrip(input: unknown, userId: string) {
        const parsed = leaveTripSchema.parse(input);
        const trip = await prisma.trip.findUnique({
            where: { id: parsed.tripId },
            select: { ownerId: true },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        if (trip.ownerId === userId) {
            throw new Error("Owner cannot leave. Delete the trip instead.");
        }

        await prisma.tripMember.delete({
            where: {
                tripId_userId: {
                    tripId: parsed.tripId,
                    userId,
                },
            },
        });

        return { left: true };
    }
}