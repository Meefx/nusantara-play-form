import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-secret-key"
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function verifyPassword(password: string): Promise<boolean> {
    return password === ADMIN_PASSWORD;
}

export async function createToken(): Promise<string> {
    const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

    return token;
}

export async function verifyToken(token: string): Promise<boolean> {
    try {
        await jwtVerify(token, JWT_SECRET);
        return true;
    } catch {
        return false;
    }
}

export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");
    return token?.value || null;
}

export async function isAuthenticated(): Promise<boolean> {
    const token = await getAuthToken();
    if (!token) return false;
    return verifyToken(token);
}
