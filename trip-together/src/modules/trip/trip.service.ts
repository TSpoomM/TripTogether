import { z } from "zod";
import { TripRepository } from "./trip.repository";

const createTripSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    ownerId: z.string().min(1, "Owner ID is required"),
});

export class TripService {
    constructor(private readonly tripRepository = new TripRepository()) { }

    async createTrip(input: unknown) {
        const parsed = createTripSchema.parse(input);
        return this.tripRepository.create(parsed);
    }

    async getTrips() {
        return this.tripRepository.findAll();
    }

    async getTripById(id: string) {
        if (!id) {
            throw new Error("Trip ID is required");
        }
        return this.tripRepository.findById(id);
    }
}