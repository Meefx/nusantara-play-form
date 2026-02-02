"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "./QuestionCard";
import RadioGroup from "./RadioGroup";
import InputField from "./InputField";

interface Section3Data {
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
}

export default function Section3Form() {
  const router = useRouter();
  const [formData, setFormData] = useState<Section3Data>({
    frekuensiDimainkan: "",
    frekuensiOther: "",
    targetUsia: "",
    jumlahPenggiat: "",
    ketersediaanLahan: "",
    ketersediaanLahanOther: "",
    partisipasiSekolah: "",
    partisipasiSekolahOther: "",
    penghargaanJuara: "",
    penghargaanJuaraOther: ""
  });

  const frekuensiOptions = [
    { value: "setiap_hari", label: "Setiap hari" },
    { value: "seminggu_sekali", label: "Seminggu sekali" },
    { value: "saat_festival", label: "Hanya saat festival" },
    { value: "jarang_sekali", label: "Sudah jarang sekali" }
  ];

  const targetUsiaOptions = [
    { value: "anak", label: "Anak-anak" },
    { value: "remaja", label: "Remaja" },
    { value: "dewasa", label: "Dewasa" },
    { value: "semua_umur", label: "Semua umur" }
  ];

  const ketersediaanLahanOptions = [
    { value: "lapangan_khusus", label: "Lapangan khusus" },
    { value: "halaman_rumah", label: "Halaman rumah" },
    { value: "tidak_ada", label: "Tidak ada lahan sama sekali" }
  ];

  const partisipasiSekolahOptions = [
    { value: "ekstrakulikuler", label: "Ekstrakulikuler" },
    { value: "kejuaraan", label: "Kejuaraan" }
  ];

  const penghargaanJuaraOptions = [
    { value: "syarat_masuk", label: "Diakui sebagai syarat masuk sekolah" },
    { value: "belum_syarat", label: "Belum menjadi syarat masuk sekolah" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-6 px-6 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold">SECTION 3 - Eksistensi & Kondisi PR/OT Saat Ini</h2>
      </div>

      {/* i) Frekuensi Dimainkan */}
      <QuestionCard
        title="Frekuensi Dimainkan"
        required={true}
        icon="📅"
      >
        <RadioGroup
          name="frekuensiDimainkan"
          options={frekuensiOptions}
          value={formData.frekuensiDimainkan}
          onChange={(value) => setFormData({ ...formData, frekuensiDimainkan: value })}
          hasOther={true}
          otherValue={formData.frekuensiOther}
          onOtherChange={(value) => setFormData({ ...formData, frekuensiOther: value })}
          otherLabel="Lainnya:"
        />
      </QuestionCard>

      {/* ii) Target Usia Pemain */}
      <QuestionCard
        title="Target Usia Pemain"
        required={true}
        icon="👥"
      >
        <RadioGroup
          name="targetUsia"
          options={targetUsiaOptions}
          value={formData.targetUsia}
          onChange={(value) => setFormData({ ...formData, targetUsia: value })}
          hasOther={false}
        />
      </QuestionCard>

      {/* iii) Jumlah Penggiat/Pegiat */}
      <QuestionCard
        title="Jumlah Penggiat/Pegiat"
        required={true}
        icon="🔢"
      >
        <InputField
          label=""
          value={formData.jumlahPenggiat}
          onChange={(value) => setFormData({ ...formData, jumlahPenggiat: value })}
          placeholder="Masukkan jumlah penggiat/pegiat"
          type="number"
        />
      </QuestionCard>

      {/* iv) Ketersediaan Lahan/Tempat Bermain */}
      <QuestionCard
        title="Ketersediaan Lahan/Tempat Bermain PR/OT"
        required={true}
        icon="🏟️"
      >
        <RadioGroup
          name="ketersediaanLahan"
          options={ketersediaanLahanOptions}
          value={formData.ketersediaanLahan}
          onChange={(value) => setFormData({ ...formData, ketersediaanLahan: value })}
          hasOther={true}
          otherValue={formData.ketersediaanLahanOther}
          onOtherChange={(value) => setFormData({ ...formData, ketersediaanLahanOther: value })}
          otherLabel="Lainnya:"
        />
      </QuestionCard>

      {/* v) Partisipasi PR/OT dalam kegiatan sekolah */}
      <QuestionCard
        title="Partisipasi PR/OT dalam kegiatan sekolah"
        required={true}
        icon="🏫"
      >
        <RadioGroup
          name="partisipasiSekolah"
          options={partisipasiSekolahOptions}
          value={formData.partisipasiSekolah}
          onChange={(value) => setFormData({ ...formData, partisipasiSekolah: value })}
          hasOther={true}
          otherValue={formData.partisipasiSekolahOther}
          onOtherChange={(value) => setFormData({ ...formData, partisipasiSekolahOther: value })}
          otherLabel="Lainnya:"
        />
      </QuestionCard>

      {/* vi) Penghargaan juara */}
      <QuestionCard
        title="Penghargaan juara bagi penggiat/pegiat PR/OT di sekolah"
        required={true}
        icon="🏆"
      >
        <RadioGroup
          name="penghargaanJuara"
          options={penghargaanJuaraOptions}
          value={formData.penghargaanJuara}
          onChange={(value) => setFormData({ ...formData, penghargaanJuara: value })}
          hasOther={true}
          otherValue={formData.penghargaanJuaraOther}
          onOtherChange={(value) => setFormData({ ...formData, penghargaanJuaraOther: value })}
          otherLabel="Lainnya:"
        />
      </QuestionCard>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={() => router.push('/survey/section2')}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
        >
          ← Kembali ke Section 2
        </button>
        <button
          type="button"
          onClick={() => {
            // Simpan data Section 3 ke localStorage
            const section3Data = {
              frekuensiDimainkan: formData.frekuensiDimainkan,
              frekuensiOther: formData.frekuensiOther,
              targetUsia: formData.targetUsia,
              jumlahPenggiat: formData.jumlahPenggiat,
              ketersediaanLahan: formData.ketersediaanLahan,
              ketersediaanLahanOther: formData.ketersediaanLahanOther,
              partisipasiSekolah: formData.partisipasiSekolah,
              partisipasiSekolahOther: formData.partisipasiSekolahOther,
              penghargaanJuara: formData.penghargaanJuara,
              penghargaanJuaraOther: formData.penghargaanJuaraOther,
            };
            localStorage.setItem('surveySection3', JSON.stringify(section3Data));
            router.push('/survey/section4');
          }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Lanjut ke Section 4 →
        </button>
      </div>
    </div>
  );
}
