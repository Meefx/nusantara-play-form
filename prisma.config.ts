import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local for local development (Next.js projects)
// On Vercel, environment variables are automatically available
config({ path: ".env.local" });

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
});
