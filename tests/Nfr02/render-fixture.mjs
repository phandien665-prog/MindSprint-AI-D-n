import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const runId = process.env.NFR02_RUN_ID;
if (!runId || !/^[a-z0-9-]{6,40}$/i.test(runId)) throw new Error("Set NFR02_RUN_ID to the prepared fixture run ID.");
const outputDir = path.resolve("artifacts", "issue43", runId);
await mkdir(outputDir, { recursive: true });
const template = await readFile("tests/Nfr02/seed-fixture.sql", "utf8");
await writeFile(path.join(outputDir, "seed-fixture.sql"), template.replaceAll("{{RUN_ID}}", runId));
console.log(`Wrote disposable fixture SQL for ${runId}.`);
