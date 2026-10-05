import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Camera, MapPin, Play, Globe2, PawPrint, Building2, Waves, Sparkles } from "lucide-react";
import { UserProfile } from "../../types";
import { MascotFanti } from "../MascotFanti";

interface Props { user: UserProfile; onBack:()=>void; onOpenWorld:()=>void; }

const cams = [
  {city:"Nairobi", country:"Kenya", emoji:"🦁", type:"Nature", source:"Explore.org", color:"from-amber-400 to-orange-500"},
  {city:"Times Square", country:"USA", emoji:"🌆", type:"Ville", source:"EarthCam", color:"from-blue-400 to-indigo-600"},
  {city:"Paris", country:"France", emoji:"🗼", type:"Monument", source:"Webcam sélectionnée", color:"from-pink-400 to-rose-500"},
  {city:"Cape Town", country:"South Africa", emoji:"🌊", type:"Ville & Océan", source:"Caméra publique", color:"from-cyan-400 to-teal-600"},
  {city:"Tokyo", country:"Japan", emoji:"🗻", type:"Ville", source:"Caméra sélectionnée", color:"from-purple-400 to-indigo-600"},
  {city:"Savane africaine", country:"Afrique", emoji:"🐘", type:"Animaux", source:"Explore.org", color:"from-green-400 to-emerald-600"},
];

export const LiveWorldModule: React.FC<Props> = ({user,onBack,onOpenWorld}) => {
 const [selected,setSelected]=useState(cams[0]);
 return <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-5 space-y-5">
   <div className="flex items-center justify-between gap-3">
     <button onClick={onBack} className="px-4 py-2.5 bg-white rounded-2xl shadow font-black text-slate-800 flex items-center gap-2"><ArrowLeft className="w-5 h-5"/> Accueil</button>
     <div className="px-4 py-2.5 bg-white rounded-2xl shadow font-black flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"/> LIVE WORLD</div>
     <button onClick={onOpenWorld} className="px-4 py-2.5 bg-sky-500 text-white rounded-2xl shadow font-black flex items-center gap-2"><Globe2 className="w-5 h-5"/> Monde</button>
   </div>
   <div className="grid lg:grid-cols-[1.6fr_.8fr] gap-5">
     <div className="rounded-[32px] bg-slate-950 p-4 shadow-2xl">
       <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-sky-500 via-indigo-600 to-slate-900 flex items-center justify-center">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.18),transparent_35%)]"/>
         <motion.div animate={{scale:[1,1.04,1]}} transition={{repeat:Infinity,duration:4}} className="text-[130px]">{selected.emoji}</motion.div>
         <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-black flex items-center gap-2"><span className="w-2 h-2 bg-white rounded-full animate-pulse"/> EN DIRECT</div>
         <div className="absolute bottom-4 left-4 text-white"><div className="text-2xl font-black">{selected.city}</div><div className="text-sm font-bold opacity-90">{selected.country} • {selected.type}</div></div>
         <button className="absolute right-4 bottom-4 w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl"><Play className="fill-current ml-1"/></button>
       </div>
       <div className="p-4"><div className="flex items-center gap-2 text-sky-300 font-black"><Camera className="w-4 h-4"/> Source : {selected.source}</div><p className="text-white font-bold mt-2">{user.language==="fr" ? "Observe bien : Fanti va te donner une mission pendant le direct !" : "Look carefully: Fanti will give you a mission during the live stream!"}</p></div>
     </div>
     <div className="bg-white rounded-[32px] p-4 shadow-xl">
       <h2 className="text-xl font-black text-slate-900 mb-3">🌍 Choisir une caméra</h2>
       <div className="space-y-2 max-h-[560px] overflow-auto">
       {cams.map(c=><button key={c.city} onClick={()=>setSelected(c)} className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all ${selected.city===c.city ? "bg-sky-100 border-2 border-sky-400" : "bg-slate-50 border-2 border-transparent"}`}><div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl`}>{c.emoji}</div><div className="min-w-0"><div className="font-black text-slate-900 truncate">{c.city}</div><div className="text-xs font-bold text-slate-500">{c.country} • {c.type}</div></div><span className="ml-auto w-2.5 h-2.5 rounded-full bg-red-500"/></button>)}
       </div>
     </div>
   </div>
   <div className="grid sm:grid-cols-3 gap-4">
     {[["🐾","MISSION FANTI","Trouve un animal !"],["🧠","QUIZ LIVE","Que viens-tu d'observer ?"],["⭐","RÉCOMPENSE","Gagne des étoiles"]].map(([e,t,d])=><div key={t} className="bg-white rounded-3xl p-5 shadow-lg border-2 border-slate-100"><div className="text-4xl">{e}</div><div className="font-black text-slate-900 mt-2">{t}</div><div className="text-sm text-slate-500 font-bold">{d}</div></div>)}
   </div>
   <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-5 flex items-center gap-4 text-white shadow-xl"><MascotFanti size="sm" mood="excited" interactive={true}/><div><div className="font-black text-lg">Fanti transforme le direct en aventure !</div><div className="text-sm font-bold">Regarde • Observe • Réponds • Apprends</div></div></div>
 </div>
};
