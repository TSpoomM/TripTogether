import { NextResponse } from "next/server";
import { VotingService } from "./voting.service";
import { getAuthUserFromRequest } from "@/infrastructure/auth/jwt";

const votingService = new VotingService();

export class VotingController {
    static async create(request: Request) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const body = await request.json();
            const vote = await votingService.createVote(body, authUser.userId);

            return NextResponse.json(
                { success: true, data: vote },
                { status: 201 }
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create vote";
            return NextResponse.json(
                {
                    success: false,
                    message,
                },
                { status: message === "Unauthorized" ? 401 : 400 }
            );
        }
    }

    static async getByDestinationId(destinationId: string) {
        try {
            const votes = await votingService.getVotesByDestinationId(destinationId);
            return NextResponse.json({ success: true, data: votes });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to fetch votes",
                },
                { status: 400 }
            );
        }
    }
}