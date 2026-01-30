import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Helper to validate MongoDB ObjectId (24 hex characters)
function isValidObjectId(id: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(id);
}

// GET /api/survey/[id] - Get a single survey by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid survey ID format",
                },
                { status: 400 }
            );
        }

        const survey = await prisma.survey.findUnique({
            where: { id },
        });

        if (!survey) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Survey not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: survey,
        });
    } catch (error) {
        console.error("Error fetching survey:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch survey",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// PUT /api/survey/[id] - Update a survey (full replacement)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid survey ID format",
                },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Remove fields that shouldn't be updated directly
        delete body.id;
        delete body.createdAt;

        const survey = await prisma.survey.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({
            success: true,
            message: "Survey updated successfully",
            data: survey,
        });
    } catch (error) {
        console.error("Error updating survey:", error);

        // Check if it's a "not found" error
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Survey not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Failed to update survey",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// PATCH /api/survey/[id] - Partial update a survey
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid survey ID format",
                },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Remove fields that shouldn't be updated directly
        delete body.id;
        delete body.createdAt;

        const survey = await prisma.survey.update({
            where: { id },
            data: body,
        });

        return NextResponse.json({
            success: true,
            message: "Survey patched successfully",
            data: survey,
        });
    } catch (error) {
        console.error("Error patching survey:", error);

        // Check if it's a "not found" error
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Survey not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Failed to patch survey",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// DELETE /api/survey/[id] - Delete a survey
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid survey ID format",
                },
                { status: 400 }
            );
        }

        await prisma.survey.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Survey deleted successfully",
            data: { id },
        });
    } catch (error) {
        console.error("Error deleting survey:", error);

        // Check if it's a "not found" error
        if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Survey not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete survey",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
