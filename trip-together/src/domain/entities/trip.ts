export type TripStatus = "OPEN" | "FINALIZED";

export interface TripEntity {
    id: string;
    title: string;
    description?: string | null;
    ownerId: string;
    status: TripStatus;
    createdAt: Date;
}