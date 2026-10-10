import React, { useState, useEffect } from 'react';
import { UserProfile, MascotOutfit } from './types';
import { LearningModule } from './components/learning/LearningModule';
import { GamesModule } from './components/games/GamesModule';
import { DrawingModule } from './components/drawing/DrawingModule';
import { MusicModule } from './components/music/MusicModule';
import { StoriesModule } from './components/stories/StoriesModule';
import { QuizModule } from './components/quiz/QuizModule';
import { RewardsModule } from './components/rewards/RewardsModule';
import { WorldsModule } from './components/worlds/WorldsModule';
import { LiveWorldModule } from './components/worlds/LiveWorldModule';
import { VideosModule } from './components/videos/VideosModule';
import { DailyChallengesModule } from './components/defis/DailyChallengesModule';
import { ParentsPortal } from './components/parents/ParentsPortal';
import { FantiChatModal } from './components/MascotFanti';
import { AdBroadcastOverlay } from './components/ads/AdBroadcastOverlay';
import { AdminAdDashboard } from './components/ads/AdminAdDashboard';
import { PremiumModal } from './components/PremiumModal';
import { ExperienceShell, HomeHub, ActivityHub, WorldHub, CountryHub, Art } from './components/experience/ExperienceShell';
import { StoryReader } from './components/experience/StoryReader';
import { Destination, parseDestination, destinationHash, screenMeta, hubCards } from './navigation/catalog';
import './components/experience/experience.css';

function readProfile():UserProfile {
 const saved=localStorage.getItem('bebe_tab_user');
 if(saved){try{const profile=JSON.parse(saved);if(profile && typeof profile.name==='string' && Array.isArray(profile.badges) && Number.isFinite(profile.stars))return profile;}catch{}}
 return {
      name: "Petit Champion",
      ageGroup: "5-7",
      xp: 120,
      level: 1,
      stars: 15,
      diamonds: 5,
      unlockedWorlds: [
        "Jungle",
        "Océan",
        "Espace",
        "Dinosaures",
        "Savane",
        "Royaume Magique",
        "Ville",
        "Ferme",
      ],
      currentWorld: "Jungle",
      unlockedOutfits: ["Explorateur"],
      currentOutfit: "Explorateur",
      totalTimeMinutes: 5,
      screenTimeLimitMinutes: 0, // Unlimited default
      isLockedByTime: false,
      language: "fr",
      plan: "free",
      badges: [
        {
          id: "b1",
          title: "Premier Quiz",
          description: "A répondu à sa première question !",
          icon: "🧩",
          unlocked: true,
        },
        {
          id: "b2",
          title: "Artiste en Herbe",
          description: "A créé un super dessin magique !",
          icon: "🎨",
          unlocked: true,
        },
        {
          id: "b3",
          title: "Mélomane",
          description: "A joué du piano et chanté !",
          icon: "🎵",
          unlocked: true,
        },
        {
          id: "b4",
          title: "Grand Conteur",
          description: "A écouté une histoire complète !",
          icon: "📖",
          unlocked: false,
        },
        {
          id: "b5",
          title: "Génie des Maths",
          description: "A réussi 10 calculs rapides !",
          icon: "🔢",
          unlocked: false,
        },
        {
          id: "b6",
          title: "Voyageur des Mondes",
          description: "A visité tous les mondes !",
          icon: "🌍",
          unlocked: false,
        },
      ],
    };

}

class ActivityBoundary extends React.Component<{children:React.ReactNode;onBack:()=>void},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<section className="home-welcome"><h2>Reprenons l’aventure</h2><p>Cette activité n’a pas pu s’ouvrir. Tu peux revenir au menu.</p><button className="primary-cta" onClick={this.props.onBack}>Retour aux activités</button></section>:this.props.children;}
}

