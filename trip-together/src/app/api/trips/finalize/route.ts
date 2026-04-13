import { TripController } from "@/modules/trip/trip.controller";

export async function POST(request: Request) {
    return TripController.finalize(request);
}