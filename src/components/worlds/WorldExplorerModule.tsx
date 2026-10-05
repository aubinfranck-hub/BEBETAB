import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Globe2, MapPin, Play, Sparkles, Camera, BookOpen, PawPrint, Landmark, Waves, Rocket, Languages } from "lucide-react";
import { UserProfile } from "../../types";
import { MascotFanti } from "../MascotFanti";

interface Props { user: UserProfile; onBack: () => void; onOpenLive: () => void; onAwardXP?: (xp:number, stars:number) => void; }

const regions = [
  { name:"Afrique", emoji:"🦁", color:"from-amber-400 to-orange-500", places:["Abidjan","Nairobi","Le Caire"] },
  { name:"Europe", emoji:"🗼", color:"from-blue-400 to-indigo-500", places:["Paris","Rome","London"] },
  { name:"Asie", emoji:"🗻", color:"from-pink-400 to-purple-500", places:["Tokyo","Beijing","Seoul"] },
  { name:"Amérique", emoji:"🗽", color:"from-cyan-400 to-blue-600", places:["New York","Rio","Vancouver"] },
  { name:"Océanie", emoji:"🦘", color:"from-emerald-400 to-teal-600", places:["Sydney","Auckland","Great Barrier Reef"] },
  { name:"Antarctique", emoji:"🐧", color:"from-sky-200 to-blue-400", places:["Pôle Sud","Manchots","Glace"] },
];

const categories = [
  ["🏙️","Villes"],["🐾","Animaux"],["🏛️","Cultures"],["🗿","Monuments"],["🌳","Nature"],
  ["🐠","Océans"],["🪐","Espace"],["👩‍🚀","Métiers"],["🍲","Cuisine"],["🗣️","Langues"],["📜","Histoire"]
];

export const WorldExplorerModule: React.FC<Props> = ({ user, onBack, onOpenLive, onAwardXP }) => {
  const [selected, setSelected] = useState("Afrique");
  const region = regions.find(r=>r.name===selected) || regions[0];

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-5 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack} className="px-4 py-2.5 bg-white/90 rounded-2xl shadow-lg font-black text-slate-800 flex items-center gap-2 border-2 border-slate-200"><ArrowLeft className="w-5 h-5"/> Accueil</button>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-2xl shadow font-black text-slate-800"><Globe2 className="w-5 h-5 text-blue-500"/> Explorer le monde</div>
        <button onClick={onOpenLive} className="px-4 py-2.5 bg-rose-500 text-white rounded-2xl shadow-lg font-black flex items-center gap-2"><Camera className="w-5 h-5"/> LIVE WORLD</button>
      </div>

      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-400 via-cyan-300 to-blue-500 min-h-[430px] shadow-2xl border-4 border-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_25%),radial-gradient(circle_at_80%_30%,white_0,transparent_22%)]"/>
        <div className="absolute left-6 top-6 z-10">
          <MascotFanti size="md" mood="excited" interactive={true} speechBubble={user.language==="fr" ? "Où veux-tu voyager aujourd'hui ?" : "Where do you want to travel today?"}/>
        </div>
        <motion.div animate={{ rotate:[0,2,-2,0] }} transition={{ repeat:Infinity, duration:12 }} className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[330px] h-[330px] sm:w-[430px] sm:h-[430px] rounded-full bg-gradient-to-br from-emerald-300 via-blue-400 to-indigo-700 border-[12px] border-white/80 shadow-[0_30px_80px_rgba(15,23,42,.3)] flex items-center justify-center">
          <div className="text-[100px] sm:text-[130px] drop-shadow-xl">🌍</div>
          <div className="absolute top-12 left-16 text-5xl">🦒</div><div className="absolute bottom-20 right-14 text-5xl">🗼</div>
          <div className="absolute top-24 right-16 text-4xl">🗻</div><div className="absolute bottom-12 left-20 text-4xl">🐘</div>
        </motion.div>
        <div className="absolute right-5 top-5 w-[260px] hidden lg:block bg-white/95 rounded-3xl p-4 shadow-xl">
          <h3 className="font-black text-slate-900 mb-3">⭐ Lieux populaires</h3>
          {["Paris 🇫🇷","New York 🇺🇸","Nairobi 🇰🇪","Tokyo 🇯🇵","Le Caire 🇪🇬"].map((p,i)=><button key={p} onClick={()=>{onAwardXP?.(5,1)}} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-50 text-left font-black text-slate-700"><span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">{["🗼","🗽","🦁","🗻","🏺"][i]}</span>{p}<span className="ml-auto">›</span></button>)}
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <button onClick={onOpenLive} className="px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-lg shadow-2xl border-4 border-white flex items-center gap-3 active:scale-95"><Play className="fill-current"/> EXPLORER EN DIRECT</button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {regions.map(r=><button key={r.name} onClick={()=>setSelected(r.name)} className={`min-w-[145px] p-4 rounded-3xl text-white font-black shadow-lg border-4 transition-all ${selected===r.name ? "border-white scale-105" : "border-white/30 opacity-90"} bg-gradient-to-br ${r.color}`}><div className="text-4xl">{r.emoji}</div><div className="mt-1">{r.name}</div></button>)}
      </div>

      <div className="bg-white/90 rounded-3xl p-5 shadow-xl border-2 border-white">
        <div className="flex items-center justify-between mb-4"><div><h2 className="text-2xl font-black text-slate-900">{region.name}</h2><p className="text-sm font-semibold text-slate-500">Choisis une destination et découvre, regarde, joue.</p></div><Sparkles className="text-amber-400"/></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {region.places.map((place,i)=><motion.button key={place} whileTap={{scale:.97}} onClick={()=>onAwardXP?.(10,2)} className="text-left rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50 border-2 border-sky-100 shadow-md">
            <div className="h-28 flex items-center justify-center text-6xl bg-gradient-to-br from-sky-100 to-indigo-100">{["🏙️","🦁","🏛️"][i]}</div>
            <div className="p-4"><div className="flex items-center gap-2 font-black text-slate-900"><MapPin className="w-4 h-4 text-rose-500"/>{place}</div><div className="text-xs text-slate-500 font-bold mt-1">Vidéo • Live • Jeu</div></div>
          </motion.button>)}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {categories.map(([icon,label])=><button key={label} onClick={()=>onAwardXP?.(3,1)} className="bg-white rounded-2xl p-4 shadow-md border-2 border-slate-100 hover:border-sky-300 hover:-translate-y-1 transition-all font-black text-slate-700"><div className="text-3xl">{icon}</div><div className="text-xs mt-2">{label}</div></button>)}
      </div>
    </div>
  );
};
