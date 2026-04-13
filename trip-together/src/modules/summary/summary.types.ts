export interface RankedDestination {
    id: string;
    placeName: string;
    description?: string | null;
    category?: string | null;
    estimatedBudget?: number | null;
    totalVotes: number;
    averageScore: number;
    proposedBy?: {
        name?: string;
    } | null;
}