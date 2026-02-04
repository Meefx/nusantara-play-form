"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagementLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || "Login gagal");
                return;
            }

            router.push("/management/dashboard");
        } catch {
            setError("Terjadi kesalahan saat login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🔐</div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Management Login
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Masukkan email dan password untuk mengakses dashboard
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="masukkan email"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Masukkan password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 ${isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:from-blue-700 hover:to-orange-600 hover:shadow-xl transform hover:-translate-y-0.5"
                            }`}
                        >
                            {isLoading ? "⏳ Memproses..." : "🔓 Login"}
                        </button>
                    </form>

                    {/* Back Link */}
                    <div className="text-center mt-6">
                        <a
                            href="/"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            ← Kembali ke halaman utama
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
