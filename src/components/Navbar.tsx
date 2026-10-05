import React from "react";
import { UserProfile, WorldTheme, ActiveScreen } from "../types";
import { soundFx } from "../utils/audio";
import { Sparkles, Star, Gem, Lock, Globe, Home, Volume2, Tv } from "lucide-react";

interface NavbarProps {
  user: UserProfile;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenParentalGate: () => void;
  onToggleLanguage: () => void;
  onOpenFantiChat: () => void;
  onOpenAdminAdDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeScreen,
  onNavigate,
  onOpenParentalGate,
  onToggleLanguage,
  onOpenFantiChat,
  onOpenAdminAdDashboard,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-yellow-400 px-3 py-2 sm:px-6 sm:py-3 shadow-lg flex items-center justify-between gap-2 select-none">
      {/* Brand & Home Navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        {activeScreen !== "home" && (
          <button
            onClick={() => {
              soundFx.playTap();
              onNavigate("home");
            }}
            className="p-2 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-black rounded-2xl shadow-md border-2 border-white flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Accueil</span>
          </button>
        )}

        <div
          onClick={() => {
            soundFx.playTap();
            onNavigate("home");
          }}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-transform border-2 border-white">
            <span className="text-2xl">🐘</span>
          </div>
          <div className="hidden xs:block">
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 drop-shadow-sm">
              BéBé-TAB
            </h1>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest block -mt-1">
              Kids World
            </span>
          </div>
        </div>
      </div>

      {/* Stats Badges (Stars, Diamonds, XP, Age) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* World Badge */}
        <button
          onClick={() => {
            soundFx.playTap();
            onNavigate("mondes");
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 rounded-xl text-sky-800 text-xs font-black shadow-sm"
        >
          <span>🌍</span>
          <span>{user.currentWorld}</span>
        </button>

        {/* Stars */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 border-2 border-amber-300 rounded-xl text-amber-900 font-black text-xs sm:text-sm shadow-sm">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-bounce" />
          <span>{user.stars}</span>
        </div>

        {/* Diamonds */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-cyan-100 border-2 border-cyan-300 rounded-xl text-cyan-900 font-black text-xs sm:text-sm shadow-sm">
          <Gem className="w-4 h-4 text-cyan-500 fill-cyan-400" />
          <span>{user.diamonds}</span>
        </div>

        {/* Age Badge */}
        <span className="px-2.5 py-1 bg-purple-100 border-2 border-purple-300 rounded-xl text-purple-900 font-black text-xs sm:text-sm">
          {user.ageGroup} ans
        </span>

        {/* Fanti AI Chat Quick Button */}
        <button
          onClick={() => {
            soundFx.playTrumpet();
            onOpenFantiChat();
          }}
          className="p-2 sm:px-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-md border-2 border-white flex items-center gap-1 transition-all"
          title="Lia Gemini Live 🎙️"
        >
          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
          <span className="hidden lg:inline text-xs font-black">Gemini Live 🎙️</span>
        </button>

        {/* Language FR/EN toggle */}
        <button
          onClick={onToggleLanguage}
          className="p-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-xl text-xs font-black text-slate-700 uppercase"
          title="Changer de langue"
        >
          <Globe className="w-4 h-4 inline mr-1" />
          {user.language}
        </button>

        {/* Parents Portal Button */}
        <button
          onClick={onOpenParentalGate}
          className="p-2 sm:px-3 sm:py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow border-2 border-white flex items-center gap-1"
          title="Contrôle Parental"
        >
          <Lock className="w-4 h-4" />
          <span className="hidden md:inline">Parents</span>
        </button>

        {/* Admin Ad Dashboard Button */}
        {onOpenAdminAdDashboard && (
          <button
            onClick={() => {
              soundFx.playTap();
              onOpenAdminAdDashboard();
            }}
            className="p-2 sm:px-3 sm:py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs rounded-xl shadow border-2 border-white flex items-center gap-1 transition-all"
            title="Régie Pub Live Admin"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden xl:inline">Régie Pub</span>
          </button>
        )}
      </div>
    </header>
  );
};
