import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { selectedModel, analysisLevel, language } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                selectedModel,
                analysisLevel,
                language,
            },
        });
        return NextResponse.json({
            selectedModel: updatedUser.selectedModel,
            analysisLevel: updatedUser.analysisLevel,
            language: updatedUser.language,
        });
    } catch (error) {
        console.error("Error updating user settings:", error);
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
