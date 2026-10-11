import { createHash, timingSafeEqual } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { NextFunction, Request, Response } from "express";

/* ------------------------------------------------------------------ */
/* Constantes partagées                                               */
/* ------------------------------------------------------------------ */

export const AGE_GROUPS = ["2-4", "5-7", "8-10"] as const;
export type AgeGroupValue = (typeof AGE_GROUPS)[number];

export const MOODS = ["happy", "excited", "singing", "thinking", "proud"] as const;

/* ------------------------------------------------------------------ */
/* Lecture de la configuration                                        */
/* ------------------------------------------------------------------ */

/** Lit un nombre dans une variable d'environnement. Une valeur « 0 » est une vraie valeur (pas un oubli). */
export function envNumber(raw: string | undefined, fallback: number, min = Number.NEGATIVE_INFINITY): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? Math.max(min, n) : fallback;
}

/* ------------------------------------------------------------------ */
/* Comparaison et nettoyage de texte                                  */
/* ------------------------------------------------------------------ */

/** Comparaison en temps constant (les deux valeurs sont d'abord hachées : longueurs égales). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * Nettoie une courte étiquette (héros, monde, thème…) destinée à être insérée dans une consigne :
 * lettres, chiffres, espaces et ponctuation simple uniquement, longueur bornée.
 * Empêche les retours à la ligne, guillemets, accolades, balises et autres caractères de contrôle.
 */
export function sanitizeLabel(value: unknown, max = 60, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const cleaned = value
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} '’\-.,!?&]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max)
    .trim();
  return cleaned || fallback;
}

/** Texte libre de l'enfant : on retire seulement les caractères de contrôle et on borne la taille. */
export function sanitizeFreeText(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFC")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

export function parseAgeGroup(value: unknown): AgeGroupValue {
  return (AGE_GROUPS as readonly string[]).includes(value as string) ? (value as AgeGroupValue) : "5-7";
}

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

/* ------------------------------------------------------------------ */
/* Adresse IP du client et origine                                    */
/* ------------------------------------------------------------------ */

/**
 * Adresse IP du client. `trustProxyHops` = nombre de proxys de confiance devant le serveur.
 * À 0 (défaut), l'en-tête X-Forwarded-For est ignoré : un client ne peut pas usurper son IP.
 */
export function clientIp(req: IncomingMessage, trustProxyHops = 0): string {
  const remote = req.socket.remoteAddress ?? "unknown";
  if (trustProxyHops > 0) {
    const raw = req.headers["x-forwarded-for"];
    const list = (Array.isArray(raw) ? raw.join(",") : raw ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const idx = list.length - trustProxyHops;
    if (idx >= 0) return list[idx];
  }
  return remote;
}

/**
 * Origine d'une requête WebSocket. Les clients sans en-tête Origin (applications natives, curl)
 * sont acceptés ; un navigateur doit venir du même hôte ou d'une origine listée.
 */
export function isOriginAllowed(origin: string | undefined, host: string | undefined, allowed: string[]): boolean {
  if (!origin) return true;
  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  if (host && parsed.host === host) return true;
  return allowed.some((a) => a === origin || a === parsed.origin || a === parsed.host);
}

/* ------------------------------------------------------------------ */
/* Limiteur de débit (fenêtre fixe, en mémoire, sans dépendance)      */
/* ------------------------------------------------------------------ */

export interface RateLimiterOptions {
  windowMs: number;
  max: number;
  keyFn: (req: Request) => string;
  message?: string;
}

export interface ConsumeResult {
  allowed: boolean;
  retryAfterSec: number;
}

export function createRateLimiter(opts: RateLimiterOptions) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
  }, Math.max(opts.windowMs, 10_000));
  sweep.unref();

  const consume = (key: string, now = Date.now()): ConsumeResult => {
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + opts.windowMs });
      return { allowed: true, retryAfterSec: 0 };
    }
    entry.count += 1;
    if (entry.count > opts.max) {
      return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
    }
    return { allowed: true, retryAfterSec: 0 };
  };

  const middleware = (req: Request, res: Response, next: NextFunction) => {
    const result = consume(opts.keyFn(req));
    if (!result.allowed) {
      res.setHeader("Retry-After", String(result.retryAfterSec));
      return res.status(429).json({ error: opts.message ?? "Trop de requêtes, réessaie dans un instant." });
    }
    next();
  };

  return { consume, middleware };
}

/* ------------------------------------------------------------------ */
/* Publicités : validation de la charge utile                         */
/* ------------------------------------------------------------------ */

export interface AdInput {
  title: string;
  sponsor: string;
  type: "video" | "image";
  url: string;
  duration: number;
  locked: boolean;
}

export const AD_MIN_SECONDS = 5;
export const AD_MAX_SECONDS = 60;

function hostMatches(hostname: string, rule: string): boolean {
  const r = rule.toLowerCase();
  if (r.startsWith("*.")) return hostname === r.slice(2) || hostname.endsWith(r.slice(1));
  return hostname === r;
}

/** Liste de domaines autorisés pour les médias publicitaires (« cdn.exemple.com, *.exemple.org »). */
export function parseHostList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function validateAdPayload(
  body: any,
  allowedHosts: string[] = []
): { ok: true; value: AdInput } | { ok: false; error: string } {
  const b = body && typeof body === "object" ? body : {};

  const title = typeof b.title === "string" ? b.title.replace(/[\u0000-\u001F\u007F]/g, " ").trim() : "";
  if (title.length < 1 || title.length > 120) {
    return { ok: false, error: "Le titre est obligatoire (120 caractères maximum)." };
  }

  const sponsorRaw = typeof b.sponsor === "string" ? b.sponsor.replace(/[\u0000-\u001F\u007F]/g, " ").trim() : "";
  if (sponsorRaw.length > 80) return { ok: false, error: "Le nom du sponsor est trop long (80 caractères maximum)." };

  if (typeof b.url !== "string" || b.url.length < 1 || b.url.length > 2048) {
    return { ok: false, error: "L'URL du média est obligatoire (2048 caractères maximum)." };
  }
  let parsed: URL;
  try {
    parsed = new URL(b.url);
  } catch {
    return { ok: false, error: "L'URL du média n'est pas valide." };
  }
  if (parsed.protocol !== "https:") return { ok: false, error: "L'URL du média doit commencer par https://." };
  if (parsed.username || parsed.password) return { ok: false, error: "L'URL ne doit pas contenir d'identifiants." };
  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname.includes(":") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
  ) {
    return { ok: false, error: "L'URL doit pointer vers un nom de domaine public." };
  }
  if (allowedHosts.length > 0 && !allowedHosts.some((rule) => hostMatches(hostname, rule))) {
    return { ok: false, error: "Ce domaine n'est pas autorisé pour les publicités." };
  }

  const seconds = Math.round(Number(b.duration));
  const duration = Number.isFinite(seconds) ? Math.min(AD_MAX_SECONDS, Math.max(AD_MIN_SECONDS, seconds)) : 15;

  return {
    ok: true,
    value: {
      title,
      sponsor: sponsorRaw || "Partenaire Officiel BéBé-TAB",
      type: b.type === "video" ? "video" : "image",
      url: parsed.toString(),
      duration,
      locked: b.locked === true,
    },
  };
}
