import { TripController } from "@/modules/trip/trip.controller";

export async function GET() {
    return TripController.getAll();
}

export async function POST(request: Request) {
    return TripController.create(request);
}