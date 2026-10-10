import React,{useState} from 'react';
import { ExternalLink, Camera, HelpCircle, Globe2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { Art } from '../experience/ExperienceShell';
interface Props {user:UserProfile;onBack:()=>void;onOpenWorld:()=>void;onQuiz?:()=>void}
const sources=[
 {id:'nature',title:'Animaux & nature',icon:'🦒',provider:'Explore.org',description:'Choisis une caméra animalière dans le catalogue du fournisseur.',url:'https://explore.org/livecams'},
 {id:'cities',title:'Villes & monuments',icon:'🏙️',provider:'EarthCam',description:'Explore les caméras publiques des villes et des monuments.',url:'https://www.earthcam.com/'},
 {id:'ocean',title:'Océans & vie marine',icon:'🐠',provider:'Explore.org',description:'Retrouve les caméras marines dans le catalogue du fournisseur.',url:'https://explore.org/livecams'},
];
export const LiveWorldModule:React.FC<Props>=({onOpenWorld,onQuiz})=>{
 const [selected,setSelected]=useState(sources[0]);
 return <section className="live-experience"><div className="live-source-card"><Art name="videos"/><div><span><Camera/> CAMÉRAS DU MONDE</span><h2>{selected.title}</h2><p>{selected.description}</p><p className="source-status">Le flux et sa disponibilité dépendent du fournisseur.</p><a className="primary-cta" href={selected.url} target="_blank" rel="noopener noreferrer"><ExternalLink/> Ouvrir {selected.provider}</a></div></div><aside><h2>Choisis ta découverte</h2>{sources.map(source=><button key={source.id} className={source.id===selected.id?'selected':''} onClick={()=>setSelected(source)}><span>{source.icon}</span><strong>{source.title}</strong><small>{source.provider}</small></button>)}<button className="live-mission" onClick={onQuiz}><HelpCircle/> Mission : reconnais les animaux</button><button className="live-mission" onClick={onOpenWorld}><Globe2/> Explorer les pays</button></aside></section>;
};
