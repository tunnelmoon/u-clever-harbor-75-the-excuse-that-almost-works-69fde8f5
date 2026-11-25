// The Excuse That Almost Works
// One line a gamer texts the boss to skip work on GTA 6 launch week.
// The excuse never mentions the game: a boring, specific, verifiable
// workplace-adjacent detail is what a tired manager almost believes.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Council closed my street for resurfacing and my car's boxed in behind the steamroller till five";

const MAX_CHARS = 140;
const MAX_WORDS = 20;

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`entry must be 1 to ${MAX_CHARS} characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  const words = line.trim().split(/\s+/);
  if (words.length > MAX_WORDS) {
    throw new Error(`entry must be at most ${MAX_WORDS} words, got ${words.length}`);
  }
  if (line !== line.trim() || /\s{2,}/.test(line)) {
    throw new Error("entry must not have leading, trailing or doubled white space");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
validate(LINE);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip read-back: the file on disk must be byte for byte the line.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("round-trip read-back mismatch");
}
console.log(`wrote ${outPath} (${LINE.length} chars, ${LINE.trim().split(/\s+/).length} words)`);
