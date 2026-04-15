import { NextResponse } from "next/server";
import { DestinationService } from "./destination.service";
import { getAuthUserFromRequest } from "@/infrastructure/auth/jwt";

const destinationService = new DestinationService();

export class DestinationController {
    static async create(request: Request) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const body = await request.json();
            const destination = await destinationService.createDestination(body, authUser.userId);

            return NextResponse.json(
                { success: true, data: destination },
                { status: 201 }
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to create destination";
            return NextResponse.json(
                {
                    success: false,
                    message,
                },
                { status: message === "Unauthorized" ? 401 : 400 }
            );
        }
    }

    static async getByTripId(request: Request, tripId: string) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const destinations = await destinationService.getDestinationsByTripId(tripId, authUser.userId);
            return NextResponse.json({ success: true, data: destinations });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch destinations";
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