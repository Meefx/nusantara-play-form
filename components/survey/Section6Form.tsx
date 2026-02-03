"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuestionCard from "./QuestionCard";
import FileUpload from "./FileUpload";

interface Section6Data {
  fotoAlat: string[];
  fotoKegiatan: string[];
  videoPROT: string[];
}

interface SavedSurvey {
  section2: any;
  section3: any;
  section4: any;
  section5: any;
  section6: Section6Data;
  savedAt?: string;
}

export default function Section6Form() {
  const router = useRouter();
  const [formData, setFormData] = useState<Section6Data>({
    fotoAlat: [],
    fotoKegiatan: [],
    videoPROT: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState<number>(0);
  const [totalSavedSurveys, setTotalSavedSurveys] = useState<number>(0);

  // Load current survey index on mount
  useEffect(() => {
    const savedSurveys = localStorage.getItem('savedSurveys');
    if (savedSurveys) {
      const surveys = JSON.parse(savedSurveys);
      setTotalSavedSurveys(surveys.length);
      setCurrentSurveyIndex(surveys.length);
    }
  }, []);

  const handleSaveAndCreateNew = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get all current sections data
      const section2Raw = localStorage.getItem('surveySection2');
      const section3Raw = localStorage.getItem('surveySection3');
      const section4Raw = localStorage.getItem('surveySection4');
      const section5Raw = localStorage.getItem('surveySection5');

      if (!section2Raw || !section3Raw || !section4Raw || !section5Raw) {
        throw new Error('Mohon lengkapi semua section sebelum melanjutkan');
      }

      // Save current survey to array
      const savedSurveysRaw = localStorage.getItem('savedSurveys');
      const savedSurveys: SavedSurvey[] = savedSurveysRaw ? JSON.parse(savedSurveysRaw) : [];
      
      savedSurveys.push({
        section2: JSON.parse(section2Raw),
        section3: JSON.parse(section3Raw),
        section4: JSON.parse(section4Raw),
        section5: JSON.parse(section5Raw),
        section6: {
          fotoAlat: formData.fotoAlat,
          fotoKegiatan: formData.fotoKegiatan,
          videoPROT: formData.videoPROT,
        },
        savedAt: new Date().toISOString()
      });

      localStorage.setItem('savedSurveys', JSON.stringify(savedSurveys));

      // Clear Section 2-6 for new entry
      localStorage.removeItem('surveySection2');
      localStorage.removeItem('surveySection3');
      localStorage.removeItem('surveySection4');
      localStorage.removeItem('surveySection5');

      // Navigate to Section 2 for new entry
      alert(`✅ Survey PR/OT #${savedSurveys.length} berhasil disimpan! Lanjutkan untuk PR/OT berikutnya.`);
      router.push('/survey/section2');
    } catch (error) {
      console.error('Error saving survey:', error);
      setSubmitError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get all previous sections data from localStorage
      const section1Raw = localStorage.getItem('surveySection1');
      const section2Raw = localStorage.getItem('surveySection2');
      const section3Raw = localStorage.getItem('surveySection3');
      const section4Raw = localStorage.getItem('surveySection4');
      const section5Raw = localStorage.getItem('surveySection5');
      
      if (!section1Raw) {
        throw new Error('Data Section 1 tidak ditemukan. Silakan kembali ke Section 1.');
      }

      // Get all saved surveys
      const savedSurveysRaw = localStorage.getItem('savedSurveys');
      const savedSurveys: SavedSurvey[] = savedSurveysRaw ? JSON.parse(savedSurveysRaw) : [];

      // Add current survey if it has data
      if (section2Raw && section3Raw && section4Raw && section5Raw) {
        savedSurveys.push({
          section2: JSON.parse(section2Raw),
          section3: JSON.parse(section3Raw),
          section4: JSON.parse(section4Raw),
          section5: JSON.parse(section5Raw),
          section6: {
            fotoAlat: formData.fotoAlat,
            fotoKegiatan: formData.fotoKegiatan,
            videoPROT: formData.videoPROT,
          },
        });
      }

      if (savedSurveys.length === 0) {
        throw new Error('Tidak ada data survey untuk disimpan');
      }

      const section1 = JSON.parse(section1Raw);

      // Submit all surveys
      const submissions = await Promise.all(
        savedSurveys.map(async (survey: SavedSurvey, index: number) => {
          const surveyData = {
            status: "completed",
            section1,
            section2: survey.section2,
            section3: survey.section3,
            section4: survey.section4,
            section5: survey.section5,
            section6: survey.section6,
          };

          const response = await fetch('/api/survey', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(surveyData),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || `Gagal menyimpan survey #${index + 1}`);
          }

          return result;
        })
      );

      // Clear all localStorage after successful submission
      localStorage.removeItem('surveySection1');
      localStorage.removeItem('surveySection2');
      localStorage.removeItem('surveySection3');
      localStorage.removeItem('surveySection4');
      localStorage.removeItem('surveySection5');
      localStorage.removeItem('savedSurveys');

      // Show success message and redirect to home
      alert(`✅ Berhasil! Semua survey (${savedSurveys.length} PR/OT) telah tersimpan. Terima kasih atas partisipasi Anda!`);
      router.push('/');
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmitError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-6 px-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">SECTION 6 - Dokumentasi PR/OT</h2>
            <p className="text-white/90 mt-2">
              Unggah foto dan video dokumentasi PR/OT Anda
            </p>
          </div>
          {totalSavedSurveys > 0 && (
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-white font-bold text-lg">Survey PR/OT #{currentSurveyIndex + 1}</p>
              <p className="text-white/90 text-sm">{totalSavedSurveys} survey tersimpan</p>
            </div>
          )}
        </div>
      </div>

      {/* Info: Multiple Surveys */}
      {totalSavedSurveys > 0 && (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg px-4 py-3">
          <p className="text-green-800 font-semibold">
            ✅ Anda sudah menyimpan {totalSavedSurveys} survey PR/OT. Survey ini belum di-submit ke server.
          </p>
          <p className="text-sm text-green-700 mt-1">
            Klik <strong>"Selesai & Simpan Survey"</strong> untuk submit semua ({totalSavedSurveys + 1} survey) ke database.
          </p>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {submitError}
        </div>
      )}

      {/* Foto alat PR/OT */}
      <QuestionCard
        title="Foto alat PR/OT"
        required={true}
        icon="📷"
        description="Unggah foto alat-alat yang digunakan dalam PR/OT"
      >
        <FileUpload
          prefix="foto-alat"
          initialFiles={formData.fotoAlat}
          onFilesChange={(files) => setFormData({ ...formData, fotoAlat: files })}
          maxFiles={5}
        />
        <p className="text-sm text-gray-500 mt-2">Format: JPG, PNG, atau JPEG. Maksimal 5 foto.</p>
      </QuestionCard>

      {/* Foto PR/OT berlangsung */}
      <QuestionCard
        title="Foto PR/OT berlangsung"
        required={true}
        icon="📸"
        description="Unggah foto kegiatan PR/OT saat sedang berlangsung"
      >
        <FileUpload
          prefix="foto-kegiatan"
          initialFiles={formData.fotoKegiatan}
          onFilesChange={(files) => setFormData({ ...formData, fotoKegiatan: files })}
          maxFiles={5}
        />
        <p className="text-sm text-gray-500 mt-2">Format: JPG, PNG, atau JPEG. Maksimal 5 foto.</p>
      </QuestionCard>

      {/* Video PR/OT */}
      <QuestionCard
        title="Video PR/OT (jika ada)"
        required={false}
        icon="🎥"
        description="Unggah video dokumentasi PR/OT (opsional)"
      >
        <FileUpload
          prefix="video-prot"
          initialFiles={formData.videoPROT}
          onFilesChange={(files) => setFormData({ ...formData, videoPROT: files })}
          maxFiles={2}
        />
        <p className="text-sm text-gray-500 mt-2">Format: MP4, MOV, atau AVI. Maksimal 2 video. Ukuran maksimal 50MB per file.</p>
      </QuestionCard>

      {/* Success Message */}
      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <h3 className="font-bold text-lg mb-1">Semua Survey Berhasil Disimpan!</h3>
              <p className="text-green-700">Total {totalSavedSurveys + 1} survey PR/OT telah tersimpan di database.</p>
              <p className="text-green-600 mt-2">Terima kasih atas partisipasi Anda!</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {!isSuccess && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pt-8">
            <button
              type="button"
              onClick={() => router.push('/survey/section5')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-semibold"
            >
              ← Kembali ke Section 5
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveAndCreateNew}
                disabled={isSubmitting}
                className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isSubmitting ? '⏳ Menyimpan...' : '🎮 Simpan & Buat PR/OT Baru'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className={`px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-green-700 hover:to-blue-700'
                }`}
              >
                {isSubmitting ? '⏳ Menyimpan...' : `✅ Selesai & Simpan ${totalSavedSurveys > 0 ? `Semua (${totalSavedSurveys + 1} Survey)` : 'Survey'}`}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <p className="text-sm text-blue-800">
              💡 <strong>Tips:</strong> Jika responden memiliki lebih dari satu PR/OT, gunakan tombol <strong>"Simpan & Buat PR/OT Baru"</strong> untuk melanjutkan input PR/OT berikutnya. Data responden (Section 1) akan tetap tersimpan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
