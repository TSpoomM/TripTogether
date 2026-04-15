import { DestinationController } from "@/modules/destination/destination.controller";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    return DestinationController.getByTripId(request, params.id);
}