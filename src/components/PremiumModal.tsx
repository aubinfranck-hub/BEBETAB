import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, Sparkles } from "lucide-react";
import { SubscriptionPlan } from "../types";

interface Props { isOpen:boolean; plan:SubscriptionPlan; onClose:()=>void; onChoosePlan:(plan:SubscriptionPlan)=>void; }

export const PremiumModal: React.FC<Props> = ({isOpen,plan,onClose,onChoosePlan}) => (
 <AnimatePresence>{isOpen && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
  <motion.div initial={{scale:.92,y:20}} animate={{scale:1,y:0}} className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden border-4 border-white">
   <div className="bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 p-6 text-white relative">
    <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-xl bg-white/20"><X/></button>
    <div className="text-5xl">👑</div><h2 className="text-3xl font-black mt-2">BEBETAB PREMIUM</h2><p className="font-bold opacity-90">Plus de découvertes. Zéro publicité. Plus de liberté.</p>
   </div>
   <div className="p-6 grid md:grid-cols-3 gap-4">
    <Plan title="GRATUIT" price="0 FCFA" accent="border-slate-200" current={plan==="free"} onClick={()=>onChoosePlan("free")} items={["Explorer le monde","Jeux sélectionnés","Histoires sélectionnées","Live World sélectionné","Publicités adaptées"]}/>
    <Plan title="PREMIUM" price="Abonnement" accent="border-amber-300 bg-amber-50" current={plan==="premium"} onClick={()=>onChoosePlan("premium")} items={["Tout le contenu","Sans publicité","Fanti IA avancé","Mode hors ligne","Toutes les missions"]}/>
    <Plan title="FAMILY" price="Famille" accent="border-purple-300 bg-purple-50" current={plan==="family"} onClick={()=>onChoosePlan("family")} items={["Tout Premium","Plusieurs profils enfants","Suivi parental avancé","Hors ligne famille","Plusieurs profils"]}/>
   </div>
   <div className="px-6 pb-6 text-xs text-slate-500 font-semibold flex gap-2 items-center"><Sparkles className="w-4 h-4 text-amber-500"/> Prototype : le paiement réel sera connecté après validation de l'expérience.</div>
  </motion.div>
 </motion.div>}</AnimatePresence>
);

const Plan=({title,price,items,accent,current,onClick}:{title:string;price:string;items:string[];accent:string;current:boolean;onClick:()=>void})=>(
 <button onClick={onClick} className={`text-left rounded-3xl border-4 ${accent} p-5 shadow-lg hover:-translate-y-1 transition-all relative`}>
  {current && <span className="absolute right-3 top-3 px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black">ACTUEL</span>}
  <div className="text-2xl font-black text-slate-900">{title}</div><div className="text-lg font-black text-blue-600 mt-1">{price}</div>
  <div className="space-y-2 mt-4">{items.map(x=><div key={x} className="flex gap-2 text-sm font-bold text-slate-700"><Check className="w-4 h-4 text-emerald-500 shrink-0"/>{x}</div>)}</div>
  <div className="mt-5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-center text-xs font-black">{current?"Sélectionnée":"Choisir cette offre"}</div>
 </button>
);
