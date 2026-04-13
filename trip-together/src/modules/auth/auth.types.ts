export interface LoginInput {
    name: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
}