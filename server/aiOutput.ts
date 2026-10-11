import { MOODS, isHexColor } from "./security";

/* Les réponses du modèle sont traitées comme des données non fiables :
 * on borne les tailles, on vérifie les formes et on retombe sur des valeurs sûres. */

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const clip = (value: unknown, max: number): string =>
  typeof value === "string" ? value.replace(CONTROL_CHARS, "").trim().slice(0, max) : "";

export interface ChatReply {
  text: string;
  mood: (typeof MOODS)[number];
  color: string;
  voiceAdvice: string;
}

export function sanitizeChatReply(raw: any, fallbackColor = "#3B82F6"): ChatReply {
  const mood = (MOODS as readonly string[]).includes(raw?.mood) ? raw.mood : "happy";
  return {
    text: clip(raw?.text, 600) || "Youpi ! Fanti t'écoute !",
    mood,
    color: isHexColor(raw?.color) ? raw.color : fallbackColor,
    voiceAdvice: clip(raw?.voiceAdvice, 200),
  };
}

export interface StoryScene {
  sceneNumber: number;
  text: string;
  choices: string[];
  illustrationPrompt: string;
}

export interface Story {
  title: string;
  intro: string;
  scenes: StoryScene[];
  moral: string;
}

export function sanitizeStory(raw: any): Story | null {
  const title = clip(raw?.title, 120);
  const scenes: StoryScene[] = (Array.isArray(raw?.scenes) ? raw.scenes : [])
    .slice(0, 5)
    .map((s: any) => ({
      sceneNumber: 0,
      text: clip(s?.text, 800),
      choices: (Array.isArray(s?.choices) ? s.choices : [])
        .map((c: unknown) => clip(c, 120))
        .filter(Boolean)
        .slice(0, 3),
      illustrationPrompt: clip(s?.illustrationPrompt, 300),
    }))
    .filter((s: StoryScene) => s.text)
    .map((s: StoryScene, i: number) => ({ ...s, sceneNumber: i + 1 }));
  if (!title || scenes.length === 0) return null;
  return { title, intro: clip(raw?.intro, 600), scenes, moral: clip(raw?.moral, 300) };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioHint: string;
}

export function sanitizeQuiz(raw: any): { questions: QuizQuestion[] } | null {
  const questions: QuizQuestion[] = [];
  for (const q of (Array.isArray(raw?.questions) ? raw.questions : []).slice(0, 6)) {
    const options: string[] = (Array.isArray(q?.options) ? q.options : [])
      .map((o: unknown) => clip(o, 100))
      .filter(Boolean);
    const correctIndex = q?.correctIndex;
    const question = clip(q?.question, 300);
    if (!question || options.length < 2 || options.length > 4) continue;
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) continue;
    questions.push({
      id: questions.length + 1,
      question,
      options,
      correctIndex,
      explanation: clip(q?.explanation, 300),
      audioHint: clip(q?.audioHint, 200),
    });
  }
  return questions.length > 0 ? { questions } : null;
}
