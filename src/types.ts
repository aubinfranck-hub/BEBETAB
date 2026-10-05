export type AgeGroup = "2-4" | "5-7" | "8-10";

export type WorldTheme = 
  | "Jungle" 
  | "Océan" 
  | "Espace" 
  | "Dinosaures" 
  | "Savane" 
  | "Royaume Magique" 
  | "Ville" 
  | "Ferme";

export type MascotOutfit = 
  | "Explorateur" 
  | "Astronaute" 
  | "Artiste" 
  | "Chef" 
  | "Magicien" 
  | "Super-Héros";

export type ActiveScreen = 
  | "home" 
  | "apprendre" 
  | "jouer" 
  | "dessiner" 
  | "musique" 
  | "histoires" 
  | "quiz" 
  | "recompenses" 
  | "mondes" 
  | "videos" 
  | "parents" 
  | "fanti-chat"
  | "defis";

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardStars: number;
  rewardXP: number;
  targetScreen: ActiveScreen;
  completed: boolean;
  category: "jouer" | "dessiner" | "histoires" | "apprendre" | "musique" | "quiz";
}

export interface UserProfile {
  name: string;
  ageGroup: AgeGroup;
  xp: number;
  level: number;
  stars: number;
  diamonds: number;
  unlockedWorlds: WorldTheme[];
  currentWorld: WorldTheme;
  unlockedOutfits: MascotOutfit[];
  currentOutfit: MascotOutfit;
  badges: Badge[];
  totalTimeMinutes: number;
  screenTimeLimitMinutes: number; // 0 = unlimited
  isLockedByTime: boolean;
  language: "fr" | "en";
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LearningCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  ageGroups: AgeGroup[];
}

export interface FlashcardItem {
  id: string;
  titleFr: string;
  titleEn: string;
  category: string;
  iconOrEmoji: string;
  soundTextFr: string;
  soundTextEn: string;
  funFact: string;
  color: string;
}

export interface InteractiveStory {
  title: string;
  intro: string;
  scenes: {
    sceneNumber: number;
    text: string;
    choices: string[];
    illustrationPrompt?: string;
  }[];
  moral: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioHint?: string;
}

export interface KidsVideo {
  id: string;
  youtubeId: string;
  title: string;
  category: "comptines" | "apprentissage" | "dessins_animes" | "sciences" | "art";
  duration: string;
  thumbnail: string;
  ageGroup: AgeGroup;
}
