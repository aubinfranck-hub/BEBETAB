import React from "react";
import { UserProfile, ActiveScreen } from "../types";
import { soundFx } from "../utils/audio";
import { Home, Star, Globe2, Sparkles, Lock, Crown } from "lucide-react";

interface Props { user:UserProfile; activeScreen:ActiveScreen; onNavigate:(screen:ActiveScreen)=>void; onOpenParentalGate:()=>void; onToggleLanguage:()=>void; onOpenFantiChat:()=>void; onOpenAdminAdDashboard?:()=>void; onOpenPremium?:()=>void; }

export const Navbar: React.FC<Props> = ({user,activeScreen,onNavigate,onOpenParentalGate,onToggleLanguage,onOpenFantiChat,onOpenPremium}) => (
 <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b-4 border-sky-300 px-3 sm:px-6 py-2.5 shadow-lg flex items-center justify-between gap-3">
   <button onClick={()=>{soundFx.playTap();onNavigate("home")}} className="flex items-center gap-2">
     <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-md">🐘</div>
     <div className="hidden sm:block text-left"><div className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">BEBETAB</div><div className="text-[9px] font-black text-slate-500 tracking-[.2em] -mt-1">WORLD • KIDS</div></div>
   </button>
   <div className="flex items-center gap-2">
     <button onClick={()=>onNavigate("world")} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-100 text-sky-800 font-black text-xs"><Globe2 className="w-4 h-4"/><span>Monde</span></button>
     <div className="px-3 py-2 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-500"/>{user.stars}</div>
     <button onClick={onOpenFantiChat} className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-black text-xs flex items-center gap-1.5 shadow"><Sparkles className="w-4 h-4 text-yellow-300"/> <span className="hidden lg:inline">Fanti</span></button>
     {onOpenPremium && <button onClick={onOpenPremium} className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs flex items-center gap-1 shadow"><Crown className="w-4 h-4"/> <span className="hidden sm:inline">Premium</span></button>}\n     <button onClick={onToggleLanguage} className="px-3 py-2 rounded-xl bg-slate-100 text-slate-800 font-black text-xs border-2 border-slate-200">{user.language==="fr"?"FR":"EN"}</button>
     <button onClick={onOpenParentalGate} className="p-2 rounded-xl bg-rose-500 text-white shadow" title="Parents"><Lock className="w-4 h-4"/></button>
   </div>
 </header>
);
