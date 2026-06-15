import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Paths
const envPath = path.resolve("../../apps/web/.env.local");

if (!fs.existsSync(envPath)) {
  console.error("❌ apps/web/.env.local not found!");
  process.exit(1);
}

// Parse env file manually
const envContent = fs.readFileSync(envPath, "utf-8");
let databaseUrl = "";

for (const line of envContent.split("\n")) {
  const match = line.match(/^\s*DATABASE_URL\s*=\s*["']?(.*?)["']?\s*$/);
  if (match) {
    databaseUrl = match[1];
    break;
  }
}

if (!databaseUrl) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

console.log("Found DATABASE_URL, starting migrations...");

try {
  // Generate migrations
  console.log("Generating migrations...");
  execSync("npx drizzle-kit generate", {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  });

  // Run migrations (since we are on neon, we can run migrate or push)
  console.log("Running migrations...");
  execSync("npx drizzle-kit migrate", {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: "inherit",
  });

  console.log("✅ Database migrations complete!");
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
}
