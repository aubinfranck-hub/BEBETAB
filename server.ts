import express from "express";
import { approvedChannels, discoverChannelVideos } from "./src/server/channelDiscovery";
import path from "path";
import dotenv from "dotenv";
import { createServer as createHttpServer } from "http";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const httpServer = createHttpServer(app);

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK lazily / safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// --- GEMINI LIVE WEBSOCKET ENDPOINT ---
const wss = new WebSocketServer({ server: httpServer, path: "/live" });

wss.on("connection", async (clientWs) => {
  console.log("Client connected to Gemini Live WebSocket");
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    clientWs.send(
      JSON.stringify({
        error: "Clé API Gemini non configurée dans le serveur.",
      })
    );
    clientWs.close();
    return;
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" },
    },
  });

  try {
    const session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
        },
        systemInstruction:
          "Tu es Lia (ou Fanti), l'adorable mascotte éléphant magique de BéBé-TAB Kids World. Tu réponds aux enfants avec une voix extrêmement joyeuse, douce, enthousiaste et très adaptée en français. Tes phrases sont courtes, simples et remplies d'émerveillement.",
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (text) {
            clientWs.send(JSON.stringify({ text }));
          }
        },
        onerror: (err) => {
          console.error("Gemini Live error:", err);
          try {
            clientWs.send(JSON.stringify({ error: "Erreur lors de la session Gemini Live." }));
          } catch (e) {}
        },
        onclose: () => {
          console.log("Gemini Live session closed");
        },
      },
    });

    clientWs.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.audio) {
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" },
          });
        } else if (msg.text) {
          session.sendRealtimeInput({
            text: msg.text,
          });
        }
      } catch (err) {
        console.error("Error processing client ws message:", err);
      }
    });

    clientWs.on("close", () => {
      try {
        session.close();
      } catch (e) {}
    });
  } catch (err: any) {
    console.error("Failed to connect to Gemini Live:", err);
    try {
      clientWs.send(
        JSON.stringify({
          error: err.message || "Impossible d'ouvrir la session Gemini Live.",
        })
      );
      clientWs.close();
    } catch (e) {}
  }
});

// --- API ROUTES ---
app.get("/api/education/channels", (_req, res) => res.json({ channels: approvedChannels() }));
app.get("/api/education/videos", async (_req, res) => {
  try { res.setHeader("Cache-Control", "public, max-age=900"); res.json({ videos: await discoverChannelVideos() }); }
  catch { res.status(503).json({ videos: [], error: "Catalogue temporairement indisponible" }); }
});

// --- AD BROADCAST LIVE SYSTEM ---
interface AdBroadcast {
  id: string;
  title: string;
  type: "video" | "image";
  url: string;
  duration: number; // in seconds
  sponsor?: string;
  locked: boolean; // kept false for child-safe freemium ads
  createdAt: number;
}

let currentActiveAd: AdBroadcast | null = null;
let totalAdViews = 0;
const sseAdClients: Set<express.Response> = new Set();

const broadcastAdToClients = (event: string, data: any) => {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseAdClients) {
    try {
      client.write(payload);
    } catch (e) {
      sseAdClients.delete(client);
    }
  }
};

// SSE Endpoint for Live Ad Broadcast Stream to all connected devices
app.get("/api/ads/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseAdClients.add(res);

  // Send current state on connection
  res.write(
    `event: initial\ndata: ${JSON.stringify({
      activeAd: currentActiveAd,
      stats: { totalAdViews, activeClients: sseAdClients.size },
    })}\n\n`
  );

  // Heartbeat ping every 15 seconds
  const pingInterval = setInterval(() => {
    try {
      res.write(":\n\n");
    } catch (e) {
      clearInterval(pingInterval);
    }
  }, 15000);

  req.on("close", () => {
    clearInterval(pingInterval);
    sseAdClients.delete(res);
  });
});

// GET current ad state
app.get("/api/ads/current", (_req, res) => {
  res.json({
    activeAd: currentActiveAd,
    stats: { totalAdViews, activeClients: sseAdClients.size },
  });
});

