import { prisma } from "@/infrastructure/db/prisma";
import type { CreateVoteInput } from "./voting.types";

export class VotingRepository {
    async create(data: CreateVoteInput) {
        return prisma.vote.create({
            data: {
                destinationId: data.destinationId,
                userId: data.userId,
                score: data.score,
            },
            include: {
                user: true,
                destination: true,
            },
        });
    }

    async findByDestinationId(destinationId: string) {
        return prisma.vote.findMany({
            where: { destinationId },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findUserVote(destinationId: string, userId: string) {
        return prisma.vote.findUnique({
            where: {
                destinationId_userId: {
                    destinationId,
                    userId,
                },
            },
        });
    }
}