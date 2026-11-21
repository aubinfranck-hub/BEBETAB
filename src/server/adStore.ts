import fs from "fs";
import path from "path";

// Bandeau du bas de l'écran : pubs et projets de l'équipe. Modifiable via BEBETAB_ADS_FILE.
export interface TickerAd {
  id: string;        // identifiant généré par le serveur
  text: string;      // phrase affichée, 140 caractères maximum
  link?: string;     // lien https facultatif (projet ou site de l'équipe)
  enabled: boolean;  // désactivée = masquée sans être supprimée
  startsAt?: string; // date ISO facultative : affichée à partir de cette date
  endsAt?: string;   // date ISO facultative : retirée après cette date
}

const STORE_FILE = process.env.BEBETAB_ADS_FILE || path.join(process.cwd(), "data", "ads.json");

export function isValidAd(a: unknown): a is TickerAd {
  const x = a as Partial<TickerAd> | null;
  return Boolean(x && typeof x.id === "string" && x.id.length > 0
    && typeof x.text === "string" && x.text.trim().length > 0 && x.text.length <= 140
    && typeof x.enabled === "boolean"
    && (x.link === undefined || (typeof x.link === "string" && /^https:\/\/[^\s]+$/.test(x.link)))
    && (x.startsAt === undefined || !Number.isNaN(Date.parse(x.startsAt)))
    && (x.endsAt === undefined || !Number.isNaN(Date.parse(x.endsAt))));
}

export function readAds(): TickerAd[] {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed.filter(isValidAd) : [];
  } catch { return []; }
}

export function writeAds(list: TickerAd[]): void {
  fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  const tmp = STORE_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2), "utf8");
  fs.renameSync(tmp, STORE_FILE);
}

// Pubs réellement visibles à l'instant donné : activées et dans leur période.
export function activeAds(now = Date.now()): Pick<TickerAd, "id" | "text" | "link">[] {
  return readAds()
    .filter(a => a.enabled
      && (!a.startsAt || Date.parse(a.startsAt) <= now)
      && (!a.endsAt || Date.parse(a.endsAt) >= now))
    .map(a => ({ id: a.id, text: a.text, link: a.link }));
}
