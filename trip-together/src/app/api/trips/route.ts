import { TripController } from "@/modules/trip/trip.controller";

export async function GET(request: Request) {
    return TripController.getAll(request);
}

export async function POST(request: Request) {
    return TripController.create(request);
}