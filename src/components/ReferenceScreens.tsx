import React from "react";
import { ArrowLeft, Settings, Star, Gift, Play, Camera, Gamepad2, BookOpen, Music2, Palette, Globe2, Trophy, Brain, Languages, FlaskConical, PawPrint, Map, Landmark, Utensils, History, Image as ImageIcon } from "lucide-react";
import { ActiveScreen, UserProfile } from "../types";
import { HeroFanti, GlobeIllustration, WorldMapIllustration } from "./BebeTabArt";

type Props = {
  screen: ActiveScreen;
  user: UserProfile;
  onBack: () => void;
  onParents: () => void;
  onPremium?: () => void;
  onNavigate: (screen: ActiveScreen) => void;
  onAwardXP: (xp:number, stars:number) => void;
};

const meta:Record<string,{icon:string;title:string;sub:string;accent:string}>={
  world:{icon:"🌍",title:"EXPLORER LE MONDE",sub:"Découvre les pays, les cultures, les animaux, les villes et bien plus encore !",accent:"#10b981"},
  country:{icon:"🇫🇷",title:"FRANCE",sub:"Europe > France",accent:"#2563eb"},
  live:{icon:"📷",title:"LIVE WORLD",sub:"Regarde le monde en direct !",accent:"#0891b2"},
  apprendre:{icon:"📖",title:"APPRENDRE",sub:"Choisis une matière et commence à apprendre !",accent:"#f97316"},
  jouer:{icon:"🎮",title:"JOUER",sub:"Des jeux éducatifs pour apprendre en s'amusant !",accent:"#ef4444"},
  histoires:{icon:"📚",title:"HISTOIRES",sub:"Écoute, lis et vis des histoires incroyables avec Fanti !",accent:"#7c3aed"},
  dessiner:{icon:"🎨",title:"DESSINER",sub:"Laisse libre cours à ton imagination !",accent:"#f97316"},
  musique:{icon:"🎵",title:"MUSIQUE",sub:"Chante, joue et crée ta musique !",accent:"#db2777"},
  quiz:{icon:"🧠",title:"QUIZ",sub:"Teste tes connaissances avec Fanti !",accent:"#7c3aed"},
  recompenses:{icon:"⭐",title:"MES RÉCOMPENSES",sub:"Collectionne tes étoiles et tes badges !",accent:"#eab308"},
  defis:{icon:"🏆",title:"DÉFIS DU JOUR",sub:"Une nouvelle mission chaque jour !",accent:"#16a34a"},
  mondes:{icon:"🌎",title:"MES MONDES",sub:"Choisis ton univers d’aventure !",accent:"#0ea5e9"},
  videos:{icon:"🎬",title:"VIDÉOS",sub:"Regarde, observe et apprends !",accent:"#dc2626"}
};

const Card=({emoji,title,sub,onClick,color="#fff"}:{emoji:string;title:string;sub?:string;onClick?:()=>void;color?:string})=>(
  <button onClick={onClick} className="ref-card" style={{background:color}}>
    <div className="ref-card-art">{emoji}</div><div className="ref-card-title">{title}</div>{sub&&<div className="ref-card-sub">{sub}</div>}
  </button>
);

const Top=({screen,user,onBack,onParents}:{screen:ActiveScreen;user:UserProfile;onBack:()=>void;onParents:()=>void})=>{
 const m=meta[screen]||meta.world;
 return <header className="ref-top">
   <button className="ref-back" onClick={onBack}><ArrowLeft/></button>
   <div className="ref-title-icon">{m.icon}</div>
   <div className="ref-title"><b>{m.title}</b><span>{m.sub}</span></div>
   <div className="ref-profile">
     <div className="ref-avatar">👦🏾</div><b>{user.name==="Petit Champion"?"Kofi":user.name}</b>
     <span className="ref-stars">⭐ {user.stars.toLocaleString("fr-FR")}</span>
     <span className="ref-gift">🎁</span>
     <span className="ref-level">Niveau {user.level}<small>Explorateur</small></span>
     <div className="ref-xp"><i style={{width:`${Math.min(100,user.xp%100)}%`}}/></div>
     <button className="ref-lang active">FR</button><button className="ref-lang">EN</button>
     <button className="ref-settings" onClick={onParents}><Settings/></button>
   </div>
 </header>
};

