import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-red-500 to-orange-500 p-4 relative overflow-x-hidden">
      {/* Management Button - Top Right */}
      <Link
        href="/management/dashboard"
        className="fixed top-6 right-6 px-6 py-3 bg-white text-blue-600 rounded-full font-bold text-base hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform flex items-center gap-2 z-50"
      >
        🎯 Management
      </Link>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <main className="max-w-6xl mx-auto py-8 md:py-12 relative z-10">
        {/* Logo KPOTI - Letakkan file logo di folder public dengan nama kpoti-logo.png */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-block bg-white rounded-full p-4 shadow-2xl">
            <img
              src="/Logo_KPOTI.jpg.jpeg"
              alt="Logo KPOTI"
              width="80"
              height="80"
              className="object-contain"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold">
            ✨ Survei Nasional 2025-2030
          </div>
        </div>

        {/* Hero Banner - Slogan */}
        <div className="mb-8 transform hover:scale-[1.02] transition-all duration-300">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-8 md:p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <p className="text-3xl md:text-5xl font-black tracking-tight mb-2">
                Salam KPOTI!
              </p>
              <p className="text-2xl md:text-4xl font-bold">
                &quot;Lestari Budayaku, Bugar Bangsaku&quot;
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                👋
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Kepada Pelestari Budaya</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Bapak/Ibu dan Rekan-rekan yang kami hormati, menyambut terbentuknya Kepengurusan KPOTI Pusat masa bakti 2025-2030, kami melakukan Pemetaan dan pemutakhiran data Permainan Rakyat (PR) dan Olahraga Tradisional (OT) di Indonesia.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
                🎯
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Tujuan Survei</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Langkah awal dalam perencanaan matang berdasarkan data akurat untuk implementasi visi dan program kerja KPOTI di semua tingkatan - Pusat, Provinsi, dan Kabupaten/Kota.
            </p>
          </div>
        </div>

        {/* Why This Matters Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-10 mb-8 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
              💡
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">Mengapa Ini Penting?</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Kita sering mendengar bahwa banyak permainan kita yang mulai hilang, namun kita jarang memiliki angka pasti tentang hal tersebut, di mana lokasinya, dan apa kendala utamanya.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-l-4 border-blue-500">
            <p className="text-gray-700 font-semibold text-lg">
              Survey ini adalah instrumen kita untuk &quot;mendengar&quot; langsung dari para Pegiat, Penggiat Komunitas PR dan OT, serta pemangku kepentingan lainnya di masyarakat.
            </p>
          </div>
        </div>

        {/* Impact & Commitment */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="font-bold text-xl mb-2 text-gray-800">Data Akurat</h3>
            <p className="text-gray-600 text-sm">Hasil survei menjadi dasar strategi dan aksi nyata KPOTI</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="font-bold text-xl mb-2 text-gray-800">Identitas Bangsa</h3>
            <p className="text-gray-600 text-sm">Bagian integral yang wajib dilestarikan</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="font-bold text-xl mb-2 text-gray-800">Industri Kreatif</h3>
            <p className="text-gray-600 text-sm">Motor penggerak ekonomi berbasis budaya</p>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-10 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-4 text-center">💫</div>
            <p className="text-xl md:text-2xl font-bold text-center leading-relaxed italic">
              &quot;Permainan Rakyat dan Olahraga Tradisional tidak lagi sekedar pelengkap seremonial, melainkan menjadi bagian integral dari identitas bangsa yang wajib dilestarikan dan motor penggerak industri kreatif berbasis budaya.&quot;
            </p>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Mari Bergerak Bersama! 🚀</h2>
            <p className="text-gray-600 text-lg">
              Kami mengajak seluruh pihak untuk menyebarkan survei ini. Mari kita kumpulkan PR dan OT sebagai jati diri bangsa yang tersebar di pelosok negeri ini.
            </p>
          </div>

          {/* Pantun Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 md:p-8 border-2 border-orange-200 mb-6">
            <div className="text-center mb-4">
              <span className="text-4xl">🪁</span>
            </div>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center font-medium italic">
              Gasing berputar merdu bergema,<br />
              Indah menari di atas papan.<br />
              <span className="font-bold text-orange-600">
                Mari lestarikan budaya kita bersama-sama,<br />
                Agar tumbuh ekonomi lokal di masa depan
              </span>
            </p>
          </div>

          {/* Signature */}
          <div className="text-center py-4">
            <p className="text-gray-600 mb-2">Terima kasih atas kerjasamanya</p>
            <p className="font-bold text-gray-800 text-lg">Salam hormat,</p>
            <p className="font-bold text-blue-600 text-xl">Pengurus KPOTI Pusat</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/survey"
            className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold text-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 transform shadow-xl"
          >
            <span className="text-2xl">📝</span>
            <span>Mulai Survei Sekarang</span>
            <span className="text-2xl">→</span>
          </Link>
          <p className="text-white mt-4 text-sm">Kontribusi Anda sangat berarti untuk Indonesia</p>
        </div>
      </main>
    </div>
  );
}

