import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { UserProfile, ActiveScreen, DailyChallenge } from "../../types";
import { MascotFanti } from "../MascotFanti";
import { soundFx, speakText } from "../../utils/audio";
import {
  ArrowLeft,
  Trophy,
  Star,
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Palette,
  BookMarked,
  Music,
  HelpCircle,
  BookOpen,
  Gift,
  Flame,
  Calendar,
} from "lucide-react";

interface DailyChallengesModuleProps {
  user: UserProfile;
  onAwardXP: (xp: number, stars: number) => void;
  onNavigate: (screen: ActiveScreen) => void;
  onBack: () => void;
}

export const DailyChallengesModule: React.FC<DailyChallengesModuleProps> = ({
  user,
  onAwardXP,
  onNavigate,
  onBack,
}) => {
  const todayKey = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  // Base pool of daily challenges
  const defaultChallengesPool: Omit<DailyChallenge, "completed">[] = [
    {
      id: "def_jouer",
      title: "Champion des Jeux 🎮",
      description: "Joue à une super aventure (Safari Jungle, Fusée Spatiale ou Mémoire) !",
      icon: "🏃‍♂️",
      rewardStars: 10,
      rewardXP: 25,
      targetScreen: "jouer",
      category: "jouer",
    },
    {
      id: "def_dessin",
      title: "Artiste Étoilé 🎨",
      description: "Fais un beau dessin magique avec les pinceaux et les paillettes !",
      icon: "🎨",
      rewardStars: 10,
      rewardXP: 25,
      targetScreen: "dessiner",
      category: "dessiner",
    },
    {
      id: "def_histoire",
      title: "Lecteur Enchanté 📖",
      description: "Écoute ou lis une histoire passionnante dans la bibliothèque !",
      icon: "📚",
      rewardStars: 15,
      rewardXP: 30,
      targetScreen: "histoires",
      category: "histoires",
    },
    {
      id: "def_musique",
      title: "Petit Virtuose 🎵",
      description: "Joue de la musique au piano ou au xylophone rigolo !",
      icon: "🎹",
      rewardStars: 10,
      rewardXP: 25,
      targetScreen: "musique",
      category: "musique",
    },
    {
      id: "def_quiz",
      title: "Génie des Énigmes 🧩",
      description: "Réponds aux questions du Quiz interactif avec Fanti !",
      icon: "🤔",
      rewardStars: 15,
      rewardXP: 30,
      targetScreen: "quiz",
      category: "quiz",
    },
    {
      id: "def_apprendre",
      title: "Explorateur du Savoir 🔤",
      description: "Découvre les cartes de l'Alphabet, des Chiffres ou des Animaux !",
      icon: "🐘",
      rewardStars: 10,
      rewardXP: 20,
      targetScreen: "apprendre",
      category: "apprendre",
    },
  ];

  // Daily State stored in localStorage with date key
  const [challenges, setChallenges] = useState<DailyChallenge[]>(() => {
    const saved = localStorage.getItem(`bebe_tab_defis_${todayKey}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    // Pick 3 deterministic or random challenges for today
    // We select 3 varied challenges
    return [
      { ...defaultChallengesPool[0], completed: false },
      { ...defaultChallengesPool[1], completed: false },
      { ...defaultChallengesPool[2], completed: false },
    ];
  });

  const [bonusClaimed, setBonusClaimed] = useState<boolean>(() => {
    return localStorage.getItem(`bebe_tab_bonus_${todayKey}`) === "true";
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`bebe_tab_defis_${todayKey}`, JSON.stringify(challenges));
  }, [challenges, todayKey]);

  useEffect(() => {
    localStorage.setItem(`bebe_tab_bonus_${todayKey}`, String(bonusClaimed));
  }, [bonusClaimed, todayKey]);

  const completedCount = challenges.filter((c) => c.completed).length;
  const isAllCompleted = completedCount === challenges.length;

  // Complete a challenge
  const handleCompleteChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((item) => {
        if (item.id === id && !item.completed) {
          soundFx.playVictory();
          confetti({ particleCount: 50, spread: 60 });
          speakText(`Bravo ! Tu as complété le défi ${item.title} !`);
          onAwardXP(item.rewardXP, item.rewardStars);
          return { ...item, completed: true };
        }
        return item;
      })
    );
  };

  // Claim Grand Daily Treasure
  const handleClaimBonus = () => {
    if (bonusClaimed) return;
    setBonusClaimed(true);
    soundFx.playVictory();
    confetti({ particleCount: 120, spread: 90 });
    speakText("Incroyable ! Tu as réussi tous tes défis quotidiens ! Voici ton Trésor Bonus d'Étoiles !");
    onAwardXP(60, 25); // +25 Stars, +60 XP
  };

  // Map icons
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "jouer":
        return <Gamepad2 className="w-6 h-6 text-emerald-500" />;
      case "dessiner":
        return <Palette className="w-6 h-6 text-pink-500" />;
      case "histoires":
        return <BookMarked className="w-6 h-6 text-amber-500" />;
      case "musique":
        return <Music className="w-6 h-6 text-purple-500" />;
      case "quiz":
        return <HelpCircle className="w-6 h-6 text-indigo-500" />;
      default:
        return <BookOpen className="w-6 h-6 text-sky-500" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-white/90 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playTap();
              onBack();
            }}
            className="p-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl transition-all active:scale-95 border-2 border-amber-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎯</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Défis Quotidiens
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600">
              Réalise tes 3 missions du jour pour gagner des étoiles bonus !
            </p>
          </div>
        </div>

        {/* User Stars Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 px-4 py-2 rounded-2xl font-black text-sm sm:text-base shadow-lg border-2 border-white shrink-0">
          <Star className="w-5 h-5 text-yellow-100 fill-yellow-100 animate-spin" />
          <span>{user.stars} Étoiles</span>
        </div>
      </div>

      {/* Daily Progress Banner with Fanti */}
      <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 rounded-3xl p-6 shadow-xl border-4 border-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 space-y-3 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 rounded-full text-slate-800 font-extrabold text-xs shadow-sm">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Missions du jour • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Progression : {completedCount} / {challenges.length} accomplis !
          </h3>

          {/* Progress Bar */}
          <div className="w-full max-w-md h-5 bg-black/10 rounded-full p-1 overflow-hidden border border-white/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow"
            />
          </div>

          <p className="text-xs sm:text-sm font-extrabold text-slate-800">
            {isAllCompleted
              ? "🎉 Bravo Champ ! Tu as accompli toutes tes missions aujourd'hui !"
              : "Complète chaque mission pour débloquer le Trésor Bonus d'Étoiles ! 🌟"}
          </p>
        </div>

        <div className="shrink-0 flex justify-center z-10">
          <MascotFanti
            size="md"
            outfit={user.currentOutfit}
            world={user.currentWorld}
            interactive={true}
            speechBubble={
              isAllCompleted
                ? "Youpi ! Tu es le roi des défis aujourd'hui ! 🏆"
                : `Encore ${challenges.length - completedCount} défis à faire ! On y va ! 🚀`
            }
          />
        </div>
      </div>

      {/* Daily Challenges Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-3xl p-6 shadow-xl border-4 flex flex-col justify-between h-80 transition-all relative overflow-hidden ${
              challenge.completed
                ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-300 text-white"
                : "bg-white border-amber-300 text-slate-900"
            }`}
          >
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl p-2 bg-amber-100/80 rounded-2xl shadow-inner">
                  {challenge.icon}
                </span>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-900 font-black text-xs rounded-full shadow border border-white">
                  <Star className="w-4 h-4 fill-amber-900 text-amber-900" />
                  <span>+{challenge.rewardStars} Étoiles</span>
                </div>
              </div>

              <h4
                className={`text-xl font-black mb-2 ${
                  challenge.completed ? "text-yellow-200 drop-shadow" : "text-slate-900"
                }`}
              >
                {challenge.title}
              </h4>

              <p
                className={`text-xs sm:text-sm font-bold leading-relaxed ${
                  challenge.completed ? "text-emerald-100" : "text-slate-600"
                }`}
              >
                {challenge.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200/40 space-y-2">
              {challenge.completed ? (
                <div className="w-full py-3 bg-white/20 backdrop-blur rounded-2xl font-black text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow border border-white/40">
                  <CheckCircle2 className="w-5 h-5 text-yellow-300" />
                  <span>Défi Terminé ! (+{challenge.rewardStars} ⭐)</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      soundFx.playTap();
                      onNavigate(challenge.targetScreen);
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md border border-white/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span>Commencer la mission ▶</span>
                  </button>

                  <button
                    onClick={() => handleCompleteChallenge(challenge.id)}
                    className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow border border-emerald-300 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-yellow-200" />
                    <span>Valider & Réclamer les ⭐</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Daily Grand Chest Bonus Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
          isAllCompleted
            ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white border-yellow-300 animate-pulse"
            : "bg-slate-100 border-slate-300 text-slate-700 opacity-80"
        }`}
      >
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-4 bg-yellow-400 text-slate-900 rounded-3xl text-5xl shadow-lg border-2 border-white shrink-0">
            🎁
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-300 text-slate-900 font-black text-xs rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>Trésor Bonus du Jour</span>
            </div>
            <h3 className="text-2xl font-black text-white drop-shadow">
              Coffre aux Merveilles (+25 Étoiles & +60 XP)
            </h3>
            <p className="text-xs sm:text-sm font-semibold max-w-lg">
              {isAllCompleted
                ? bonusClaimed
                  ? "🎉 Tu as déjà récupéré ton coffre magique aujourd'hui ! Reviens demain !"
                  : "🌟 Félicitations ! Clique pour ouvrir ton Trésor Bonus d'Étoiles !"
                : "Termine les 3 défis ci-dessus pour débloquer ce super Coffre Magique !"}
            </p>
          </div>
        </div>

        <div>
          {isAllCompleted ? (
            bonusClaimed ? (
              <div className="px-6 py-3 bg-white/20 backdrop-blur text-yellow-200 font-black rounded-2xl border border-white/40 text-sm">
                ✅ Trésor Récupéré !
              </div>
            ) : (
              <button
                onClick={handleClaimBonus}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-black text-base rounded-2xl shadow-xl border-2 border-white animate-bounce active:scale-95 transition-all flex items-center gap-2"
              >
                <Trophy className="w-6 h-6 text-amber-900" />
                <span>Ouvrir le Coffre ! 🌟</span>
              </button>
            )
          ) : (
            <div className="px-5 py-2.5 bg-slate-300 text-slate-600 font-black text-xs rounded-2xl border border-slate-400">
              🔒 Verrouillé ({completedCount}/3)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
