"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "./QuestionCard";
import RadioGroup from "./RadioGroup";
import InputField from "./InputField";
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

interface Section1Data {
  role: string;
  roleOther: string;
  provinsi: string;
  kabKota: string;
  kecamatan: string;
  desaKelurahan: string;
  namaLengkap: string;
  nomorHP: string;
  instansi: string;
  jumlahPROT: string;
  jumlahPROTOther: string;
}

export default function Section1Form() {
  const router = useRouter();
  const [formData, setFormData] = useState<Section1Data>({
    role: "",
    roleOther: "",
    provinsi: "",
    kabKota: "",
    kecamatan: "",
    desaKelurahan: "",
    namaLengkap: "",
    nomorHP: "",
    instansi: "",
    jumlahPROT: "",
    jumlahPROTOther: ""
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
  const kabupatenOptions = formData.provinsi
    ? getKabupatenByProvinsi(kabupatenList, formData.provinsi)
    : [];
  
  const kecamatanOptions = formData.kabKota
    ? getKecamatanByKabupaten(kecamatanList, formData.kabKota)
    : [];
  
  const desaOptions = formData.kecamatan
    ? getDesaByKecamatan(desaList, formData.kecamatan)
    : [];

  const roleOptions = [
    { value: "provinsi", label: "Pengurus/Koordinator PR-OT tingkat Provinsi" },
    { value: "kabkota", label: "Pengurus/Koordinator PR-OT tingkat Kab/Kota" },
    { value: "kecamatan", label: "Pengurus/Koordinator PR-OT tingkat Kecamatan/Desa" },
    { value: "perangkat", label: "Perangkat Desa/Kelurahan (mitra pengurus daerah)" },
    { value: "pemda", label: "Pemda/Instansi pembina (Dispora/Dikbud/Dispar/dll.)" }
  ];

  const jumlahOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-6 px-6 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold">SECTION 1 - Identitas Pengurus Daerah</h2>
      </div>

      {/* Question 1 */}
      <QuestionCard
        title="Anda mengisi kuesioner ini sebagai"
        required={true}
        icon="👤"
      >
        <RadioGroup
          name="role"
          options={roleOptions}
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
          hasOther={true}
          otherValue={formData.roleOther}
          onOtherChange={(value) => setFormData({ ...formData, roleOther: value })}
        />
      </QuestionCard>

      {/* Question 2 */}
      <QuestionCard
        title="Wilayah kerja pengurus yang Anda input"
        required={true}
        icon="📍"
      >
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Memuat data wilayah...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableDropdown
              label="Provinsi"
              value={formData.provinsi}
              options={provinsiList.map(p => ({ value: p.code, label: p.name }))}
              onChange={(value) => {
                setFormData({ 
                  ...formData, 
                  provinsi: value,
                  kabKota: "",
                  kecamatan: "",
                  desaKelurahan: ""
                });
              }}
              placeholder="Pilih atau cari provinsi"
            />
            <SearchableDropdown
              label="Kab/Kota"
              value={formData.kabKota}
              options={kabupatenOptions.map(k => ({ 
                value: k.code, 
                label: k.name 
              }))}
              onChange={(value) => {
                setFormData({ 
                  ...formData, 
                  kabKota: value,
                  kecamatan: "",
                  desaKelurahan: ""
                });
              }}
              placeholder="Pilih atau cari kab/kota"
              disabled={!formData.provinsi}
            />
            <SearchableDropdown
              label="Kecamatan"
              value={formData.kecamatan}
              options={kecamatanOptions.map(kec => ({ 
                value: kec.code, 
                label: kec.name 
              }))}
              onChange={(value) => {
                setFormData({ 
                  ...formData, 
                  kecamatan: value,
                  desaKelurahan: ""
                });
              }}
              placeholder="Pilih atau cari kecamatan"
              disabled={!formData.kabKota}
            />
            <SearchableDropdown
              label="Desa/Kelurahan"
              value={formData.desaKelurahan}
              options={desaOptions.map(desa => ({ 
                value: desa.code, 
                label: desa.name 
              }))}
              onChange={(value) => setFormData({ ...formData, desaKelurahan: value })}
              placeholder="Pilih atau cari desa/kelurahan"
              disabled={!formData.kecamatan}
            />
          </div>
        )}
      </QuestionCard>

      {/* Question 3 */}
      <QuestionCard
        title="Kontak pengisi (untuk verifikasi data)"
        required={true}
        icon="📞"
      >
        <InputField
          label="Nama lengkap"
          value={formData.namaLengkap}
          onChange={(value) => setFormData({ ...formData, namaLengkap: value })}
          placeholder="Masukkan nama lengkap Anda"
        />
        <InputField
          label="Nomor HP/WA"
          value={formData.nomorHP}
          onChange={(value) => setFormData({ ...formData, nomorHP: value })}
          placeholder="Contoh: 081234567890"
          type="tel"
        />
        <InputField
          label="Instansi/Komunitas"
          value={formData.instansi}
          onChange={(value) => setFormData({ ...formData, instansi: value })}
          placeholder="Masukkan nama instansi atau komunitas"
        />
      </QuestionCard>

      {/* Question 4 */}
      <QuestionCard
        title="Berapa jumlah PR/OT yang akan Anda input pada Section 2?"
        required={true}
        icon="🎯"
      >
        <RadioGroup
          name="jumlahPROT"
          options={jumlahOptions}
          value={formData.jumlahPROT}
          onChange={(value) => setFormData({ ...formData, jumlahPROT: value })}
          hasOther={true}
          otherValue={formData.jumlahPROTOther}
          onOtherChange={(value) => setFormData({ ...formData, jumlahPROTOther: value })}
        />
      </QuestionCard>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
        >
          ← Kembali
        </button>
        <button
          type="button"
          onClick={() => {
            // Simpan data Section 1 ke localStorage
            const section1Data = {
              role: formData.role,
              roleOther: formData.roleOther,
              wilayahKerja: {
                provinsi: formData.provinsi,
                kabKota: formData.kabKota,
                kecamatan: formData.kecamatan,
                desaKelurahan: formData.desaKelurahan,
              },
              kontak: {
                namaLengkap: formData.namaLengkap,
                nomorHP: formData.nomorHP,
                instansi: formData.instansi,
              },
              jumlahPROT: formData.jumlahPROT,
              jumlahPROTOther: formData.jumlahPROTOther,
            };
            localStorage.setItem('surveySection1', JSON.stringify(section1Data));
            router.push('/survey/section2');
          }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Lanjut ke Section 2 →
        </button>
      </div>
    </div>
  );
}
