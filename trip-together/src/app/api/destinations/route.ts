import { DestinationController } from "@/modules/destination/destination.controller";

export async function POST(request: Request) {
    return DestinationController.create(request);
}