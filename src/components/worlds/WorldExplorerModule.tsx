import React,{useState} from "react";
import { UserProfile } from "../../types";
import { ArrowLeft, Search, ChevronRight, Camera } from "lucide-react";
import { WorldMapIllustration, HeroFanti } from "../BebeTabArt";

interface Props{user:UserProfile;onBack:()=>void;onOpenLive:()=>void;onOpenCountry?:()=>void;onAwardXP?:(xp:number,stars:number)=>void}

const places=[["🗼","Paris","France"],["🗽","New York","États-Unis"],["🦒","Nairobi","Kenya"],["🗻","Tokyo","Japon"],["🏜️","Le Caire","Égypte"]];
const cats=[["🏙️","Villes"],["🦁","Animaux"],["🎭","Cultures"],["🏛️","Monuments"],["🌳","Nature"],["🐠","Oceans"],["🪐","Espace"],["🧑‍🚀","Métiers"],["🍲","Cuisine"],["🗣️","Langues"],["⌛","Histoire"]];
const continents=[["AMÉRIQUE","left-[15%] top-[35%]","bg-cyan-600"],["EUROPE","left-[46%] top-[22%]","bg-emerald-600"],["ASIE","left-[68%] top-[32%]","bg-orange-500"],["AFRIQUE","left-[47%] top-[54%]","bg-red-500"],["OCÉANIE","left-[76%] top-[69%]","bg-cyan-600"],["ANTARCTIQUE","left-[20%] top-[82%]","bg-blue-600"]];

export const WorldExplorerModule:React.FC<Props>=({user,onBack,onOpenLive,onOpenCountry,onAwardXP})=>{
 const [selected,setSelected]=useState("AFRIQUE");
 return <div className="min-h-screen bg-[#08a8e5]">
  <div className="max-w-[1536px] mx-auto px-4 sm:px-7 pt-4 pb-6">
   <div className="flex items-center justify-between text-white mb-3">
    <button onClick={onBack} className="w-12 h-12 rounded-full bg-white text-blue-700 shadow-xl flex items-center justify-center"><ArrowLeft/></button>
    <div className="flex items-center gap-3"><span className="text-4xl">🌍</span><div><div className="text-3xl sm:text-4xl font-black leading-none">EXPLORER LE MONDE</div><div className="text-xs font-bold">Découvre les pays, les cultures, les animaux, les villes et bien plus encore !</div></div></div>
    <div className="flex items-center gap-1"><button className="px-4 py-2 rounded-full bg-white text-slate-900 font-black">FR</button><button className="px-4 py-2 rounded-full bg-blue-700 text-white font-black">EN</button><button className="w-12 h-12 rounded-full bg-white text-blue-700 shadow-xl flex items-center justify-center"><Search/></button></div>
   </div>
   <div className="grid lg:grid-cols-[1fr_300px] gap-3">
    <section className="relative h-[600px] rounded-[34px] overflow-hidden border-4 border-white shadow-2xl bg-[#61d7f3]">
      <WorldMapIllustration/>
      <div className="absolute left-1 bottom-2 z-20 flex items-end"><HeroFanti small/><div className="bg-white rounded-[22px] border-4 border-slate-200 shadow-xl px-4 py-3 text-center font-black text-slate-900 leading-tight">Où veux-tu<br/>aller aujourd'hui ?<div className="text-xs">Touche un continent !</div></div></div>
      {continents.map(([n,pos,color])=><button key={n} onClick={()=>{setSelected(n);onAwardXP?.(5,1)}} className={`absolute z-10 ${pos} -translate-x-1/2 -translate-y-1/2 px-5 py-2 rounded-full border-2 border-white text-white font-black shadow-lg ${color}`}>{n}</button>)}
      <button onClick={onOpenLive} className="absolute bottom-4 left-1/2 -translate-x-1/2 px-8 py-3 rounded-[20px] bg-orange-500 text-white font-black text-lg border-4 border-white shadow-2xl">📷 EXPLORER EN DIRECT</button>
    </section>
    <aside className="bg-white rounded-[30px] p-3 shadow-2xl border-2 border-white">
      <div className="flex items-center justify-between px-2 py-2 text-slate-900 font-black text-xl">LIEUX POPULAIRES <span>⌕</span></div>
      {places.map(([e,city,country])=><button key={city} onClick={()=>{onAwardXP?.(5,1); if(city==="Paris") onOpenCountry?.();}} className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-sky-50 text-left"><div className="w-16 h-14 rounded-xl bg-sky-100 flex items-center justify-center text-3xl">{e}</div><div><div className="font-black text-slate-900">{city}</div><div className="text-xs font-bold text-slate-500">{country}</div></div><ChevronRight className="ml-auto text-slate-400"/></button>)}
    </aside>
   </div>
   <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2 bg-white rounded-[28px] p-3 shadow-xl">
    {cats.map(([e,t])=><button key={t} onClick={()=>onAwardXP?.(3,1)} className="rounded-2xl p-2 bg-white hover:bg-sky-50 border border-slate-100"><div className="text-3xl">{e}</div><div className="text-[11px] font-black text-slate-700">{t}</div></button>)}
   </div>
   <div className="mt-3 rounded-[24px] bg-white/95 p-3 shadow-xl text-slate-900 flex items-center justify-between"><div><b>{selected}</b><div className="text-xs font-bold text-slate-500">Découvre, regarde et joue dans cette région.</div></div><span className="px-3 py-2 rounded-full bg-blue-100 text-blue-700 font-black text-xs">+5 XP</span></div>
  </div>
 </div>
};