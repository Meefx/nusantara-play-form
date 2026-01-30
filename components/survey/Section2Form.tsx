"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Section2Entry from "./Section2Entry";

export default function Section2Form() {
  const router = useRouter();
  const [entries, setEntries] = useState<number[]>([1]);

  const addEntry = () => {
    setEntries([...entries, entries.length + 1]);
  };

  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-6 px-6 rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          SECTION 2 - Entri Pemetaan PR/OT
        </h2>
        <p className="text-white/90">
          Isi Blok Pertanyaan berikut untuk setiap PR/OT. Jika PR/OT yang Anda input lebih dari 1, tambahkan entri baru dengan tombol di bawah.
        </p>
      </div>

      {/* Display all entries */}
      {entries.map((entryNum, index) => (
        <Section2Entry
          key={index}
          entryNumber={index + 1}
          onRemove={() => removeEntry(index)}
          showRemoveButton={entries.length > 1}
        />
      ))}

      {/* Add Entry Button */}
      <div className="flex justify-center pt-4">
        <button
          type="button"
          onClick={addEntry}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          ➕ Tambah Entri PR/OT Baru
        </button>
      </div>

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
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:from-blue-700 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          ✅ Selesai
        </button>
      </div>
    </div>
  );
}
