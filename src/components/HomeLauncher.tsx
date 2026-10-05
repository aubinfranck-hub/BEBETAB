import React from "react";
import { motion } from "motion/react";
import { ActiveScreen, UserProfile } from "../types";
import { HeroFanti, GlobeIllustration } from "./BebeTabArt";
import { soundFx } from "../utils/audio";
import { Play, Settings, Star, Gift, Gamepad2, BookOpen, Music2, Palette, Globe2, Camera, Trophy } from "lucide-react";

interface Props { user:UserProfile; onNavigate:(screen:ActiveScreen)=>void; onOpenFantiChat:()=>void; onOpenParents:()=>void; }

const navCards=[
  ["world","🌍","MONDE","World","from-emerald-500 to-green-500"],
  ["apprendre","📖","APPRENDRE","Learn","from-amber-400 to-orange-500"],
  ["jouer","🎮","JOUER","Play","from-red-400 to-rose-500"],
  ["histoires","📚","HISTOIRES","Stories","from-purple-500 to-violet-600"],
  ["live","📷","LIVE WORLD","En direct","from-sky-400 to-blue-600"],
  ["musique","🎵","MUSIQUE","Music","from-pink-500 to-rose-600"],
  ["dessiner","🎨","DESSINER","Create","from-orange-400 to-amber-500"],
  ["recompenses","⭐","MES RÉCOMPENSES","My Rewards","from-lime-500 to-emerald-600"],
] as const;

