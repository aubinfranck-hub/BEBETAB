import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, InteractiveStory } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  BookMarked,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface StoriesModuleProps {
  user: UserProfile;
  onAwardXP: (xp: number, stars: number) => void;
  onBack: () => void;
}

export const StoriesModule: React.FC<StoriesModuleProps> = ({
  user,
  onAwardXP,
  onBack,
}) => {
  const [hero, setHero] = useState("Un petit lapin");
  const [animal, setAnimal] = useState("Fanti l'éléphant");
  const [setting, setSetting] = useState<string>(user.currentWorld);

  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState<InteractiveStory | null>(null);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);

  const heroOptions = [
    "Un petit lapin 🐰",
    "Une gentille fée 🧚",
    "Un courageux astronaute 🚀",
    "Un petit lion 🦁",
    "Un grand magicien 🧙‍♂️",
  ];

  const companionOptions = [
    "Fanti l'éléphant 🐘",
    "Un dauphin rieur 🐬",
    "Un petit singe rigolo 🐒",
    "Un dragon étincelant 🐲",
  ];

  const settingOptions = [
    "Jungle 🌴",
    "Océan 🌊",
    "Espace 🚀",
    "Royaume Magique 🏰",
    "Savane 🐘",
  ];

  const handleGenerateStory = async () => {
    soundFx.playTap();
    setIsLoading(true);
    setStory(null);
    setCurrentSceneIdx(0);

    try {
      const res = await fetch("/api/fanti/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero,
          animal,
          setting,
          ageGroup: user.ageGroup,
        }),
      });

      const data = await res.json();
      setStory(data);
      speakText(`Voici l'histoire : ${data.title}. ${data.intro}`);
      onAwardXP(25, 3);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = (choiceText: string) => {
    soundFx.playVictory();
    if (story && currentSceneIdx < story.scenes.length - 1) {
      const nextIdx = currentSceneIdx + 1;
      setCurrentSceneIdx(nextIdx);
      speakText(story.scenes[nextIdx].text);
    } else {
      // Completed Story!
      confetti({ particleCount: 100, spread: 80 });
      speakText(`Fin de la belle histoire ! Morale : ${story?.moral}`);
      onAwardXP(30, 5);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-300">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-transform active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>📖</span> Histoires Interactives de Fanti
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Choisis ton héros, ton décor et crée une histoire magique sur mesure !
            </p>
          </div>
        </div>
      </div>

      {/* Story Setup Builder */}
      {!story && !isLoading && (
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-4 border-amber-200 space-y-6">
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" /> Personnalise ton aventure
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hero Select */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-2">
                1. Choisis le Héros
              </label>
              <div className="space-y-2">
                {heroOptions.map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      soundFx.playTap();
                      setHero(h);
                    }}
                    className={`w-full p-3 rounded-2xl font-black text-sm text-left border-2 transition-all ${
                      hero === h
                        ? "bg-amber-400 text-slate-900 border-amber-600 shadow"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Companion Select */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-2">
                2. Choisis le Compagnon
              </label>
              <div className="space-y-2">
                {companionOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      soundFx.playTap();
                      setAnimal(c);
                    }}
                    className={`w-full p-3 rounded-2xl font-black text-sm text-left border-2 transition-all ${
                      animal === c
                        ? "bg-yellow-400 text-slate-900 border-amber-500 shadow"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting Select */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-2">
                3. Choisis le Monde / Décor
              </label>
              <div className="space-y-2">
                {settingOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      soundFx.playTap();
                      setSetting(s);
                    }}
                    className={`w-full p-3 rounded-2xl font-black text-sm text-left border-2 transition-all ${
                      setting === s
                        ? "bg-purple-500 text-white border-purple-700 shadow"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateStory}
            className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-black text-xl rounded-2xl shadow-xl border-2 border-white flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
            <span>Générer l'histoire magique par Fanti IA !</span>
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white/90 backdrop-blur rounded-3xl p-12 text-center shadow-xl border-4 border-amber-300 space-y-4">
          <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-spin" />
          <h3 className="text-2xl font-black text-slate-800">
            Fanti est en train d'écrire l'histoire...
          </h3>
          <p className="text-sm font-semibold text-slate-600">
            Il prépare des animaux extraordinaires et des secrets magiques !
          </p>
        </div>
      )}

      {/* Story View & Interactive Reader */}
      {story && (
        <div className="bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-amber-300 pb-4">
            <div>
              <span className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-xs rounded-xl uppercase">
                Conté par Fanti
              </span>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {story.title}
              </h3>
            </div>

            <button
              onClick={() => speakText(`${story.title}. ${story.intro}`)}
              className="px-4 py-2 bg-amber-400 text-slate-900 font-black text-xs rounded-2xl shadow border-2 border-white flex items-center gap-1 active:scale-95"
            >
              <Volume2 className="w-4 h-4" /> Réécouter l'intro
            </button>
          </div>

          <p className="text-lg font-bold text-slate-800 bg-white/80 p-4 rounded-2xl border border-amber-300">
            {story.intro}
          </p>

          {/* Current Scene Card */}
          {story.scenes[currentSceneIdx] && (
            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-300 space-y-4">
              <div className="flex items-center justify-between text-xs font-black uppercase text-orange-600">
                <span>Scène {currentSceneIdx + 1} sur {story.scenes.length}</span>
                <span>⭐ Choix Interactif</span>
              </div>

              <p className="text-xl font-extrabold text-slate-900 leading-relaxed">
                {story.scenes[currentSceneIdx].text}
              </p>

              <button
                onClick={() => speakText(story.scenes[currentSceneIdx].text)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 text-xs font-black rounded-xl"
              >
                <Volume2 className="w-4 h-4" /> Écouter cette scène
              </button>

              <div className="pt-2 space-y-3">
                <p className="text-xs font-black text-slate-500 uppercase">
                  Que doit faire le héros ?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {story.scenes[currentSceneIdx].choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice)}
                      className="p-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-black text-left rounded-2xl shadow-md border-2 border-white active:scale-95 transition-all text-sm"
                    >
                      👉 {choice}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* New Story Reset Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setStory(null)}
              className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-md flex items-center gap-2 active:scale-95 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Créer une autre histoire
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
