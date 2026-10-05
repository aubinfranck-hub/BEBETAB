import React from "react";
import { ArrowLeft, Play, Camera, Gamepad2, HelpCircle, Image as ImageIcon, Music2 } from "lucide-react";
import { UserProfile } from "../types";
import { HeroFanti } from "./BebeTabArt";

interface Props{user:UserProfile;onBack:()=>void;onAwardXP?:(xp:number,stars:number)=>void}
const cards=[["🗼","Monuments","Découvre la Tour Eiffel et les grands monuments."],["🎭","Culture","Arts, traditions et vie quotidienne."],["🦁","Animaux","Les animaux de France et d'Europe."],["🍲","Gastronomie","Découvre les spécialités françaises."],["🏙️","Villes","Paris, Lyon, Marseille et plus encore."],["🏛️","Histoire","Les grandes étapes de l'histoire de France."]];
const actions=[["🎬","Vidéos"],["📷","Live de pays"],["🎮","Jeux"],["❓","Quiz"],["🖼️","Images"],["🎵","Musique"]];
export const CountryModule:React.FC<Props>=({user,onBack,onAwardXP})=><div className="min-h-[650px] rounded-[34px] overflow-hidden bg-[linear-gradient(180deg,#46c7f0,#c5f3ff_68%,#e8b260)] border-4 border-white shadow-2xl">
 <div className="relative min-h-[650px]">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.7),transparent_18%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,.6),transparent_15%)]"/>
  <div className="absolute left-0 right-0 bottom-0 h-48 bg-gradient-to-t from-[#d99a4d] to-transparent"/>
  <div className="relative z-10 grid lg:grid-cols-[28%_42%_30%] items-center min-h-[650px] px-5">
   <div className="self-end flex items-end gap-1"><HeroFanti small/><div className="mb-20 bg-white rounded-[22px] border-4 border-slate-200 shadow-xl p-4 font-black text-slate-900 text-center">Bienvenue en France !<div className="text-xs font-bold mt-1">Découvre sa culture,<br/>ses monuments et ses habitudes.</div></div></div>
   <div className="flex flex-col items-center">
    <div className="text-8xl drop-shadow">🗼</div><div className="text-5xl mt-[-18px]">🏙️ 🏰 🥐</div>
    <div className="mt-3 text-center"><div className="text-5xl font-black text-white drop-shadow-[0_3px_0_#155e75]">FRANCE 🇫🇷</div><div className="font-black text-slate-800">Europe &gt; France</div></div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
      {cards.map(([e,t,d])=><button key={t} onClick={()=>onAwardXP?.(8,1)} className="w-[120px] rounded-2xl bg-white/95 p-2 shadow-xl border-2 border-white hover:-translate-y-1 transition"><div className="h-16 rounded-xl bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center text-4xl">{e}</div><b className="block text-xs mt-1">{t}</b><span className="hidden sm:block text-[9px] text-slate-500 font-bold">{d}</span></button>)}
    </div>
   </div>
   <div className="bg-white/95 rounded-[28px] p-4 shadow-2xl"><div className="text-xl font-black mb-2">Découvrir la France</div>{cards.slice(0,6).map(([e,t])=><button key={t} onClick={()=>onAwardXP?.(5,1)} className="w-[48%] inline-flex m-[1%] items-center gap-2 rounded-2xl bg-slate-50 border-2 border-slate-100 p-2 text-left"><span className="text-3xl">{e}</span><b className="text-xs">{t}</b></button>)}</div>
  </div>
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-white/95 rounded-2xl p-2 shadow-xl">{actions.map(([e,t])=><button key={t} onClick={()=>onAwardXP?.(3,1)} className="min-w-[80px] rounded-xl p-2 bg-slate-50 font-black text-[10px]"><div className="text-2xl">{e}</div>{t}</button>)}</div>
 </div>
</div>;