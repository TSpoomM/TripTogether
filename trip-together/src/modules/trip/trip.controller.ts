import { NextResponse } from "next/server";
import { TripService } from "./trip.service";

const tripService = new TripService();

export class TripController {
    static async create(request: Request) {
        try {
            const body = await request.json();
            const trip = await tripService.createTrip(body);

            return NextResponse.json(
                { success: true, data: trip },
                { status: 201 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to create trip",
                },
                { status: 400 }
            );
        }
    }

    static async getAll(request: Request) {
        try {
            const { searchParams } = new URL(request.url);
            const userId = searchParams.get("userId");
            const trips = await tripService.getTrips({ userId });
            return NextResponse.json({ success: true, data: trips });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to fetch trips",
                },
                { status: 400 }
            );
        }
    }

    static async finalize(request: Request) {
        try {
            const body = await request.json();
            const trip = await tripService.finalizeTrip(body);

            return NextResponse.json(
                { success: true, data: trip },
                { status: 200 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error instanceof Error ? error.message : "Failed to finalize trip",
                },
                { status: 400 }
            );
        }
    }

    static async join(request: Request) {
        try {
            const body = await request.json();
            const trip = await tripService.joinTrip(body);

            return NextResponse.json(
                { success: true, data: trip },
                { status: 200 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error instanceof Error ? error.message : "Failed to join trip",
                },
                { status: 400 }
            );
        }
    }

    static async delete(request: Request) {
        try {
            const body = await request.json();
            const result = await tripService.deleteTrip(body);
            return NextResponse.json({ success: true, data: result }, { status: 200 });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to delete trip",
                },
                { status: 400 }
            );
        }
    }

    static async leave(request: Request) {
        try {
            const body = await request.json();
            const result = await tripService.leaveTrip(body);
            return NextResponse.json({ success: true, data: result }, { status: 200 });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to leave trip",
                },
                { status: 400 }
            );
        }
    }
}