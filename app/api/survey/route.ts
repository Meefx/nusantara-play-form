import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Survey from "@/lib/models/Survey";

// GET /api/survey - Get all surveys (with pagination & filtering)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const searchParams = request.nextUrl.searchParams;

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        // Filtering
        const status = searchParams.get("status");
        const provinsi = searchParams.get("provinsi");
        const kabKota = searchParams.get("kabKota");
        const kategori = searchParams.get("kategori");
        const search = searchParams.get("search");

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (status) {
            query.status = status;
        }

        if (provinsi) {
            query["section1.wilayahKerja.provinsi"] = {
                $regex: provinsi,
                $options: "i",
            };
        }

        if (kabKota) {
            query["section1.wilayahKerja.kabKota"] = {
                $regex: kabKota,
                $options: "i",
            };
        }

        if (kategori) {
            query["section2.entries.identitas.kategori"] = kategori;
        }

        if (search) {
            query.$or = [
                { "section1.kontak.namaLengkap": { $regex: search, $options: "i" } },
                { "section2.entries.identitas.namaPROT": { $regex: search, $options: "i" } },
            ];
        }

        // Sorting
        const sortBy = searchParams.get("sortBy") || "submittedAt";
        const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

        // Execute query
        const [surveys, total] = await Promise.all([
            Survey.find(query)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            Survey.countDocuments(query),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: surveys,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching surveys:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch surveys",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

// POST /api/survey - Create a new survey
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();

        // Create survey with submitted data
        const survey = new Survey({
            ...body,
            submittedAt: new Date(),
            status: body.status || "draft",
        });

        await survey.save();

        return NextResponse.json(
            {
                success: true,
                message: "Survey created successfully",
                data: survey,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating survey:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create survey",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
