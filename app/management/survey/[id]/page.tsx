"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Survey {
    _id: string;
    status: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
    section1: {
        role: string;
        roleOther: string;
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
        jumlahPROT: string;
        jumlahPROTOther: string;
    };
    section2: {
        entries: Array<{
            entryNumber: number;
            identitas: {
                kategori: string;
                namaPROT: string;
                adaNamaLain: string;
                variasiNama: string;
                lokasi: {
                    jenis: string[];
                    lokasiOther: string;
                    kelengkapanLokasi: string;
                    alamatLengkap: string;
                    koordinatGPS: string;
                };
            };
            aturan: {
                statusAturan: string;
                sumberRujukan: string[];
                sumberRujukanOther: string;
                ringkasanAturan: string;
                adaVariasiAturan: string;
                jelaskanVariasi: string;
            };
            sdm: {
                koordinator: {
                    ada: string;
                    peran: string;
                    peranOther: string;
                    cakupan: string;
                    kontak: string;
                };
                pelatih: {
                    status: string;
                    level: string;
                    kontak: string;
                    jadwalLatihan: string;
                };
                pakar: {
                    ada: string;
                    kategori: string[];
                    kategoriOther: string;
                    kontak: string;
                    adaBukti: string;
                };
            };
            komunitasAktivitas: {
                adaKomunitas: string;
                bentukKomunitas: string[];
                bentukKomunitasOther: string;
                statusKeaktifan: string;
                frekuensiKegiatan: string;
                jenisKegiatan: string[];
                jenisKegiatanOther: string;
                adaDokumentasi: string;
            };
            alatProduksi: {
                adaPengrajin: string;
                skalaProduksi: string;
                kepemilikanAlat: string[];
                kondisiAlat: string;
                standardisasiAlat: string;
                dokumentasiAlat: string[];
            };
            peranPemda: {
                adaPeran: string;
                bentukPeran: string[];
                bentukPeranOther: string;
                bentukDukungan: string[];
                bentukDukunganOther: string;
                buktiDukungan: string[];
            };
            kondisiKepengurusan: {
                perkembangan: string;
                indikatorPerkembangan: string[];
                indikatorPerkembanganOther: string;
                kegiatanBerjalan: string[];
                kegiatanBerjalanOther: string;
                statusProgram: string;
                kendala: string[];
                kendalaOther: string;
                dampakKendala: string;
                catatanTambahan: string;
            };
        }>;
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

    const getRoleLabel = (role: string) => {
        const roles: Record<string, string> = {
            provinsi: "Pengurus/Koordinator PR-OT tingkat Provinsi",
            kabkota: "Pengurus/Koordinator PR-OT tingkat Kab/Kota",
            kecamatan: "Pengurus/Koordinator PR-OT tingkat Kecamatan/Desa",
            perangkat: "Perangkat Desa/Kelurahan (mitra pengurus daerah)",
            pemda: "Pemda/Instansi pembina (Dispora/Dikbud/Dispar/dll.)",
        };
        return roles[role] || role;
    };

    const getKategoriLabel = (kategori: string) => {
        switch (kategori) {
            case "pr":
                return "Permainan Rakyat (PR)";
            case "ot":
                return "Olahraga Tradisional (OT)";
            case "keduanya":
                return "Keduanya";
            default:
                return kategori;
        }
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
                            {formatDate(survey.submittedAt || survey.createdAt)}
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
                            📌 SECTION 1 - Identitas Pengurus Daerah
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Role */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Mengisi sebagai
                                </h4>
                                <p className="text-gray-800">
                                    {getRoleLabel(survey.section1?.role || "")}
                                    {survey.section1?.roleOther &&
                                        ` (${survey.section1.roleOther})`}
                                </p>
                            </div>

                            {/* Wilayah */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Wilayah Kerja
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.wilayahKerja?.provinsi || "-"},{" "}
                                    {survey.section1?.wilayahKerja?.kabKota || "-"}
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Kec. {survey.section1?.wilayahKerja?.kecamatan || "-"}, Desa{" "}
                                    {survey.section1?.wilayahKerja?.desaKelurahan || "-"}
                                </p>
                            </div>

                            {/* Kontak */}
                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Nama Lengkap
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.kontak?.namaLengkap || "-"}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Nomor HP/WA
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.kontak?.nomorHP || "-"}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Instansi/Komunitas
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.kontak?.instansi || "-"}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                    Jumlah PR/OT
                                </h4>
                                <p className="text-gray-800">
                                    {survey.section1?.jumlahPROT || "-"}
                                    {survey.section1?.jumlahPROTOther &&
                                        ` (${survey.section1.jumlahPROTOther})`}
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
                                    {entry.identitas?.namaPROT || `Entri #${entry.entryNumber}`}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Entry Content */}
                    {currentEntry && (
                        <div className="p-6 space-y-8">
                            {/* A. Identitas */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    A. Identitas PR/OT
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Kategori
                                        </h4>
                                        <p className="text-gray-800">
                                            {getKategoriLabel(currentEntry.identitas?.kategori || "")}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Nama PR/OT
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.identitas?.namaPROT || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Variasi Nama
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.identitas?.variasiNama || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Lokasi
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.identitas?.lokasi?.jenis,
                                                currentEntry.identitas?.lokasi?.lokasiOther
                                            )}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Alamat Lengkap
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.identitas?.lokasi?.alamatLengkap || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Koordinat GPS
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.identitas?.lokasi?.koordinatGPS || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* B. Aturan Baku */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    B. Aturan Baku
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Status Aturan
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.aturan?.statusAturan || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Sumber Rujukan
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.aturan?.sumberRujukan,
                                                currentEntry.aturan?.sumberRujukanOther
                                            )}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Ringkasan Aturan
                                        </h4>
                                        <p className="text-gray-800 whitespace-pre-wrap">
                                            {currentEntry.aturan?.ringkasanAturan || "-"}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Variasi Aturan
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.aturan?.jelaskanVariasi || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* C. SDM */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    C. SDM (Koordinator/Pelatih/Pakar)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">
                                            Koordinator
                                        </h4>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Ada:</span>{" "}
                                            {currentEntry.sdm?.koordinator?.ada || "-"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Peran:</span>{" "}
                                            {currentEntry.sdm?.koordinator?.peran || "-"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Cakupan:</span>{" "}
                                            {currentEntry.sdm?.koordinator?.cakupan || "-"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Kontak:</span>{" "}
                                            {currentEntry.sdm?.koordinator?.kontak || "-"}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-2">
                                            Pelatih
                                        </h4>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Status:</span>{" "}
                                            {currentEntry.sdm?.pelatih?.status || "-"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Level:</span>{" "}
                                            {currentEntry.sdm?.pelatih?.level || "-"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Kontak:</span>{" "}
                                            {currentEntry.sdm?.pelatih?.kontak || "-"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Jadwal:</span>{" "}
                                            {currentEntry.sdm?.pelatih?.jadwalLatihan || "-"}
                                        </p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-orange-800 mb-2">Pakar</h4>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Ada:</span>{" "}
                                            {currentEntry.sdm?.pakar?.ada || "-"}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Kategori:</span>{" "}
                                            {renderArrayField(
                                                currentEntry.sdm?.pakar?.kategori,
                                                currentEntry.sdm?.pakar?.kategoriOther
                                            )}
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Kontak:</span>{" "}
                                            {currentEntry.sdm?.pakar?.kontak || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* D. Komunitas & Aktivitas */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    D. Komunitas & Aktivitas
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Ada Komunitas
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.komunitasAktivitas?.adaKomunitas || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Bentuk Komunitas
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.komunitasAktivitas?.bentukKomunitas,
                                                currentEntry.komunitasAktivitas?.bentukKomunitasOther
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Status Keaktifan
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.komunitasAktivitas?.statusKeaktifan || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Frekuensi Kegiatan
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.komunitasAktivitas?.frekuensiKegiatan || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Jenis Kegiatan
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.komunitasAktivitas?.jenisKegiatan,
                                                currentEntry.komunitasAktivitas?.jenisKegiatanOther
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Dokumentasi Kegiatan
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.komunitasAktivitas?.adaDokumentasi || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* E. Alat Produksi */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    E. Alat, Sentra Produksi, Standardisasi
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Pengrajin/UMKM
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.alatProduksi?.adaPengrajin || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Skala Produksi
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.alatProduksi?.skalaProduksi || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Kepemilikan Alat
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(currentEntry.alatProduksi?.kepemilikanAlat)}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Kondisi Alat
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.alatProduksi?.kondisiAlat || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Standardisasi
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.alatProduksi?.standardisasiAlat || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Dokumentasi Alat
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(currentEntry.alatProduksi?.dokumentasiAlat)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* F. Peran Pemda */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    F. Peran & Dukungan Pemda
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Ada Peran Pemda
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.peranPemda?.adaPeran || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Bentuk Peran
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.peranPemda?.bentukPeran,
                                                currentEntry.peranPemda?.bentukPeranOther
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Bentuk Dukungan
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.peranPemda?.bentukDukungan,
                                                currentEntry.peranPemda?.bentukDukunganOther
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Bukti Dukungan
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(currentEntry.peranPemda?.buktiDukungan)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* G. Kondisi Kepengurusan */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
                                    G. Kondisi Kepengurusan
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Perkembangan 12-24 bulan
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.kondisiKepengurusan?.perkembangan || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Indikator Perkembangan
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.kondisiKepengurusan?.indikatorPerkembangan,
                                                currentEntry.kondisiKepengurusan?.indikatorPerkembanganOther
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Kegiatan Berjalan
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.kondisiKepengurusan?.kegiatanBerjalan,
                                                currentEntry.kondisiKepengurusan?.kegiatanBerjalanOther
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Status Program
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.kondisiKepengurusan?.statusProgram || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Kendala
                                        </h4>
                                        <p className="text-gray-800">
                                            {renderArrayField(
                                                currentEntry.kondisiKepengurusan?.kendala,
                                                currentEntry.kondisiKepengurusan?.kendalaOther
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Dampak Kendala
                                        </h4>
                                        <p className="text-gray-800">
                                            {currentEntry.kondisiKepengurusan?.dampakKendala || "-"}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <h4 className="font-semibold text-gray-500 text-sm mb-1">
                                            Catatan Tambahan
                                        </h4>
                                        <p className="text-gray-800 whitespace-pre-wrap">
                                            {currentEntry.kondisiKepengurusan?.catatanTambahan || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
