"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Section2Entry, { Section2Data } from "./Section2Entry";

interface EntryData {
  id: number;
  data: Section2Data;
}

export default function Section2Form() {
  const router = useRouter();
  const [entries, setEntries] = useState<number[]>([1]);
  const [entriesData, setEntriesData] = useState<Map<number, Section2Data>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const addEntry = () => {
    const newId = entries.length > 0 ? Math.max(...entries) + 1 : 1;
    setEntries([...entries, newId]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      const entryId = entries[index];
      setEntries(entries.filter((_, i) => i !== index));
      // Remove data for this entry
      const newEntriesData = new Map(entriesData);
      newEntriesData.delete(entryId);
      setEntriesData(newEntriesData);
    }
  };

  const handleEntryChange = useCallback((entryId: number, data: Section2Data) => {
    setEntriesData(prev => {
      const newMap = new Map(prev);
      newMap.set(entryId, data);
      return newMap;
    });
  }, []);

  const transformEntryData = (data: Section2Data, entryNumber: number) => {
    return {
      entryNumber,
      identitas: {
        kategori: data.kategori,
        namaPROT: data.namaPROT,
        adaNamaLain: data.adaNamaLain,
        variasiNama: data.variasiNama,
        lokasi: {
          jenis: data.lokasi,
          lokasiOther: data.lokasiOther,
          kelengkapanLokasi: data.kelengkapanLokasi,
          alamatLengkap: data.alamatLengkap,
          koordinatGPS: data.koordinatGPS,
        },
      },
      aturan: {
        statusAturan: data.statusAturan,
        sumberRujukan: data.sumberRujukan,
        sumberRujukanOther: data.sumberRujukanOther,
        ringkasanAturan: data.ringkasanAturan,
        adaVariasiAturan: data.adaVariasiAturan,
        jelaskanVariasi: data.jelaskanVariasi,
      },
      sdm: {
        koordinator: {
          ada: data.adaKoordinator,
          peran: data.peranKoordinator,
          peranOther: data.peranKoordinatorOther,
          cakupan: data.cakupanKoordinator,
          kontak: data.kontakKoordinator,
        },
        pelatih: {
          status: data.statusPelatih,
          level: data.levelPelatih,
          kontak: data.kontakPelatih,
          jadwalLatihan: data.jadwalLatihan,
        },
        pakar: {
          ada: data.adaPakar,
          kategori: data.kategoriPakar,
          kategoriOther: data.kategoriPakarOther,
          kontak: data.kontakPakar,
          adaBukti: data.adaBukti,
        },
      },
      komunitasAktivitas: {
        adaKomunitas: data.adaKomunitas,
        bentukKomunitas: data.bentukKomunitas,
        bentukKomunitasOther: data.bentukKomunitasOther,
        statusKeaktifan: data.statusKeaktifan,
        frekuensiKegiatan: data.frekuensiKegiatan,
        jenisKegiatan: data.jenisKegiatan,
        jenisKegiatanOther: data.jenisKegiatanOther,
        adaDokumentasi: data.adaDokumentasi,
      },
      alatProduksi: {
        adaPengrajin: data.adaPengrajin,
        skalaProduksi: data.skalaProduksi,
        kepemilikanAlat: data.kepemilikanAlat,
        kondisiAlat: data.kondisiAlat,
        standardisasiAlat: data.standardisasiAlat,
        dokumentasiAlat: data.dokumentasiAlat,
      },
      peranPemda: {
        adaPeran: data.peranPemda,
        bentukPeran: data.bentukPeranPemda,
        bentukPeranOther: data.bentukPeranPemdaOther,
        bentukDukungan: data.bentukDukungan,
        bentukDukunganOther: data.bentukDukunganOther,
        buktiDukungan: data.buktiDukungan,
      },
      kondisiKepengurusan: {
        perkembangan: data.perkembangan,
        indikatorPerkembangan: data.indikatorPerkembangan,
        indikatorPerkembanganOther: data.indikatorPerkembanganOther,
        kegiatanBerjalan: data.kegiatanBerjalan,
        kegiatanBerjalanOther: data.kegiatanBerjalanOther,
        statusProgram: data.statusProgram,
        kendala: data.kendala,
        kendalaOther: data.kendalaOther,
        dampakKendala: data.dampakKendala,
        catatanTambahan: data.catatanTambahan,
      },
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get Section 1 data from localStorage
      const section1Raw = localStorage.getItem('surveySection1');
      if (!section1Raw) {
        throw new Error('Data Section 1 tidak ditemukan. Silakan kembali ke Section 1.');
      }
      const section1 = JSON.parse(section1Raw);

      // Transform Section 2 entries data
      const section2Entries = entries.map((entryId, index) => {
        const data = entriesData.get(entryId);
        if (data) {
          return transformEntryData(data, index + 1);
        }
        return null;
      }).filter(Boolean);

      // Build complete survey data
      const surveyData = {
        status: "completed",
        section1,
        section2: {
          entries: section2Entries,
        },
      };

      // Submit to API
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal menyimpan survey');
      }

      // Clear localStorage after successful submission
      localStorage.removeItem('surveySection1');

      // Show success and redirect
      alert('✅ Survey berhasil disimpan!');
      window.location.href = '/';
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmitError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-6 px-6 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          SECTION 2 - Entri Pemetaan PR/OT
        </h2>
        <p className="text-white/90">
          Isi Blok Pertanyaan berikut untuk setiap PR/OT. Jika PR/OT yang Anda input lebih dari 1, tambahkan entri baru dengan tombol di bawah.
        </p>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {submitError}
        </div>
      )}

      {/* Display all entries */}
      {entries.map((entryId, index) => (
        <Section2Entry
          key={entryId}
          entryNumber={index + 1}
          onRemove={() => removeEntry(index)}
          showRemoveButton={entries.length > 1}
          onChange={(data) => handleEntryChange(entryId, data)}
        />
      ))}

      {/* Add Entry Button */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={addEntry}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          ➕ Tambah Entri PR/OT Baru
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={() => router.push('/survey')}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
        >
          ← Kembali ke Section 1
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isSubmitting
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:from-blue-700 hover:to-orange-600'
            }`}
        >
          {isSubmitting ? '⏳ Menyimpan...' : '✅ Selesai & Simpan'}
        </button>
      </div>
    </div>
  );
}
