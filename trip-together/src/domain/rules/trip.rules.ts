export function canFinalizeTrip(userId: string, ownerId: string): boolean {
    return userId === ownerId;
}

export function isValidVoteScore(score: number): boolean {
    return Number.isInteger(score) && score >= 1 && score <= 5;
}