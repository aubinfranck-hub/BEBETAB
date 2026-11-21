import fs from "fs";
import path from "path";

export interface ChannelSource {
  id: string;        // identifiant YouTube de la chaîne, au format UC… (24 caractères)
  name: string;      // nom affiché aux enfants
  category: string;  // comptines, apprentissage, dessins_animes, sciences, art…
  enabled: boolean;  // désactivée = retirée de l'application sans être supprimée
}

export const CHANNEL_ID_PATTERN = /^UC[\w-]{22}$/;

// Fichier de réglages géré par le panel parent. Modifiable via BEBETAB_CHANNELS_FILE.
const STORE_FILE = process.env.BEBETAB_CHANNELS_FILE || path.join(process.cwd(), "data", "channels.json");

export function isValidChannel(c: unknown): c is ChannelSource {
  const x = c as Partial<ChannelSource> | null;
  return Boolean(x && typeof x.id === "string" && CHANNEL_ID_PATTERN.test(x.id)
    && typeof x.name === "string" && x.name.trim().length > 0 && x.name.length <= 80
    && typeof x.category === "string" && x.category.length <= 40
    && typeof x.enabled === "boolean");
}

// Première installation : si le fichier n'existe pas, on reprend la variable d'environnement.
function seedFromEnv(): ChannelSource[] {
  try {
    const parsed: unknown = JSON.parse(process.env.BEBETAB_CHANNELS_JSON || "[]");
    return Array.isArray(parsed) ? parsed.filter(isValidChannel) : [];
  } catch { return []; }
}

export function readChannels(): ChannelSource[] {
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidChannel) : [];
  } catch {
    return seedFromEnv();
  }
}

export function writeChannels(list: ChannelSource[]): void {
  fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  const tmp = STORE_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2), "utf8");
  fs.renameSync(tmp, STORE_FILE);
}

// Extrait l'identifiant UC… d'une adresse de chaîne YouTube (youtube.com/channel/UC…) ou de l'identifiant brut.
export function parseChannelId(input: string): string | null {
  const value = input.trim();
  if (CHANNEL_ID_PATTERN.test(value)) return value;
  const match = value.match(/youtube\.com\/channel\/(UC[\w-]{22})/i);
  return match ? match[1] : null;
}
