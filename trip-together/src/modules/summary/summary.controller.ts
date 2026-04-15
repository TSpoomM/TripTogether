import { NextResponse } from "next/server";
import { SummaryService } from "./summary.service";
import { getAuthUserFromRequest } from "@/infrastructure/auth/jwt";

const summaryService = new SummaryService();

export class SummaryController {
    static async getTripSummary(request: Request, tripId: string) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const summary = await summaryService.getTripSummary(tripId, authUser.userId);

            return NextResponse.json(
                { success: true, data: summary },
                { status: 200 }
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch summary";
            return NextResponse.json(
                {
                    success: false,
                    message,
                },
                { status: message === "Unauthorized" ? 401 : 400 }
            );
        }
    }
}