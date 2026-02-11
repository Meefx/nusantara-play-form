"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Survey {
    _id?: string;
    id?: string;
    status: string;
    submittedAt: string;
    createdAt?: string;
    updatedAt: string;
    section1: {
        kategoriResponden: string;
        keanggotaan: string;
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

export default function SurveyDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeEntry, setActiveEntry] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editStatus, setEditStatus] = useState("");

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

    // Fetch survey detail
    const fetchSurvey = useCallback(async () => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/survey/${id}`);
            const result = await response.json();

            if (result.success) {
                setSurvey(result.data);
                setEditStatus(result.data.status);
            } else {
                alert("Survey tidak ditemukan");
                router.push("/management/dashboard");
            }
        } catch (error) {
            console.error("Error fetching survey:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, id, router]);

    useEffect(() => {
        fetchSurvey();
    }, [fetchSurvey]);

    const handleUpdateStatus = async () => {
        try {
            const response = await fetch(`/api/survey/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: editStatus }),
            });

            if (response.ok) {
                setIsEditing(false);
                fetchSurvey();
                alert("Status berhasil diperbarui");
            } else {
                alert("Gagal memperbarui status");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Terjadi kesalahan saat memperbarui");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus survey ini?")) return;

        try {
            const response = await fetch(`/api/survey/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Survey berhasil dihapus");
                router.push("/management/dashboard");
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
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getKategoriRespondenLabel = (kategori: string) => {
        const labels: Record<string, string> = {
            pengurus_kpoti: "Pengurus KPOTI",
            pelatih: "Pelatih",
            atlet: "Atlet",
            masyarakat_umum: "Masyarakat Umum",
        };
        return labels[kategori] || kategori;
    };

    const getKeanggotaanLabel = (keanggotaan: string) => {
        const labels: Record<string, string> = {
            anggota: "Anggota",
            pengurus: "Pengurus",
        };
        return labels[keanggotaan] || "-";
    };

    const getKategoriLabel = (kategori: string) => {
        const labels: Record<string, string> = {
            "permainanRakyat": "Permainan Rakyat",
            "olahragaTradisional": "Olahraga Tradisional",
        };
        return labels[kategori] || kategori;
    };

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

    const renderArrayField = (arr: string[] | undefined, other?: string) => {
        if (!arr || arr.length === 0) return "-";
        const items = [...arr];
        if (other) items.push(other);
        return items.join(", ");
    };

    if (!isAuthenticated || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-gray-500 text-lg">Survey tidak ditemukan</p>
                    <Link
                        href="/management/dashboard"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        ← Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const currentEntry = survey.section2?.entries?.[activeEntry];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link
                                href="/management/dashboard"
                                className="text-white/80 hover:text-white text-sm mb-1 inline-block"
                            >
                                ← Kembali ke Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold">📋 Detail Survey</h1>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
                            >
                                ✏️ Edit Status
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
                            >
                                🗑️ Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Edit Status Modal */}
                {isEditing && (
                    <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                        <h3 className="font-bold text-lg mb-4">Update Status Survey</h3>
                        <div className="flex gap-4">
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="draft">Draft</option>
                                <option value="completed">Completed</option>
                            </select>
                            <button
                                onClick={handleUpdateStatus}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                💾 Simpan
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {/* Survey Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <h3 className="font-semibold text-gray-500 text-sm mb-2">STATUS</h3>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${survey.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                        >
                            {survey.status === "completed" ? "✅ Completed" : "📝 Draft"}
                        </span>
                    </div>

                    {/* Date Card */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <h3 className="font-semibold text-gray-500 text-sm mb-2">
                            TANGGAL SUBMIT
                        </h3>
                        <p className="text-lg font-medium text-gray-800">
                            {formatDate(survey.submittedAt || survey.createdAt || "")}
                        </p>
                    </div>

                    {/* Entries Count */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <h3 className="font-semibold text-gray-500 text-sm mb-2">
                            JUMLAH ENTRI PR/OT
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {survey.section2?.entries?.length || 0}
                        </p>
                    </div>
                </div>

                {/* Section 1 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4">
                        <h2 className="text-xl font-bold">
                            📌 SECTION 1 - Identitas Responden
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kategori Responden */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Kategori Responden
                                </h4>
                                <p className="text-gray-800">
                                    {getKategoriRespondenLabel(survey.section1?.kategoriResponden || "")}
                                </p>
                            </div>

                            {/* Keanggotaan */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Keanggotaan
                                </h4>
                                <p className="text-gray-800">
                                    {getKeanggotaanLabel(survey.section1?.keanggotaan || "")}
                                </p>
                            </div>

                            {/* Nama Lengkap */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Nama Lengkap
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.kontakResponden?.namaLengkap || "-"}
                                </p>
                            </div>

                            {/* Nomor HP */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Nomor HP/WA
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.kontakResponden?.nomorHP || "-"}
                                </p>
                            </div>

                            {/* Email */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Email
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.kontakResponden?.email || "-"}
                                </p>
                            </div>

                            {/* Provinsi */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Provinsi
                                </h4>
                                <p className="text-gray-800">
                                    {getProvinsiName(survey.section1?.kontakResponden?.provinsi || "")}
                                </p>
                            </div>

                            {/* Kab/Kota */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Kabupaten/Kota
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.kontakResponden?.kabKota || "-"}
                                </p>
                            </div>

                            {/* Jumlah PR/OT */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Jumlah PR/OT
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.jumlahPROT || "-"}
                                    {survey.section1?.jumlahPROTOther &&
                                        ` (Lainnya: ${survey.section1.jumlahPROTOther})`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4">
                        <h2 className="text-xl font-bold">
                            📝 SECTION 2 - Entri Pemetaan PR/OT
                        </h2>
                    </div>

                    {/* Entry Tabs */}
                    {survey.section2?.entries && survey.section2.entries.length > 0 && (
                        <div className="border-b bg-gray-50 px-6 py-3 flex gap-2 overflow-x-auto">
                            {survey.section2.entries.map((entry, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveEntry(index)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeEntry === index
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    {entry.namaPROT || `Entri #${entry.entryNumber}`}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Entry Content */}
                    {currentEntry && (
                        <div className="p-6 space-y-8">
                            {/* Informasi Dasar */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    Informasi Dasar PR/OT
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Nama PR/OT
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.namaPROT || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Jenis Kategori
                                        </h4>
                                        <p className="text-gray-800">
                                            {getKategoriLabel(currentEntry.jenisKategori || "")}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Status Asal Usul
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.statusAsalUsul || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Lokasi */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    Lokasi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Provinsi
                                        </h4>
                                        <p className="text-gray-800">
                                            {getProvinsiName(currentEntry.lokasi?.provinsi || "")}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Kabupaten/Kota
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.lokasi?.kabKota || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Kecamatan
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.lokasi?.kecamatan || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Desa/Kelurahan
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.lokasi?.desa || "-"}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Alamat Lengkap
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.lokasi?.alamatLengkap || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Koordinator */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    Koordinator
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Nama
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.koordinator?.nama || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            No. HP
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.koordinator?.hp || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Email
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.koordinator?.email || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pelatih */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    Pelatih
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Nama
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.pelatih?.nama || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            No. HP
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.pelatih?.hp || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Email
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.pelatih?.email || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Peralatan PR/OT */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    Peralatan PR/OT
                                </h3>
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {currentEntry.peralatanPROT || "-"}
                                </p>
                            </div>

                            {/* Cara Bermain */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    Cara Bermain
                                </h3>
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {currentEntry.caraBermain || "-"}
                                </p>
                            </div>

                            {/* Nilai Moral */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    Nilai Moral/Karakter
                                </h3>
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {currentEntry.nilaiMoral || "-"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3 */}
                {survey.section3 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                        <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-6 py-4">
                            <h2 className="text-xl font-bold">
                                📊 SECTION 3 - Aktivitas & Partisipasi
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Frekuensi Dimainkan
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section3.frekuensiDimainkan}
                                        {survey.section3.frekuensiOther && ` (${survey.section3.frekuensiOther})`}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Target Usia
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section3.targetUsia || "-"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Jumlah Penggiat
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section3.jumlahPenggiat || "-"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Ketersediaan Lahan
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section3.ketersediaanLahan}
                                        {survey.section3.ketersediaanLahanOther && ` (${survey.section3.ketersediaanLahanOther})`}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Partisipasi Sekolah
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section3.partisipasiSekolah}
                                        {survey.section3.partisipasiSekolahOther && ` (${survey.section3.partisipasiSekolahOther})`}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Penghargaan Juara
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section3.penghargaanJuara}
                                        {survey.section3.penghargaanJuaraOther && ` (${survey.section3.penghargaanJuaraOther})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 4 */}
                {survey.section4 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-4">
                            <h2 className="text-xl font-bold">
                                💼 SECTION 4 - Ekonomi & Industri
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Produksi Alat
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section4.produksiAlat || "-"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Harga Alat
                                    </h4>
                                    <p className="text-gray-800">
                                        Rp {survey.section4.hargaAlat || "-"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Daya Tarik Wisata
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section4.dayaTarikWisata || "-"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Kerjasama UMKM
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section4.kerjasamaUMKM || "-"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                        Penyerapan Tenaga Kerja
                                    </h4>
                                    <p className="text-gray-800">
                                        {survey.section4.penyerapanTenagaKerja || "-"} orang
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 5 */}
                {survey.section5 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-4">
                            <h2 className="text-xl font-bold">
                                🔧 SECTION 5 - Hambatan & Kebutuhan
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Hambatan Utama
                                </h4>
                                <p className="text-gray-800">
                                    {renderArrayField(survey.section5.hambatanUtama, survey.section5.hambatanUtamaOther)}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Kebutuhan Mendesak
                                </h4>
                                <p className="text-gray-800">
                                    {renderArrayField(survey.section5.kebutuhanMendesak, survey.section5.kebutuhanMendesakOther)}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Harapan kepada KPOTI
                                </h4>
                                <p className="text-gray-800 whitespace-pre-wrap">
                                    {survey.section5.harapanKPOTI || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 6 */}
                {survey.section6 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-4">
                            <h2 className="text-xl font-bold">
                                📸 SECTION 6 - Dokumentasi
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-2">
                                    Foto Alat
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {survey.section6.fotoAlat?.map((url, idx) => (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <img
                                                src={url}
                                                alt={`Foto Alat ${idx + 1}`}
                                                className="w-full h-40 object-cover"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-2">
                                    Foto Kegiatan
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {survey.section6.fotoKegiatan?.map((url, idx) => (
                                        <a
                                            key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            <img
                                                src={url}
                                                alt={`Foto Kegiatan ${idx + 1}`}
                                                className="w-full h-40 object-cover"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            {survey.section6.videoPROT && survey.section6.videoPROT.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-sm mb-2">
                                        Video PR/OT
                                    </h4>
                                    <div className="space-y-2">
                                        {survey.section6.videoPROT.map((url, idx) => (
                                            <a
                                                key={idx}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block text-gray-500 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                🎥 Video #{idx + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
                                   