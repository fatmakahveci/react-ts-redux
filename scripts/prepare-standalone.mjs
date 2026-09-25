import { access, cp } from "node:fs/promises";

// Match the Docker layout when running the production bundle locally.
await access(".next/standalone/server.js").catch(() => {
  throw new Error("Production build missing. Run npm run build before npm start.");
});
await cp(".next/static", ".next/standalone/.next/static", { recursive: true });
try {
  await access("public");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  process.exit(0);
}
await cp("public", ".next/standalone/public", { recursive: true });
