import React from "react";
import { ActiveScreen, UserProfile } from "../types";
import { ArrowLeft, Settings, Star, Gift, Search } from "lucide-react";

const titles:Record<string,[string,string,string]>={
 apprendre:["📖","APPRENDRE","Choisis une matière et commence à apprendre !"],
 jouer:["🎮","JOUER","Des jeux éducatifs pour apprendre en s'amusant !"],
 histoires:["📚","HISTOIRES","Écoute, lis et vis des histoires incroyables avec Fanti !"],
 dessiner:["🎨","DESSINER","Laisse libre cours à ton imagination !"],
 musique:["🎵","MUSIQUE","Chante, joue et crée ta musique !"],
 live:["📷","LIVE WORLD","Regarde le monde en direct !"],
 world:["🌍","EXPLORER LE MONDE","Découvre les pays, les cultures, les animaux, les villes et bien plus encore !"],
 videos:["🎬","VIDÉOS","Regarde, observe et apprends !"],
 quiz:["🧠","QUIZ","Teste tes connaissances avec Fanti !"],
 recompenses:["⭐","MES RÉCOMPENSES","Collectionne tes étoiles et tes badges !"],
 defis:["🏆","DÉFIS DU JOUR","Une nouvelle mission chaque jour !"],
 mondes:["🌎","MES MONDES","Choisis ton univers d'aventure !"]
};

interface Props{screen:ActiveScreen;user:UserProfile;onBack:()=>void;onOpenParents:()=>void;children:React.ReactNode}
export const BebeTabFrame:React.FC<Props>=({screen,user,onBack,onOpenParents,children})=>{
 const [icon,title,sub]=titles[screen]||["🌍","BEBETAB WORLD","Le monde dans tes mains"];
 return <div className="min-h-screen bg-[linear-gradient(180deg,#0ba9e7_0%,#58d5ee_56%,#efbd68_100%)] text-slate-900 relative overflow-hidden">
   <div className="absolute inset-0 pointer-events-none opacity-70">
     <div className="absolute -top-20 -left-20 w-96 h-48 bg-white/35 rounded-full blur-3xl"/>
     <div className="absolute top-10 right-10 w-80 h-40 bg-white/30 rounded-full blur-3xl"/>
     <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#df9c49]/80 to-transparent"/>
   </div>
   <header className="relative z-20 max-w-[1536px] mx-auto px-4 sm:px-7 pt-3">
     <div className="h-[68px] rounded-[25px] bg-white/95 border-4 border-white shadow-[0_8px_25px_rgba(0,60,100,.25)] flex items-center gap-3 px-3">
       <button onClick={onBack} className="w-11 h-11 rounded-full bg-white shadow border-2 border-sky-200 text-blue-700 flex items-center justify-center"><ArrowLeft/></button>
       <div className="flex items-center gap-2 min-w-0">
         <span className="text-3xl">{icon}</span><div className="min-w-0"><div className="text-xl sm:text-3xl font-black leading-none text-blue-800 truncate">{title}</div><div className="hidden sm:block text-[11px] font-bold text-slate-500 truncate">{sub}</div></div>
       </div>
       <div className="ml-auto hidden sm:flex items-center gap-3 rounded-full px-4 py-2 bg-slate-50 border-2 border-slate-100">
         <div className="w-8 h-8 rounded-full bg-amber-300 flex items-center justify-center">👦🏾</div><b>{user.name}</b><Star className="w-5 h-5 fill-amber-400 text-amber-500"/><b>{user.stars.toLocaleString("fr-FR")}</b><Gift className="w-5 h-5 text-rose-500"/><b className="text-xs">Niveau {user.level}</b><div className="w-24 h-3 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-gradient-to-r from-lime-400 to-orange-400" style={{width:`${Math.min(100,user.xp%100)}%`}}/></div>
       </div>
       <button className="px-3 py-2 rounded-full bg-blue-600 text-white font-black text-xs">FR</button>
       <button className="px-3 py-2 rounded-full bg-white border-2 border-sky-200 text-blue-700 font-black text-xs">EN</button>
       <button onClick={onOpenParents} className="w-10 h-10 rounded-full bg-white border-2 border-sky-200 text-blue-700 flex items-center justify-center"><Settings/></button>
     </div>
   </header>
   <main className="relative z-10 max-w-[1536px] mx-auto px-3 sm:px-6 py-3">{children}</main>
 </div>
};