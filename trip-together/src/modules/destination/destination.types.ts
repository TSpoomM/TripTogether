export interface CreateDestinationInput {
    tripId: string;
    proposedById: string;
    placeName: string;
    description?: string;
    estimatedBudget?: number;
    category?: string;
}