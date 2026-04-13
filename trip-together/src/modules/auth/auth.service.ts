import { prisma } from "@/infrastructure/db/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
    name: z.string().min(2),
    password: z.string().min(6),
});

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
});

export class AuthService {
    async register(input: unknown) {
        const parsed = registerSchema.parse(input);

        const existingUser = await prisma.user.findUnique({
            where: { email: parsed.email },
        });

        if (existingUser) {
            throw new Error("Email is already registered");
        }

        const existingName = await prisma.user.findFirst({
            where: { name: parsed.name },
        });

        if (existingName) {
            throw new Error("Name is already taken");
        }

        const passwordHash = await bcrypt.hash(parsed.password, 10);

        const user = await prisma.user.create({
            data: {
                name: parsed.name,
                email: parsed.email,
                passwordHash,
            },
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }

    async login(input: unknown) {
        const parsed = loginSchema.parse(input);

        const user = await prisma.user.findFirst({
            where: { name: parsed.name },
        });

        if (!user) {
            throw new Error("Invalid name or password");
        }

        const isPasswordValid = await bcrypt.compare(
            parsed.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            throw new Error("Invalid name or password");
        }

        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}