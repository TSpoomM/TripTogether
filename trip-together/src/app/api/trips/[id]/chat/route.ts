import { prisma } from "@/infrastructure/db/prisma";
import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/infrastructure/auth/jwt";

async function isTripMember(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        select: {
            ownerId: true,
            members: {
                where: { userId },
                select: { id: true },
            },
        },
    });

    if (!trip) {
        return false;
    }

    return trip.ownerId === userId || trip.members.length > 0;
}

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = getAuthUserFromRequest(request);
        const params = await context.params;

        const canAccess = await isTripMember(params.id, authUser.userId);
        if (!canAccess) {
            return NextResponse.json({ success: false, message: "Only trip members can access chat" }, { status: 403 });
        }

        const messages = await prisma.tripMessage.findMany({
            where: { tripId: params.id },
            include: {
                sender: {
                    select: { name: true },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return NextResponse.json({ success: true, data: messages });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to load chat messages",
            },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = getAuthUserFromRequest(request);
        const body = await request.json();
        const text = body?.text as string | undefined;
        const params = await context.params;

        if (!text?.trim()) {
            return NextResponse.json(
                { success: false, message: "Message text is required" },
                { status: 400 }
            );
        }

        const canAccess = await isTripMember(params.id, authUser.userId);
        if (!canAccess) {
            return NextResponse.json({ success: false, message: "Only trip members can send messages" }, { status: 403 });
        }

        const message = await prisma.tripMessage.create({
            data: {
                tripId: params.id,
                senderId: authUser.userId,
                text: text.trim(),
            },
            include: {
                sender: {
                    select: { name: true },
                },
            },
        });

        return NextResponse.json({ success: true, data: message }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Failed to send message",
            },
            { status: 500 }
        );
    }
}
