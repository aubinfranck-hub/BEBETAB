import React from "react";
import { UserProfile, ActiveScreen } from "../types";
import { soundFx } from "../utils/audio";
import { Home, Star, Settings, Crown, Globe2 } from "lucide-react";

interface Props {
  user: UserProfile;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenParentalGate: () => void;
  onToggleLanguage: () => void;
  onOpenFantiChat: () => void;
  onOpenAdminAdDashboard?: () => void;
  onOpenPremium?: () => void;
}

export const Navbar: React.FC<Props> = ({user, activeScreen, onNavigate, onOpenParentalGate, onToggleLanguage, onOpenPremium}) => {
  const home = activeScreen === "home";
  return (
    <header className={`z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 ${home ? "absolute top-0 left-0 right-0 bg-transparent" : "sticky top-0 bg-white/95 backdrop-blur-xl border-b-4 border-sky-300 shadow-lg"}`}>
      <button onClick={()=>{soundFx.playTap();onNavigate("home")}} className={`flex items-center gap-2 ${home ? "opacity-0 pointer-events-none" : ""}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shadow">🐘</div>
        <div className="text-left"><div className="text-xl font-black text-blue-700">BEBETAB</div><div className="text-[8px] font-black text-slate-500 tracking-[.18em]">WORLD • KIDS</div></div>
      </button>
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        <div className="hidden sm:flex items-center gap-2 bg-white/95 rounded-full px-3 py-1.5 shadow-lg border-2 border-sky-100">
          <div className="w-8 h-8 rounded-full bg-amber-300 flex items-center justify-center">👦🏾</div>
          <span className="font-black text-slate-800">{user.name}</span>
          <Star className="w-5 h-5 fill-amber-400 text-amber-500"/><b>{user.stars.toLocaleString("fr-FR")}</b>
          <span className="text-[10px] font-black text-slate-500">NIVEAU {user.level}</span>
          <div className="w-24 h-3 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-gradient-to-r from-lime-400 via-yellow-400 to-orange-500" style={{width:`${Math.min(100,(user.xp%100))}%`}}/></div>
        </div>
        {onOpenPremium && <button onClick={onOpenPremium} className="px-3 py-2 rounded-full bg-white/95 shadow font-black text-xs text-slate-800"><Crown className="inline w-4 h-4 text-amber-500"/> Premium</button>}
        <button onClick={onToggleLanguage} className="px-3 py-2 rounded-full bg-white/95 shadow font-black text-xs">{user.language==="fr"?"FR":"EN"}</button>
        <button onClick={onToggleLanguage} className="hidden sm:block px-3 py-2 rounded-full bg-blue-600 text-white shadow font-black text-xs">{user.language==="fr"?"EN":"FR"}</button>
        <button onClick={onOpenParentalGate} className="p-2.5 rounded-full bg-white/95 text-blue-700 shadow"><Settings className="w-5 h-5"/></button>
      </div>
    </header>
  );
};