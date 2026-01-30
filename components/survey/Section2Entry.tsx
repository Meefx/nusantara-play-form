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

  // D. Komunitas & Aktivitas
  adaKomunitas: string;
  bentukKomunitas: string[];
  bentukKomunitasOther: string;
  statusKeaktifan: string;
  frekuensiKegiatan: string;
  jenisKegiatan: string[];
  jenisKegiatanOther: string;
  adaDokumentasi: string;

  // E. Alat, Sentra Produksi, Standardisasi, Dokumentasi
  adaPengrajin: string;
  skalaProduksi: string;
  kepemilikanAlat: string[];
  kondisiAlat: string;
  standardisasiAlat: string;
  dokumentasiAlat: string[];

  // F. Peran & Dukungan Pemda
  peranPemda: string;
  bentukPeranPemda: string[];
  bentukPeranPemdaOther: string;
  bentukDukungan: string[];
  bentukDukunganOther: string;
  buktiDukungan: string[];

  // G. Kondisi Kepengurusan
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
    adaBukti: "",
    adaKomunitas: "",
    bentukKomunitas: [],
    bentukKomunitasOther: "",
    statusKeaktifan: "",
    frekuensiKegiatan: "",
    jenisKegiatan: [],
    jenisKegiatanOther: "",
    adaDokumentasi: "",
    adaPengrajin: "",
    skalaProduksi: "",
    kepemilikanAlat: [],
    kondisiAlat: "",
    standardisasiAlat: "",
    dokumentasiAlat: [],
    peranPemda: "",
    bentukPeranPemda: [],
    bentukPeranPemdaOther: "",
    bentukDukungan: [],
    bentukDukunganOther: "",
    buktiDukungan: [],
    perkembangan: "",
    indikatorPerkembangan: [],
    indikatorPerkembanganOther: "",
    kegiatanBerjalan: [],
    kegiatanBerjalanOther: "",
    statusProgram: "",
    kendala: [],
    kendalaOther: "",
    dampakKendala: "",
    catatanTambahan: ""
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

        {/* === SECTION D: KOMUNITAS & AKTIVITAS === */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
            D. Komunitas & Aktivitas
          </h4>

          <QuestionCard
            title="Apakah ada komunitas/kelompok PR/OT di desa-desa wilayah ini?"
            required={true}
            icon="👥"
          >
            <RadioGroup
              name={`adaKomunitas-${entryNumber}`}
              options={[
                { value: "ada", label: "Ada" },
                { value: "tidak", label: "Tidak ada" },
                { value: "tidak_tahu", label: "Tidak tahu" }
              ]}
              value={formData.adaKomunitas}
              onChange={(value) => setFormData({ ...formData, adaKomunitas: value })}
            />
          </QuestionCard>

          {formData.adaKomunitas === "ada" && (
            <QuestionCard
              title="Bentuk komunitas yang paling sesuai (Opsional)"
              required={false}
              icon="🏘️"
            >
              <CheckboxGroup
                name={`bentukKomunitas-${entryNumber}`}
                options={[
                  { value: "informal", label: "Kelompok informal (warga)" },
                  { value: "sanggar", label: "Sanggar/komunitas terdaftar" },
                  { value: "ekskul", label: "Ekstrakurikuler sekolah" },
                  { value: "klub", label: "Klub/organisasi olahraga" },
                  { value: "adat", label: "Kelompok adat/budaya" }
                ]}
                values={formData.bentukKomunitas}
                onChange={(values) => setFormData({ ...formData, bentukKomunitas: values })}
                hasOther={true}
                otherValue={formData.bentukKomunitasOther}
                onOtherChange={(value) => setFormData({ ...formData, bentukKomunitasOther: value })}
              />
            </QuestionCard>
          )}

          <QuestionCard
            title="Status keaktifan komunitas"
            required={true}
            icon="⚡"
          >
            <RadioGroup
              name={`statusKeaktifan-${entryNumber}`}
              options={[
                { value: "aktif", label: "Aktif (ada agenda rutin)" },
                { value: "sesekali", label: "Sesekali aktif (musiman)" },
                { value: "tidak_aktif", label: "Tidak aktif" },
                { value: "baru", label: "Baru terbentuk" },
                { value: "tidak_tahu", label: "Tidak diketahui" }
              ]}
              value={formData.statusKeaktifan}
              onChange={(value) => setFormData({ ...formData, statusKeaktifan: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Frekuensi kegiatan/latihan"
            required={true}
            icon="📅"
          >
            <RadioGroup
              name={`frekuensiKegiatan-${entryNumber}`}
              options={[
                { value: "harian", label: "Harian" },
                { value: "mingguan", label: "Mingguan" },
                { value: "bulanan", label: "Bulanan" },
                { value: "musiman", label: "Musiman (hari besar/festival)" },
                { value: "tidak_tentu", label: "Tidak tentu" },
                { value: "tidak_ada", label: "Tidak ada kegiatan" }
              ]}
              value={formData.frekuensiKegiatan}
              onChange={(value) => setFormData({ ...formData, frekuensiKegiatan: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Jenis kegiatan yang dilakukan"
            required={true}
            icon="🎪"
          >
            <CheckboxGroup
              name={`jenisKegiatan-${entryNumber}`}
              options={[
                { value: "latihan", label: "Latihan rutin" },
                { value: "lomba", label: "Lomba/turnamen" },
                { value: "festival", label: "Festival budaya/gelar seni" },
                { value: "edukasi", label: "Edukasi/pelatihan" },
                { value: "demonstrasi", label: "Demonstrasi/pentas" },
                { value: "sekolah", label: "Kegiatan sekolah" }
              ]}
              values={formData.jenisKegiatan}
              onChange={(values) => setFormData({ ...formData, jenisKegiatan: values })}
              hasOther={true}
              otherValue={formData.jenisKegiatanOther}
              onOtherChange={(value) => setFormData({ ...formData, jenisKegiatanOther: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Apakah tersedia dokumentasi kegiatan (foto/poster/berita/daftar hadir)?"
            required={true}
            icon="📷"
          >
            <RadioGroup
              name={`adaDokumentasi-${entryNumber}`}
              options={[
                { value: "ada", label: "Ada" },
                { value: "tidak", label: "Tidak ada" },
                { value: "akan", label: "Akan dilengkapi" }
              ]}
              value={formData.adaDokumentasi}
              onChange={(value) => setFormData({ ...formData, adaDokumentasi: value })}
            />
          </QuestionCard>
        </div>

        {/* === SECTION E: ALAT, SENTRA PRODUKSI, STANDARDISASI, DOKUMENTASI === */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-red-300 pb-2">
            E. Alat, Sentra Produksi, Standardisasi, Dokumentasi
          </h4>

          <QuestionCard
            title="Apakah ada pengrajin/UMKM yang membuat alat PR/OT di wilayah ini?"
            required={true}
            icon="🔨"
          >
            <RadioGroup
              name={`adaPengrajin-${entryNumber}`}
              options={[
                { value: "sentra", label: "Ada sentra pengrajin" },
                { value: "individu", label: "Ada pengrajin individu (tidak terpusat)" },
                { value: "tidak", label: "Tidak ada (alat dibuat sendiri)" },
                { value: "tidak_tahu", label: "Tidak diketahui" }
              ]}
              value={formData.adaPengrajin}
              onChange={(value) => setFormData({ ...formData, adaPengrajin: value })}
            />
          </QuestionCard>

          {(formData.adaPengrajin === "sentra" || formData.adaPengrajin === "individu") && (
            <QuestionCard
              title="Skala produksi rata-rata (Opsional)"
              required={false}
              icon="📊"
            >
              <RadioGroup
                name={`skalaProduksi-${entryNumber}`}
                options={[
                  { value: "kecil", label: "Pesanan kecil (1-10 unit/bulan)" },
                  { value: "menengah", label: "Menengah (11-50 unit/bulan)" },
                  { value: "besar", label: "Besar (>50 unit/bulan)" },
                  { value: "tidak_tahu", label: "Tidak diketahui" }
                ]}
                value={formData.skalaProduksi}
                onChange={(value) => setFormData({ ...formData, skalaProduksi: value })}
              />
            </QuestionCard>
          )}

          <QuestionCard
            title="Status kepemilikan alat utama"
            required={true}
            icon="🏷️"
          >
            <CheckboxGroup
              name={`kepemilikanAlat-${entryNumber}`}
              options={[
                { value: "komunitas", label: "Milik komunitas" },
                { value: "desa", label: "Milik desa/kelurahan" },
                { value: "sekolah", label: "Milik sekolah" },
                { value: "individu", label: "Milik individu warga" },
                { value: "pinjam", label: "Pinjam/sewa" },
                { value: "campuran", label: "Campuran" }
              ]}
              values={formData.kepemilikanAlat}
              onChange={(values) => setFormData({ ...formData, kepemilikanAlat: values })}
            />
          </QuestionCard>

          <QuestionCard
            title="Kondisi alat secara umum"
            required={true}
            icon="🔧"
          >
            <RadioGroup
              name={`kondisiAlat-${entryNumber}`}
              options={[
                { value: "baik", label: "Baik (layak pakai)" },
                { value: "cukup", label: "Cukup (perlu perbaikan ringan)" },
                { value: "rusak", label: "Rusak (perlu penggantian)" },
                { value: "tidak_tahu", label: "Tidak diketahui" },
                { value: "tidak_ada", label: "Tidak ada alat khusus" }
              ]}
              value={formData.kondisiAlat}
              onChange={(value) => setFormData({ ...formData, kondisiAlat: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Apakah alat PR/OT ini sudah memiliki standardisasi ukuran/bahan?"
            required={true}
            icon="📏"
          >
            <RadioGroup
              name={`standardisasiAlat-${entryNumber}`}
              options={[
                { value: "standar", label: "Sudah standar (jelas ukuran/bahan)" },
                { value: "fleksibel", label: "Ada acuan, tapi fleksibel" },
                { value: "belum", label: "Belum ada standar" },
                { value: "tidak_relevan", label: "Tidak relevan (alat sederhana/umum)" },
                { value: "tidak_tahu", label: "Tidak diketahui" }
              ]}
              value={formData.standardisasiAlat}
              onChange={(value) => setFormData({ ...formData, standardisasiAlat: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Dokumentasi alat tersedia dalam bentuk apa?"
            required={true}
            icon="📸"
          >
            <CheckboxGroup
              name={`dokumentasiAlat-${entryNumber}`}
              options={[
                { value: "foto_lengkap", label: "Foto lengkap" },
                { value: "foto_sebagian", label: "Foto sebagian" },
                { value: "video", label: "Video" },
                { value: "tidak_ada", label: "Tidak ada dokumentasi" },
                { value: "akan", label: "Akan dilengkapi" }
              ]}
              values={formData.dokumentasiAlat}
              onChange={(values) => setFormData({ ...formData, dokumentasiAlat: values })}
            />
          </QuestionCard>
        </div>

        {/* === SECTION F: PERAN & DUKUNGAN PEMDA === */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-orange-300 pb-2">
            F. Peran & Dukungan Pemda
          </h4>

          <QuestionCard
            title="Apakah pemerintah daerah berperan dalam pengembangan PR/OT ini?"
            required={true}
            icon="🏛️"
          >
            <RadioGroup
              name={`peranPemda-${entryNumber}`}
              options={[
                { value: "ya", label: "Ya" },
                { value: "tidak", label: "Tidak" },
                { value: "tidak_tahu", label: "Tidak tahu" }
              ]}
              value={formData.peranPemda}
              onChange={(value) => setFormData({ ...formData, peranPemda: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Bentuk peran pemerintah daerah yang pernah/masih dilakukan"
            required={true}
            icon="📋"
          >
            <CheckboxGroup
              name={`bentukPeranPemda-${entryNumber}`}
              options={[
                { value: "pembinaan", label: "Pembinaan/pendampingan" },
                { value: "fasilitasi", label: "Fasilitasi event/kompetisi" },
                { value: "sarana", label: "Penyediaan sarana/venue" },
                { value: "anggaran", label: "Penyediaan anggaran/hibah" },
                { value: "promosi", label: "Promosi (media/publikasi)" },
                { value: "regulasi", label: "Regulasi/SK/Perda" },
                { value: "kemitraan", label: "Kemitraan dengan sekolah/komunitas" },
                { value: "belum", label: "Belum ada peran" }
              ]}
              values={formData.bentukPeranPemda}
              onChange={(values) => setFormData({ ...formData, bentukPeranPemda: values })}
              hasOther={true}
              otherValue={formData.bentukPeranPemdaOther}
              onOtherChange={(value) => setFormData({ ...formData, bentukPeranPemdaOther: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Bentuk dukungan yang paling sering diberikan"
            required={true}
            icon="🤝"
          >
            <CheckboxGroup
              name={`bentukDukungan-${entryNumber}`}
              options={[
                { value: "alat", label: "Bantuan alat" },
                { value: "dana", label: "Bantuan dana" },
                { value: "event", label: "Pengadaan event" },
                { value: "pelatihan", label: "Pelatihan SDM/pelatih" },
                { value: "transport", label: "Transport/akomodasi kegiatan" },
                { value: "dokumentasi", label: "Dokumentasi dan publikasi" },
                { value: "legalitas", label: "Legalitas/pendaftaran komunitas" }
              ]}
              values={formData.bentukDukungan}
              onChange={(values) => setFormData({ ...formData, bentukDukungan: values })}
              hasOther={true}
              otherValue={formData.bentukDukunganOther}
              onOtherChange={(value) => setFormData({ ...formData, bentukDukunganOther: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Apakah ada bukti dukungan?"
            required={true}
            icon="📄"
          >
            <CheckboxGroup
              name={`buktiDukungan-${entryNumber}`}
              options={[
                { value: "dokumen", label: "Ada dokumen (SK/nota dinas/LPJ)" },
                { value: "dokumentasi", label: "Ada dokumentasi (foto/berita)" },
                { value: "tidak", label: "Tidak ada bukti" }
              ]}
              values={formData.buktiDukungan}
              onChange={(values) => setFormData({ ...formData, buktiDukungan: values })}
            />
          </QuestionCard>
        </div>

        {/* === SECTION G: KONDISI KEPENGURUSAN === */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h4 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-300 pb-2">
            G. Kondisi Kepengurusan
          </h4>

          <QuestionCard
            title="Perkembangan PR/OT dalam 12-24 bulan terakhir"
            required={true}
            icon="📈"
          >
            <RadioGroup
              name={`perkembangan-${entryNumber}`}
              options={[
                { value: "meningkat", label: "Meningkat" },
                { value: "stabil", label: "Stabil" },
                { value: "menurun", label: "Menurun" },
                { value: "tidak_tahu", label: "Tidak diketahui" }
              ]}
              value={formData.perkembangan}
              onChange={(value) => setFormData({ ...formData, perkembangan: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Indikator perkembangan yang paling terlihat"
            required={true}
            icon="📊"
          >
            <CheckboxGroup
              name={`indikatorPerkembangan-${entryNumber}`}
              options={[
                { value: "pemain", label: "Jumlah pemain/anggota" },
                { value: "komunitas", label: "Jumlah komunitas aktif" },
                { value: "event", label: "Jumlah event/kompetisi" },
                { value: "dukungan", label: "Dukungan pemda/anggaran" },
                { value: "pelatih", label: "Ketersediaan pelatih" },
                { value: "alat", label: "Ketersediaan alat/venue" }
              ]}
              values={formData.indikatorPerkembangan}
              onChange={(values) => setFormData({ ...formData, indikatorPerkembangan: values })}
              hasOther={true}
              otherValue={formData.indikatorPerkembanganOther}
              onOtherChange={(value) => setFormData({ ...formData, indikatorPerkembanganOther: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Kegiatan yang saat ini sedang dilaksanakan"
            required={true}
            icon="🎯"
          >
            <CheckboxGroup
              name={`kegiatanBerjalan-${entryNumber}`}
              options={[
                { value: "latihan", label: "Latihan rutin" },
                { value: "pembinaan", label: "Pembinaan pelatih" },
                { value: "lomba", label: "Lomba/turnamen" },
                { value: "festival", label: "Festival/gelar budaya" },
                { value: "pendataan", label: "Pendataan dan dokumentasi" },
                { value: "pengadaan", label: "Pengadaan alat" },
                { value: "sosialisasi", label: "Sosialisasi di sekolah" }
              ]}
              values={formData.kegiatanBerjalan}
              onChange={(values) => setFormData({ ...formData, kegiatanBerjalan: values })}
              hasOther={true}
              otherValue={formData.kegiatanBerjalanOther}
              onOtherChange={(value) => setFormData({ ...formData, kegiatanBerjalanOther: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Status kegiatan/program saat ini"
            required={true}
            icon="⚙️"
          >
            <RadioGroup
              name={`statusProgram-${entryNumber}`}
              options={[
                { value: "perencanaan", label: "Perencanaan" },
                { value: "berjalan", label: "Sedang berjalan" },
                { value: "selesai", label: "Selesai (3 bulan terakhir)" },
                { value: "tertunda", label: "Tertunda" },
                { value: "tidak_ada", label: "Tidak ada program" }
              ]}
              value={formData.statusProgram}
              onChange={(value) => setFormData({ ...formData, statusProgram: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Kendala utama yang dihadapi"
            required={true}
            icon="⚠️"
          >
            <CheckboxGroup
              name={`kendala-${entryNumber}`}
              options={[
                { value: "sdm", label: "SDM (pelatih/pengurus minim)" },
                { value: "dana", label: "Dana/anggaran" },
                { value: "sarana", label: "Sarana/venue" },
                { value: "alat", label: "Alat (kurang/rusak)" },
                { value: "koordinasi", label: "Koordinasi dan organisasi" },
                { value: "dukungan", label: "Dukungan pemerintah minim" },
                { value: "regenerasi", label: "Regenerasi/minat anak muda menurun" },
                { value: "akses", label: "Akses lokasi/transport" },
                { value: "dokumentasi", label: "Dokumentasi minim" }
              ]}
              values={formData.kendala}
              onChange={(values) => setFormData({ ...formData, kendala: values })}
              hasOther={true}
              otherValue={formData.kendalaOther}
              onOtherChange={(value) => setFormData({ ...formData, kendalaOther: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Seberapa besar dampak kendala tersebut?"
            required={true}
            icon="💥"
          >
            <RadioGroup
              name={`dampakKendala-${entryNumber}`}
              options={[
                { value: "rendah", label: "Rendah" },
                { value: "sedang", label: "Sedang" },
                { value: "tinggi", label: "Tinggi" }
              ]}
              value={formData.dampakKendala}
              onChange={(value) => setFormData({ ...formData, dampakKendala: value })}
            />
          </QuestionCard>

          <QuestionCard
            title="Catatan tambahan/kebutuhan bantuan (Opsional)"
            required={false}
            icon="📝"
          >
            <TextArea
              label=""
              value={formData.catatanTambahan}
              onChange={(value) => setFormData({ ...formData, catatanTambahan: value })}
              placeholder="Tuliskan catatan tambahan atau kebutuhan bantuan yang diperlukan..."
              rows={5}
            />
          </QuestionCard>
        </div>
      </div>
    </div>
  );
}
