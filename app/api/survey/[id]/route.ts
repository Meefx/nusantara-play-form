import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Survey from "@/lib/models/Survey";
import mongoose from "mongoose";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// Helper to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/survey/[id] - Get a single survey by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();

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

        const survey = await Survey.findById(id).lean();

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

// PUT /api/survey/[id] - Update a survey
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();

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
        delete body._id;
        delete body.createdAt;

        const survey = await Survey.findByIdAndUpdate(
            id,
            {
                ...body,
                updatedAt: new Date(),
            },
            {
                new: true, // Return updated document
                runValidators: true, // Run schema validators
            }
        ).lean();

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
            message: "Survey updated successfully",
            data: survey,
        });
    } catch (error) {
        console.error("Error updating survey:", error);
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
        await dbConnect();

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
        delete body._id;
        delete body.createdAt;

        const survey = await Survey.findByIdAndUpdate(
            id,
            {
                $set: body,
                updatedAt: new Date(),
            },
            {
                new: true,
                runValidators: true,
            }
        ).lean();

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
            message: "Survey patched successfully",
            data: survey,
        });
    } catch (error) {
        console.error("Error patching survey:", error);
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
        await dbConnect();

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

        const survey = await Survey.findByIdAndDelete(id).lean();

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
            message: "Survey deleted successfully",
            data: { id },
        });
    } catch (error) {
        console.error("Error deleting survey:", error);
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
