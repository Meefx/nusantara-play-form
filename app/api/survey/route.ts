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
                    wilayahKerja: {
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
                    wilayahKerja: {
                        is: {
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
                            kontak: {
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

// Helper function to ensure nested objects have default values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ensureDefaults(data: any) {
    const defaultWilayahKerja = {
        provinsi: "",
        kabKota: "",
        kecamatan: "",
        desaKelurahan: "",
    };

    const defaultKontak = {
        namaLengkap: "",
        nomorHP: "",
        instansi: "",
    };

    const defaultSection1 = {
        role: "",
        roleOther: "",
        wilayahKerja: defaultWilayahKerja,
        kontak: defaultKontak,
        jumlahPROT: "",
        jumlahPROTOther: "",
    };

    const defaultLokasi = {
        jenis: [],
        lokasiOther: "",
        kelengkapanLokasi: "",
        alamatLengkap: "",
        koordinatGPS: "",
    };

    const defaultIdentitas = {
        kategori: "",
        namaPROT: "",
        adaNamaLain: "",
        variasiNama: "",
        lokasi: defaultLokasi,
    };

    const defaultAturan = {
        statusAturan: "",
        sumberRujukan: [],
        sumberRujukanOther: "",
        ringkasanAturan: "",
        adaVariasiAturan: "",
        jelaskanVariasi: "",
    };

    const defaultKoordinator = {
        ada: "",
        peran: "",
        peranOther: "",
        cakupan: "",
        kontak: "",
    };

    const defaultPelatih = {
        status: "",
        level: "",
        kontak: "",
        jadwalLatihan: "",
    };

    const defaultPakar = {
        ada: "",
        kategori: [],
        kategoriOther: "",
        kontak: "",
        adaBukti: "",
    };

    const defaultSDM = {
        koordinator: defaultKoordinator,
        pelatih: defaultPelatih,
        pakar: defaultPakar,
    };

    const defaultKomunitasAktivitas = {
        adaKomunitas: "",
        bentukKomunitas: [],
        bentukKomunitasOther: "",
        statusKeaktifan: "",
        frekuensiKegiatan: "",
        jenisKegiatan: [],
        jenisKegiatanOther: "",
        adaDokumentasi: "",
    };

    const defaultAlatProduksi = {
        adaPengrajin: "",
        skalaProduksi: "",
        kepemilikanAlat: [],
        kondisiAlat: "",
        standardisasiAlat: "",
        dokumentasiAlat: [],
    };

    const defaultPeranPemda = {
        adaPeran: "",
        bentukPeran: [],
        bentukPeranOther: "",
        bentukDukungan: [],
        bentukDukunganOther: "",
        buktiDukungan: [],
    };

    const defaultKondisiKepengurusan = {
        perkembangan: "",
        indikatorPerkembangan: [],
        indikatorPerkembanganOther: "",
        kegiatanBerjalan: [],
        kegiatanBerjalanOther: "",
        statusProgram: "",
        kendala: [],
        kendalaOther: "",
        dampakKendala: "",
        catatanTambahan: "",
    };

    // Merge section1 with defaults
    const section1 = {
        ...defaultSection1,
        ...data.section1,
        wilayahKerja: {
            ...defaultWilayahKerja,
            ...(data.section1?.wilayahKerja || {}),
        },
        kontak: {
            ...defaultKontak,
            ...(data.section1?.kontak || {}),
        },
    };

    // Merge section2 entries with defaults
    const entries = (data.section2?.entries || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (entry: any, index: number) => ({
            entryNumber: entry.entryNumber || index + 1,
            identitas: {
                ...defaultIdentitas,
                ...entry.identitas,
                lokasi: {
                    ...defaultLokasi,
                    ...(entry.identitas?.lokasi || {}),
                },
            },
            aturan: {
                ...defaultAturan,
                ...entry.aturan,
            },
            sdm: {
                ...defaultSDM,
                ...entry.sdm,
                koordinator: {
                    ...defaultKoordinator,
                    ...(entry.sdm?.koordinator || {}),
                },
                pelatih: {
                    ...defaultPelatih,
                    ...(entry.sdm?.pelatih || {}),
                },
                pakar: {
                    ...defaultPakar,
                    ...(entry.sdm?.pakar || {}),
                },
            },
            komunitasAktivitas: {
                ...defaultKomunitasAktivitas,
                ...entry.komunitasAktivitas,
            },
            alatProduksi: {
                ...defaultAlatProduksi,
                ...entry.alatProduksi,
            },
            peranPemda: {
                ...defaultPeranPemda,
                ...entry.peranPemda,
            },
            kondisiKepengurusan: {
                ...defaultKondisiKepengurusan,
                ...entry.kondisiKepengurusan,
            },
        })
    );

    return {
        status: data.status || "draft",
        section1,
        section2: {
            entries,
        },
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