export const ReferenceScreens:React.FC<Props>=({screen,user,onBack,onParents,onNavigate,onAwardXP})=>{
 const m=meta[screen]||meta.world;
 const award=()=>onAwardXP(5,1);
 return <div className="ref-app" style={{"--accent":m.accent} as React.CSSProperties}>
   <Top screen={screen} user={user} onBack={onBack} onParents={onParents}/>
   <main className="ref-body">
     {screen==="world"&&<WorldScreen user={user} onNavigate={onNavigate} award={award}/>}
     {screen==="country"&&<CountryScreen award={award}/>}
     {screen==="live"&&<LiveScreen onNavigate={onNavigate}/>}
     {screen==="apprendre"&&<LearningScreen award={award}/>}
     {screen==="jouer"&&<PlayScreen award={award}/>}
     {screen==="histoires"&&<StoriesScreen award={award}/>}
     {screen==="dessiner"&&<DrawingScreen award={award}/>}
     {screen==="musique"&&<MusicScreen award={award}/>}
     {screen==="quiz"&&<QuizScreen award={award}/>}
     {screen==="recompenses"&&<RewardsScreen user={user} award={award}/>}
     {screen==="defis"&&<ChallengesScreen award={award}/>}
     {screen==="mondes"&&<WorldsScreen award={award}/>}
     {screen==="videos"&&<VideosScreen award={award}/>}
   </main>
 </div>
};

