"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "./QuestionCard";
import RadioGroup from "./RadioGroup";
import InputField from "./InputField";

interface Section4Data {
  produksiAlat: string;
  hargaAlat: string;
  dayaTarikWisata: string;
  kerjasamaUMKM: string;
  penyerapanTenagaKerja: string;
}

export default function Section4Form() {
  const router = useRouter();
  const [formData, setFormData] = useState<Section4Data>({
    produksiAlat: "",
    hargaAlat: "",
    dayaTarikWisata: "",
    kerjasamaUMKM: "",
    penyerapanTenagaKerja: ""
  });

  const produksiAlatOptions = [
    { value: "mandiri", label: "Dibuat sendiri secara mandiri" },
    { value: "pengrajin_lokal", label: "Pengrajin lokal yang memproduksi" },
    { value: "pengrajin_luar", label: "Membeli dari pengrajin luar" }
  ];

  const dayaTarikWisataOptions = [
    { value: "ya", label: "Ya" },
    { value: "tidak", label: "Tidak" }
  ];

  const kerjasamaUMKMOptions = [
    { value: "sudah", label: "Sudah" },
    { value: "belum", label: "Belum" }
  ];

  const penyerapanTenagaKerjaOptions = [
    { value: "1", label: "1 orang" },
    { value: "1-3", label: "1-3 orang" },
    { value: "4-7", label: "4-7 orang" },
    { value: "7-10", label: "7-10 orang" },
    { value: ">10", label: ">10 orang" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-6 px-6 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold">SECTION 4 - Potensi Ekonomi Lokal & Industri Kreatif</h2>
      </div>

      {/* i) Produksi Alat */}
      <QuestionCard
        title="Produksi Alat"
        required={true}
        icon="🛠️"
      >
        <RadioGroup
          name="produksiAlat"
          options={produksiAlatOptions}
          value={formData.produksiAlat}
          onChange={(value) => setFormData({ ...formData, produksiAlat: value })}
          hasOther={false}
        />
      </QuestionCard>

      {/* ii) Harga Alat (1 set) */}
      <QuestionCard
        title="Harga Alat (1 set)"
        required={true}
        icon="💰"
      >
        <InputField
          label=""
          value={formData.hargaAlat}
          onChange={(value) => setFormData({ ...formData, hargaAlat: value })}
          placeholder="Masukkan harga 1 set alat (contoh: Rp 500.000)"
        />
      </QuestionCard>

      {/* iii) Daya tarik wisata/atraksi budaya */}
      <QuestionCard
        title="Apakah menjadi daya tarik wisata/atraksi budaya"
        required={true}
        icon="🎭"
      >
        <RadioGroup
          name="dayaTarikWisata"
          options={dayaTarikWisataOptions}
          value={formData.dayaTarikWisata}
          onChange={(value) => setFormData({ ...formData, dayaTarikWisata: value })}
          hasOther={false}
        />
      </QuestionCard>

      {/* iv) Kerja sama dengan UMKM lokal */}
      <QuestionCard
        title="Apakah sudah ada kerja sama dengan UMKM lokal untuk pengadaan alat atau merchandise?"
        required={true}
        icon="🤝"
      >
        <RadioGroup
          name="kerjasamaUMKM"
          options={kerjasamaUMKMOptions}
          value={formData.kerjasamaUMKM}
          onChange={(value) => setFormData({ ...formData, kerjasamaUMKM: value })}
          hasOther={false}
        />
      </QuestionCard>

      {/* v) Penyerapan Tenaga Kerja */}
      <QuestionCard
        title="Penyerapan Tenaga Kerja: (Berapa banyak kegiatan ini mampu membuka peluang kerja bagi pengrajin/pegiat PR/OT?)"
        required={true}
        icon="👷"
      >
        <RadioGroup
          name="penyerapanTenagaKerja"
          options={penyerapanTenagaKerjaOptions}
          value={formData.penyerapanTenagaKerja}
          onChange={(value) => setFormData({ ...formData, penyerapanTenagaKerja: value })}
          hasOther={false}
        />
      </QuestionCard>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={() => router.push('/survey/section3')}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
        >
          ← Kembali ke Section 3
        </button>
        <button
          type="button"
          onClick={() => {
            // Simpan data Section 4 ke localStorage
            const section4Data = {
              produksiAlat: formData.produksiAlat,
              hargaAlat: formData.hargaAlat,
              dayaTarikWisata: formData.dayaTarikWisata,
              kerjasamaUMKM: formData.kerjasamaUMKM,
              penyerapanTenagaKerja: formData.penyerapanTenagaKerja,
            };
            localStorage.setItem('surveySection4', JSON.stringify(section4Data));
            router.push('/survey/section5');
          }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Lanjut ke Section 5 →
        </button>
      </div>
    </div>
  );
}
