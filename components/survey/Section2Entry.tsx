"use client";

import { useState } from "react";
import QuestionCard from "./QuestionCard";
import RadioGroup from "./RadioGroup";
import CheckboxGroup from "./CheckboxGroup";
import InputField from "./InputField";
import TextArea from "./TextArea";

interface Section2Data {
  // A. Identitas PR/OT
  kategori: string;
  namaPROT: string;
  adaNamaLain: string;
  variasiNama: string;
  lokasi: string[];
  lokasiOther: string;
  kelengkapanLokasi: string;
  alamatLengkap: string;
  koordinatGPS: string;

  // B. Aturan Baku
  statusAturan: string;
  sumberRujukan: string[];
  sumberRujukanOther: string;
  ringkasanAturan: string;
  adaVariasiAturan: string;
  jelaskanVariasi: string;

  // C. SDM
  adaKoordinator: string;
  peranKoordinator: string;
  peranKoordinatorOther: string;
  cakupanKoordinator: string;
  kontakKoordinator: string;
  statusPelatih: string;
  levelPelatih: string;
  kontakPelatih: string;
  jadwalLatihan: string;
  adaPakar: string;
  kategoriPakar: string[];
  kategoriPakarOther: string;
  kontakPakar: string;
  adaBukti: string;
}

