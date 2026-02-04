import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

// POST /api/survey/export - Export surveys to Excel
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { provinsi, kabKota, status, search } = body;

        // Build where clause (same logic as GET /api/survey)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (provinsi) {
            where.section1 = {
                ...where.section1,
                is: {
                    ...where.section1?.is,
                    kontakResponden: {
                        is: {
                            provinsi: {
                                contains: provinsi,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            };
        }

        if (kabKota) {
            where.section1 = {
                ...where.section1,
                is: {
                    ...where.section1?.is,
                    kontakResponden: {
                        is: {
                            ...where.section1?.is?.kontakResponden?.is,
                            kabKota: {
                                contains: kabKota,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            };
        }

        if (search) {
            where.OR = [
                {
                    section1: {
                        is: {
                            kontakResponden: {
                                is: {
                                    namaLengkap: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    },
                },
            ];
        }

        // Fetch all matching surveys (no pagination)
        const surveys = await prisma.survey.findMany({
            where,
            orderBy: { submittedAt: "desc" },
        });

        if (surveys.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No data to export",
                },
                { status: 400 }
            );
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Survey");

        // Define columns
        worksheet.columns = [
            { header: "ID", key: "id", width: 20 },
            { header: "Status", key: "status", width: 12 },
            { header: "Tanggal Submit", key: "submittedAt", width: 20 },
            { header: "Kategori Responden", key: "kategoriResponden", width: 20 },
            { header: "Nama Lengkap", key: "namaLengkap", width: 25 },
            { header: "Nomor HP", key: "nomorHP", width: 15 },
            { header: "Email", key: "email", width: 30 },
            { header: "Provinsi", key: "provinsi", width: 20 },
            { header: "Kota/Kabupaten", key: "kabKota", width: 20 },
            { header: "Jumlah PROT", key: "jumlahPROT", width: 15 },
            { header: "Jumlah Entry", key: "jumlahEntry", width: 15 },
            { header: "Frekuensi Dimainkan", key: "frekuensiDimainkan", width: 20 },
            { header: "Target Usia", key: "targetUsia", width: 20 },
            { header: "Jumlah Penggiat", key: "jumlahPenggiat", width: 20 },
            { header: "Ketersediaan Lahan", key: "ketersediaanLahan", width: 20 },
            { header: "Produksi Alat", key: "produksiAlat", width: 15 },
            { header: "Harga Alat", key: "hargaAlat", width: 15 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4472C4" },
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

        // Add data rows
        surveys.forEach((survey) => {
            worksheet.addRow({
                id: survey.id,
                status: survey.status === "completed" ? "Completed" : "Draft",
                submittedAt: new Date(survey.submittedAt).toLocaleDateString("id-ID"),
                kategoriResponden: survey.section1?.kategoriResponden || "",
                namaLengkap: survey.section1?.kontakResponden?.namaLengkap || "",
                nomorHP: survey.section1?.kontakResponden?.nomorHP || "",
                email: survey.section1?.kontakResponden?.email || "",
                provinsi: survey.section1?.kontakResponden?.provinsi || "",
                kabKota: survey.section1?.kontakResponden?.kabKota || "",
                jumlahPROT: survey.section1?.jumlahPROT || "",
                jumlahEntry: survey.section2?.entries?.length || 0,
                frekuensiDimainkan: survey.section3?.frekuensiDimainkan || "",
                targetUsia: survey.section3?.targetUsia || "",
                jumlahPenggiat: survey.section3?.jumlahPenggiat || "",
                ketersediaanLahan: survey.section3?.ketersediaanLahan || "",
                produksiAlat: survey.section4?.produksiAlat || "",
                hargaAlat: survey.section4?.hargaAlat || "",
            });
        });

        // Enable auto-filter
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: worksheet.columns.length },
        };

        // Generate Excel file buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Return file
        const filename = `survey-data-${new Date().toISOString().split("T")[0]}.xlsx`;

        return new NextResponse(buffer, {
            headers: {
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Error exporting surveys:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to export surveys",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