export const HomeLauncher:React.FC<Props>=({user,onNavigate,onOpenFantiChat,onOpenParents})=>(
  <div className="min-h-[calc(100vh-0px)] overflow-hidden bg-[linear-gradient(180deg,#11b9ef_0%,#54d3ed_57%,#f3bb62_100%)]">
    <div className="max-w-[1536px] mx-auto px-5 sm:px-8 pt-5 pb-6">
      <section className="relative min-h-[520px] rounded-[34px] overflow-hidden">
        <div className="absolute top-1 right-1 z-30 hidden md:flex items-center gap-2 bg-white/95 rounded-full px-3 py-2 shadow-2xl border-2 border-sky-100">
          <div className="w-9 h-9 rounded-full bg-amber-300 flex items-center justify-center text-xl">👦🏾</div>
          <span className="font-black text-slate-800">{user.name}</span>
          <span className="flex items-center gap-1 font-black"><Star className="w-5 h-5 fill-amber-400 text-amber-500"/>{user.stars.toLocaleString("fr-FR")}</span>
          <Gift className="w-5 h-5 text-rose-500"/>
          <span className="font-black text-xs">Niveau {user.level}<br/><span className="text-[9px] text-slate-500">Explorateur</span></span>
          <div className="w-28 h-3 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-gradient-to-r from-lime-400 via-yellow-400 to-orange-500" style={{width:`${Math.min(100,user.xp%100)}%`}}/></div>
          <button className="px-3 py-2 rounded-full bg-white border-2 border-sky-100 font-black text-xs">FR</button>
          <button className="px-3 py-2 rounded-full bg-blue-600 text-white font-black text-xs">EN</button>
          <button onClick={onOpenParents} className="w-9 h-9 rounded-full bg-white border-2 border-sky-100 flex items-center justify-center"><Settings className="w-5 h-5 text-blue-700"/></button>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_25%,rgba(255,255,255,.75)_0,transparent_18%),radial-gradient(circle_at_85%_18%,rgba(255,255,255,.7)_0,transparent_15%)]"/>
        <div className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-t from-[#e8a54e] to-transparent"/>
        <div className="relative grid lg:grid-cols-[30%_40%_30%] items-center min-h-[520px]">
          <div className="self-start pt-2">
            <div className="inline-flex rounded-[20px] px-5 py-1.5 bg-gradient-to-b from-[#16b7f0] to-[#1268c8] border-[5px] border-white shadow-xl -rotate-1">
              <span className="text-4xl sm:text-5xl font-black text-yellow-300 tracking-tight drop-shadow-[0_3px_0_#0b3b73]">BEBE</span><span className="text-4xl sm:text-5xl font-black text-cyan-100 drop-shadow-[0_3px_0_#0b3b73]">TAB</span>
            </div>
            <div className="ml-5 -mt-1 text-xl sm:text-2xl font-black text-white drop-shadow-[0_3px_0_#164e63]">LE MONDE DANS TES MAINS</div>
            <div className="ml-5 mt-1 text-sm font-black text-slate-900">Jouer • Apprendre • Découvrir • Explorer</div>
            <div className="mt-4 -ml-1 flex items-end">
              <HeroFanti/>
              <div className="-ml-4 -mb-1 bg-white rounded-[24px] border-4 border-slate-200 px-5 py-3 shadow-xl text-center text-slate-900 font-black text-lg leading-tight">
                Bonjour !<br/>Hello !<br/><span className="text-base">Prêt pour une<br/>nouvelle aventure ?</span>
                <div className="absolute"/>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-4">
            <GlobeIllustration/>
            <motion.button whileTap={{scale:.97}} onClick={()=>{soundFx.playTap();onNavigate("world")}} className="-mt-8 z-10 px-9 py-4 rounded-[28px] bg-gradient-to-b from-[#ffb11b] to-[#ff6b00] border-4 border-white shadow-2xl text-white font-black text-xl flex items-center gap-3">
              <Play className="fill-white w-7 h-7"/> EXPLORER<br className="hidden"/> LE MONDE
            </motion.button>
          </div>

          <div className="self-start pt-5 space-y-3">
            <div className="rounded-[28px] bg-white p-3 shadow-2xl border-2 border-white">
              <div className="flex items-center justify-between px-2">
                <span className="text-2xl font-black text-slate-900">LIVE WORLD</span>
                <span className="bg-red-600 text-white rounded-full px-3 py-1 text-xs font-black">▶ EN DIRECT</span>
              </div>
              <button onClick={()=>onNavigate("live")} className="relative mt-2 h-32 w-full rounded-2xl overflow-hidden bg-[linear-gradient(135deg,#365f3f,#7db167,#395a72)] border border-slate-200">
                <div className="absolute inset-0 flex items-center justify-center text-7xl">🦒</div>
                <div className="absolute bottom-2 left-3 text-white font-black drop-shadow">Regarde le monde en direct !</div>
                <span className="absolute bottom-2 right-3 w-12 h-12 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center shadow"><Play className="fill-slate-900"/></span>
              </button>
            </div>
            <div className="rounded-[28px] bg-white p-4 shadow-2xl">
              <div className="text-lg font-black text-slate-900">Aujourd'hui avec Fanti</div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[["🦁","1 vidéo","videos"],["🎮","2 jeux","jouer"],["📖","1 histoire","histoires"],["🎵","1 chanson","musique"]].map(([e,t,id])=><button key={id} onClick={()=>onNavigate(id as ActiveScreen)} className="rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-100"><div className="h-12 flex items-center justify-center text-3xl">{e}</div><div className="text-[10px] font-black pb-1 text-slate-700">{t}</div></button>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 -mt-1 relative z-10">
        {navCards.map(([id,e,title,sub,grad])=><motion.button key={id} whileHover={{y:-4}} whileTap={{scale:.97}} onClick={()=>onNavigate(id as ActiveScreen)} className={`h-[112px] rounded-[26px] border-4 border-white shadow-[0_8px_20px_rgba(0,0,0,.28)] bg-gradient-to-br ${grad} text-white flex flex-col items-center justify-center`}>
          <span className="text-4xl drop-shadow">{e}</span><span className="font-black text-[14px] mt-1 leading-none">{title}</span><span className="font-bold text-[11px] mt-1">{sub}</span>
        </motion.button>)}
      </div>

      <div className="mt-4 rounded-[22px] bg-white/90 shadow-xl px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center text-2xl">👦🏾</div><div><div className="font-black text-slate-900">{user.name}</div><div className="text-xs font-bold text-slate-500">Niveau {user.level} • ⭐ {user.stars.toLocaleString("fr-FR")}</div></div></div>
        <div className="flex items-center gap-2"><span className="hidden sm:block px-4 py-2 rounded-full bg-white font-black text-xs text-slate-700">NIVEAU {user.level} <span className="inline-block w-24 h-2 bg-slate-200 rounded-full ml-2 align-middle overflow-hidden"><span className="block h-full bg-gradient-to-r from-lime-400 to-orange-400" style={{width:`${Math.min(100,user.xp%100)}%`}}/></span></span><button onClick={onOpenParents} className="p-2.5 rounded-full bg-white shadow text-slate-700"><Settings/></button><button onClick={onOpenFantiChat} className="p-2.5 rounded-full bg-pink-500 text-white shadow">🐘</button></div>
      </div>
    </div>
  </div>
);