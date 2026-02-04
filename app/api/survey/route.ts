import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/survey - Get all surveys (with pagination & filtering)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        // Filtering
        const status = searchParams.get("status");
        const provinsi = searchParams.get("provinsi");
        const kabKota = searchParams.get("kabKota");
        const search = searchParams.get("search");
        const includeStats = searchParams.get("includeStats") === "true";

        // Build where clause
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

        // Sorting
        const sortBy = searchParams.get("sortBy") || "submittedAt";
        const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

        // Execute query
        const [surveys, total] = await Promise.all([
            prisma.survey.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            prisma.survey.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        // Calculate statistics if requested
        let statistics = null;
        if (includeStats) {
            // Get all unique provinsi and kabKota with counts
            const allSurveys = await prisma.survey.findMany({
                where,
                select: {
                    section1: {
                        select: {
                            kontakResponden: {
                                select: {
                                    provinsi: true,
                                    kabKota: true,
                                }
                            }
                        }
                    }
                }
            });

            statistics = calculateStatistics(allSurveys);
        }

        const response: any = {
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
        };

        if (statistics) {
            response.statistics = statistics;
        }

        return NextResponse.json(response);
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

// Calculate statistics from surveys
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateStatistics(surveys: any[]) {
    const byProvinsi: Record<string, number> = {};
    const byKabKota: Record<string, number> = {};
    const uniqueProvinsi: Set<string> = new Set();
    const uniqueKabKota: Set<string> = new Set();
    const kabKotaPerProvinsi: Record<string, Set<string>> = {};

    surveys.forEach((survey) => {
        const provinsi = survey.section1?.kontakResponden?.provinsi || "";
        const kabKota = survey.section1?.kontakResponden?.kabKota || "";

        if (provinsi) {
            byProvinsi[provinsi] = (byProvinsi[provinsi] || 0) + 1;
            uniqueProvinsi.add(provinsi);

            // Track kabKota per provinsi
            if (!kabKotaPerProvinsi[provinsi]) {
                kabKotaPerProvinsi[provinsi] = new Set();
            }
            if (kabKota) {
                kabKotaPerProvinsi[provinsi].add(kabKota);
            }
        }

        if (kabKota) {
            byKabKota[kabKota] = (byKabKota[kabKota] || 0) + 1;
            uniqueKabKota.add(kabKota);
        }
    });

    // Convert Sets to Arrays for JSON serialization
    const kabKotaPerProvinsiArray: Record<string, string[]> = {};
    Object.entries(kabKotaPerProvinsi).forEach(([prov, kabSet]) => {
        kabKotaPerProvinsiArray[prov] = Array.from(kabSet).sort();
    });

    return {
        byProvinsi,
        byKabKota,
        uniqueProvinsi: Array.from(uniqueProvinsi).sort(),
        uniqueKabKota: Array.from(uniqueKabKota).sort(),
        kabKotaPerProvinsi: kabKotaPerProvinsiArray,
    };
}

// Helper function to ensure nested objects have default values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ensureDefaults(data: any) {
    // Section 1 defaults
    const defaultKontakResponden = {
        namaLengkap: "",
        nomorHP: "",
        email: "",
        provinsi: "",
        kabKota: "",
    };

    const defaultSection1 = {
        kategoriResponden: "",
        kontakResponden: defaultKontakResponden,
        jumlahPROT: "",
        jumlahPROTOther: "",
    };

    // Section 2 defaults
    const defaultLokasiPROT = {
        provinsi: "",
        kabKota: "",
        kecamatan: "",
        desa: "",
        alamatLengkap: "",
    };

    const defaultKontakKoordinator = {
        nama: "",
        hp: "",
        email: "",
    };

    const defaultKontakPelatih = {
        nama: "",
        hp: "",
        email: "",
    };

    // Section 3 defaults
    const defaultSection3 = {
        frekuensiDimainkan: "",
        frekuensiOther: "",
        targetUsia: "",
        jumlahPenggiat: "",
        ketersediaanLahan: "",
        ketersediaanLahanOther: "",
        partisipasiSekolah: "",
        partisipasiSekolahOther: "",
        penghargaanJuara: "",
        penghargaanJuaraOther: "",
    };

    // Section 4 defaults
    const defaultSection4 = {
        produksiAlat: "",
        hargaAlat: "",
        dayaTarikWisata: "",
        kerjasamaUMKM: "",
        penyerapanTenagaKerja: "",
    };

    // Section 5 defaults
    const defaultSection5 = {
        hambatanUtama: [],
        hambatanUtamaOther: "",
        kebutuhanMendesak: [],
        kebutuhanMendesakOther: "",
        harapanKPOTI: "",
    };

    // Section 6 defaults
    const defaultSection6 = {
        fotoAlat: [],
        fotoKegiatan: [],
        videoPROT: [],
    };

    // Merge section1 with defaults
    const section1 = {
        ...defaultSection1,
        ...data.section1,
        kontakResponden: {
            ...defaultKontakResponden,
            ...(data.section1?.kontakResponden || {}),
        },
    };

    // Merge section2 entries with defaults
    const entries = (data.section2?.entries || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entry: any, index: number) => ({
            entryNumber: entry.entryNumber || index + 1,
            namaPROT: entry.namaPROT || "",
            jenisKategori: entry.jenisKategori || "",
            statusAsalUsul: entry.statusAsalUsul || "",
            lokasi: {
                ...defaultLokasiPROT,
                ...(entry.lokasi || {}),
            },
            koordinator: {
                ...defaultKontakKoordinator,
                ...(entry.koordinator || {}),
            },
            pelatih: {
                ...defaultKontakPelatih,
                ...(entry.pelatih || {}),
            },
            peralatanPROT: entry.peralatanPROT || "",
            caraBermain: entry.caraBermain || "",
            nilaiMoral: entry.nilaiMoral || "",
        })
    );

    // Merge section3 with defaults
    const section3 = {
        ...defaultSection3,
        ...data.section3,
    };

    // Merge section4 with defaults
    const section4 = {
        ...defaultSection4,
        ...data.section4,
    };

    // Merge section5 with defaults
    const section5 = {
        ...defaultSection5,
        ...data.section5,
    };

    // Merge section6 with defaults
    const section6 = {
        ...defaultSection6,
        ...data.section6,
    };

    return {
        status: data.status || "draft",
        section1,
        section2: {
            entries,
        },
        section3,
        section4,
        section5,
        section6,
    };
}

// POST /api/survey - Create a new survey
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Ensure all nested objects have proper defaults
        const surveyData = ensureDefaults(body);

        const survey = await prisma.survey.create({
            data: surveyData,
        });

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
