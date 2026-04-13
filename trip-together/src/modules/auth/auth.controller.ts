import { NextResponse } from "next/server";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
    static async register(request: Request) {
        try {
            const body = await request.json();
            const result = await authService.register(body);

            return NextResponse.json(
                {
                    success: true,
                    data: result,
                },
                { status: 201 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Register failed",
                },
                { status: 400 }
            );
        }
    }

    static async login(request: Request) {
        try {
            const body = await request.json();
            const result = await authService.login(body);

            return NextResponse.json(
                {
                    success: true,
                    data: result,
                },
                { status: 200 }
            );
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Login failed",
                },
                { status: 400 }
            );
        }
    }
}