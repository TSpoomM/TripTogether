import { SummaryController } from "@/modules/summary/summary.controller";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    return SummaryController.getTripSummary(request, params.id);
}