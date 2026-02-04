import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface CSVProvinsi {
    code: string;
    parent_code: string;
    name: string;
}

interface CSVKabupaten {
    code: string;
    parent_code: string;
    name: string;
}

// Parse CSV string to array of objects
function parseCSV<T>(csvText: string): T[] {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");

    return lines.slice(1).map((line) => {
        const values = line.split(",");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim() || "";
        });
        return obj as T;
    });
}

// GET /api/wilayah - Get provinces and kabupaten/kota reference data
export async function GET() {
    try {
        const publicDir = path.join(process.cwd(), "public");

        // Read CSV files
        const [provinsiCsv, kabupatenCsv] = await Promise.all([
            fs.readFile(path.join(publicDir, "provinsi.csv"), "utf-8"),
            fs.readFile(path.join(publicDir, "kabupaten.csv"), "utf-8"),
        ]);

        const provinsiList = parseCSV<CSVProvinsi>(provinsiCsv);
        const kabupatenList = parseCSV<CSVKabupaten>(kabupatenCsv);

        // Build province data with kabupaten counts
        const provinsiData = provinsiList.map((prov) => {
            const kabupatenInProvinsi = kabupatenList.filter(
                (kab) => kab.parent_code === prov.code
            );
            return {
                code: prov.code,
                name: prov.name,
                totalKabKota: kabupatenInProvinsi.length,
                kabupatenList: kabupatenInProvinsi.map((kab) => ({
                    code: kab.code,
                    name: kab.name,
                })),
            };
        });

        // Summary statistics
        const summary = {
            totalProvinsi: provinsiList.length,
            totalKabKota: kabupatenList.length,
        };

        return NextResponse.json({
            success: true,
            data: provinsiData,
            summary,
        });
    } catch (error) {
        console.error("Error loading wilayah data:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to load wilayah data",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
