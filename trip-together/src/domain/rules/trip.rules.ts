export function canFinalizeTrip(userId: string, ownerId: string): boolean {
    return userId === ownerId;
}

export function isTripOpen(status: string): boolean {
    return status === "OPEN";
}

export function canModifyTrip(status: string): boolean {
    return status === "OPEN";
}

export function isValidVoteScore(score: number): boolean {
    return Number.isInteger(score) && score >= 1 && score <= 5;
}