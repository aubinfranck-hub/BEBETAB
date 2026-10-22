/**
 * Aide au choix de la voix et au suivi des crédits ElevenLabs, depuis le terminal (sans navigateur).
 *
 *   npm run elevenlabs -- voices [mot-clé] [--fr]   voix de VOTRE compte (id, accent, lien d'écoute)
 *   npm run elevenlabs -- usage [campagne]          caractères utilisés / restants + besoin de la campagne
 *
 * Ne génère aucun audio et ne consomme aucun crédit. La clé n'est jamais affichée.
 * Une clé d'API restreinte doit avoir les droits de lecture des voix et de l'abonnement.
 */
import 'dotenv/config';
import {campaignId, hasFlag, loadCampaign} from './lib/io';

interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  preview_url?: string | null;
  labels?: Record<string, string>;
  verified_languages?: {language?: string}[];
}

const apiKey = process.env.ELEVENLABS_API_KEY;
const baseUrl = process.env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io';

async function api<T>(route: string): Promise<T> {
  const response = await fetch(`${baseUrl}${route}`, {headers: {'xi-api-key': apiKey as string}});
  if (!response.ok) {
    const hint = response.status === 401 ? ' (clé invalide, ou droits insuffisants pour cette ressource)' : '';
    throw new Error(`ElevenLabs ${response.status} sur ${route.split('?')[0]}${hint}`);
  }
  return (await response.json()) as T;
}

function speaksFrench(voice: Voice): boolean {
  const text = JSON.stringify([voice.labels, voice.verified_languages]).toLowerCase();
  return /\bfr\b|french|fran[cç]ais/.test(text);
}

async function listVoices(args: string[]) {
  const search = args.filter(arg => !arg.startsWith('--')).join(' ');
  const query = new URLSearchParams({page_size: '100'});
  if (search) query.set('search', search);
  const data = await api<{voices: Voice[]}>(`/v2/voices?${query}`);
  const voices = hasFlag('--fr') ? data.voices.filter(speaksFrench) : data.voices;
  if (voices.length === 0) {
    console.log('Aucune voix trouvée dans votre compte. Les voix de la bibliothèque doivent d\'abord y être ajoutées ("Add to my voices").');
    return;
  }
  for (const voice of voices) {
    const labels = Object.entries(voice.labels ?? {}).map(([key, value]) => `${key}=${value}`).join(', ');
    console.log(`${voice.name}\n  id       : ${voice.voice_id}\n  catégorie: ${voice.category ?? '?'}\n  labels   : ${labels || '—'}`);
    if (voice.preview_url) console.log(`  écouter  : ${voice.preview_url}`);
  }
  console.log(`\n${voices.length} voix. Renseigner l'id choisi dans ELEVENLABS_VOICE_ID (.env).`);
}

async function usage(args: string[]) {
  const data = await api<{character_count: number; character_limit: number; next_character_count_reset_unix?: number}>(
    '/v1/user/subscription',
  );
  const remaining = data.character_limit - data.character_count;
  console.log(`Caractères utilisés : ${data.character_count} / ${data.character_limit} (restants : ${remaining})`);
  if (data.next_character_count_reset_unix) {
    console.log(`Prochaine remise à zéro : ${new Date(data.next_character_count_reset_unix * 1000).toISOString().slice(0, 10)}`);
  }
  const campaign = loadCampaign(campaignId(args));
  const needed = campaign.scenes.reduce((sum, scene) => sum + (scene.voiceover?.length ?? 0), 0);
  console.log(`Voix off de « ${campaign.id} » : ${needed} caractères pour une génération complète.`);
  console.log(
    needed <= remaining
      ? 'Crédits suffisants pour une génération complète (la consommation réelle par caractère dépend du modèle et de votre offre).'
      : `⚠ Il manque environ ${needed - remaining} caractères pour une génération complète.`,
  );
}

async function main() {
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY est requis (voir .env.example).');
    process.exit(1);
  }
  const [command, ...args] = process.argv.slice(2);
  if (command === 'voices') await listVoices(args);
  else if (command === 'usage') await usage(args);
  else {
    console.error('Usage : npm run elevenlabs -- voices [mot-clé] [--fr]  |  npm run elevenlabs -- usage [campagne]');
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
