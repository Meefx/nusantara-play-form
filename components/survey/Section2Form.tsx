"use client";

import { useState, useCallback, useEffect } from "react";
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
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState<number>(0);
  const [totalSurveys, setTotalSurveys] = useState<number>(0);

  // Load saved surveys on mount
  useEffect(() => {
    const savedSurveys = localStorage.getItem('savedSurveys');
    if (savedSurveys) {
      const surveys = JSON.parse(savedSurveys);
      setTotalSurveys(surveys.length);
      setCurrentSurveyIndex(surveys.length);
    }
  }, []);

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
      namaPROT: data.namaPROT,
      jenisKategori: data.jenisKategori,
      statusAsalUsul: data.statusAsalUsul,
      lokasi: {
        provinsi: data.lokasiProvinsi,
        kabKota: data.lokasiKabKota,
        kecamatan: data.lokasiKecamatan,
        desa: data.lokasiDesa,
        alamatLengkap: data.alamatLengkap,
      },
      koordinator: {
        nama: data.koordinatorNama,
        hp: data.koordinatorHP,
        email: data.koordinatorEmail,
      },
      pelatih: {
        nama: data.pelatihNama,
        hp: data.pelatihHP,
        email: data.pelatihEmail,
      },
      peralatanPROT: data.peralatanPROT,
      caraBermain: data.caraBermain,
      nilaiMoral: data.nilaiMoral,
    };
  };

  const loadSurvey = (index: number) => {
    const savedSurveys = localStorage.getItem('savedSurveys');
    if (savedSurveys) {
      const surveys = JSON.parse(savedSurveys);
      if (surveys[index]) {
        // Load data from saved survey
        localStorage.setItem('surveySection2', surveys[index].section2);
        localStorage.setItem('surveySection3', surveys[index].section3);
        localStorage.setItem('surveySection4', surveys[index].section4);
        localStorage.setItem('surveySection5', surveys[index].section5);
        setCurrentSurveyIndex(index);
        // Refresh page to load data
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-6 px-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              SECTION 2 - Inventarisasi PR/OT
            </h2>
            <p className="text-white/90">
              Isi informasi berikut untuk setiap PR/OT. Jika PR/OT yang Anda input lebih dari 1, tambahkan entri baru dengan tombol di bawah.
            </p>
          </div>
          {totalSurveys > 0 && (
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-white font-bold text-lg">Survey PR/OT #{currentSurveyIndex + 1}</p>
              {totalSurveys > 0 && (
                <p className="text-white/90 text-sm">{totalSurveys} survey tersimpan</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation to Previous Surveys */}
      {totalSurveys > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-semibold mb-1">📋 Survey Sebelumnya</p>
              <p className="text-sm text-blue-600">Klik untuk melihat atau edit survey yang sudah diisi</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: totalSurveys }, (_, i) => (
                <button
                  key={i}
                  onClick={() => loadSurvey(i)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentSurveyIndex === i
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 hover:bg-blue-100 border border-blue-300'
                  }`}
                >
                  PR/OT #{i + 1}
                </button>
              ))}
            </div>
          </div>
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
          onClick={() => {
            // Simpan data Section 2 ke localStorage
            const section2Entries = entries.map((entryId, index) => {
              const data = entriesData.get(entryId);
              if (data) {
                return transformEntryData(data, index + 1);
              }
              return null;
            }).filter(Boolean);
            
            localStorage.setItem('surveySection2', JSON.stringify({ entries: section2Entries }));
            router.push('/survey/section3');
          }}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Lanjut ke Section 3 →
        </button>
      </div>
    </div>
  );
}
