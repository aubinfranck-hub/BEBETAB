import React, { useState } from "react";
import { motion } from "motion/react";
import { Camera, ExternalLink } from "lucide-react";
import { UserProfile } from "../../types";
import { MascotFanti } from "../MascotFanti";

interface Props { user: UserProfile; onBack:()=>void; onOpenWorld:()=>void; }

const cams = [
  {city:"Nairobi / Laikipia",country:"Kenya",emoji:"🦒",type:"Nature • animaux",source:"Explore.org",color:"from-amber-400 to-orange-500",url:"https://explore.org/livecams/explore-all-cams/african-river-wildlife-camera",embed:true},
  {city:"Shark Cam",country:"Océan Atlantique",emoji:"🦈",type:"Océan • sciences",source:"Explore.org",color:"from-cyan-400 to-blue-700",url:"https://explore.org/livecams/explore-all-cams/shark-cam",embed:true},
  {city:"Times Square",country:"États-Unis",emoji:"🌆",type:"Ville",source:"EarthCam",color:"from-blue-400 to-indigo-600",url:"https://www.earthcam.com/usa/newyork/timessquare/?cam=streaming.html",embed:false},
  {city:"Paris",country:"France",emoji:"🗼",type:"Ville • monument",source:"Caméra officielle sélectionnée",color:"from-pink-400 to-rose-500",url:"https://www.earthcam.com/",embed:false},
  {city:"Cape Town",country:"Afrique du Sud",emoji:"🌊",type:"Ville • océan",source:"Caméra officielle sélectionnée",color:"from-cyan-400 to-teal-600",url:"https://www.earthcam.com/",embed:false},
  {city:"African Safari",country:"Afrique",emoji:"🐘",type:"Animaux",source:"Explore.org",color:"from-green-400 to-emerald-600",url:"https://explore.org/livecams/explore-all-cams/african-river-wildlife-camera",embed:true}
];

export const LiveWorldModule: React.FC<Props> = ({user}) => {
 const [selected,setSelected]=useState(cams[0]);
 return <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-5 space-y-5">
   <div className="grid lg:grid-cols-[1.6fr_.8fr] gap-5">
     <div className="rounded-[34px] bg-slate-950 p-3 shadow-2xl border-4 border-white">
       <div className="relative aspect-video rounded-[28px] overflow-hidden bg-slate-950">
         {selected.embed ? <iframe key={selected.url} src={selected.url} title={selected.city} className="absolute inset-0 w-full h-full border-0 bg-slate-950" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /> :
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-sky-500 via-blue-700 to-slate-950"><div className="text-[130px]">{selected.emoji}</div><div className="text-white font-black">Caméra officielle</div></div>}
         <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-black shadow-lg"><span className="animate-pulse">●</span> EN DIRECT</div>
         <button onClick={()=>window.open(selected.url,"_blank","noopener,noreferrer")} className="absolute right-4 bottom-4 w-14 h-14 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center shadow-xl border-4 border-white"><ExternalLink/></button>
       </div>
       <div className="p-4">
         <div className="flex flex-wrap items-center gap-2 text-sky-300 font-black"><Camera className="w-4 h-4"/> {selected.source} • {selected.city}<span className="px-2 py-1 rounded-full bg-red-600 text-white text-[10px]">LIVE</span></div>
         <p className="text-white font-bold mt-2">{user.language==="fr" ? "Observe bien : Fanti transforme le direct en mission éducative." : "Look carefully: Fanti turns the live stream into an educational mission."}</p>
         <button onClick={()=>window.open(selected.url,"_blank","noopener,noreferrer")} className="mt-3 px-4 py-2.5 rounded-2xl bg-white text-blue-700 font-black text-xs flex items-center gap-2"><ExternalLink className="w-4 h-4"/> Ouvrir la caméra officielle</button>
       </div>
     </div>
     <div className="bg-white rounded-[32px] p-4 shadow-xl border-4 border-white">
       <div className="flex items-center justify-between mb-3"><h2 className="text-xl font-black text-slate-900">🌍 Caméras du monde</h2><span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-1 rounded-full">OFFICIEL</span></div>
       <div className="space-y-2 max-h-[590px] overflow-auto">{cams.map(cam=><button key={cam.city} onClick={()=>setSelected(cam)} className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left ${selected.city===cam.city?"bg-sky-100 border-2 border-sky-400":"bg-slate-50 border-2 border-transparent"}`}><div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cam.color} flex items-center justify-center text-2xl`}>{cam.emoji}</div><div className="min-w-0"><div className="font-black text-slate-900 truncate">{cam.city}</div><div className="text-xs font-bold text-slate-500">{cam.country} • {cam.type}</div><div className="text-[10px] font-black text-sky-600">{cam.source}</div></div><span className="ml-auto w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"/></button>)}</div>
     </div>
   </div>
   <div className="grid sm:grid-cols-3 gap-4">{[["🐾","MISSION FANTI","Trouve un animal !"],["🧠","QUIZ LIVE","Que viens-tu d'observer ?"],["⭐","RÉCOMPENSE","Gagne des étoiles"]].map(([e,t,d])=><div key={t} className="bg-white rounded-3xl p-5 shadow-lg border-2 border-white"><div className="text-4xl">{e}</div><div className="font-black text-slate-900 mt-2">{t}</div><div className="text-sm text-slate-500 font-bold">{d}</div></div>)}</div>
   <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 p-5 flex items-center gap-4 text-white shadow-xl"><MascotFanti size="sm" mood="excited" interactive={true}/><div><div className="font-black text-lg">Fanti transforme le direct en aventure !</div><div className="text-sm font-bold">Regarde • Observe • Réponds • Apprends</div></div></div>
 </div>;
};