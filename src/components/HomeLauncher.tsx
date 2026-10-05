import React from "react";
import { motion } from "motion/react";
import { ActiveScreen, UserProfile } from "../types";
import { MascotFanti } from "./MascotFanti";
import { soundFx, speakText } from "../utils/audio";
import { Play, Settings, Star, Gift, Gamepad2, BookOpen, Music2, Palette, Globe2, Camera, Trophy } from "lucide-react";

interface Props {
  user: UserProfile;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenFantiChat: () => void;
  onOpenParents: () => void;
}

const actions: Array<{id: ActiveScreen; label: string; sub: string; icon: React.ReactNode; cls: string}> = [
  { id:"world", label:"MONDE", sub:"World", icon:<Globe2/>, cls:"from-emerald-500 to-teal-500" },
  { id:"apprendre", label:"APPRENDRE", sub:"Learn", icon:<BookOpen/>, cls:"from-amber-400 to-orange-500" },
  { id:"jouer", label:"JOUER", sub:"Play", icon:<Gamepad2/>, cls:"from-red-400 to-rose-500" },
  { id:"histoires", label:"HISTOIRES", sub:"Stories", icon:<BookOpen/>, cls:"from-purple-500 to-violet-600" },
  { id:"live", label:"LIVE WORLD", sub:"En direct", icon:<Camera/>, cls:"from-sky-400 to-blue-600" },
  { id:"musique", label:"MUSIQUE", sub:"Music", icon:<Music2/>, cls:"from-pink-500 to-rose-600" },
  { id:"dessiner", label:"DESSINER", sub:"Create", icon:<Palette/>, cls:"from-orange-400 to-amber-500" },
  { id:"recompenses", label:"MES RÉCOMPENSES", sub:"My Rewards", icon:<Trophy/>, cls:"from-lime-500 to-emerald-600" },
];

const MiniGlobe = () => (
  <div className="relative w-[270px] h-[270px] sm:w-[360px] sm:h-[360px] rounded-full border-[8px] border-white/80 shadow-[0_25px_65px_rgba(0,0,0,.35)] overflow-visible bg-[radial-gradient(circle_at_30%_25%,#7dd3fc_0,#2563eb_45%,#172554_100%)]">
    <div className="absolute inset-0 rounded-full opacity-35 bg-[linear-gradient(90deg,transparent_48%,white_49%,transparent_51%),linear-gradient(0deg,transparent_48%,white_49%,transparent_51%)]"/>
    <div className="absolute left-[15%] top-[27%] w-[25%] h-[28%] rounded-[48%_52%_45%_55%] bg-emerald-400 rotate-12 shadow-inner"/>
    <div className="absolute left-[39%] top-[22%] w-[24%] h-[20%] rounded-[55%_45%_55%_45%] bg-emerald-500 -rotate-6"/>
    <div className="absolute left-[48%] top-[48%] w-[22%] h-[28%] rounded-[45%_55%_55%_45%] bg-emerald-400 rotate-12"/>
    <div className="absolute left-[70%] top-[34%] w-[16%] h-[30%] rounded-[55%_45%_50%_50%] bg-emerald-500 rotate-12"/>
    <span className="absolute -top-8 left-[12%] text-5xl">🎈</span>
    <span className="absolute -top-2 right-[8%] text-5xl">🗼</span>
    <span className="absolute top-[28%] right-[-18px] text-5xl">🎈</span>
    <span className="absolute bottom-[15%] left-[-25px] text-5xl">🐘</span>
    <span className="absolute bottom-[-8px] right-[20%] text-5xl">🦁</span>
    <span className="absolute top-[7%] left-[45%] text-3xl">✈️</span>
  </div>
);

