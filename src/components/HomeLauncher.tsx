import React from "react";
import { motion } from "motion/react";
import { ActiveScreen, UserProfile } from "../types";
import { MascotFanti } from "./MascotFanti";
import { soundFx, speakText } from "../utils/audio";
import {
  BookOpen,
  Gamepad2,
  Palette,
  Music,
  BookMarked,
  HelpCircle,
  Trophy,
  Globe2,
  Tv,
  Lock,
  Sparkles,
  Volume2,
  Target,
  Flame,
} from "lucide-react";

interface HomeLauncherProps {
  user: UserProfile;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenFantiChat: () => void;
  onOpenParents: () => void;
}

export const HomeLauncher: React.FC<HomeLauncherProps> = ({
  user,
  onNavigate,
  onOpenFantiChat,
  onOpenParents,
}) => {
  const launchButtons = [
    {
      id: "defis" as ActiveScreen,
      title: "Défis Quotidiens",
      subtitle: "3 Missions du jour • Étoiles Bonus",
      icon: Target,
      gradient: "from-amber-400 via-orange-500 to-rose-600",
      borderColor: "border-amber-300",
      emoji: "🎯",
    },
    {
      id: "apprendre" as ActiveScreen,
      title: "Encarta des Petits",
      subtitle: "Encyclopédie • Espace, Dinosaures, Océans...",
      icon: BookOpen,
      gradient: "from-blue-500 via-sky-400 to-indigo-600",
      borderColor: "border-sky-300",
      emoji: "🌍",
    },
    {
      id: "jouer" as ActiveScreen,
      title: "Jouer",
      subtitle: "Puzzles, Ballons, Mémoire...",
      icon: Gamepad2,
      gradient: "from-emerald-500 via-teal-400 to-green-600",
      borderColor: "border-green-300",
      emoji: "🎮",
    },
    {
      id: "dessiner" as ActiveScreen,
      title: "Dessiner",
      subtitle: "Pinceaux, Paillettes, Tampons",
      icon: Palette,
      gradient: "from-pink-500 via-rose-400 to-red-500",
      borderColor: "border-pink-300",
      emoji: "🎨",
    },
    {
      id: "musique" as ActiveScreen,
      title: "Musique",
      subtitle: "Piano, Xylophone, Comptines",
      icon: Music,
      gradient: "from-purple-500 via-fuchsia-400 to-indigo-600",
      borderColor: "border-fuchsia-300",
      emoji: "🎵",
    },
    {
      id: "histoires" as ActiveScreen,
      title: "Histoires",
      subtitle: "Contes interactifs & Fanti IA",
      icon: BookMarked,
      gradient: "from-amber-500 via-orange-400 to-yellow-500",
      borderColor: "border-amber-300",
      emoji: "📖",
    },
    {
      id: "quiz" as ActiveScreen,
      title: "Quiz",
      subtitle: "Questions & Défis rigolos",
      icon: HelpCircle,
      gradient: "from-violet-600 via-purple-500 to-indigo-700",
      borderColor: "border-purple-300",
      emoji: "🧩",
    },
    {
      id: "recompenses" as ActiveScreen,
      title: "Récompenses",
      subtitle: "Badges, Costumes de Fanti",
      icon: Trophy,
      gradient: "from-yellow-400 via-amber-500 to-orange-600",
      borderColor: "border-yellow-200",
      emoji: "🏆",
    },
    {
      id: "mondes" as ActiveScreen,
      title: "Mondes",
      subtitle: "Jungle, Océan, Espace...",
      icon: Globe2,
      gradient: "from-teal-500 via-cyan-400 to-blue-600",
      borderColor: "border-cyan-300",
      emoji: "🌍",
    },
    {
      id: "videos" as ActiveScreen,
      title: "Vidéos",
      subtitle: "Comptines & Cartoons sécurisés",
      icon: Tv,
      gradient: "from-rose-600 via-red-500 to-orange-500",
      borderColor: "border-rose-300",
      emoji: "📺",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col items-center gap-6">
      {/* Welcome Banner with Mascot Fanti */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 rounded-3xl p-6 shadow-xl border-4 border-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex-1 text-center md:text-left space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur rounded-full text-slate-800 font-extrabold text-xs sm:text-sm shadow-sm border border-orange-200">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Bienvenue dans l'univers de Fanti !</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm">
            Prêt à apprendre en t'amusant ?
          </h2>
          <p className="text-slate-800 font-bold text-sm sm:text-base max-w-lg">
            Aventure-toi dans le monde <span className="text-purple-700 font-extrabold">{user.currentWorld}</span> avec Fanti, résous des énigmes et débloque de superbes récompenses !
          </p>

          <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
            <button
              onClick={() => {
                soundFx.playVictory();
                speakText("Bonjour ! Je suis Fanti l'éléphant, prêt pour la grande aventure ?");
              }}
              className="px-5 py-2.5 bg-white hover:bg-yellow-100 text-slate-900 font-black rounded-2xl shadow-md border-2 border-amber-300 flex items-center gap-2 active:scale-95 transition-all text-sm"
            >
              <Volume2 className="w-5 h-5 text-amber-500" />
              <span>Écouter Fanti</span>
            </button>

            <button
              onClick={onOpenFantiChat}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:scale-105 text-white font-black rounded-2xl shadow-lg border-2 border-white flex items-center gap-2 active:scale-95 transition-all text-sm"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
              <span>Gemini Live 🎙️ Vocal Lia</span>
            </button>
          </div>
        </div>

        {/* Mascot Mascot Visual */}
        <div className="shrink-0 flex justify-center z-10">
          <MascotFanti
            size="lg"
            outfit={user.currentOutfit}
            world={user.currentWorld}
            onOpenChat={onOpenFantiChat}
          />
        </div>
      </motion.div>

      {/* Featured Daily Challenges Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          soundFx.playTap();
          onNavigate("defis");
        }}
        className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-200 cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-between gap-4 text-white relative overflow-hidden group"
      >
        <div className="flex items-center gap-4 z-10">
          <div className="p-3 sm:p-4 bg-white/20 backdrop-blur rounded-2xl border-2 border-white/40 shadow-inner group-hover:rotate-12 transition-transform">
            <Target className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-yellow-300 text-slate-900 font-black text-xs rounded-full shadow mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>Nouveau • Missions du Jour</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow">
              3 Défis Quotidiens à relever ! 🎯
            </h3>
            <p className="text-xs sm:text-sm font-extrabold text-amber-100">
              Gagne jusqu'à +45 Étoiles bonus et un Coffre aux Trésors aujourd'hui !
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white text-slate-900 font-black px-5 py-3 rounded-2xl shadow-lg border-2 border-amber-200 text-xs sm:text-sm shrink-0 group-hover:bg-yellow-100 transition-colors">
          <span>Relever les Défis ▶</span>
        </div>
      </motion.div>

      {/* Grid of Launcher Activities */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {launchButtons.map((btn, index) => {
          const Icon = btn.icon;
          return (
            <motion.div
              key={btn.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundFx.playTap();
                onNavigate(btn.id);
              }}
              className={`cursor-pointer rounded-3xl p-5 bg-gradient-to-br ${btn.gradient} text-white shadow-xl border-4 ${btn.borderColor} flex items-center justify-between gap-4 relative overflow-hidden group`}
            >
              {/* Background ambient pattern glow */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />

              <div className="space-y-1 z-10">
                <span className="text-3xl block">{btn.emoji}</span>
                <h3 className="text-2xl font-black tracking-tight text-yellow-200 drop-shadow">
                  {btn.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-white/90">
                  {btn.subtitle}
                </p>
              </div>

              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-inner shrink-0 group-hover:rotate-12 transition-transform">
                <Icon className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Parents Access Footer Card */}
      <div className="w-full mt-2 bg-white/80 backdrop-blur rounded-2xl p-4 border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm">
              Espace Contrôle Parental & Statistiques
            </h4>
            <p className="text-xs text-slate-500">
              Gérer le temps d'écran, le niveau d'âge ({user.ageGroup} ans) et voir la progression.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenParents}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow transition-colors active:scale-95"
        >
          Ouvrir l'espace Parents
        </button>
      </div>
    </div>
  );
};
