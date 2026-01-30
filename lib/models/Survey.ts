import mongoose, { Schema, Document, Model } from "mongoose";

// === INTERFACES ===

interface IWilayahKerja {
    provinsi: string;
    kabKota: string;
    kecamatan: string;
    desaKelurahan: string;
}

interface IKontak {
    namaLengkap: string;
    nomorHP: string;
    instansi: string;
}

interface ISection1 {
    role: string;
    roleOther: string;
    wilayahKerja: IWilayahKerja;
    kontak: IKontak;
    jumlahPROT: string;
    jumlahPROTOther: string;
}

interface ILokasi {
    jenis: string[];
    lokasiOther: string;
    kelengkapanLokasi: string;
    alamatLengkap: string;
    koordinatGPS: string;
}

interface IIdentitas {
    kategori: string;
    namaPROT: string;
    adaNamaLain: string;
    variasiNama: string;
    lokasi: ILokasi;
}

interface IAturan {
    statusAturan: string;
    sumberRujukan: string[];
    sumberRujukanOther: string;
    ringkasanAturan: string;
    adaVariasiAturan: string;
    jelaskanVariasi: string;
}

interface IKoordinator {
    ada: string;
    peran: string;
    peranOther: string;
    cakupan: string;
    kontak: string;
}

interface IPelatih {
    status: string;
    level: string;
    kontak: string;
    jadwalLatihan: string;
}

interface IPakar {
    ada: string;
    kategori: string[];
    kategoriOther: string;
    kontak: string;
    adaBukti: string;
}

interface ISDM {
    koordinator: IKoordinator;
    pelatih: IPelatih;
    pakar: IPakar;
}

interface IKomunitasAktivitas {
    adaKomunitas: string;
    bentukKomunitas: string[];
    bentukKomunitasOther: string;
    statusKeaktifan: string;
    frekuensiKegiatan: string;
    jenisKegiatan: string[];
    jenisKegiatanOther: string;
    adaDokumentasi: string;
}

interface IAlatProduksi {
    adaPengrajin: string;
    skalaProduksi: string;
    kepemilikanAlat: string[];
    kondisiAlat: string;
    standardisasiAlat: string;
    dokumentasiAlat: string[];
}

interface IPeranPemda {
    adaPeran: string;
    bentukPeran: string[];
    bentukPeranOther: string;
    bentukDukungan: string[];
    bentukDukunganOther: string;
    buktiDukungan: string[];
}

