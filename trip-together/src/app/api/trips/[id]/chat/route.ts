import { prisma } from "@/infrastructure/db/prisma";
import { NextResponse } from "next/server";

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
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const params = await context.params;

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const canAccess = await isTripMember(params.id, userId);
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
        const body = await request.json();
        const userId = body?.userId as string | undefined;
        const text = body?.text as string | undefined;
        const params = await context.params;

        if (!userId || !text?.trim()) {
            return NextResponse.json(
                { success: false, message: "User ID and message text are required" },
                { status: 400 }
            );
        }

        const canAccess = await isTripMember(params.id, userId);
        if (!canAccess) {
            return NextResponse.json({ success: false, message: "Only trip members can send messages" }, { status: 403 });
        }

        const message = await prisma.tripMessage.create({
            data: {
                tripId: params.id,
                senderId: userId,
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
