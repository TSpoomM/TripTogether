import { z } from "zod";
import { TripRepository } from "./trip.repository";
import { prisma } from "@/infrastructure/db/prisma";

const createTripSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    ownerId: z.string().min(1, "Owner ID is required"),
});

const joinTripSchema = z.object({
    inviteCode: z.string().min(1),
    userId: z.string().min(1),
});

const getTripsSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
});

const finalizeTripSchema = z.object({
    tripId: z.string().min(1),
    userId: z.string().min(1),
});

const deleteTripSchema = z.object({
    tripId: z.string().min(1),
    userId: z.string().min(1),
});

const leaveTripSchema = z.object({
    tripId: z.string().min(1),
    userId: z.string().min(1),
});

export class TripService {
    constructor(private readonly tripRepository = new TripRepository()) { }

    async createTrip(input: unknown) {
        const parsed = createTripSchema.parse(input);
        return this.tripRepository.create(parsed);
    }

    async getTrips(input: unknown) {
        const parsed = getTripsSchema.parse(input);
        return this.tripRepository.findAllByUserId(parsed.userId);
    }

    async getTripById(id: string) {
        if (!id) {
            throw new Error("Trip ID is required");
        }
        return this.tripRepository.findById(id);
    }

    async joinTrip(input: unknown) {
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
                    userId: parsed.userId,
                },
            },
        });

        if (existing) {
            throw new Error("You are already in this trip");
        }

        await prisma.tripMember.create({
            data: {
                tripId: trip.id,
                userId: parsed.userId,
            },
        });

        return trip;
    }

    async finalizeTrip(input: unknown) {
        const parsed = finalizeTripSchema.parse(input);

        const trip = await prisma.trip.findUnique({
            where: { id: parsed.tripId },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        if (trip.ownerId !== parsed.userId) {
            throw new Error("Only trip owner can finalize");
        }
        if (trip.status === "FINALIZED") {
            throw new Error("Trip is already finalized");
        }

        return this.tripRepository.finalizeTrip(trip.id);
    }

    async deleteTrip(input: unknown) {
        const parsed = deleteTripSchema.parse(input);
        const trip = await prisma.trip.findUnique({
            where: { id: parsed.tripId },
            select: { ownerId: true },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        if (trip.ownerId !== parsed.userId) {
            throw new Error("Only trip owner can delete this trip");
        }

        await prisma.trip.delete({
            where: { id: parsed.tripId },
        });

        return { deleted: true };
    }

    async leaveTrip(input: unknown) {
        const parsed = leaveTripSchema.parse(input);
        const trip = await prisma.trip.findUnique({
            where: { id: parsed.tripId },
            select: { ownerId: true },
        });
        if (!trip) {
            throw new Error("Trip not found");
        }
        if (trip.ownerId === parsed.userId) {
            throw new Error("Owner cannot leave. Delete the trip instead.");
        }

        await prisma.tripMember.delete({
            where: {
                tripId_userId: {
                    tripId: parsed.tripId,
                    userId: parsed.userId,
                },
            },
        });

        return { left: true };
    }
}