export default function App(){
 const [user,setUser]=useState<UserProfile>(readProfile);
 const [route,setRoute]=useState<Destination>(()=>parseDestination(window.location.hash));
 const [isParentsOpen,setIsParentsOpen]=useState(false);
 const [isFantiChatOpen,setIsFantiChatOpen]=useState(false);
 const [isAdminOpen,setIsAdminOpen]=useState(false);
 const [isPremiumOpen,setIsPremiumOpen]=useState(false);
 useEffect(()=>{const sync=()=>{setRoute(parseDestination(window.location.hash));window.scrollTo(0,0)};window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[]);
 useEffect(()=>{localStorage.setItem('bebe_tab_user',JSON.stringify(user))},[user]);
 useEffect(()=>{document.title=`${screenMeta[route.screen]?.title||'BÉBÉTAB'} • Bebetab`},[route.screen]);
 useEffect(()=>{
  const today=new Date().toLocaleDateString('en-CA');
  if(localStorage.getItem('bebe_tab_usage_date')!==today){localStorage.setItem('bebe_tab_usage_date',today);setUser(p=>({...p,totalTimeMinutes:0,isLockedByTime:false}))}
  const timer=window.setInterval(()=>{if(document.visibilityState==='hidden'||isParentsOpen||isAdminOpen)return;const day=new Date().toLocaleDateString('en-CA');const reset=localStorage.getItem('bebe_tab_usage_date')!==day;localStorage.setItem('bebe_tab_usage_date',day);setUser(p=>{if(p.isLockedByTime&&!reset)return p;const mins=reset?1:p.totalTimeMinutes+1;return {...p,totalTimeMinutes:mins,isLockedByTime:p.screenTimeLimitMinutes>0&&mins>=p.screenTimeLimitMinutes}})},60000);
  return()=>window.clearInterval(timer);
 },[isParentsOpen,isAdminOpen]);
 const navigate=(to:Destination)=>{const hash=destinationHash(to);if(window.location.hash===hash){setRoute(to);window.scrollTo(0,0)}else window.location.hash=hash};
 const back=()=>route.activity?navigate({screen:route.screen,country:route.country}):route.screen==='country'?navigate({screen:'world'}):navigate({screen:'home'});
 const award=(xp:number,stars:number)=>{
  if(xp>0&&stars>0&&route.screen!=='defis'){
   const key='bebe_tab_activities_'+new Date().toISOString().slice(0,10);
   let done:string[]=[];try{done=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
   localStorage.setItem(key,JSON.stringify([...new Set([...done,route.screen])]));
  }
  setUser(p=>({...p,xp:p.xp+xp,stars:p.stars+stars,level:Math.floor((p.xp+xp)/100)+1}));
 };
 const props={user,onBack:back,onAwardXP:award};
 const module=()=>{
  switch(route.screen){
   case 'apprendre':return <LearningModule {...props} initialCategory={route.activity==='english'?'alphabet':route.activity} initialLanguage={route.activity==='english'?'en':user.language}/>;
   case 'jouer':return <GamesModule {...props} initialGame={route.activity}/>;
   case 'dessiner':return <DrawingModule {...props} mode={route.activity}/>;
   case 'musique':return <MusicModule {...props} initialTab={route.activity}/>;
   case 'histoires':return route.activity==='create'?<StoriesModule {...props}/>:<StoryReader id={route.activity||'forest'} {...props}/>;
   case 'quiz':return <QuizModule {...props} initialSubject={route.activity}/>;
   case 'live':return <LiveWorldModule user={user} onBack={back} onOpenWorld={()=>navigate({screen:'world'})} onQuiz={()=>navigate({screen:'quiz',activity:'Animaux & Nature'})}/>;
   case 'videos':return <VideosModule {...props}/>;
   case 'defis':return <DailyChallengesModule {...props} onNavigate={screen=>navigate({screen})}/>;
   case 'mondes':return <WorldsModule {...props} onChangeWorld={world=>setUser(p=>({...p,currentWorld:world}))}/>;
   case 'recompenses':return <RewardsModule user={user} onBack={back} onEquipOutfit={outfit=>setUser(p=>p.unlockedOutfits.includes(outfit)?({...p,currentOutfit:outfit}):p)} onUnlockOutfit={(outfit:MascotOutfit,cost:number)=>setUser(p=>p.stars>=cost&&!p.unlockedOutfits.includes(outfit)?({...p,stars:p.stars-cost,unlockedOutfits:[...p.unlockedOutfits,outfit],currentOutfit:outfit}):p)}/>;
   default:return <HomeHub user={user} onNavigate={navigate} onAssistant={()=>setIsFantiChatOpen(true)}/>;
  }
 };
 const content=route.screen==='home'?<HomeHub user={user} onNavigate={navigate} onAssistant={()=>setIsFantiChatOpen(true)}/>:route.screen==='world'?<WorldHub user={user} onNavigate={navigate}/>:route.screen==='country'?<CountryHub key={route.country} route={route} user={user} onNavigate={navigate}/>:hubCards[route.screen]&&!route.activity?<ActivityHub route={route} user={user} onNavigate={navigate}/>:<ActivityBoundary key={destinationHash(route)} onBack={back}><div className="activity-module"><div className="module-art-banner"><Art name={screenMeta[route.screen]?.art||'worlds'}/><strong>{screenMeta[route.screen]?.title}</strong><button onClick={back}>← Retour</button></div>{module()}</div></ActivityBoundary>;
 return <>
  {user.isLockedByTime?<div className="rest-screen"><Art name="rest"/><section><h1>C’est l’heure de se reposer !</h1><p>À bientôt pour une nouvelle aventure avec Fanti.</p><button className="primary-cta" onClick={()=>setIsParentsOpen(true)}>Espace parents</button></section></div>:<ExperienceShell route={route} user={user} onNavigate={navigate} onBack={back} onParents={()=>setIsParentsOpen(true)} onAssistant={()=>setIsFantiChatOpen(true)} onPremium={()=>setIsPremiumOpen(true)} onLanguage={language=>setUser(p=>({...p,language}))}>{content}</ExperienceShell>}
  <FantiChatModal isOpen={isFantiChatOpen} onClose={()=>setIsFantiChatOpen(false)} ageGroup={user.ageGroup} currentWorld={user.currentWorld}/>
  <PremiumModal isOpen={isPremiumOpen} plan={user.plan} onClose={()=>setIsPremiumOpen(false)} onChoosePlan={plan=>setUser(p=>({...p,plan}))}/>
  {isParentsOpen&&<ParentsPortal user={user} onUpdateProfile={updates=>setUser(p=>({...p,...updates}))} onClose={()=>setIsParentsOpen(false)} onOpenAdminAdDashboard={()=>setIsAdminOpen(true)}/>}
  {isAdminOpen&&<AdminAdDashboard onClose={()=>setIsAdminOpen(false)}/>}
  {user.plan==='free'&&!user.isLockedByTime&&<AdBroadcastOverlay onRewardUser={stars=>award(50,stars)}/>}
 </>;
}