// POST launch new broadcast ad to all connected users
app.post("/api/ads/broadcast", (req, res) => {
  const { title, type, url, duration, sponsor, locked = false } = req.body;

  if (!url || !title) {
    return res.status(400).json({ error: "URL et Titre de l'annonce requis" });
  }

  const newAd: AdBroadcast = {
    id: "ad_" + Date.now(),
    title,
    type: type === "video" ? "video" : "image",
    url,
    duration: Number(duration) || 15,
    sponsor: sponsor || "Partenaire Officiel BéBé-TAB",
    locked: Boolean(locked),
    createdAt: Date.now(),
  };

  currentActiveAd = newAd;
  broadcastAdToClients("ad_start", newAd);

  console.log(`📢 Ad broadcast launched to ${sseAdClients.size} connected clients: ${newAd.title}`);
  return res.json({
    success: true,
    activeAd: currentActiveAd,
    activeClients: sseAdClients.size,
  });
});

// POST stop active broadcast ad
app.post("/api/ads/stop", (_req, res) => {
  currentActiveAd = null;
  broadcastAdToClients("ad_stop", { stoppedAt: Date.now() });
  console.log("🛑 Ad broadcast stopped by admin");
  return res.json({ success: true, message: "Publicité arrêtée avec succès" });
});

// POST record ad view completion
app.post("/api/ads/view", (_req, res) => {
  totalAdViews += 1;
  broadcastAdToClients("stats_update", { totalAdViews, activeClients: sseAdClients.size });
  return res.json({ success: true, totalAdViews });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "BéBé-TAB Kids World" });
});

// Fanti Mascot Chat Endpoint
app.post("/api/fanti/chat", async (req, res) => {
  try {
    const { prompt, ageGroup = "5-7", currentWorld = "Jungle" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not configured yet
      return res.json({
        text: `Coucou ! Je suis Fanti l'éléphant ! Tu es dans le monde ${currentWorld} ! Je suis tellement content de jouer avec toi ! 🐘✨`,
        mood: "excited",
        color: "#F59E0B",
        voiceAdvice: "Parle joyeusement",
      });
    }

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      contents: prompt || "Bonjour Fanti !",
      config: {
        systemInstruction: `Tu es Fanti, une mascotte éléphant magique, joyeuse, bienveillante et très encourageante pour une application éducative pour enfants (BéBé-TAB Kids World).
L'enfant a entre ${ageGroup} ans. Il se trouve actuellement dans le monde : "${currentWorld}".
Réponds TOUJOURS en français simple, court, enthousiaste et très adapté aux enfants. Utilise des emojis amusants (🐘, ⭐, 🎨, 🚀, 🎵).
N'utilise jamais de gros mots, de sujets tristes ou effrayants.
Sois structuré en JSON avec les champs:
- "text": ta réponse parlée à l'enfant (2-3 phrases max)
- "mood": une valeur parmi ["happy", "excited", "singing", "thinking", "proud"]
- "color": une couleur hexadécimale lumineuse assortie (ex: #3B82F6, #10B981, #F59E0B, #EC4899, #8B5CF6)
- "voiceAdvice": un court conseil d'intonation pour l'enfant`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            mood: { type: Type.STRING },
            color: { type: Type.STRING },
            voiceAdvice: { type: Type.STRING },
          },
          required: ["text", "mood", "color"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Fanti chat error:", error);
    res.status(500).json({
      text: "Oups ! Fanti a fait une petite cabriole ! On recommence ? 🐘⭐",
      mood: "happy",
      color: "#3B82F6",
    });
  }
});

// Interactive Story Generation
app.post("/api/fanti/story", async (req, res) => {
  try {
    const { hero = "Un petit lapin", animal = "Éléphant Fanti", setting = "Jungle magique", theme = "L'amitié", ageGroup = "5-7" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality fallback story
      return res.json({
        title: `L'Aventure de ${hero} dans la ${setting}`,
        intro: `Aujourd'hui, ${hero} s'aventure dans la ${setting}. Tout à coup, il rencontre ${animal} !`,
        scenes: [
          {
            sceneNumber: 1,
            text: `${hero} se promène joyeusement quand un drôle de bruit retentit dans la forêt. Que va-t-il faire ?`,
            choices: ["Suivre le petit chemin doré", "Gramper au sommet du grand arbre"],
            illustrationPrompt: "A cute magical forest with a friendly little animal and glowing golden pathways",
          },
          {
            sceneNumber: 2,
            text: `Bravo ! Sur le chemin, ${hero} trouve une carte au trésor étincelante laissée par ${animal}.`,
            choices: ["Ouvrir le coffre magique", "Chanter une chanson pour ouvrir la porte"],
            illustrationPrompt: "A magical chest opening with rainbow sparkles and musical notes floating",
          },
        ],
        moral: "Ensemble, on réussit toutes les grandes aventures !",
      });
    }

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      contents: `Génère une histoire interactive personnalisée et merveilleuse pour un enfant de ${ageGroup} ans.
Héros principal: ${hero}
Compagnon: ${animal}
Décor/Monde: ${setting}
Thème: ${theme}`,
      config: {
        systemInstruction: `Tu es un conteur magique pour enfants. Génère une histoire captivante et éducative en français sous forme de JSON strict.
L'histoire doit contenir:
- title: Titre féérique
- intro: Introduction poétique (2-3 phrases)
- scenes: Tableau de 3 scènes interactives avec { "sceneNumber": number, "text": string, "choices": string[] (2 choix simples), "illustrationPrompt": string en anglais pour dessin }
- moral: La jolie morale positive de l'histoire`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            intro: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  choices: { type: Type.ARRAY, items: { type: Type.STRING } },
                  illustrationPrompt: { type: Type.STRING },
                },
                required: ["sceneNumber", "text", "choices"],
              },
            },
            moral: { type: Type.STRING },
          },
          required: ["title", "intro", "scenes", "moral"],
        },
      },
    });

    const storyData = JSON.parse(response.text || "{}");
    res.json(storyData);
  } catch (error: any) {
    console.error("Story API error:", error);
    res.status(500).json({ error: "Impossible de créer l'histoire pour le moment" });
  }
});

