"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Survey {
    id: string;
    _id?: string;
    status: string;
    submittedAt: string;
    updatedAt: string;
    section1: {
        kategoriResponden: string;
        kontakResponden: {
            namaLengkap: string;
            nomorHP: string;
            email: string;
            provinsi: string;
            kabKota: string;
        };
        jumlahPROT: string;
        jumlahPROTOther: string;
    };
    section2: {
        entries: Array<{
            entryNumber: number;
            namaPROT: string;
            jenisKategori: string;
            statusAsalUsul: string;
            lokasi: {
                provinsi: string;
                kabKota: string;
                kecamatan: string;
                desa: string;
                alamatLengkap: string;
            };
            koordinator: {
                nama: string;
                hp: string;
                email: string;
            };
            pelatih: {
                nama: string;
                hp: string;
                email: string;
            };
            peralatanPROT: string;
            caraBermain: string;
            nilaiMoral: string;
        }>;
    };
    section3?: {
        frekuensiDimainkan: string;
        frekuensiOther: string;
        targetUsia: string;
        jumlahPenggiat: string;
        ketersediaanLahan: string;
        ketersediaanLahanOther: string;
        partisipasiSekolah: string;
        partisipasiSekolahOther: string;
        penghargaanJuara: string;
        penghargaanJuaraOther: string;
    };
    section4?: {
        produksiAlat: string;
        hargaAlat: string;
        dayaTarikWisata: string;
        kerjasamaUMKM: string;
        penyerapanTenagaKerja: string;
    };
    section5?: {
        hambatanUtama: string[];
        hambatanUtamaOther: string;
        kebutuhanMendesak: string[];
        kebutuhanMendesakOther: string;
        harapanKPOTI: string;
    };
    section6?: {
        fotoAlat: string[];
        fotoKegiatan: string[];
        videoPROT: string[];
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface Statistics {
    byProvinsi: Record<string, number>;
    byKabKota: Record<string, number>;
    uniqueProvinsi: string[];
    uniqueKabKota: string[];
    kabKotaPerProvinsi: Record<string, string[]>;
}

interface ProvinsiRef {
    code: string;
    name: string;
    totalKabKota: number;
    kabupatenList: Array<{ code: string; name: string }>;
}

interface WilayahSummary {
    totalProvinsi: number;
    totalKabKota: number;
}

interface ProvinsiProgress {
    name: string;
    registered: number;
    total: number;
    percentage: number;
    status: "not-started" | "in-progress" | "completed";
}

export default function ManagementDashboard() {
    const router = useRouter();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // New state for filters and statistics
    const [provinsiFilter, setProvinsiFilter] = useState("");
    const [kabKotaFilter, setKabKotaFilter] = useState("");
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    // Wilayah reference data
    const [wilayahData, setWilayahData] = useState<ProvinsiRef[]>([]);
    const [wilayahSummary, setWilayahSummary] = useState<WilayahSummary | null>(null);
    const [provinsiProgress, setProvinsiProgress] = useState<ProvinsiProgress[]>([]);

    // Create kabupaten code to name mapping
    const kabKotaMap = useMemo(() => {
        const map: Record<string, string> = {};
        wilayahData.forEach((prov) => {
            prov.kabupatenList.forEach((kab) => {
                map[kab.code] = kab.name;
            });
        });
        return map;
    }, [wilayahData]);

    // Helper function to get kabupaten name
    const getKabKotaName = useCallback((kode: string) => {
        return kabKotaMap[kode] || kode;
    }, [kabKotaMap]);

    // Get kabupaten list based on selected provinsi
    const getKabKotaOptions = useCallback(() => {
        if (!provinsiFilter || !statistics) return [];
        return statistics.kabKotaPerProvinsi[provinsiFilter] || [];
    }, [provinsiFilter, statistics]);

    // Check authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/check");
                const result = await response.json();

                if (!result.authenticated) {
                    router.push("/management");
                    return;
                }

                setIsAuthenticated(true);
            } catch {
                router.push("/management");
            }
        };

        checkAuth();
    }, [router]);

    // Fetch wilayah reference data
    useEffect(() => {
        const fetchWilayahData = async () => {
            try {
                const response = await fetch("/api/wilayah");
                const result = await response.json();
                if (result.success) {
                    setWilayahData(result.data);
                    setWilayahSummary(result.summary);
                }
            } catch (error) {
                console.error("Error fetching wilayah data:", error);
            }
        };
        fetchWilayahData();
    }, []);

    // Fetch surveys
    const fetchSurveys = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                includeStats: "true",
            });

            if (searchQuery) params.set("search", searchQuery);
            if (statusFilter) params.set("status", statusFilter);
            if (provinsiFilter) params.set("provinsi", provinsiFilter);
            if (kabKotaFilter) params.set("kabKota", kabKotaFilter);

            const response = await fetch(`/api/survey?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                setSurveys(result.data);
                setPagination(result.pagination);
                if (result.statistics) {
                    setStatistics(result.statistics);
                }
            }
        } catch (error) {
            console.error("Error fetching surveys:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, currentPage, searchQuery, statusFilter, provinsiFilter, kabKotaFilter]);

    useEffect(() => {
        fetchSurveys();
    }, [fetchSurveys]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/management");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus survey ini?")) return;

        try {
            const response = await fetch(`/api/survey/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchSurveys();
            } else {
                alert("Gagal menghapus survey");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Terjadi kesalahan saat menghapus");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getKategoriLabel = (kategori: string) => {
        switch (kategori) {
            case "pr":
                return "Permainan Rakyat";
            case "ot":
                return "Olahraga Tradisional";
            case "keduanya":
                return "Keduanya";
            default:
                return kategori;
        }
    };

    const getKategoriRespondenLabel = (kategori: string) => {
        switch (kategori) {
            case "pengurus_kpoti":
                return "Pengurus KPOTI";
            case "pelatih":
                return "Pelatih";
            case "atlet":
                return "Atlet";
            case "masyarakat_umum":
                return "Masyarakat Umum";
            default:
                return kategori;
        }
    };

    // Helper untuk mendapatkan nama provinsi (simplified mapping)
    const getProvinsiName = (kode: string) => {
        const provinsiMap: Record<string, string> = {
            "11": "Aceh",
            "12": "Sumatera Utara",
            "13": "Sumatera Barat",
            "14": "Riau",
            "15": "Jambi",
            "16": "Sumatera Selatan",
            "17": "Bengkulu",
            "18": "Lampung",
            "19": "Kepulauan Bangka Belitung",
            "21": "Kepulauan Riau",
            "31": "DKI Jakarta",
            "32": "Jawa Barat",
            "33": "Jawa Tengah",
            "34": "DI Yogyakarta",
            "35": "Jawa Timur",
            "36": "Banten",
            "51": "Bali",
            "52": "Nusa Tenggara Barat",
            "53": "Nusa Tenggara Timur",
            "61": "Kalimantan Barat",
            "62": "Kalimantan Tengah",
            "63": "Kalimantan Selatan",
            "64": "Kalimantan Timur",
            "65": "Kalimantan Utara",
            "71": "Sulawesi Utara",
            "72": "Sulawesi Tengah",
            "73": "Sulawesi Selatan",
            "74": "Sulawesi Tenggara",
            "75": "Gorontalo",
            "76": "Sulawesi Barat",
            "81": "Maluku",
            "82": "Maluku Utara",
            "91": "Papua Barat",
            "94": "Papua",
        };
        return provinsiMap[kode] || kode;
    };

    // Calculate progress per provinsi
    useEffect(() => {
        if (!wilayahData.length || !statistics) return;

        const progress: ProvinsiProgress[] = wilayahData.map((prov) => {
            // Count unique kabupaten registered from statistics
            // Try matching by both code and name (case insensitive)
            let registeredKabKota = 0;

            // Check if statistics has data by province code
            if (statistics.kabKotaPerProvinsi[prov.code]) {
                registeredKabKota = statistics.kabKotaPerProvinsi[prov.code].length;
            }
            // Also check by name (case insensitive)
            else {
                const matchingKey = Object.keys(statistics.kabKotaPerProvinsi).find(
                    key => key.toLowerCase() === prov.name.toLowerCase()
                );
                if (matchingKey) {
                    registeredKabKota = statistics.kabKotaPerProvinsi[matchingKey].length;
                }
            }

            const total = prov.totalKabKota;
            const percentage = total > 0 ? Math.round((registeredKabKota / total) * 100) : 0;

            let status: "not-started" | "in-progress" | "completed";
            if (percentage === 0) {
                status = "not-started";
            } else if (percentage === 100) {
                status = "completed";
            } else {
                status = "in-progress";
            }

            return {
                name: prov.name,
                registered: registeredKabKota,
                total,
                percentage,
                status,
            };
        });

        // Sort by percentage descending
        progress.sort((a, b) => b.percentage - a.percentage);
        setProvinsiProgress(progress);
    }, [wilayahData, statistics]);

    // Export to Excel
    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await fetch("/api/survey/export", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    provinsi: provinsiFilter || undefined,
                    kabKota: kabKotaFilter || undefined,
                    status: statusFilter || undefined,
                    search: searchQuery || undefined,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Export failed");
            }

            // Get the blob and trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `survey-data-${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Export error:", error);
            alert("Gagal export data. Silakan coba lagi.");
        } finally {
            setIsExporting(false);
        }
    };

    // Get status badge color
    const getStatusColor = (status: "not-started" | "in-progress" | "completed") => {
        switch (status) {
            case "not-started":
                return "bg-gray-100 text-gray-600";
            case "in-progress":
                return "bg-yellow-100 text-yellow-700";
            case "completed":
                return "bg-green-100 text-green-700";
        }
    };

    // Get progress bar color
    const getProgressBarColor = (percentage: number) => {
        if (percentage === 0) return "bg-gray-300";
        if (percentage < 50) return "bg-yellow-500";
        if (percentage < 100) return "bg-blue-500";
        return "bg-green-500";
    };

    // Calculate national progress
    const nationalProgress = {
        provinsiWithData: provinsiProgress.filter((p) => p.registered > 0).length,
        totalProvinsi: wilayahSummary?.totalProvinsi || 0,
        kabKotaWithData: statistics ? Object.keys(statistics.byKabKota).length : 0,
        totalKabKota: wilayahSummary?.totalKabKota || 0,
        provinsiPercentage: wilayahSummary?.totalProvinsi
            ? Math.round((provinsiProgress.filter((p) => p.registered > 0).length / wilayahSummary.totalProvinsi) * 100)
            : 0,
        kabKotaPercentage: wilayahSummary?.totalKabKota && statistics
            ? Math.round((Object.keys(statistics.byKabKota).length / wilayahSummary.totalKabKota) * 100)
            : 0,
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                ← Home
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold">📊 Management Dashboard</h1>
                                <p className="text-white/80 text-sm">
                                    Kelola data survey PR & OT
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* National Progress Overview */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 shadow-lg mb-8 text-white">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        🇮🇩 Progress Nasional
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Provinsi */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-white/80 text-sm">Total Provinsi</p>
                            <p className="text-3xl font-bold">{nationalProgress.totalProvinsi}</p>
                        </div>
                        {/* Provinsi Terdaftar */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-white/80 text-sm">Provinsi Terdaftar</p>
                            <p className="text-3xl font-bold">
                                {nationalProgress.provinsiWithData}
                                <span className="text-lg font-normal text-white/60 ml-2">
                                    ({nationalProgress.provinsiPercentage}%)
                                </span>
                            </p>
                            <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-500"
                                    style={{ width: `${nationalProgress.provinsiPercentage}%` }}
                                />
                            </div>
                        </div>
                        {/* Total Kab/Kota */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-white/80 text-sm">Total Kab/Kota</p>
                            <p className="text-3xl font-bold">{nationalProgress.totalKabKota}</p>
                        </div>
                        {/* Kab/Kota Terdaftar */}
                        <div className="bg-white/10 rounded-lg p-4">
                            <p className="text-white/80 text-sm">Kab/Kota Terdaftar</p>
                            <p className="text-3xl font-bold">
                                {nationalProgress.kabKotaWithData}
                                <span className="text-lg font-normal text-white/60 ml-2">
                                    ({nationalProgress.kabKotaPercentage}%)
                                </span>
                            </p>
                            <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-500"
                                    style={{ width: `${nationalProgress.kabKotaPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">📝</div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Survey</p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {pagination?.total || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">✅</div>
                            <div>
                                <p className="text-gray-500 text-sm">Completed</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {surveys.filter((s) => s.status === "completed").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">📋</div>
                            <div>
                                <p className="text-gray-500 text-sm">Draft</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {surveys.filter((s) => s.status === "draft").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Row 2: Per Region Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Jumlah per Provinsi */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🗺️</span>
                            <h3 className="text-lg font-semibold text-gray-800">Jumlah per Provinsi</h3>
                        </div>
                        {statistics && Object.keys(statistics.byProvinsi).length > 0 ? (
                            <div className="space-y-2">
                                {Object.entries(statistics.byProvinsi)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 5)
                                    .map(([prov, count]) => (
                                        <div key={prov} className="flex justify-between items-center">
                                            <span className="text-gray-700 truncate">{getProvinsiName(prov)}</span>
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                {Object.keys(statistics.byProvinsi).length > 5 && (
                                    <p className="text-gray-500 text-sm mt-2">
                                        +{Object.keys(statistics.byProvinsi).length - 5} provinsi lainnya
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-4">Belum ada data</p>
                        )}
                    </div>

                    {/* Jumlah per Kab/Kota */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🏙️</span>
                            <h3 className="text-lg font-semibold text-gray-800">Jumlah per Kab/Kota</h3>
                        </div>
                        {statistics && Object.keys(statistics.byKabKota).length > 0 ? (
                            <div className="space-y-2">
                                {Object.entries(statistics.byKabKota)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 5)
                                    .map(([kabKota, count]) => (
                                        <div key={kabKota} className="flex justify-between items-center">
                                            <span className="text-gray-700 truncate">{getKabKotaName(kabKota)}</span>
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                {Object.keys(statistics.byKabKota).length > 5 && (
                                    <p className="text-gray-500 text-sm mt-2">
                                        +{Object.keys(statistics.byKabKota).length - 5} kota/kab lainnya
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-4">Belum ada data</p>
                        )}
                    </div>
                </div>

                {/* Progress per Provinsi */}
                <div className="bg-white rounded-xl p-6 shadow-md mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📊</span>
                            <h3 className="text-lg font-semibold text-gray-800">Progress per Provinsi</h3>
                        </div>
                        <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                                Not Started
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                In Progress
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                Completed
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {provinsiProgress.map((prov) => (
                            <div
                                key={prov.name}
                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-gray-800 text-sm">{prov.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prov.status)}`}>
                                        {prov.status === "not-started" ? "0%" : prov.status === "completed" ? "100%" : `${prov.percentage}%`}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${getProgressBarColor(prov.percentage)}`}
                                        style={{ width: `${prov.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {prov.registered} / {prov.total} Kab/Kota
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Search */}
                        <div className="md:col-span-12">
                            <input
                                type="text"
                                placeholder="🔍 Cari nama, provinsi, atau PR/OT..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        {/* Provinsi Filter */}
                        <div className="md:col-span-3">
                            <select
                                value={provinsiFilter}
                                onChange={(e) => {
                                    setProvinsiFilter(e.target.value);
                                    setKabKotaFilter("");
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Semua Provinsi</option>
                                {statistics?.uniqueProvinsi.map((prov) => (
                                    <option key={prov} value={prov}>
                                        {getProvinsiName(prov)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Kab/Kota Filter */}
                        <div className="md:col-span-3">
                            <select
                                value={kabKotaFilter}
                                onChange={(e) => {
                                    setKabKotaFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                disabled={!provinsiFilter}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Semua Kab/Kota</option>
                                {getKabKotaOptions().map((kabKota) => (
                                    <option key={kabKota} value={kabKota}>
                                        {getKabKotaName(kabKota)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Status Filter */}
                        <div className="md:col-span-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Semua Status</option>
                                <option value="completed">Completed</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                        {/* Export Button */}
                        <div className="md:col-span-2">
                            <button
                                onClick={handleExport}
                                disabled={isExporting || !pagination?.total}
                                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isExporting ? (
                                    <>⏳ Exporting...</>
                                ) : (
                                    <>📥 Export Excel</>
                                )}
                            </button>
                        </div>
                        {/* Refresh Button */}
                        <div className="md:col-span-2">
                            <button
                                onClick={fetchSurveys}
                                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                🔄 Refresh
                            </button>
                        </div>
                    </div>
                    {/* Clear Filters */}
                    {(provinsiFilter || kabKotaFilter || statusFilter || searchQuery) && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setProvinsiFilter("");
                                    setKabKotaFilter("");
                                    setStatusFilter("");
                                    setSearchQuery("");
                                    setCurrentPage(1);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                ✕ Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Survey List */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {isLoading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Memuat data...</p>
                        </div>
                    ) : surveys.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-500 text-lg">Belum ada data survey</p>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Pengisi
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Wilayah
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                PR/OT
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {surveys.map((survey) => (
                                            <tr key={survey.id || survey._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {survey.section1?.kontakResponden?.namaLengkap || "-"}

                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {survey.section1?.kontakResponden?.nomorHP || "-"}

                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {getKategoriRespondenLabel(survey.section1?.kategoriResponden || "")}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {getProvinsiName(survey.section1?.kontakResponden?.provinsi || "")}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {getKabKotaName(survey.section1?.kontakResponden?.kabKota || "")}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {survey.section2?.entries
                                                            ?.slice(0, 2)
                                                            .map((entry, idx) => (
                                                                <div key={idx}>
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                        {entry.namaPROT || `Entry ${entry.entryNumber}`}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 ml-1">
                                                                        ({getKategoriLabel(entry.jenisKategori || "")})
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        {(survey.section2?.entries?.length || 0) > 2 && (
                                                            <p className="text-xs text-gray-500">
                                                                +{(survey.section2?.entries?.length || 0) - 2} lainnya
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${survey.status === "completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {survey.status === "completed" ? "✅ Completed" : "📝 Draft"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {formatDate(survey.submittedAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/management/survey/${survey.id || survey._id}`}
                                                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                                        >
                                                            👁️ Detail
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(survey.id || survey._id || "")}
                                                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                                        >
                                                            🗑️ Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
                                        {Math.min(pagination.page * pagination.limit, pagination.total)} dari{" "}
                                        {pagination.total} data
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={!pagination.hasPrevPage}
                                            className={`px-4 py-2 rounded-lg font-medium ${pagination.hasPrevPage
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            ← Prev
                                        </button>
                                        <span className="px-4 py-2 text-gray-600">
                                            {pagination.page} / {pagination.totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage((p) => p + 1)}
                                            disabled={!pagination.hasNextPage}
                                            className={`px-4 py-2 rounded-lg font-medium ${pagination.hasNextPage
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
