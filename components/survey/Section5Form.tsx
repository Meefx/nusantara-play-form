"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "./QuestionCard";
import CheckboxGroup from "./CheckboxGroup";
import TextArea from "./TextArea";

interface Section5Data {
  hambatanUtama: string[];
  hambatanUtamaOther: string;
  kebutuhanMendesak: string[];
  kebutuhanMendesakOther: string;
  harapanKPOTI: string;
}

export default function Section5Form() {
  const router = useRouter();
  const [formData, setFormData] = useState<Section5Data>({
    hambatanUtama: [],
    hambatanUtamaOther: "",
    kebutuhanMendesak: [],
    kebutuhanMendesakOther: "",
    harapanKPOTI: ""
  });

  const hambatanUtamaOptions = [
    { value: "kurang_minat", label: "Kurangnya minat generasi muda" },
    { value: "keterbatasan_lahan", label: "Keterbatasan lahan" },
    { value: "tidak_ada_biaya", label: "Tidak ada biaya untuk alat" },
    { value: "kurang_kompetisi", label: "Kurangnya kompetisi" }
  ];

  const kebutuhanMendesakOptions = [
    { value: "pelatihan_wasit", label: "Pelatihan wasit/juri" },
    { value: "bantuan_alat", label: "Bantuan alat" },
    { value: "legalitas_komunitas", label: "Bantuan legalitas komunitas" },
    { value: "ruang_publik", label: "Ruang publik khusus" },
    { value: "standar_panduan", label: "Standar/panduan permainan" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-6 px-6 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold">SECTION 5 - Tantangan & Harapan PR/OT</h2>
      </div>

      {/* i) Hambatan Utama PR/OT */}
      <QuestionCard
        title="Hambatan Utama PR/OT"
        required={true}
        icon="🚧"
      >
        <CheckboxGroup
          name="hambatanUtama"
          options={hambatanUtamaOptions}
          values={formData.hambatanUtama}
          onChange={(values) => setFormData({ ...formData, hambatanUtama: values })}
          hasOther={true}
          otherValue={formData.hambatanUtamaOther}
          onOtherChange={(value) => setFormData({ ...formData, hambatanUtamaOther: value })}
          otherLabel=":"
        />
      </QuestionCard>

      {/* ii) Kebutuhan Mendesak */}
      <QuestionCard
        title="Kebutuhan Mendesak"
        required={true}
        icon="⚠️"
      >
        <CheckboxGroup
          name="kebutuhanMendesak"
          options={kebutuhanMendesakOptions}
          values={formData.kebutuhanMendesak}
          onChange={(values) => setFormData({ ...formData, kebutuhanMendesak: values })}
          hasOther={true}
          otherValue={formData.kebutuhanMendesakOther}
          onOtherChange={(value) => setFormData({ ...formData, kebutuhanMendesakOther: value })}
          otherLabel=":"
        />
      </QuestionCard>

      {/* iii) Harapan terhadap KPOTI/Pemerintah */}
      <QuestionCard
        title="Harapan terhadap KPOTI/Pemerintah"
        required={true}
        icon="💭"
        description="Tuliskan saran atau masukan untuk program kerja ke depan"
      >
        <TextArea
          label=""
          value={formData.harapanKPOTI}
          onChange={(value) => setFormData({ ...formData, harapanKPOTI: value })}
          placeholder="Tuliskan harapan, saran, atau masukan Anda untuk program kerja KPOTI/Pemerintah ke depan..."
          rows={8}
        />
      </QuestionCard>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={() => router.push('/survey/section4')}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
        >
          ← Kembali ke Section 4
        </button>
        <button
          type="button"
          onClick={() => {
            // Simpan data Section 5 ke localStorage
            const section5Data = {
              hambatanUtama: formData.hambatanUtama,
              hambatanUtamaOther: formData.hambatanUtamaOther,
              kebutuhanMendesak: formData.kebutuhanMendesak,
              kebutuhanMendesakOther: formData.kebutuhanMendesakOther,
              harapanKPOTI: formData.harapanKPOTI,
            };
            localStorage.setItem('surveySection5', JSON.stringify(section5Data));
            router.push('/survey/section6');
          }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Lanjut ke Section 6 →
        </button>
      </div>
    </div>
  );
}
