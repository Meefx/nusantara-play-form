"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Survey {
    _id: string;
    status: string;
    submittedAt: string;
    createdAt: string;
    section1: {
        role: string;
        wilayahKerja: {
            provinsi: string;
            kabKota: string;
            kecamatan: string;
            desaKelurahan: string;
        };
        kontak: {
            namaLengkap: string;
            nomorHP: string;
            instansi: string;
        };
    };
    section2: {
        entries: Array<{
            entryNumber: number;
            identitas: {
                namaPROT: string;
                kategori: string;
            };
        }>;
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

export default function ManagementDashboard() {
    const router = useRouter();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

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

    // Fetch surveys
    const fetchSurveys = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
            });

            if (searchQuery) params.set("search", searchQuery);
            if (statusFilter) params.set("status", statusFilter);

            const response = await fetch(`/api/survey?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                // Convert _id to string untuk memastikan tidak undefined
                const surveysWithStringId = result.data.map((survey: any) => ({
                    ...survey,
                    _id: survey._id?.toString() || survey.id?.toString() || ""
                }));
                setSurveys(surveysWithStringId);
                setPagination(result.pagination);
            }
        } catch (error) {
            console.error("Error fetching surveys:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, currentPage, searchQuery, statusFilter]);

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
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

                {/* Filters */}
                <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
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
                        <div className="w-full md:w-48">
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
                        <button
                            onClick={fetchSurveys}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            🔄 Refresh
                        </button>
                    </div>
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
                                            <tr key={survey._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {survey.section1?.kontak?.namaLengkap || "-"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {survey.section1?.kontak?.nomorHP || "-"}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {survey.section1?.wilayahKerja?.provinsi || "-"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {survey.section1?.wilayahKerja?.kabKota || "-"}
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
                                                                        {entry.identitas?.namaPROT || `Entry ${entry.entryNumber}`}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 ml-1">
                                                                        ({getKategoriLabel(entry.identitas?.kategori || "")})
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
                                                    {formatDate(survey.submittedAt || survey.createdAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/management/survey/${survey._id}`}
                                                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                                        >
                                                            👁️ Detail
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(survey._id)}
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
