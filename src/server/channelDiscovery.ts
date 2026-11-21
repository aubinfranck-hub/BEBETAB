import { readChannels, ChannelSource, isValidChannel } from "./channelStore";

export type { ChannelSource };
export interface ChannelVideo { id: string; channelId: string; title: string; publishedAt: string; thumbnail: string; category: string }

// Seules les chaînes activées dans le panel parent sont interrogées.
export function approvedChannels(): ChannelSource[] {
  return readChannels().filter(c => isValidChannel(c) && c.enabled === true);
}

let cache: { expires: number; videos: ChannelVideo[] } | undefined;

// Le cache est vidé quand le panel modifie les chaînes.
export function clearVideoCache(): void { cache = undefined; }

export async function discoverChannelVideos(): Promise<ChannelVideo[]> {
  if (cache && cache.expires > Date.now()) return cache.videos;
  const key = process.env.YOUTUBE_API_KEY;
  const channels = approvedChannels();
  if (channels.length === 0) return cache?.videos || [];
  const results = await Promise.allSettled(channels.map(channel => key ? fetchWithKey(channel, key) : fetchWithFeed(channel)));
  const videos = results.flatMap(r => r.status === "fulfilled" ? r.value : []);
  if (videos.length) cache = { expires: Date.now() + 6 * 60 * 60 * 1000, videos: [...new Map(videos.map(v => [v.id, v])).values()].sort((a,b) => b.publishedAt.localeCompare(a.publishedAt)) };
  return cache?.videos || [];
}

// Sans clé API : flux RSS public de chaque chaîne (15 dernières vidéos, sans clé).
async function fetchWithFeed(channel: ChannelSource): Promise<ChannelVideo[]> {
  const response = await fetch("https://www.youtube.com/feeds/videos.xml?channel_id=" + encodeURIComponent(channel.id));
  if (!response.ok) throw new Error("YouTube feed failed: " + response.status);
  const xml = await response.text();
  const entries = xml.split("<entry>").slice(1);
  return entries.flatMap(entry => {
    const id = entry.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
    if (!id) return [];
    const title = decodeXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "Vidéo éducative");
    const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] || "";
    const thumbnail = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1] || "https://i.ytimg.com/vi/" + id + "/mqdefault.jpg";
    return [{ id, channelId: channel.id, title, publishedAt, thumbnail, category: channel.category }];
  });
}

function decodeXml(text: string): string {
  return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

// Avec clé API : recherche YouTube Data API v3 (jusqu'à 20 vidéos par chaîne).
async function fetchWithKey(channel: ChannelSource, key: string): Promise<ChannelVideo[]> {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("channelId", channel.id);
    url.searchParams.set("order", "date");
    url.searchParams.set("type", "video");
    url.searchParams.set("videoEmbeddable", "true");
    url.searchParams.set("safeSearch", "strict");
    url.searchParams.set("maxResults", "20");
    url.searchParams.set("key", key);
    const response = await fetch(url);
    if (!response.ok) throw new Error("YouTube request failed: " + response.status);
    const data = await response.json() as { items?: Array<{id?: {videoId?: string}; snippet?: {title?: string; publishedAt?: string; thumbnails?: {medium?: {url?: string}}}}> };
    return (data.items || []).filter(item => /^[\w-]{11}$/.test(item.id?.videoId || "")).map(item => ({
      id: item.id!.videoId!, channelId: channel.id, title: item.snippet?.title || "Vidéo éducative",
      publishedAt: item.snippet?.publishedAt || "", thumbnail: item.snippet?.thumbnails?.medium?.url || "",
      category: channel.category
    }));
}
