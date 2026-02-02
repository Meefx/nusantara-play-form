import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-red-500 to-orange-500 flex items-center justify-center p-4 relative">
      {/* Management Button - Top Right */}
      <Link
        href="/management/dashboard"
        className="absolute top-6 right-6 px-6 py-3 bg-white text-blue-600 rounded-full font-bold text-base hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform flex items-center gap-2"
      >
        🎯 Management
      </Link>

      <main className="text-center text-white max-w-3xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Pemetaan Permainan Rakyat & Olahraga Tradisional
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Selamat datang di platform survei untuk memetakan dan mendokumentasikan kekayaan permainan rakyat dan olahraga tradisional Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              href="/survey"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
            >
              🎯 Mulai Survei
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="font-bold text-lg mb-2">Permainan Rakyat</h3>
              <p className="text-sm text-white/80">Dokumentasi permainan tradisional dari seluruh Indonesia</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl mb-3">⚽</div>
              <h3 className="font-bold text-lg mb-2">Olahraga Tradisional</h3>
              <p className="text-sm text-white/80">Pelestarian olahraga asli nusantara</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="font-bold text-lg mb-2">Pemetaan Wilayah</h3>
              <p className="text-sm text-white/80">Data terstruktur per provinsi, kab/kota, hingga desa</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

