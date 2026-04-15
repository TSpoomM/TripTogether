import { z } from "zod";
import { VotingRepository } from "./voting.repository";
import { prisma } from "@/infrastructure/db/prisma";
import { canModifyTrip } from "@/domain/rules/trip.rules";

const createVoteSchema = z.object({
    destinationId: z.string().min(1, "Destination ID is required"),
    score: z.number().int().min(1).max(5),
});

export class VotingService {
    constructor(private readonly votingRepository = new VotingRepository()) { }

    async createVote(input: unknown, userId: string) {
        const parsed = createVoteSchema.parse(input);

        const destination = await prisma.destination.findUnique({
            where: { id: parsed.destinationId },
            include: {
                trip: true,
            },
        });

        if (!destination) {
            throw new Error("Destination not found");
        }

        if (!canModifyTrip(destination.trip.status)) {
            throw new Error("Cannot vote on a finalized trip");
        }

        const membership = await prisma.tripMember.findUnique({
            where: {
                tripId_userId: {
                    tripId: destination.tripId,
                    userId,
                },
            },
        });

        if (!membership && destination.trip.ownerId !== userId) {
            throw new Error("Only trip members can vote");
        }

        const existingVote = await this.votingRepository.findUserVote(
            parsed.destinationId,
            userId
        );

        if (existingVote) {
            throw new Error("You have already voted for this destination");
        }

        return this.votingRepository.create({
            ...parsed,
            userId,
        });
    }

    async getVotesByDestinationId(destinationId: string) {
        if (!destinationId) {
            throw new Error("Destination ID is required");
        }

        return this.votingRepository.findByDestinationId(destinationId);
    }
}