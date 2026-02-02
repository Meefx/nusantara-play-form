"use client";

import { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import RadioGroup from "./RadioGroup";
import InputField from "./InputField";
import TextArea from "./TextArea";
import SearchableDropdown from "./SearchableDropdown";
import {
  loadProvinsiData,
  loadKabupatenData,
  loadKecamatanData,
  loadDesaData,
  getKabupatenByProvinsi,
  getKecamatanByKabupaten,
  getDesaByKecamatan,
  CSVProvinsi,
  CSVKabupaten,
  CSVKecamatan,
  CSVDesa
} from "@/lib/csvLoader";

export interface Section2Data {
  namaPROT: string;
  jenisKategori: string;
  statusAsalUsul: string;
  lokasiProvinsi: string;
  lokasiKabKota: string;
  lokasiKecamatan: string;
  lokasiDesa: string;
  alamatLengkap: string;
  koordinatorNama: string;
  koordinatorHP: string;
  koordinatorEmail: string;
  pelatihNama: string;
  pelatihHP: string;
  pelatihEmail: string;
  peralatanPROT: string;
  caraBermain: string;
  nilaiMoral: string;
}

interface Section2EntryProps {
  entryNumber: number;
  onRemove?: () => void;
  showRemoveButton?: boolean;
  onChange?: (data: Section2Data) => void;
}

export default function Section2Entry({ 
  entryNumber, 
  onRemove, 
  showRemoveButton = true, 
  onChange 
}: Section2EntryProps) {
  const [formData, setFormData] = useState<Section2Data>({
    namaPROT: "",
    jenisKategori: "",
    statusAsalUsul: "",
    lokasiProvinsi: "",
    lokasiKabKota: "",
    lokasiKecamatan: "",
    lokasiDesa: "",
    alamatLengkap: "",
    koordinatorNama: "",
    koordinatorHP: "",
    koordinatorEmail: "",
    pelatihNama: "",
    pelatihHP: "",
    pelatihEmail: "",
    peralatanPROT: "",
    caraBermain: "",
    nilaiMoral: ""
  });

  // State untuk data wilayah
  const [provinsiList, setProvinsiList] = useState<CSVProvinsi[]>([]);
  const [kabupatenList, setKabupatenList] = useState<CSVKabupaten[]>([]);
  const [kecamatanList, setKecamatanList] = useState<CSVKecamatan[]>([]);
  const [desaList, setDesaList] = useState<CSVDesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data CSV saat component mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [provinsi, kabupaten, kecamatan, desa] = await Promise.all([
          loadProvinsiData(),
          loadKabupatenData(),
          loadKecamatanData(),
          loadDesaData()
        ]);
        setProvinsiList(provinsi);
        setKabupatenList(kabupaten);
        setKecamatanList(kecamatan);
        setDesaList(desa);
      } catch (error) {
        console.error("Error loading wilayah data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Get filtered options
  const kabupatenOptions = formData.lokasiProvinsi
    ? getKabupatenByProvinsi(kabupatenList, formData.lokasiProvinsi)
    : [];
  
  const kecamatanOptions = formData.lokasiKabKota
    ? getKecamatanByKabupaten(kecamatanList, formData.lokasiKabKota)
    : [];
  
  const desaOptions = formData.lokasiKecamatan
    ? getDesaByKecamatan(desaList, formData.lokasiKecamatan)
    : [];

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (field: keyof Section2Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const jenisKategoriOptions = [
    { value: "pr", label: "Permainan Rakyat (PR)" },
    { value: "ot", label: "Olahraga Tradisional (OT)" },
    { value: "budaya", label: "Budaya/Kearifan Lokal/Upacara Adat" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border-2 border-blue-200">
      {/* Entry Header */}
      <div className="flex justify-between items-center pb-4 border-b-2 border-blue-200">
        <h3 className="text-2xl font-bold text-blue-700">
          📝 Entri PR/OT #{entryNumber}
        </h3>
        {showRemoveButton && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold"
          >
            🗑️ Hapus Entri
          </button>
        )}
      </div>

      {/* i) Nama PR/OT */}
      <QuestionCard
        title="Nama PR/OT (nama lokal)"
        required={true}
        icon="🎮"
      >
        <InputField
          label=""
          value={formData.namaPROT}
          onChange={(value) => handleChange('namaPROT', value)}
          placeholder="Masukkan nama PR/OT dalam bahasa lokal"
        />
      </QuestionCard>

      {/* ii) Jenis Kategori */}
      <QuestionCard
        title="Jenis Kategori"
        required={true}
        icon="🏷️"
      >
        <RadioGroup
          name={`jenisKategori-${entryNumber}`}
          options={jenisKategoriOptions}
          value={formData.jenisKategori}
          onChange={(value) => handleChange('jenisKategori', value)}
          hasOther={false}
        />
      </QuestionCard>

      {/* iii) Status Asal-Usul PR/OT */}
      <QuestionCard
        title="Status Asal-Usul PR/OT"
        required={true}
        icon="📜"
      >
        <InputField
          label=""
          value={formData.statusAsalUsul}
          onChange={(value) => handleChange('statusAsalUsul', value)}
          placeholder="Jelaskan asal-usul atau sejarah PR/OT ini"
        />
      </QuestionCard>

      {/* iv) Lokasi PR/OT */}
      <QuestionCard
        title="Lokasi PR/OT"
        required={true}
        icon="📍"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Memuat data wilayah...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableDropdown
                label="Provinsi"
                value={formData.lokasiProvinsi}
                options={provinsiList.map(p => ({ value: p.code, label: p.name }))}
                onChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    lokasiProvinsi: value,
                    lokasiKabKota: "",
                    lokasiKecamatan: "",
                    lokasiDesa: ""
                  });
                }}
                placeholder="Pilih atau cari provinsi"
              />
              <SearchableDropdown
                label="Kabupaten/Kota"
                value={formData.lokasiKabKota}
                options={kabupatenOptions.map(k => ({ 
                  value: k.code, 
                  label: k.name 
                }))}
                onChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    lokasiKabKota: value,
                    lokasiKecamatan: "",
                    lokasiDesa: ""
                  });
                }}
                placeholder="Pilih atau cari kabupaten/kota"
                disabled={!formData.lokasiProvinsi}
              />
              <SearchableDropdown
                label="Kecamatan"
                value={formData.lokasiKecamatan}
                options={kecamatanOptions.map(kec => ({ 
                  value: kec.code, 
                  label: kec.name 
                }))}
                onChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    lokasiKecamatan: value,
                    lokasiDesa: ""
                  });
                }}
                placeholder="Pilih atau cari kecamatan"
                disabled={!formData.lokasiKabKota}
              />
              <SearchableDropdown
                label="Desa/Kelurahan"
                value={formData.lokasiDesa}
                options={desaOptions.map(desa => ({ 
                  value: desa.code, 
                  label: desa.name 
                }))}
                onChange={(value) => handleChange('lokasiDesa', value)}
                placeholder="Pilih atau cari desa/kelurahan"
                disabled={!formData.lokasiKecamatan}
              />
            </div>
            <TextArea
              label="Alamat Lengkap"
              value={formData.alamatLengkap}
              onChange={(value) => handleChange('alamatLengkap', value)}
              placeholder="Masukkan alamat lengkap detail lokasi PR/OT"
              rows={3}
            />
          </div>
        )}
      </QuestionCard>

      {/* v) Koordinator/penggerak utama PR/OT */}
      <QuestionCard
        title="Koordinator/penggerak utama PR/OT di wilayah ini?"
        required={true}
        icon="👤"
      >
        <div className="space-y-4">
          <InputField
            label="Nama Lengkap"
            value={formData.koordinatorNama}
            onChange={(value) => handleChange('koordinatorNama', value)}
            placeholder="Masukkan nama lengkap koordinator"
          />
          <InputField
            label="No. HP"
            value={formData.koordinatorHP}
            onChange={(value) => handleChange('koordinatorHP', value)}
            placeholder="Contoh: 081234567890"
            type="tel"
          />
          <InputField
            label="Email"
            value={formData.koordinatorEmail}
            onChange={(value) => handleChange('koordinatorEmail', value)}
            placeholder="Contoh: email@example.com"
            type="email"
          />
        </div>
      </QuestionCard>

      {/* vi) Pelatih PR/OT */}
      <QuestionCard
        title="Pelatih PR/OT di wilayah ini?"
        required={true}
        icon="🏃"
      >
        <div className="space-y-4">
          <InputField
            label="Nama Lengkap"
            value={formData.pelatihNama}
            onChange={(value) => handleChange('pelatihNama', value)}
            placeholder="Masukkan nama lengkap pelatih"
          />
          <InputField
            label="No. HP"
            value={formData.pelatihHP}
            onChange={(value) => handleChange('pelatihHP', value)}
            placeholder="Contoh: 081234567890"
            type="tel"
          />
          <InputField
            label="Email"
            value={formData.pelatihEmail}
            onChange={(value) => handleChange('pelatihEmail', value)}
            placeholder="Contoh: email@example.com"
            type="email"
          />
        </div>
      </QuestionCard>

      {/* vii) Peralatan PR/OT */}
      <QuestionCard
        title="Peralatan PR/OT yang Digunakan"
        required={true}
        icon="⚙️"
      >
        <InputField
          label=""
          value={formData.peralatanPROT}
          onChange={(value) => handleChange('peralatanPROT', value)}
          placeholder="Sebutkan peralatan yang digunakan (isian singkat)"
        />
      </QuestionCard>

      {/* viii) Cara Bermain/Aturan Dasar */}
      <QuestionCard
        title="Cara Bermain/Aturan Dasar PR/OT"
        required={true}
        icon="📋"
      >
        <TextArea
          label=""
          value={formData.caraBermain}
          onChange={(value) => handleChange('caraBermain', value)}
          placeholder="Jelaskan secara detail cara bermain dan aturan dasar PR/OT ini"
          rows={6}
        />
      </QuestionCard>

      {/* ix) Nilai Moral & Filosofis */}
      <QuestionCard
        title="Nilai Moral & Filosofis"
        required={true}
        icon="💡"
      >
        <TextArea
          label=""
          value={formData.nilaiMoral}
          onChange={(value) => handleChange('nilaiMoral', value)}
          placeholder="Jelaskan nilai moral dan filosofis yang terkandung dalam PR/OT ini"
          rows={6}
        />
      </QuestionCard>
    </div>
  );
}