// Dynamic Educational Quiz Endpoint
app.post("/api/fanti/quiz", async (req, res) => {
  try {
    const { ageGroup = "5-7", subject = "Maths & Chiffres" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback quiz items
      return res.json({
        questions: [
          {
            id: 1,
            question: "Combien font 2 + 3 ?",
            options: ["4", "5", "6"],
            correctIndex: 1,
            explanation: "Excellence ! 2 pommes + 3 pommes font bien 5 pommes ! 🍎",
            audioHint: "Compte sur tes doigts : 1, 2, 3, 4, 5 !",
          },
          {
            id: 2,
            question: "Quelle est la couleur d'une banane mûre ?",
            options: ["Jaune", "Bleue", "Verte"],
            correctIndex: 0,
            explanation: "Oui ! Les bananes bien mûres sont toutes jaunes et sucrées ! 🍌",
            audioHint: "C'est la couleur du soleil !",
          },
          {
            id: 3,
            question: "Quel animal fait 'Ouafe Ouafe' ?",
            options: ["Le chat", "Le chien", "La vache"],
            correctIndex: 1,
            explanation: "Bravo ! C'est le chien qui aboie ouafe ouafe ! 🐶",
            audioHint: "C'est le meilleur ami de l'homme !",
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
      contents: `Crée un quiz ludique de 4 questions pour un enfant de ${ageGroup} ans sur la matière : "${subject}".`,
      config: {
        systemInstruction: `Tu es Fanti, le professeur éléphant rigolo. Crée un quiz parfaitement adapté à l'âge sélectionné (${ageGroup} ans).
Pour 2-4 ans: questions très simples basées sur les couleurs, cris d'animaux, comptage jusqu'à 5.
Pour 5-7 ans: petites additions/soustraction, orthographe simple, animaux, nature.
Pour 8-10 ans: culture générale, géographie, sciences amusantes, tables de multiplication.

Renvoie un JSON avec un tableau "questions":
- id: number
- question: string
- options: array of 3 string choices
- correctIndex: number (0, 1 or 2)
- explanation: string (encouragement joyeux expliquant la réponse)
- audioHint: string (petit indice vocal amusant par Fanti)`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  audioHint: { type: Type.STRING },
                },
                required: ["id", "question", "options", "correctIndex", "explanation"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const quizData = JSON.parse(response.text || "{}");
    res.json(quizData);
  } catch (error: any) {
    console.error("Quiz API error:", error);
    res.status(500).json({ error: "Erreur lors de la génération du quiz" });
  }
});

// Gemini Text-to-Speech API Endpoint
app.post("/api/fanti/tts", async (req, res) => {
  try {
    const { text } = req.body;
    const ai = getGeminiClient();

    if (!ai || !text) {
      return res.status(400).json({ error: "TTS non disponible ou texte vide" });
    }

    const ttsResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Parle comme un éléphant rigolo et gentil pour enfants : ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio });
    } else {
      return res.status(500).json({ error: "Audio non généré" });
    }
  } catch (err: any) {
    console.error("TTS endpoint error:", err);
    res.status(500).json({ error: "Erreur de synthèse vocale" });
  }
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🐘 BéBé-TAB Kids World Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
