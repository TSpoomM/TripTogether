import { NextResponse } from "next/server";
import { DestinationService } from "./destination.service";

const destinationService = new DestinationService();

export class DestinationController {
    static async create(request: Request) {
        try {
            const body = await request.json();
            const destination = await destinationService.createDestination(body);

            return NextResponse.json(
                { success: true, data: destination },
                { status: 201 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to create destination",
                },
                { status: 400 }
            );
        }
    }

    static async getByTripId(tripId: string) {
        try {
            const destinations = await destinationService.getDestinationsByTripId(tripId);
            return NextResponse.json({ success: true, data: destinations });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error instanceof Error
                            ? error.message
                            : "Failed to fetch destinations",
                },
                { status: 400 }
            );
        }
    }
}