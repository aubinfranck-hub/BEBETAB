import React from "react";
import { motion } from "motion/react";
import { ActiveScreen, UserProfile } from "../types";
import { MascotFanti } from "./MascotFanti";
import { soundFx, speakText } from "../utils/audio";
import { Globe2, BookOpen, Gamepad2, BookMarked, Music, Palette, Tv, Trophy, Sparkles, Volume2, Lock, Play } from "lucide-react";

interface Props { user: UserProfile; onNavigate:(screen:ActiveScreen)=>void; onOpenFantiChat:()=>void; onOpenParents:()=>void; }

const cards = [
 {id:"world", title:"MONDE", sub:"Explore les pays et les cultures", emoji:"🌍", color:"from-emerald-500 to-cyan-500"},
 {id:"apprendre", title:"APPRENDRE", sub:"Sciences, maths, langues...", emoji:"📚", color:"from-blue-500 to-indigo-600"},
 {id:"jouer", title:"JOUER", sub:"Puzzles, mémoire, logique", emoji:"🎮", color:"from-green-500 to-teal-600"},
 {id:"histoires", title:"HISTOIRES", sub:"Contes interactifs avec Fanti", emoji:"📖", color:"from-orange-400 to-pink-500"},
 {id:"live", title:"LIVE WORLD", sub:"Villes, nature et lieux du monde", emoji:"📺", color:"from-cyan-500 to-blue-700"},
 {id:"musique", title:"MUSIQUE", sub:"Chante, joue et découvre", emoji:"🎵", color:"from-purple-500 to-fuchsia-600"},
 {id:"dessiner", title:"DESSINER", sub:"Crée ton propre monde", emoji:"🎨", color:"from-pink-500 to-rose-600"},
 {id:"recompenses", title:"MES RÉCOMPENSES", sub:"Badges et aventures", emoji:"⭐", color:"from-yellow-400 to-orange-500"},
] as const;

export const HomeLauncher: React.FC<Props> = ({user,onNavigate,onOpenFantiChat,onOpenParents}) => (
 <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-5 space-y-5">
   <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-400 p-5 sm:p-7 shadow-2xl border-4 border-white min-h-[390px]">
     <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_10%_20%,white_0,transparent_25%),radial-gradient(circle_at_90%_20%,white_0,transparent_22%)]"/>
     <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5">
       <div className="w-full lg:w-[30%]">
         <div className="inline-flex px-4 py-2 rounded-full bg-white/90 text-slate-800 font-black text-xs shadow mb-3">🌍 LE NOUVEL ENCARTA POUR ENFANTS</div>
         <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight drop-shadow-lg">Le monde<br/>est ton terrain<br/>de jeu.</h2>
         <p className="mt-3 text-slate-800 font-bold max-w-sm">Découvre, joue, écoute, observe et apprends avec Fanti.</p>
         <div className="flex gap-2 mt-4">
           <button onClick={()=>{soundFx.playTap();onNavigate("world")}} className="px-5 py-3 bg-orange-500 text-white rounded-2xl font-black shadow-xl border-2 border-white flex items-center gap-2"><Globe2 className="w-5 h-5"/> Explorer</button>
           <button onClick={onOpenFantiChat} className="px-4 py-3 bg-white/90 text-slate-900 rounded-2xl font-black shadow-xl flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500"/> Fanti</button>
         </div>
       </div>
       <div className="relative flex-1 min-h-[300px] w-full flex items-center justify-center">
         <motion.div animate={{rotate:[0,2,-2,0]}} transition={{repeat:Infinity,duration:12}} className="w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] rounded-full bg-gradient-to-br from-emerald-300 via-blue-400 to-indigo-700 border-[10px] border-white/80 shadow-[0_25px_70px_rgba(15,23,42,.3)] flex items-center justify-center">
           <span className="text-[110px] sm:text-[145px]">🌍</span>
           <span className="absolute -top-3 left-12 text-5xl">🎈</span><span className="absolute top-10 -right-4 text-5xl">🗼</span><span className="absolute bottom-8 -left-7 text-5xl">🐘</span><span className="absolute -bottom-2 right-10 text-5xl">🦁</span>
         </motion.div>
       </div>
       <div className="w-full lg:w-[27%] space-y-3">
         <div className="bg-white/95 rounded-3xl p-4 shadow-xl">
           <div className="flex items-center justify-between"><span className="font-black text-slate-900">🔴 LIVE WORLD</span><button onClick={()=>onNavigate("live")} className="text-xs font-black text-blue-600">Voir tout ›</button></div>
           <div className="mt-3 h-28 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center text-6xl">🦒</div>
           <div className="mt-2 text-sm font-black text-slate-900">Observe la nature en direct !</div>
         </div>
         <div className="bg-white/95 rounded-3xl p-4 shadow-xl">
           <div className="font-black text-slate-900">Aujourd'hui avec Fanti</div>
           <div className="grid grid-cols-4 gap-2 mt-3">{["🦁","🎮","📖","🎵"].map((e,i)=><button key={i} className="rounded-xl bg-slate-100 p-3 text-2xl">{e}</button>)}</div>
         </div>
       </div>
     </div>
   </section>

   <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
     {cards.map((c,i)=><motion.button key={c.id} whileHover={{y:-4,scale:1.02}} whileTap={{scale:.97}} onClick={()=>{soundFx.playTap();onNavigate(c.id as ActiveScreen)}} className={`text-left rounded-3xl p-4 sm:p-5 text-white shadow-xl border-4 border-white/80 bg-gradient-to-br ${c.color}`}>
       <div className="flex items-start justify-between gap-2"><span className="text-4xl sm:text-5xl">{c.emoji}</span><span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"><Play className="w-4 h-4 fill-current"/></span></div>
       <div className="mt-3 font-black text-lg sm:text-xl">{c.title}</div><div className="text-xs font-bold text-white/90 mt-1">{c.sub}</div>
     </motion.button>)}
   </section>

   <section className="rounded-3xl bg-white/90 p-4 shadow-xl border-2 border-white flex flex-wrap items-center justify-between gap-4">
     <div className="flex items-center gap-3"><MascotFanti size="sm" mood="happy" interactive={true}/><div><div className="font-black text-slate-900">Bonjour {user.name} ! 🐘</div><div className="text-xs font-bold text-slate-500">Niveau {user.level} • ⭐ {user.stars} • {user.language.toUpperCase()}</div></div></div>
     <div className="flex gap-2">
       <button onClick={()=>speakText("Bonjour ! Je suis Fanti. Prêt pour une nouvelle aventure ?")} className="px-4 py-2.5 rounded-xl bg-amber-100 text-amber-900 font-black text-xs flex items-center gap-2"><Volume2 className="w-4 h-4"/> Écouter Fanti</button>
       <button onClick={onOpenParents} className="px-4 py-2.5 rounded-xl bg-rose-500 text-white font-black text-xs flex items-center gap-2"><Lock className="w-4 h-4"/> Parents</button>
     </div>
   </section>
 </div>
);
