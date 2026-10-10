import React,{useState} from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import { UserProfile } from '../../types';
import { speakText } from '../../utils/audio';
import { Art } from './ExperienceShell';
const books:Record<string,{title:string;art:string;pages:string[];moral:string}>={
 forest:{title:'Fanti dans la forêt',art:'worlds',pages:['Ce matin, Fanti entre dans la forêt. Il écoute le chant des oiseaux et suit un petit sentier.','Au pied d’un arbre, un oisillon est tombé de son nid. Fanti appelle les autres animaux pour l’aider.','Avec douceur, ils placent l’oisillon à l’abri près de sa famille. Fanti ramasse aussi les déchets sur le sentier.'],moral:'Prendre soin de la nature, c’est prendre soin de tous ses habitants.'},
 desert:{title:'Le trésor du désert',art:'challenges',pages:['Fanti découvre une carte au bord du désert. Avec son ami le dromadaire, il prépare de l’eau et part tôt le matin.','Ils suivent les traces dessinées sur la carte. Quand la chaleur augmente, ils se reposent à l’ombre.','Au bout du chemin, ils trouvent un coffre rempli de graines et un jardin près d’une oasis. Ils partagent les graines avec les habitants.'],moral:'Le plus beau trésor est celui que l’on partage.'},
 space:{title:'Le voyage dans l’espace',art:'worlds',pages:['Fanti rêve d’explorer l’espace. Il prépare sa fusée et enfile sa combinaison d’astronaute.','À travers le hublot, il voit la Terre, la Lune et les anneaux de Saturne. Il apprend que la Terre tourne autour du Soleil.','De retour à la maison, Fanti raconte son voyage. Il veut protéger notre planète bleue et continuer à apprendre.'],moral:'La curiosité nous fait découvrir le monde, et les connaissances nous aident à en prendre soin.'}
};
export function StoryReader({id,user,onBack,onAwardXP}:{id:string;user:UserProfile;onBack:()=>void;onAwardXP:(xp:number,stars:number)=>void}){
 const story=books[id]||books.forest;
 const [page,setPage]=useState(0),[finished,setFinished]=useState(false);
 const complete=()=>{if(finished)return;setFinished(true);onAwardXP(30,5)};
 return <section className="reader-screen"><Art name={story.art}/><div><span>📖 {page+1} / {story.pages.length}</span><h2>{story.title}</h2><p>{finished?story.moral:story.pages[page]}</p><div className="reader-controls"><button onClick={()=>speakText(finished?story.moral:story.pages[page],user.language==='en'?'en-US':'fr-FR')}><Volume2/> Écouter</button>{!finished?<button className="primary-cta" onClick={()=>page<story.pages.length-1?setPage(page+1):complete()}>{page<story.pages.length-1?'Page suivante':'Terminer l’histoire'}<ArrowRight/></button>:<><strong>Bravo ! +5 étoiles ⭐</strong><button className="primary-cta" onClick={onBack}>Choisir une autre histoire</button></>}</div></div></section>;
}