interface IKondisiKepengurusan {
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

interface IEntry {
    entryNumber: number;
    identitas: IIdentitas;
    aturan: IAturan;
    sdm: ISDM;
    komunitasAktivitas: IKomunitasAktivitas;
    alatProduksi: IAlatProduksi;
    peranPemda: IPeranPemda;
    kondisiKepengurusan: IKondisiKepengurusan;
}

interface ISection2 {
    entries: IEntry[];
}

export interface ISurvey extends Document {
    submittedAt: Date;
    updatedAt: Date;
    status: "draft" | "completed";
    section1: ISection1;
    section2: ISection2;
}

// === SCHEMAS ===

const WilayahKerjaSchema = new Schema<IWilayahKerja>(
    {
        provinsi: { type: String, default: "" },
        kabKota: { type: String, default: "" },
        kecamatan: { type: String, default: "" },
        desaKelurahan: { type: String, default: "" },
    },
    { _id: false }
);

const KontakSchema = new Schema<IKontak>(
    {
        namaLengkap: { type: String, default: "" },
        nomorHP: { type: String, default: "" },
        instansi: { type: String, default: "" },
    },
    { _id: false }
);

const Section1Schema = new Schema<ISection1>(
    {
        role: { type: String, default: "" },
        roleOther: { type: String, default: "" },
        wilayahKerja: { type: WilayahKerjaSchema, default: () => ({}) },
        kontak: { type: KontakSchema, default: () => ({}) },
        jumlahPROT: { type: String, default: "" },
        jumlahPROTOther: { type: String, default: "" },
    },
    { _id: false }
);

const LokasiSchema = new Schema<ILokasi>(
    {
        jenis: { type: [String], default: [] },
        lokasiOther: { type: String, default: "" },
        kelengkapanLokasi: { type: String, default: "" },
        alamatLengkap: { type: String, default: "" },
        koordinatGPS: { type: String, default: "" },
    },
    { _id: false }
);

const IdentitasSchema = new Schema<IIdentitas>(
    {
        kategori: { type: String, default: "" },
        namaPROT: { type: String, default: "" },
        adaNamaLain: { type: String, default: "" },
        variasiNama: { type: String, default: "" },
        lokasi: { type: LokasiSchema, default: () => ({}) },
    },
    { _id: false }
);

const AturanSchema = new Schema<IAturan>(
    {
        statusAturan: { type: String, default: "" },
        sumberRujukan: { type: [String], default: [] },
        sumberRujukanOther: { type: String, default: "" },
        ringkasanAturan: { type: String, default: "" },
        adaVariasiAturan: { type: String, default: "" },
        jelaskanVariasi: { type: String, default: "" },
    },
    { _id: false }
);

const KoordinatorSchema = new Schema<IKoordinator>(
    {
        ada: { type: String, default: "" },
        peran: { type: String, default: "" },
        peranOther: { type: String, default: "" },
        cakupan: { type: String, default: "" },
        kontak: { type: String, default: "" },
    },
    { _id: false }
);

const PelatihSchema = new Schema<IPelatih>(
    {
        status: { type: String, default: "" },
        level: { type: String, default: "" },
        kontak: { type: String, default: "" },
        jadwalLatihan: { type: String, default: "" },
    },
    { _id: false }
);

const PakarSchema = new Schema<IPakar>(
    {
        ada: { type: String, default: "" },
        kategori: { type: [String], default: [] },
        kategoriOther: { type: String, default: "" },
        kontak: { type: String, default: "" },
        adaBukti: { type: String, default: "" },
    },
    { _id: false }
);

const SDMSchema = new Schema<ISDM>(
    {
        koordinator: { type: KoordinatorSchema, default: () => ({}) },
        pelatih: { type: PelatihSchema, default: () => ({}) },
        pakar: { type: PakarSchema, default: () => ({}) },
    },
    { _id: false }
);

const KomunitasAktivitasSchema = new Schema<IKomunitasAktivitas>(
    {
        adaKomunitas: { type: String, default: "" },
        bentukKomunitas: { type: [String], default: [] },
        bentukKomunitasOther: { type: String, default: "" },
        statusKeaktifan: { type: String, default: "" },
        frekuensiKegiatan: { type: String, default: "" },
        jenisKegiatan: { type: [String], default: [] },
        jenisKegiatanOther: { type: String, default: "" },
        adaDokumentasi: { type: String, default: "" },
    },
    { _id: false }
);

const AlatProduksiSchema = new Schema<IAlatProduksi>(
    {
        adaPengrajin: { type: String, default: "" },
        skalaProduksi: { type: String, default: "" },
        kepemilikanAlat: { type: [String], default: [] },
        kondisiAlat: { type: String, default: "" },
        standardisasiAlat: { type: String, default: "" },
        dokumentasiAlat: { type: [String], default: [] },
    },
    { _id: false }
);

const PeranPemdaSchema = new Schema<IPeranPemda>(
    {
        adaPeran: { type: String, default: "" },
        bentukPeran: { type: [String], default: [] },
        bentukPeranOther: { type: String, default: "" },
        bentukDukungan: { type: [String], default: [] },
        bentukDukunganOther: { type: String, default: "" },
        buktiDukungan: { type: [String], default: [] },
    },
    { _id: false }
);

const KondisiKepengurusanSchema = new Schema<IKondisiKepengurusan>(
    {
        perkembangan: { type: String, default: "" },
        indikatorPerkembangan: { type: [String], default: [] },
        indikatorPerkembanganOther: { type: String, default: "" },
        kegiatanBerjalan: { type: [String], default: [] },
        kegiatanBerjalanOther: { type: String, default: "" },
        statusProgram: { type: String, default: "" },
        kendala: { type: [String], default: [] },
        kendalaOther: { type: String, default: "" },
        dampakKendala: { type: String, default: "" },
        catatanTambahan: { type: String, default: "" },
    },
    { _id: false }
);

const EntrySchema = new Schema<IEntry>(
    {
        entryNumber: { type: Number, required: true },
        identitas: { type: IdentitasSchema, default: () => ({}) },
        aturan: { type: AturanSchema, default: () => ({}) },
        sdm: { type: SDMSchema, default: () => ({}) },
        komunitasAktivitas: { type: KomunitasAktivitasSchema, default: () => ({}) },
        alatProduksi: { type: AlatProduksiSchema, default: () => ({}) },
        peranPemda: { type: PeranPemdaSchema, default: () => ({}) },
        kondisiKepengurusan: { type: KondisiKepengurusanSchema, default: () => ({}) },
    },
    { _id: false }
);

const Section2Schema = new Schema<ISection2>(
    {
        entries: { type: [EntrySchema], default: [] },
    },
    { _id: false }
);

const SurveySchema = new Schema<ISurvey>(
    {
        submittedAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["draft", "completed"],
            default: "draft",
        },
        section1: { type: Section1Schema, default: () => ({}) },
        section2: { type: Section2Schema, default: () => ({}) },
    },
    {
        timestamps: true,
    }
);

// Indexes
SurveySchema.index({ submittedAt: -1 });
SurveySchema.index({ status: 1 });
SurveySchema.index({ "section1.wilayahKerja.provinsi": 1 });
SurveySchema.index({ "section1.wilayahKerja.kabKota": 1 });
SurveySchema.index({ "section2.entries.identitas.kategori": 1 });
SurveySchema.index({ "section2.entries.identitas.namaPROT": "text" });

const Survey: Model<ISurvey> =
    mongoose.models.Survey || mongoose.model<ISurvey>("Survey", SurveySchema);

export default Survey;