interface Section2EntryProps {
  entryNumber: number;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export default function Section2Entry({ entryNumber, onRemove, showRemoveButton = true }: Section2EntryProps) {
  const [formData, setFormData] = useState<Section2Data>({
    kategori: "",
    namaPROT: "",
    adaNamaLain: "",
    variasiNama: "",
    lokasi: [],
    lokasiOther: "",
    kelengkapanLokasi: "",
    alamatLengkap: "",
    koordinatGPS: "",
    statusAturan: "",
    sumberRujukan: [],
    sumberRujukanOther: "",
    ringkasanAturan: "",
    adaVariasiAturan: "",
    jelaskanVariasi: "",
    adaKoordinator: "",
    peranKoordinator: "",
    peranKoordinatorOther: "",
    cakupanKoordinator: "",
    kontakKoordinator: "",
    statusPelatih: "",
    levelPelatih: "",
    kontakPelatih: "",
    jadwalLatihan: "",
    adaPakar: "",
    kategoriPakar: [],
    kategoriPakarOther: "",
    kontakPakar: "",
    adaBukti: ""
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-6 mb-8 border-2 border-blue-200 shadow-lg">
      {/* Header Entri */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-blue-700">
          📝 Entri PR/OT #{entryNumber}
        </h3>
        {showRemoveButton && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold flex items-center gap-2"
          >
            🗑️ Hapus Entri
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* === SECTION A: IDENTITAS PR/OT === */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
            A. Identitas PR/OT
          </h4>

          <QuestionCard
            title="Kategori data yang Anda input"
            required={true}
            icon="🎭"
          >
            <RadioGroup
              name={`kategori-${entryNumber}`}
              options={[
                { value: "pr", label: "Permainan Rakyat (PR)" },
                { value: "ot", label: "Olahraga Tradisional (OT)" },
                { value: "keduanya", label: "Keduanya" }
              ]}
              value={formData.kategori}
              onChange={(value) => setFormData({ ...formData, kategori: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Nama PR/OT (nama lokal)"
            required={true}
            icon="✏️"
          >
            <InputField
              label=""
              value={formData.namaPROT}
              onChange={(value) => setFormData({ ...formData, namaPROT: value })}
              placeholder="Contoh: Gobak Sodor, Egrang, dll."
            />
          </QuestionCard>

          <QuestionCard
            title="Apakah PR/OT ini memiliki nama lain (variasi nama)?"
            required={true}
            icon="🔄"
          >
            <RadioGroup
              name={`adaNamaLain-${entryNumber}`}
              options={[
                { value: "ya", label: "Ya" },
                { value: "tidak", label: "Tidak" },
                { value: "tidak_tahu", label: "Tidak tahu" }
              ]}
              value={formData.adaNamaLain}
              onChange={(value) => setFormData({ ...formData, adaNamaLain: value })}
            />
          </QuestionCard>

          {formData.adaNamaLain === "ya" && (
            <QuestionCard
              title="Sebutkan variasi nama lainnya"
              required={false}
              icon="📝"
            >
              <InputField
                label=""
                value={formData.variasiNama}
                onChange={(value) => setFormData({ ...formData, variasiNama: value })}
                placeholder="Contoh: Galah Asin, Hadang, dll."
              />
            </QuestionCard>
          )}

          <QuestionCard
            title="Lokasi utama PR/OT ini dimainkan/dilatihkan"
            required={true}
            icon="📍"
          >
            <CheckboxGroup
              name={`lokasi-${entryNumber}`}
              options={[
                { value: "lapangan", label: "Lapangan terbuka" },
                { value: "sekolah", label: "Halaman sekolah" },
                { value: "balai", label: "Balai desa/gedung serbaguna" },
                { value: "jalan", label: "Jalan/ruang publik" },
                { value: "pantai", label: "Pantai/sungai" },
                { value: "pegunungan", label: "Area pegunungan/hutan" }
              ]}
              values={formData.lokasi}
              onChange={(values) => setFormData({ ...formData, lokasi: values })}
              hasOther={true}
              otherValue={formData.lokasiOther}
              onOtherChange={(value) => setFormData({ ...formData, lokasiOther: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Seberapa lengkap informasi lokasi yang tersedia?"
            required={true}
            icon="🗺️"
          >
            <RadioGroup
              name={`kelengkapanLokasi-${entryNumber}`}
              options={[
                { value: "alamat", label: "Ada alamat lengkap" },
                { value: "gps", label: "Ada koordinat GPS" },
                { value: "nama", label: "Hanya nama wilayah (tanpa detail alamat)" },
                { value: "tidak_tahu", label: "Tidak diketahui" }
              ]}
              value={formData.kelengkapanLokasi}
              onChange={(value) => setFormData({ ...formData, kelengkapanLokasi: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Tulis alamat lengkap/patokan lokasi (Opsional)"
            required={false}
            icon="🏠"
          >
            <TextArea
              label=""
              value={formData.alamatLengkap}
              onChange={(value) => setFormData({ ...formData, alamatLengkap: value })}
              placeholder="Contoh: Lapangan Desa Sukamaju, Jl. Raya No. 12, dekat masjid Al-Falah"
              rows={3}
            />
          </QuestionCard>

          <QuestionCard
            title="Koordinat GPS (jika ada) (Opsional)"
            required={false}
            icon="🌐"
          >
            <InputField
              label=""
              value={formData.koordinatGPS}
              onChange={(value) => setFormData({ ...formData, koordinatGPS: value })}
              placeholder="Contoh: -6.9175, 107.6191"
            />
          </QuestionCard>
        </div>

        {/* === SECTION B: ATURAN BAKU === */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-red-300 pb-2">
            B. Aturan Baku
          </h4>

          <QuestionCard
            title="Status 'aturan baku' PR/OT ini"
            required={true}
            icon="📜"
          >
            <RadioGroup
              name={`statusAturan-${entryNumber}`}
              options={[
                { value: "baku", label: "Sudah baku dan digunakan luas" },
                { value: "variasi", label: "Ada pedoman, tapi sering terjadi variasi" },
                { value: "belum", label: "Belum baku (berbeda tiap desa/kelompok)" },
                { value: "tidak_tahu", label: "Tidak diketahui" }
              ]}
              value={formData.statusAturan}
              onChange={(value) => setFormData({ ...formData, statusAturan: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Sumber rujukan aturan main yang digunakan"
            required={true}
            icon="📚"
          >
            <CheckboxGroup
              name={`sumberRujukan-${entryNumber}`}
              options={[
                { value: "lisan", label: "Tradisi lisan (tetua/pakar)" },
                { value: "dokumen", label: "Dokumen komunitas (catatan/pedoman)" },
                { value: "buku", label: "Buku/artikel/penelitian" },
                { value: "peraturan", label: "Peraturan daerah/SK/Instruksi" },
                { value: "video", label: "Video/arsip dokumentasi" }
              ]}
              values={formData.sumberRujukan}
              onChange={(values) => setFormData({ ...formData, sumberRujukan: values })}
              hasOther={true}
              otherValue={formData.sumberRujukanOther}
              onOtherChange={(value) => setFormData({ ...formData, sumberRujukanOther: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Ringkas aturan main (jumlah pemain, durasi, cara menang, skor, larangan utama)"
            required={true}
            icon="📋"
          >
            <TextArea
              label=""
              value={formData.ringkasanAturan}
              onChange={(value) => setFormData({ ...formData, ringkasanAturan: value })}
              placeholder="Contoh: Dimainkan 2 tim @ 3-5 orang. Durasi 15-30 menit. Menang jika berhasil melewati semua garis tanpa tertangkap. Larangan: tidak boleh keluar dari garis permainan."
              rows={5}
            />
          </QuestionCard>

          <QuestionCard
            title="Apakah ada variasi aturan antar desa/kelompok?"
            required={true}
            icon="🔀"
          >
            <RadioGroup
              name={`adaVariasiAturan-${entryNumber}`}
              options={[
                { value: "ada", label: "Ada" },
                { value: "tidak", label: "Tidak ada" },
                { value: "tidak_tahu", label: "Tidak tahu" }
              ]}
              value={formData.adaVariasiAturan}
              onChange={(value) => setFormData({ ...formData, adaVariasiAturan: value })}
            />
          </QuestionCard>

          {formData.adaVariasiAturan === "ada" && (
            <QuestionCard
              title="Jelaskan variasinya singkat (Opsional)"
              required={false}
              icon="💬"
            >
              <TextArea
                label=""
                value={formData.jelaskanVariasi}
                onChange={(value) => setFormData({ ...formData, jelaskanVariasi: value })}
                placeholder="Contoh: Di desa A menggunakan 5 garis, di desa B menggunakan 7 garis"
                rows={3}
              />
            </QuestionCard>
          )}
        </div>

        {/* === SECTION C: SDM === */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-orange-300 pb-2">
            C. SDM (Koordinator/Pelatih/Pakar)
          </h4>

          <QuestionCard
            title="Apakah ada koordinator/penggerak utama PR/OT di wilayah ini?"
            required={true}
            icon="👥"
          >
            <RadioGroup
              name={`adaKoordinator-${entryNumber}`}
              options={[
                { value: "ada", label: "Ada" },
                { value: "tidak", label: "Tidak ada" },
                { value: "tidak_tahu", label: "Tidak tahu" }
              ]}
              value={formData.adaKoordinator}
              onChange={(value) => setFormData({ ...formData, adaKoordinator: value })}
            />
          </QuestionCard>

          {formData.adaKoordinator === "ada" && (
            <>
              <QuestionCard
                title="Peran koordinator (Opsional)"
                required={false}
                icon="🎯"
              >
                <RadioGroup
                  name={`peranKoordinator-${entryNumber}`}
                  options={[
                    { value: "pengurus", label: "Pengurus daerah/cabang" },
                    { value: "ketua", label: "Ketua komunitas" },
                    { value: "guru", label: "Guru/pembina sekolah" },
                    { value: "tokoh", label: "Tokoh adat/budayawan" },
                    { value: "relawan", label: "Relawan pegiat" },
                    { value: "pemda", label: "Pemda/instansi pembina" }
                  ]}
                  value={formData.peranKoordinator}
                  onChange={(value) => setFormData({ ...formData, peranKoordinator: value })}
                  hasOther={true}
                  otherValue={formData.peranKoordinatorOther}
                  onOtherChange={(value) => setFormData({ ...formData, peranKoordinatorOther: value })}
                />
              </QuestionCard>

              <QuestionCard
                title="Cakupan wilayah koordinator (Opsional)"
                required={false}
                icon="🗺️"
              >
                <RadioGroup
                  name={`cakupanKoordinator-${entryNumber}`}
                  options={[
                    { value: "desa", label: "Desa/Kelurahan" },
                    { value: "kecamatan", label: "Kecamatan" },
                    { value: "kabkota", label: "Kab/Kota" },
                    { value: "provinsi", label: "Provinsi" }
                  ]}
                  value={formData.cakupanKoordinator}
                  onChange={(value) => setFormData({ ...formData, cakupanKoordinator: value })}
                />
              </QuestionCard>

              <QuestionCard
                title="Nama dan kontak koordinator (HP/WA) (Opsional)"
                required={false}
                icon="📞"
              >
                <InputField
                  label=""
                  value={formData.kontakKoordinator}
                  onChange={(value) => setFormData({ ...formData, kontakKoordinator: value })}
                  placeholder="Contoh: Budi Santoso - 081234567890"
                />
              </QuestionCard>
            </>
          )}

          <QuestionCard
            title="Status pelatih untuk PR/OT ini"
            required={true}
            icon="🏃"
          >
            <RadioGroup
              name={`statusPelatih-${entryNumber}`}
              options={[
                { value: "aktif", label: "Ada pelatih aktif (rutin)" },
                { value: "tidak_rutin", label: "Ada pelatih, namun tidak rutin" },
                { value: "tidak_ada", label: "Tidak ada pelatih khusus (belajar mandiri)" },
                { value: "tidak_tahu", label: "Tidak diketahui" }
              ]}
              value={formData.statusPelatih}
              onChange={(value) => setFormData({ ...formData, statusPelatih: value })}
            />
          </QuestionCard>

          {(formData.statusPelatih === "aktif" || formData.statusPelatih === "tidak_rutin") && (
            <>
              <QuestionCard
                title="Level pelatih (Opsional)"
                required={false}
                icon="⭐"
              >
                <RadioGroup
                  name={`levelPelatih-${entryNumber}`}
                  options={[
                    { value: "lokal", label: "Lokal/komunitas" },
                    { value: "sekolah", label: "Sekolah" },
                    { value: "kabkota", label: "Kab/Kota" },
                    { value: "provinsi", label: "Provinsi" }
                  ]}
                  value={formData.levelPelatih}
                  onChange={(value) => setFormData({ ...formData, levelPelatih: value })}
                />
              </QuestionCard>

              <QuestionCard
                title="Nama dan kontak pelatih utama (Opsional)"
                required={false}
                icon="📱"
              >
                <InputField
                  label=""
                  value={formData.kontakPelatih}
                  onChange={(value) => setFormData({ ...formData, kontakPelatih: value })}
                  placeholder="Contoh: Siti Rahma - 082345678901"
                />
              </QuestionCard>

              <QuestionCard
                title="Jadwal latihan (Opsional)"
                required={false}
                icon="🕐"
              >
                <InputField
                  label=""
                  value={formData.jadwalLatihan}
                  onChange={(value) => setFormData({ ...formData, jadwalLatihan: value })}
                  placeholder="Contoh: Senin-Rabu 16.00-18.00"
                />
              </QuestionCard>
            </>
          )}

          <QuestionCard
            title="Apakah ada pakar/pegiat senior yang menjadi rujukan PR/OT ini?"
            required={true}
            icon="🎓"
          >
            <RadioGroup
              name={`adaPakar-${entryNumber}`}
              options={[
                { value: "ada", label: "Ada" },
                { value: "tidak", label: "Tidak ada" },
                { value: "tidak_tahu", label: "Tidak tahu" }
              ]}
              value={formData.adaPakar}
              onChange={(value) => setFormData({ ...formData, adaPakar: value })}
            />
          </QuestionCard>

          {formData.adaPakar === "ada" && (
            <>
              <QuestionCard
                title="Kategori pakar/pegiat (Opsional)"
                required={false}
                icon="👨‍🏫"
              >
                <CheckboxGroup
                  name={`kategoriPakar-${entryNumber}`}
                  options={[
                    { value: "tetua", label: "Tetua adat/penjaga tradisi" },
                    { value: "budayawan", label: "Budayawan/peneliti" },
                    { value: "penggiat", label: "Penggiat komunitas senior" },
                    { value: "pengajar", label: "Pengajar/praktisi sekolah" },
                    { value: "pemain", label: "Pemain berprestasi/juara lokal" }
                  ]}
                  values={formData.kategoriPakar}
                  onChange={(values) => setFormData({ ...formData, kategoriPakar: values })}
                  hasOther={true}
                  otherValue={formData.kategoriPakarOther}
                  onOtherChange={(value) => setFormData({ ...formData, kategoriPakarOther: value })}
                />
              </QuestionCard>

              <QuestionCard
                title="Nama pakar/pegiat dan kontak (Opsional)"
                required={false}
                icon="📇"
              >
                <InputField
                  label=""
                  value={formData.kontakPakar}
                  onChange={(value) => setFormData({ ...formData, kontakPakar: value })}
                  placeholder="Contoh: H. Ahmad - 083456789012"
                />
              </QuestionCard>
            </>
          )}

          <QuestionCard
            title="Apakah tersedia bukti peran (foto kegiatan/sertifikat/berita)?"
            required={true}
            icon="📸"
          >
            <RadioGroup
              name={`adaBukti-${entryNumber}`}
              options={[
                { value: "ada", label: "Ada" },
                { value: "tidak", label: "Tidak ada" }
              ]}
              value={formData.adaBukti}
              onChange={(value) => setFormData({ ...formData, adaBukti: value })}
            />
          </QuestionCard>
        </div>
      </div>
    </div>
  );
}
