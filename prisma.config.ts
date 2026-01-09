import { defineConfig } from "@prisma/config";
import { config } from "dotenv";
import path from "path";

// IMPORTANT: load env explicitly
config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
