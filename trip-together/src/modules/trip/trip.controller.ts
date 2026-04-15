import { NextResponse } from "next/server";
import { TripService } from "./trip.service";
import { getAuthUserFromRequest } from "@/infrastructure/auth/jwt";

const tripService = new TripService();

export class TripController {
    static async create(request: Request) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const body = await request.json();
            const trip = await tripService.createTrip(body, authUser.userId);

            return NextResponse.json(
                { success: true, data: trip },
                { status: 201 }
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create trip";
            return NextResponse.json(
                {
                    success: false,
                    message,
                },
                { status: message === "Unauthorized" ? 401 : 400 }
            );
        }
    }

    static async getAll(request: Request) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const trips = await tripService.getTrips(authUser.userId);
            return NextResponse.json({ success: true, data: trips });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to fetch trips";
            return NextResponse.json(
                {
                    success: false,
                    message,
                },
                { status: message === "Unauthorized" ? 401 : 400 }
            );
        }
    }

    static async finalize(request: Request) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const body = await request.json();
            const trip = await tripService.finalizeTrip(body, authUser.userId);

            return NextResponse.json(
                { success: true, data: trip },
                { status: 200 }
            );
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to finalize trip";
            return NextResponse.json(
                {
                    success: false,
                    message,
                },
                { status: message === "Unauthorized" ? 401 : 400 }
            );
        }
    }

    static async join(request: Request) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const body = await request.json();
            const trip = await tripService.joinTrip(body, authUser.userId);

            return NextResponse.json(
                { success: true, data: trip },
                { status: 200 }
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to join trip";
            return NextResponse.json(
                {
                    success: false,
                    message,
                },
                { status: message === "Unauthorized" ? 401 : 400 }
            );
        }
    }

    static async delete(request: Request) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const body = await request.json();
            const result = await tripService.deleteTrip(body, authUser.userId);
            return NextResponse.json({ success: true, data: result }, { status: 200 });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to delete trip";
            return NextResponse.json(
                {
                    success: false,
                    message,
                },
                { status: message === "Unauthorized" ? 401 : 400 }
            );
        }
    }

    static async leave(request: Request) {
        try {
            const authUser = getAuthUserFromRequest(request);
            const body = await request.json();
            const result = await tripService.leaveTrip(body, authUser.userId);
            return NextResponse.json({ success: true, data: result }, { status: 200 });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to leave trip";
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