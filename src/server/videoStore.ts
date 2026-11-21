import fs from "fs";
import path from "path";

// Vidéos ajoutées une à une depuis le panel (sans clé API). Modifiable via BEBETAB_VIDEOS_FILE.
export interface ManualVideo {
  id: string;        // identifiant YouTube, 11 caractères
  title: string;     // titre affiché, 140 caractères maximum
  category: string;  // rubrique : comptines, dessins_animes ou apprentissage
  addedAt: string;   // date ISO d'ajout
}

const STORE_FILE = process.env.BEBETAB_VIDEOS_FILE || path.join(process.cwd(), "data", "videos.json");
const CATEGORIES = ["comptines", "dessins_animes", "apprentissage"];

// Accepte un identifiant seul, ou un lien youtube.com / youtu.be (watch, shorts, embed).
export function parseVideoId(input: string): string | null {
  const text = input.trim();
  if (/^[\w-]{11}$/.test(text)) return text;
  try {
    const url = new URL(text);
    if (url.hostname === "youtu.be") return /^[\w-]{11}$/.test(url.pathname.slice(1)) ? url.pathname.slice(1) : null;
    if (!/(^|\.)youtube\.com$/.test(url.hostname)) return null;
    const v = url.searchParams.get("v");
    if (v && /^[\w-]{11}$/.test(v)) return v;
    const m = url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/);
    return m ? m[1] : null;
  } catch { return null; }
}

export function isValidManualVideo(v: unknown): v is ManualVideo {
  const x = v as Partial<ManualVideo> | null;
  return Boolean(x && typeof x.id === "string" && /^[\w-]{11}$/.test(x.id)
    && typeof x.title === "string" && x.title.trim().length > 0 && x.title.length <= 140
    && typeof x.category === "string" && CATEGORIES.includes(x.category)
    && typeof x.addedAt === "string");
}

export function readManualVideos(): ManualVideo[] {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed.filter(isValidManualVideo) : [];
  } catch { return []; }
}

export function writeManualVideos(list: ManualVideo[]): void {
  fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  const tmp = STORE_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2), "utf8");
  fs.renameSync(tmp, STORE_FILE);
}

export const VIDEO_CATEGORIES = CATEGORIES;
