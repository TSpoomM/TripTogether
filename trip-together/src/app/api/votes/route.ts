import { VotingController } from "@/modules/voting/voting.controller";

export async function POST(request: Request) {
    return VotingController.create(request);
}