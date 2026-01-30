import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { success: false, error: "Password is required" },
                { status: 400 }
            );
        }

        const isValid = await verifyPassword(password);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: "Password salah" },
                { status: 401 }
            );
        }

        const token = await createToken();

        const response = NextResponse.json({
            success: true,
            message: "Login berhasil",
        });

        // Set cookie
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "Login gagal" },
            { status: 500 }
        );
    }
}
