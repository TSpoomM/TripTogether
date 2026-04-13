import { VotingController } from "@/modules/voting/voting.controller";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    return VotingController.getByDestinationId(params.id);
}