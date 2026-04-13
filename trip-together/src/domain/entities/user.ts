export type UserRole = "TRIP_OWNER" | "MEMBER" | "ADMIN";

export interface UserEntity {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}