export const HomeLauncher: React.FC<Props> = ({ user, onNavigate, onOpenFantiChat, onOpenParents }) => (
  <div className="min-h-[calc(100vh-64px)] overflow-hidden bg-[linear-gradient(180deg,#11b5ee_0%,#67d5ee_48%,#f5c46c_100%)]">
    <div className="relative max-w-[1540px] mx-auto px-4 sm:px-7 pt-5 pb-7">
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(circle_at_10%_20%,#fff_0,transparent_18%),radial-gradient(circle_at_85%_12%,#fff_0,transparent_16%)]"/>
      <section className="relative min-h-[510px] rounded-[42px] overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.02))]">
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,#f2ad55)]"/>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[31%_38%_31%] items-center gap-2 min-h-[510px]">
          <div className="self-start pt-4 sm:pt-8 pl-2 sm:pl-5">
            <div className="inline-block rounded-[20px] bg-gradient-to-r from-blue-700 to-purple-600 px-5 py-2 text-white text-4xl sm:text-5xl font-black tracking-tight shadow-xl -rotate-1">BEBE<span className="text-cyan-200">TAB</span></div>
            <div className="mt-1 ml-3 text-xl sm:text-2xl font-black text-white drop-shadow-lg">LE MONDE DANS TES MAINS</div>
            <div className="mt-1 ml-3 text-sm sm:text-base font-black text-slate-900">Jouer • Apprendre • Découvrir • Explorer</div>
            <div className="mt-4">
              <MascotFanti size="lg" mood="happy" interactive={true} speechBubble={user.language==="fr" ? "Bonjour ! Hello ! Prêt pour une nouvelle aventure ?" : "Hello! Ready for a new adventure?"} onOpenChat={onOpenFantiChat}/>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center pt-5">
            <MiniGlobe/>
            <motion.button whileTap={{scale:.96}} onClick={()=>{soundFx.playTap();onNavigate("world")}} className="relative -mt-8 z-20 px-9 py-4 rounded-[28px] bg-gradient-to-b from-orange-400 to-orange-600 text-white text-xl sm:text-2xl font-black shadow-[0_10px_25px_rgba(180,70,0,.4)] border-4 border-white flex items-center gap-3">
              <Play className="fill-white w-7 h-7"/> EXPLORER LE MONDE
            </motion.button>
          </div>

          <div className="self-start pt-5 pr-1 sm:pr-3 space-y-3">
            <div className="rounded-[28px] bg-white/95 p-3 shadow-2xl border-2 border-white">
              <div className="flex items-center justify-between px-2">
                <div className="text-2xl font-black text-slate-900">LIVE WORLD</div>
                <span className="rounded-full bg-red-600 text-white px-3 py-1 text-xs font-black">● EN DIRECT</span>
              </div>
              <button onClick={()=>onNavigate("live")} className="relative mt-2 w-full h-32 rounded-2xl overflow-hidden bg-[linear-gradient(135deg,#365d3b,#8ab56a,#25445d)]">
                <div className="absolute inset-0 flex items-center justify-center text-7xl">🦒</div>
                <div className="absolute bottom-2 left-3 text-white font-black text-sm drop-shadow">Regarde le monde en direct !</div>
                <span className="absolute right-3 bottom-2 w-11 h-11 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center"><Play className="fill-slate-900 w-5 h-5"/></span>
              </button>
            </div>
            <div className="rounded-[28px] bg-white/95 p-4 shadow-2xl">
              <div className="text-lg font-black text-slate-900">Aujourd'hui avec Fanti</div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[["🦁","1 vidéo","videos"],["🎮","2 jeux","jouer"],["📖","1 histoire","histoires"],["🎵","1 chanson","musique"]].map(([e,t,id])=>(
                  <button key={id} onClick={()=>onNavigate(id as ActiveScreen)} className="rounded-2xl bg-slate-50 border-2 border-slate-100 p-2 hover:-translate-y-1 transition">
                    <div className="h-12 rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center text-3xl">{e}</div>
                    <div className="text-[10px] font-black text-slate-700 mt-1">{t}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 -mt-2">
        {actions.map((a)=>(
          <motion.button key={a.id} whileHover={{y:-5}} whileTap={{scale:.96}} onClick={()=>{soundFx.playTap();onNavigate(a.id)}} className={`min-h-[105px] rounded-[24px] border-4 border-white shadow-[0_8px_18px_rgba(0,0,0,.25)] bg-gradient-to-br ${a.cls} text-white p-2 flex flex-col items-center justify-center`}>
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center [&>svg]:w-8 [&>svg]:h-8">{a.icon}</div>
            <div className="mt-1 text-[13px] font-black text-center leading-tight">{a.label}</div>
            <div className="text-[10px] font-bold opacity-95">{a.sub}</div>
          </motion.button>
        ))}
      </section>

      <section className="mt-4 rounded-[24px] bg-white/90 backdrop-blur p-3 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 flex items-center justify-center text-2xl">👦🏾</div>
          <div><div className="font-black text-slate-900">{user.name}</div><div className="text-xs font-bold text-slate-500">Niveau {user.level} • ⭐ {user.stars.toLocaleString("fr-FR")} • {user.language.toUpperCase()}</div></div>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenParents} className="p-3 rounded-xl bg-slate-100 text-slate-700"><Settings className="w-5 h-5"/></button>
          <button onClick={onOpenFantiChat} className="p-3 rounded-xl bg-pink-500 text-white"><span className="text-lg">🐘</span></button>
        </div>
      </section>
    </div>
  </div>
);