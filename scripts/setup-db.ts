import { ensureSchema } from "../lib/db-schema";

async function main() {
  console.log("Creating tables...");
  await ensureSchema();
  console.log("Done. Tables created successfully.");
}

main().catch((err) => {
  console.error("Failed to set up database:", err);
  process.exit(1);
});
