// Data Wilayah Indonesia (34 Provinsi)
// Format: provinsi -> kabupaten/kota -> kecamatan -> kelurahan/desa

export interface Kelurahan {
  value: string;
  label: string;
}

export interface Kecamatan {
  value: string;
  label: string;
  kelurahan: Kelurahan[];
}

export interface KabupatenKota {
  value: string;
  label: string;
  kecamatan: Kecamatan[];
}

export interface Provinsi {
  value: string;
  label: string;
  kabupatenKota: KabupatenKota[];
}

export const wilayahData: Provinsi[] = [
  {
    value: "dki_jakarta",
    label: "DKI Jakarta",
    kabupatenKota: [
      {
        value: "jakarta_pusat",
        label: "Jakarta Pusat",
        kecamatan: [
          {
            value: "gambir",
            label: "Gambir",
            kelurahan: [
              { value: "gambir", label: "Gambir" },
              { value: "cideng", label: "Cideng" },
              { value: "petojo_utara", label: "Petojo Utara" },
              { value: "petojo_selatan", label: "Petojo Selatan" },
              { value: "kebon_kelapa", label: "Kebon Kelapa" },
              { value: "duri_pulo", label: "Duri Pulo" }
            ]
          },
          {
            value: "tanah_abang",
            label: "Tanah Abang",
            kelurahan: [
              { value: "gelora", label: "Gelora" },
              { value: "bendungan_hilir", label: "Bendungan Hilir" },
              { value: "karet_tengsin", label: "Karet Tengsin" },
              { value: "petamburan", label: "Petamburan" },
              { value: "kebon_melati", label: "Kebon Melati" },
              { value: "kebon_kacang", label: "Kebon Kacang" },
              { value: "kampung_bali", label: "Kampung Bali" }
            ]
          },
          {
            value: "menteng",
            label: "Menteng",
            kelurahan: [
              { value: "menteng", label: "Menteng" },
              { value: "pegangsaan", label: "Pegangsaan" },
              { value: "cikini", label: "Cikini" },
              { value: "kebon_sirih", label: "Kebon Sirih" },
              { value: "gondangdia", label: "Gondangdia" }
            ]
          }
        ]
      },
      {
        value: "jakarta_utara",
        label: "Jakarta Utara",
        kecamatan: [
          {
            value: "penjaringan",
            label: "Penjaringan",
            kelurahan: [
              { value: "penjaringan", label: "Penjaringan" },
              { value: "pluit", label: "Pluit" },
              { value: "pejagalan", label: "Pejagalan" },
              { value: "kapuk_muara", label: "Kapuk Muara" },
              { value: "kamal_muara", label: "Kamal Muara" }
            ]
          },
          {
            value: "tanjung_priok",
            label: "Tanjung Priok",
            kelurahan: [
              { value: "tanjung_priok", label: "Tanjung Priok" },
              { value: "kebon_bawang", label: "Kebon Bawang" },
              { value: "sungai_bambu", label: "Sungai Bambu" },
              { value: "papanggo", label: "Papanggo" },
              { value: "warakas", label: "Warakas" }
            ]
          }
        ]
      },
      {
        value: "jakarta_barat",
        label: "Jakarta Barat",
        kecamatan: [
          {
            value: "kebon_jeruk",
            label: "Kebon Jeruk",
            kelurahan: [
              { value: "kebon_jeruk", label: "Kebon Jeruk" },
              { value: "sukabumi_utara", label: "Sukabumi Utara" },
              { value: "kelapa_dua", label: "Kelapa Dua" },
              { value: "duri_kepa", label: "Duri Kepa" }
            ]
          },
          {
            value: "grogol_petamburan",
            label: "Grogol Petamburan",
            kelurahan: [
              { value: "grogol", label: "Grogol" },
              { value: "tomang", label: "Tomang" },
              { value: "tanjung_duren_utara", label: "Tanjung Duren Utara" },
              { value: "tanjung_duren_selatan", label: "Tanjung Duren Selatan" }
            ]
          }
        ]
      },
      {
        value: "jakarta_selatan",
        label: "Jakarta Selatan",
        kecamatan: [
          {
            value: "tebet",
            label: "Tebet",
            kelurahan: [
              { value: "tebet_timur", label: "Tebet Timur" },
              { value: "tebet_barat", label: "Tebet Barat" },
              { value: "kebon_baru", label: "Kebon Baru" },
              { value: "bukit_duri", label: "Bukit Duri" },
              { value: "manggarai", label: "Manggarai" }
            ]
          },
          {
            value: "kebayoran_baru",
            label: "Kebayoran Baru",
            kelurahan: [
              { value: "gunung", label: "Gunung" },
              { value: "cipete_utara", label: "Cipete Utara" },
              { value: "cipete_selatan", label: "Cipete Selatan" },
              { value: "melawai", label: "Melawai" },
              { value: "petogogan", label: "Petogogan" }
            ]
          }
        ]
      },
      {
        value: "jakarta_timur",
        label: "Jakarta Timur",
        kecamatan: [
          {
            value: "matraman",
            label: "Matraman",
            kelurahan: [
              { value: "palmeriam", label: "Palmeriam" },
              { value: "kebon_manggis", label: "Kebon Manggis" },
              { value: "utan_kayu_utara", label: "Utan Kayu Utara" },
              { value: "utan_kayu_selatan", label: "Utan Kayu Selatan" }
            ]
          },
          {
            value: "jatinegara",
            label: "Jatinegara",
            kelurahan: [
              { value: "bali_mester", label: "Bali Mester" },
              { value: "kampung_melayu", label: "Kampung Melayu" },
              { value: "bidaracina", label: "Bidaracina" },
              { value: "cipinang_besar_selatan", label: "Cipinang Besar Selatan" }
            ]
          }
        ]
      }
    ]
  },
  {
    value: "jawa_barat",
    label: "Jawa Barat",
    kabupatenKota: [
      {
        value: "kota_bandung",
        label: "Kota Bandung",
        kecamatan: [
          {
            value: "coblong",
            label: "Coblong",
            kelurahan: [
              { value: "cipaganti", label: "Cipaganti" },
              { value: "dago", label: "Dago" },
              { value: "lebak_gede", label: "Lebak Gede" },
              { value: "lebak_siliwangi", label: "Lebak Siliwangi" },
              { value: "sadang_serang", label: "Sadang Serang" },
              { value: "sekeloa", label: "Sekeloa" }
            ]
          },
          {
            value: "sukasari",
            label: "Sukasari",
            kelurahan: [
              { value: "geger_kalong", label: "Geger Kalong" },
              { value: "isola", label: "Isola" },
              { value: "sarijadi", label: "Sarijadi" },
              { value: "sukarasa", label: "Sukarasa" }
            ]
          },
          {
            value: "cicendo",
            label: "Cicendo",
            kelurahan: [
              { value: "arjuna", label: "Arjuna" },
              { value: "husein_sastranegara", label: "Husein Sastranegara" },
              { value: "pajajaran", label: "Pajajaran" },
              { value: "pamoyanan", label: "Pamoyanan" },
              { value: "pasir_kaliki", label: "Pasir Kaliki" },
              { value: "sukaraja", label: "Sukaraja" }
            ]
          }
        ]
      },
      {
        value: "kab_bandung",
        label: "Kabupaten Bandung",
        kecamatan: [
          {
            value: "soreang",
            label: "Soreang",
            kelurahan: [
              { value: "soreang", label: "Soreang" },
              { value: "pamekaran", label: "Pamekaran" },
              { value: "cingcin", label: "Cingcin" },
              { value: "panyirapan", label: "Panyirapan" }
            ]
          },
          {
            value: "cicalengka",
            label: "Cicalengka",
            kelurahan: [
              { value: "cicalengka_wetan", label: "Cicalengka Wetan" },
              { value: "cicalengka_kulon", label: "Cicalengka Kulon" },
              { value: "nagreg", label: "Nagreg" },
              { value: "tenjolaya", label: "Tenjolaya" }
            ]
          }
        ]
      },
      {
        value: "kota_bogor",
        label: "Kota Bogor",
        kecamatan: [
          {
            value: "bogor_tengah",
            label: "Bogor Tengah",
            kelurahan: [
              { value: "paledang", label: "Paledang" },
              { value: "babakan", label: "Babakan" },
              { value: "tegallega", label: "Tegallega" },
              { value: "gudang", label: "Gudang" }
            ]
          },
          {
            value: "bogor_utara",
            label: "Bogor Utara",
            kelurahan: [
              { value: "tegal_gundil", label: "Tegal Gundil" },
              { value: "tanah_baru", label: "Tanah Baru" },
              { value: "bantarjati", label: "Bantarjati" },
              { value: "kedung_halang", label: "Kedung Halang" }
            ]
          }
        ]
      }
    ]
  },
  {
    value: "jawa_tengah",
    label: "Jawa Tengah",
    kabupatenKota: [
      {
        value: "kota_semarang",
        label: "Kota Semarang",
        kecamatan: [
          {
            value: "semarang_tengah",
            label: "Semarang Tengah",
            kelurahan: [
              { value: "kauman", label: "Kauman" },
              { value: "kranggan", label: "Kranggan" },
              { value: "purwodinatan", label: "Purwodinatan" },
              { value: "pekunden", label: "Pekunden" }
            ]
          },
          {
            value: "semarang_utara",
            label: "Semarang Utara",
            kelurahan: [
              { value: "bandarharjo", label: "Bandarharjo" },
              { value: "tanjung_mas", label: "Tanjung Mas" },
              { value: "panggung_lor", label: "Panggung Lor" }
            ]
          }
        ]
      },
      {
        value: "kota_surakarta",
        label: "Kota Surakarta (Solo)",
        kecamatan: [
          {
            value: "laweyan",
            label: "Laweyan",
            kelurahan: [
              { value: "laweyan", label: "Laweyan" },
              { value: "bumi", label: "Bumi" },
              { value: "penumping", label: "Penumping" },
              { value: "sondakan", label: "Sondakan" }
            ]
          }
        ]
      }
    ]
  },
  {
    value: "jawa_timur",
    label: "Jawa Timur",
    kabupatenKota: [
      {
        value: "kota_surabaya",
        label: "Kota Surabaya",
        kecamatan: [
          {
            value: "gubeng",
            label: "Gubeng",
            kelurahan: [
              { value: "gubeng", label: "Gubeng" },
              { value: "airlangga", label: "Airlangga" },
              { value: "mojo", label: "Mojo" },
              { value: "pucang_sewu", label: "Pucang Sewu" }
            ]
          },
          {
            value: "sukolilo",
            label: "Sukolilo",
            kelurahan: [
              { value: "keputih", label: "Keputih" },
              { value: "gebang_putih", label: "Gebang Putih" },
              { value: "klampis_ngasem", label: "Klampis Ngasem" },
              { value: "medokan_ayu", label: "Medokan Ayu" }
            ]
          }
        ]
      },
      {
        value: "kota_malang",
        label: "Kota Malang",
        kecamatan: [
          {
            value: "lowokwaru",
            label: "Lowokwaru",
            kelurahan: [
              { value: "lowokwaru", label: "Lowokwaru" },
              { value: "dinoyo", label: "Dinoyo" },
              { value: "tunggulwulung", label: "Tunggulwulung" },
              { value: "mojolangu", label: "Mojolangu" }
            ]
          }
        ]
      }
    ]
  },
  {
    value: "banten",
    label: "Banten",
    kabupatenKota: [
      {
        value: "kota_tangerang",
        label: "Kota Tangerang",
        kecamatan: [
          {
            value: "tangerang",
            label: "Tangerang",
            kelurahan: [
              { value: "sukasari", label: "Sukasari" },
              { value: "sukarasa", label: "Sukarasa" },
              { value: "babakan", label: "Babakan" }
            ]
          }
        ]
      },
      {
        value: "kota_tangerang_selatan",
        label: "Kota Tangerang Selatan",
        kecamatan: [
          {
            value: "serpong",
            label: "Serpong",
            kelurahan: [
              { value: "serpong", label: "Serpong" },
              { value: "ciater", label: "Ciater" },
              { value: "cilenggang", label: "Cilenggang" }
            ]
          }
        ]
      }
    ]
  },
  {
    value: "yogyakarta",
    label: "DI Yogyakarta",
    kabupatenKota: [
      {
        value: "kota_yogyakarta",
        label: "Kota Yogyakarta",
        kecamatan: [
          {
            value: "danurejan",
            label: "Danurejan",
            kelurahan: [
              { value: "bausasran", label: "Bausasran" },
              { value: "tegalpanggung", label: "Tegalpanggung" }
            ]
          },
          {
            value: "gondokusuman",
            label: "Gondokusuman",
            kelurahan: [
              { value: "baciro", label: "Baciro" },
              { value: "demangan", label: "Demangan" },
              { value: "kotabaru", label: "Kotabaru" },
              { value: "terban", label: "Terban" }
            ]
          }
        ]
      },
      {
        value: "kab_sleman",
        label: "Kabupaten Sleman",
        kecamatan: [
          {
            value: "depok",
            label: "Depok",
            kelurahan: [
              { value: "caturtunggal", label: "Caturtunggal" },
              { value: "condongcatur", label: "Condongcatur" },
              { value: "maguwoharjo", label: "Maguwoharjo" }
            ]
          }
        ]
      }
    ]
  },
  // Provinsi lainnya (untuk kelengkapan, tambahkan 28 provinsi lagi)
  { value: "aceh", label: "Aceh", kabupatenKota: [] },
  { value: "sumatera_utara", label: "Sumatera Utara", kabupatenKota: [] },
  { value: "sumatera_barat", label: "Sumatera Barat", kabupatenKota: [] },
  { value: "riau", label: "Riau", kabupatenKota: [] },
  { value: "kepulauan_riau", label: "Kepulauan Riau", kabupatenKota: [] },
  { value: "jambi", label: "Jambi", kabupatenKota: [] },
  { value: "sumatera_selatan", label: "Sumatera Selatan", kabupatenKota: [] },
  { value: "bangka_belitung", label: "Bangka Belitung", kabupatenKota: [] },
  { value: "bengkulu", label: "Bengkulu", kabupatenKota: [] },
  { value: "lampung", label: "Lampung", kabupatenKota: [] },
  { value: "bali", label: "Bali", kabupatenKota: [] },
  { value: "nusa_tenggara_barat", label: "Nusa Tenggara Barat", kabupatenKota: [] },
  { value: "nusa_tenggara_timur", label: "Nusa Tenggara Timur", kabupatenKota: [] },
  { value: "kalimantan_barat", label: "Kalimantan Barat", kabupatenKota: [] },
  { value: "kalimantan_tengah", label: "Kalimantan Tengah", kabupatenKota: [] },
  { value: "kalimantan_selatan", label: "Kalimantan Selatan", kabupatenKota: [] },
  { value: "kalimantan_timur", label: "Kalimantan Timur", kabupatenKota: [] },
  { value: "kalimantan_utara", label: "Kalimantan Utara", kabupatenKota: [] },
  { value: "sulawesi_utara", label: "Sulawesi Utara", kabupatenKota: [] },
  { value: "sulawesi_tengah", label: "Sulawesi Tengah", kabupatenKota: [] },
  { value: "sulawesi_selatan", label: "Sulawesi Selatan", kabupatenKota: [] },
  { value: "sulawesi_tenggara", label: "Sulawesi Tenggara", kabupatenKota: [] },
  { value: "gorontalo", label: "Gorontalo", kabupatenKota: [] },
  { value: "sulawesi_barat", label: "Sulawesi Barat", kabupatenKota: [] },
  { value: "maluku", label: "Maluku", kabupatenKota: [] },
  { value: "maluku_utara", label: "Maluku Utara", kabupatenKota: [] },
  { value: "papua", label: "Papua", kabupatenKota: [] },
  { value: "papua_barat", label: "Papua Barat", kabupatenKota: [] }
];

// Helper functions
export const getKabupatenKotaByProvinsi = (provinsiValue: string): KabupatenKota[] => {
  const provinsi = wilayahData.find(p => p.value === provinsiValue);
  return provinsi?.kabupatenKota || [];
};

export const getKecamatanByKabupatenKota = (provinsiValue: string, kabKotaValue: string): Kecamatan[] => {
  const provinsi = wilayahData.find(p => p.value === provinsiValue);
  const kabKota = provinsi?.kabupatenKota.find(k => k.value === kabKotaValue);
  return kabKota?.kecamatan || [];
};

export const getKelurahanByKecamatan = (
  provinsiValue: string,
  kabKotaValue: string,
  kecamatanValue: string
): Kelurahan[] => {
  const provinsi = wilayahData.find(p => p.value === provinsiValue);
  const kabKota = provinsi?.kabupatenKota.find(k => k.value === kabKotaValue);
  const kecamatan = kabKota?.kecamatan.find(kec => kec.value === kecamatanValue);
  return kecamatan?.kelurahan || [];
};
