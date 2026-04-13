import { NextResponse } from "next/server";
import { VotingService } from "./voting.service";

const votingService = new VotingService();

export class VotingController {
    static async create(request: Request) {
        try {
            const body = await request.json();
            const vote = await votingService.createVote(body);

            return NextResponse.json(
                { success: true, data: vote },
                { status: 201 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to create vote",
                },
                { status: 400 }
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