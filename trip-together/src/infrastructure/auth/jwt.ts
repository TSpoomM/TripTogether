import jwt from "jsonwebtoken";

export interface AuthUser {
    userId: string;
    email: string;
    role: string;
}

export function getAuthUserFromRequest(request: Request): AuthUser {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) {
        throw new Error("Unauthorized");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT secret is not configured");
    }

    try {
        const payload = jwt.verify(token, secret) as {
            sub?: string;
            email?: string;
            role?: string;
        };

        if (!payload.sub || !payload.email || !payload.role) {
            throw new Error("Invalid token payload");
        }

        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    } catch {
        throw new Error("Unauthorized");
    }
}
