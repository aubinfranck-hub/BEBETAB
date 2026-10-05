import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Search, Camera, ChevronRight, Globe2, Map, PawPrint, Landmark, Trees, Waves, Rocket, BriefcaseBusiness, Utensils, Languages, History, Building2 } from "lucide-react";
import { UserProfile } from "../../types";
import { MascotFanti } from "../MascotFanti";

interface Props { user: UserProfile; onBack:()=>void; onOpenLive:()=>void; onAwardXP?:(xp:number,stars:number)=>void; }

const regions = [
  {name:"AMÉRIQUE", emoji:"🗽", pos:"left-[13%] top-[35%]", color:"bg-cyan-500"},
  {name:"EUROPE", emoji:"🏰", pos:"left-[45%] top-[24%]", color:"bg-emerald-500"},
  {name:"ASIE", emoji:"🏯", pos:"left-[66%] top-[32%]", color:"bg-orange-500"},
  {name:"AFRIQUE", emoji:"🐘", pos:"left-[45%] top-[52%]", color:"bg-red-500"},
  {name:"OCÉANIE", emoji:"🦘", pos:"left-[75%] top-[68%]", color:"bg-cyan-500"},
  {name:"ANTARCTIQUE", emoji:"🐧", pos:"left-[20%] top-[73%]", color:"bg-blue-500"},
];

const popular = [
  ["🗼","Paris","France"],["🗽","New York","États-Unis"],["🦒","Nairobi","Kenya"],["🗻","Tokyo","Japon"],["🏜️","Le Caire","Égypte"]
];

const cats = [
  ["🏙️","Villes",Building2],["🦁","Animaux",PawPrint],["🎭","Cultures",Globe2],["🏛️","Monuments",Landmark],["🌳","Nature",Trees],["🐠","Océans",Waves],["🪐","Espace",Rocket],["🧑‍🚀","Métiers",BriefcaseBusiness],["🍲","Cuisine",Utensils],["🗣️","Langues",Languages],["📜","Histoire",History]
] as const;

export const WorldExplorerModule: React.FC<Props> = ({user,onBack,onOpenLive,onAwardXP}) => {
  const [selected,setSelected]=useState("AFRIQUE");
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[linear-gradient(180deg,#079ee7,#67d8ef_52%,#dff7ff)]">
      <div className="max-w-[1550px] mx-auto px-3 sm:px-5 py-4">
        <div className="flex items-center justify-between mb-3 text-white">
          <button onClick={onBack} className="w-11 h-11 rounded-full bg-white text-blue-700 shadow-xl flex items-center justify-center"><ArrowLeft/></button>
          <div className="flex items-center gap-2"><span className="text-3xl">🌍</span><div><div className="text-3xl font-black leading-none">EXPLORER LE MONDE</div><div className="text-xs font-bold opacity-90">Découvre les pays, les cultures, les animaux, les villes et bien plus encore !</div></div></div>
          <div className="flex items-center gap-2"><button className="px-4 py-2 rounded-full bg-white text-slate-900 font-black text-sm">{user.language==="fr"?"FR":"EN"}</button><button className="px-4 py-2 rounded-full bg-blue-700 text-white font-black text-sm">{user.language==="fr"?"EN":"FR"}</button><button className="w-11 h-11 rounded-full bg-white text-blue-700 shadow-xl flex items-center justify-center"><Search/></button></div>
        </div>

        <div className="grid lg:grid-cols-[1fr_285px] gap-3">
          <section className="relative min-h-[570px] rounded-[34px] overflow-hidden bg-[linear-gradient(180deg,#35c8f3,#b7f2ff)] border-4 border-white shadow-2xl">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_15%,white_0,transparent_18%),radial-gradient(circle_at_75%_10%,white_0,transparent_15%)]"/>
            <div className="absolute left-2 bottom-4 z-20"><MascotFanti size="md" mood="excited" interactive speechBubble="Où veux-tu aller aujourd'hui ? Touche un continent !" /></div>
            <div className="absolute inset-x-4 top-8 bottom-16 rounded-[45%] bg-[radial-gradient(ellipse_at_center,#7dd3fc,#22aee0_55%,#1680c0)] border-[5px] border-white/50 shadow-inner"/>
            {regions.map(r=>(
              <button key={r.name} onClick={()=>{setSelected(r.name);onAwardXP?.(5,1)}} className={`absolute z-10 ${r.pos} -translate-x-1/2 -translate-y-1/2 `}>
                <div className={`${r.color} px-5 py-2 rounded-full text-white font-black shadow-lg border-2 border-white text-sm sm:text-base`}>{r.emoji} {r.name}</div>
              </button>
            ))}
            <div className="absolute left-[18%] top-[17%] text-5xl">🦅</div><div className="absolute left-[35%] top-[14%] text-5xl">✈️</div><div className="absolute left-[53%] top-[9%] text-5xl">🎈</div><div className="absolute left-[78%] top-[17%] text-5xl">🎈</div>
            <div className="absolute left-[41%] top-[39%] text-6xl">🐘</div><div className="absolute left-[67%] top-[45%] text-6xl">🦒</div><div className="absolute left-[77%] top-[70%] text-5xl">🐘</div>
            <div className="absolute left-[54%] top-[66%] text-5xl">🚢</div><div className="absolute left-[26%] top-[65%] text-5xl">🐋</div>
            <div className="absolute left-[48%] top-[44%] text-5xl">🏜️</div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <button onClick={onOpenLive} className="px-8 py-3 rounded-[22px] bg-orange-500 text-white font-black text-lg shadow-xl border-4 border-white flex items-center gap-2"><Camera className="w-6 h-6"/> EXPLORER EN DIRECT</button>
            </div>
          </section>

          <aside className="rounded-[30px] bg-white/95 p-3 shadow-2xl border-2 border-white">
            <div className="flex items-center justify-between px-2 py-2"><div className="text-lg font-black text-slate-900">LIEUX POPULAIRES</div><Map className="w-5 h-5 text-blue-500"/></div>
            {popular.map(([emoji,city,country])=>(
              <button key={city} onClick={()=>onAwardXP?.(5,1)} className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-sky-50 transition text-left">
                <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center text-3xl">{emoji}</div>
                <div className="min-w-0"><div className="font-black text-slate-900 truncate">{city}</div><div className="text-xs font-bold text-slate-500">{country}</div></div><ChevronRight className="ml-auto text-slate-400"/>
              </button>
            ))}
          </aside>
        </div>

        <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2 overflow-x-auto">
          {cats.map(([emoji,label,Icon])=>(
            <button key={label} onClick={()=>onAwardXP?.(3,1)} className="min-w-[82px] rounded-2xl bg-white border-2 border-slate-100 shadow-md p-2.5 hover:-translate-y-1 transition">
              <div className="w-11 h-11 mx-auto rounded-xl bg-sky-100 flex items-center justify-center text-2xl">{emoji}</div>
              <div className="text-[11px] font-black text-slate-700 mt-1 text-center">{label}</div>
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-3xl bg-white/95 p-4 shadow-xl flex items-center justify-between">
          <div><div className="text-xl font-black text-slate-900">{selected}</div><div className="text-sm font-bold text-slate-500">Choisis un lieu pour découvrir, regarder et jouer.</div></div>
          <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-black text-sm">+5 XP à chaque découverte</div>
        </div>
      </div>
    </div>
  );
};