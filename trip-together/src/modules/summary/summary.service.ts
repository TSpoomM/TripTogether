import { prisma } from "@/infrastructure/db/prisma";
import type { RankedDestination } from "./summary.types";

export class SummaryService {
    async getTripSummary(tripId: string, userId: string) {
        if (!tripId) {
            throw new Error("Trip ID is required");
        }

        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            select: { status: true, ownerId: true },
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
            throw new Error("Only trip members can view summary");
        }

        if (trip.status !== "FINALIZED") {
            throw new Error("Summary is available after trip is finalized");
        }

        const destinations = await prisma.destination.findMany({
            where: { tripId },
            include: {
                proposedBy: true,
                votes: true,
            },
        });

        const ranked: RankedDestination[] = destinations.map((destination) => {
            const totalVotes = destination.votes.length;
            const totalScore = destination.votes.reduce(
                (sum, vote) => sum + vote.score,
                0
            );

            const averageScore =
                totalVotes > 0 ? Number((totalScore / totalVotes).toFixed(1)) : 0;

            return {
                id: destination.id,
                placeName: destination.placeName,
                description: destination.description,
                category: destination.category,
                estimatedBudget: destination.estimatedBudget,
                totalVotes,
                averageScore,
                proposedBy: destination.proposedBy
                    ? { name: destination.proposedBy.name }
                    : null,
            };
        });

        ranked.sort((a, b) => {
            if (b.averageScore !== a.averageScore) {
                return b.averageScore - a.averageScore;
            }

            return b.totalVotes - a.totalVotes;
        });

        return {
            tripId,
            totalDestinations: ranked.length,
            topDestination: ranked.length > 0 ? ranked[0] : null,
            rankings: ranked,
        };
    }
}