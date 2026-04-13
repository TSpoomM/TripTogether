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

    static async getAll() {
        try {
            const trips = await tripService.getTrips();
            return NextResponse.json({ success: true, data: trips });
        } catch {
            return NextResponse.json(
                { success: false, message: "Failed to fetch trips" },
                { status: 500 }
            );
        }
    }
}