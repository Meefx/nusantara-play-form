export default function SurveyHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-red-500 to-orange-500 text-white py-12 px-6 rounded-2xl shadow-2xl mb-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
          Pemetaan Permainan Rakyat (PR) dan Olahraga Tradisional (OT)
        </h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-3">📋 Catatan Pengisian:</h2>
          <ul className="space-y-2 text-sm md:text-base">
            <li className="flex items-start">
              <span className="mr-2 font-bold">1)</span>
              <span>Kuesioner ini ditujukan untuk Pengurus Daerah (Provinsi/Kab-Kota/Kecamatan/Desa).</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">2)</span>
              <span>Anda boleh mengisi lebih dari 1 (satu) entri PR/OT. Ulangi Blok Pertanyaan Section 2 untuk setiap PR/OT yang berbeda.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