function WorldScreen({onNavigate,award}:{user:UserProfile;onNavigate:(s:ActiveScreen)=>void;award:()=>void}){
 const places=[["🗼","Paris","🇫🇷 France"],["🗽","New York","🇺🇸 États-Unis"],["🦒","Nairobi","🇰🇪 Kenya"],["🗼","Tokyo","🇯🇵 Japon"],["🏜️","Le Caire","🇪🇬 Égypte"]];
 return <div className="ref-world">
   <div className="ref-map-panel"><WorldMapIllustration/>
     <div className="continent c-amerique">AMÉRIQUE</div><div className="continent c-europe">EUROPE</div><div className="continent c-asie">ASIE</div><div className="continent c-afrique">AFRIQUE</div><div className="continent c-oceanie">OCÉANIE</div><div className="continent c-ocean">OCÉANS</div><div className="continent c-ant">ANTARCTIQUE</div>
     <div className="ref-fanti-mini"><HeroFanti small/><div>Où veux-tu<br/>aller aujourd'hui ?<br/><small>Touche un continent !</small></div></div>
   </div>
   <aside className="ref-popular"><h3>LIEUX POPULAIRES</h3>{places.map(([e,n,s])=><button key={n} onClick={()=>{award();onNavigate(n==="Paris"?"country":"live")}}><span>{e}</span><b>{n}<small>{s}</small></b><i>›</i></button>)}</aside>
   <div className="ref-bottom-cats">{[["🏙️","Villes"],["🦁","Animaux"],["🎭","Cultures"],["🏛️","Monuments"],["🌳","Nature"],["🐠","Océans"],["🪐","Espace"],["🧑‍🚀","Métiers"],["🍲","Cuisine"],["🗣️","Langues"],["⌛","Histoire"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div>
 </div>
}

function CountryScreen({award}:{award:()=>void}){
 return <div className="ref-country">
   <div className="ref-country-hero"><div className="ref-eiffel">🗼</div><div className="ref-city">🏙️</div><div className="ref-country-name">FRANCE 🇫🇷</div>
     <div className="ref-country-path">Europe &gt; France</div><div className="ref-country-fanti"><HeroFanti small/><div>Bienvenue en France !<small>Découvre sa culture,<br/>ses monuments et ses habitudes.</small></div></div>
   </div>
   <aside className="ref-discover"><h3>Découvrir la France</h3><div className="ref-grid2">{[["🗼","Monuments"],["🎭","Culture"],["🦁","Animaux"],["🍲","Gastronomie"],["🏙️","Villes"],["🏛️","Histoire"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></aside>
   <div className="ref-action-row">{[["🎬","Vidéos"],["📷","Live de pays"],["🎮","Jeux"],["❓","Quiz"],["🖼️","Images"],["🎵","Musique"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div>
 </div>
}

function LiveScreen({onNavigate}:{onNavigate:(s:ActiveScreen)=>void}){
 const cams=[["🗼","Paris","France"],["🗽","New York","États-Unis"],["🗼","Tokyo","Japon"],["🦒","Nairobi","Kenya"],["🐘","La Savane","Afrique"],["🐠","Barrière de corail","Australie"]];
 return <div className="ref-live"><div className="ref-live-grid">{cams.map(([e,n,c],i)=><button key={n} className="ref-live-card" onClick={()=>onNavigate("live")}><div className="live-img">{e}<span>● LIVE</span></div><b>{n}</b><small>🔴 {c}</small></button>)}</div><div className="ref-live-cats">{[["🏙️","Villes"],["🌳","Nature"],["🦁","Animaux"],["🏛️","Monuments"],["🏖️","Plages"],["🏔️","Montagnes"]].map(([e,t])=><Card key={t} emoji={e} title={t}/>)}</div></div>
}

function LearningScreen({award}:{award:()=>void}){return <div className="ref-learning"><div className="ref-learning-fanti"><HeroFanti small/><div>Apprendre,<br/>c'est découvrir<br/>le monde !</div></div><div className="ref-subject-grid">{[["🔤","Lettres"],["123","Nombres"],["⚗️","Sciences"],["🌍","Monde"],["🦁","Animaux"],["🪐","Espace"],["🎨","Art"],["🗣️","Langues"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function PlayScreen({award}:{award:()=>void}){return <div className="ref-learning"><div className="ref-learning-fanti"><HeroFanti small/><div>Joue et<br/>apprends<br/>en t'amusant !</div></div><div className="ref-subject-grid">{[["🧩","Puzzles"],["2️⃣3️⃣","Maths"],["🌍","Géographie"],["🦁","Animaux"],["🧠","Mémoire"],["🧊","Logique"],["ABC","Français"],["ABC","English"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function StoriesScreen({award}:{award:()=>void}){return <div className="ref-stories"><div className="ref-story-fanti"><HeroFanti small/></div><div className="ref-story-grid">{[["🌲","Fanti dans la forêt"],["🏜️","Le trésor du désert"],["🪐","Le voyage dans l'espace"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div><div className="ref-story-cats">{[["🏜️","Aventure"],["🐾","Animaux"],["✨","Magie"],["🌍","Monde"],["🤝","Amitié"],["🎧","Écouter"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function DrawingScreen({award}:{award:()=>void}){return <div className="ref-drawing"><div className="ref-drawing-fanti"><HeroFanti small/><div className="paint-splash">🎨</div></div><div className="ref-draw-grid">{[["🖌️","Dessin libre"],["🦋","Coloriage"],["A","Tracer lettres"],["123","Tracer chiffres"],["🔵","Formes"],["🎵","Créer musique"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function MusicScreen({award}:{award:()=>void}){return <div className="ref-learning"><div className="ref-learning-fanti"><HeroFanti small/><div>Chante, joue<br/>et crée ta musique !</div></div><div className="ref-subject-grid">{[["🎹","Piano"],["🥁","Batterie"],["🎤","Chanter"],["🎸","Guitare"],["🎵","Mélodies"],["🎼","Créer"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function QuizScreen({award}:{award:()=>void}){return <div className="ref-learning"><div className="ref-learning-fanti"><HeroFanti small/><div>Prêt pour<br/>le quiz ?</div></div><div className="ref-subject-grid">{[["🌍","Monde"],["🦁","Animaux"],["🔢","Maths"],["🔬","Sciences"],["🇬🇧","English"],["🧠","Logique"],["📖","Histoires"],["🎨","Art"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function RewardsScreen({user,award}:{user:UserProfile;award:()=>void}){return <div className="ref-learning"><div className="ref-reward-profile"><div className="ref-avatar-big">👦🏾</div><b>{user.name}</b><strong>⭐ {user.stars}</strong><small>Niveau {user.level} • Explorateur</small></div><div className="ref-subject-grid">{[["🏆","Premier Quiz"],["🎨","Artiste"],["🎵","Mélomane"],["📖","Conteur"],["🔢","Maths"],["🌍","Voyageur"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function ChallengesScreen({award}:{award:()=>void}){return <div className="ref-learning"><div className="ref-learning-fanti"><HeroFanti small/><div>Aujourd'hui avec Fanti !<br/><small>Relève ta mission.</small></div></div><div className="ref-subject-grid">{[["🎬","1 vidéo"],["🎮","2 jeux"],["📖","1 histoire"],["🎵","1 chanson"],["🌍","1 pays"],["🧠","1 quiz"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function WorldsScreen({award}:{award:()=>void}){return <div className="ref-learning"><div className="ref-worlds-orb"><GlobeIllustration/></div><div className="ref-subject-grid">{[["🌳","Jungle"],["🐠","Océan"],["🪐","Espace"],["🦖","Dinosaures"],["🦒","Savane"],["🧙","Royaume magique"],["🏙️","Ville"],["🐄","Ferme"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}

function VideosScreen({award}:{award:()=>void}){return <div className="ref-learning"><div className="ref-learning-fanti"><HeroFanti small/><div>Regarde, observe<br/>et apprends !</div></div><div className="ref-subject-grid">{[["🦁","Animaux"],["🌍","Monde"],["🔬","Sciences"],["🚀","Espace"],["🌊","Océans"],["🌳","Nature"],["🏙️","Villes"],["🎵","Musique"]].map(([e,t])=><Card key={t} emoji={e} title={t} onClick={award}/>)}</div></div>}
