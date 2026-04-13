import { NextResponse } from "next/server";
import { SummaryService } from "./summary.service";

const summaryService = new SummaryService();

export class SummaryController {
    static async getTripSummary(tripId: string) {
        try {
            const summary = await summaryService.getTripSummary(tripId);

            return NextResponse.json(
                { success: true, data: summary },
                { status: 200 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch summary",
                },
                { status: 400 }
            );
        }
    }
}