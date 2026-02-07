import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [handsPlayed, correctHands] = await Promise.all([
            prisma.playedHand.count({
                where: { userId: session.user.id }
            }),
            prisma.playedHand.count({
                where: {
                    userId: session.user.id,
                    isCorrect: true
                }
            })
        ]);

        return NextResponse.json({
            handsPlayed,
            correctHands
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { isCorrect, hand, position, situation, limperPos, action, correctAction } = await req.json();

        await prisma.playedHand.create({
            data: {
                userId: session.user.id,
                hand,
                position,
                situation,
                limperPos,
                action,
                isCorrect,
                correctAction,
            }
        });

        const [handsPlayed, correctHands] = await Promise.all([
            prisma.playedHand.count({
                where: { userId: session.user.id }
            }),
            prisma.playedHand.count({
                where: {
                    userId: session.user.id,
                    isCorrect: true
                }
            })
        ]);

        return NextResponse.json({
            handsPlayed,
            correctHands
        });
    } catch (error) {
        console.error("Error updating user stats:", error);
        return NextResponse.json(
            { error: "Failed to update stats" },
            { status: 500 }
        );
    }
}
