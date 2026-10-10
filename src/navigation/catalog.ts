import { ActiveScreen } from '../types';
export type Destination = { screen: ActiveScreen; activity?: string; country?: string };
export type ScreenCard = { id: string; title: string; en: string; subtitle: string; icon: string; to: Destination; color?: string };
export const screenMeta: Partial<Record<ActiveScreen, {title:string; en:string; subtitle:string; art:string; accent:string}>> = {
  home:{title:'BÉBÉTAB',en:'BÉBÉTAB',subtitle:'Le monde dans tes mains',art:'worlds',accent:'#078cdd'},
  world:{title:'EXPLORER LE MONDE',en:'EXPLORE THE WORLD',subtitle:'Un continent, un pays, une nouvelle découverte.',art:'worlds',accent:'#089dcc'},
  country:{title:'DÉCOUVRIR UN PAYS',en:'DISCOVER A COUNTRY',subtitle:'Observe, écoute et découvre sa culture.',art:'worlds',accent:'#168be0'},
  live:{title:'LIVE WORLD',en:'LIVE WORLD',subtitle:'Choisis une caméra et pars à la découverte du monde.',art:'worlds',accent:'#098fce'},
  apprendre:{title:'APPRENDRE',en:'LEARN',subtitle:'Choisis une matière et commence à apprendre !',art:'quiz',accent:'#ee9600'},
  jouer:{title:'JOUER',en:'PLAY',subtitle:'Des jeux éducatifs pour apprendre en s’amusant !',art:'challenges',accent:'#ef4554'},
  histoires:{title:'HISTOIRES',en:'STORIES',subtitle:'Écoute, lis et vis des histoires avec Fanti.',art:'assistant',accent:'#9254e4'},
  dessiner:{title:'DESSINER',en:'DRAW',subtitle:'Laisse libre cours à ton imagination !',art:'quiz',accent:'#f9a400'},
  musique:{title:'MUSIQUE',en:'MUSIC',subtitle:'Chante, joue et crée ta musique.',art:'music',accent:'#ee4196'},
  recompenses:{title:'MES RÉCOMPENSES',en:'MY REWARDS',subtitle:'Tes étoiles, tes badges et les tenues de Fanti.',art:'rewards',accent:'#1cbb63'},
  quiz:{title:'QUIZ',en:'QUIZ',subtitle:'Teste tes découvertes et gagne des étoiles.',art:'quiz',accent:'#7a52d5'},
  defis:{title:'DÉFIS DU JOUR',en:'DAILY CHALLENGES',subtitle:'Une nouvelle mission à accomplir chaque jour.',art:'challenges',accent:'#0fa873'},
  mondes:{title:'MES MONDES',en:'MY WORLDS',subtitle:'Choisis l’univers de tes prochaines aventures.',art:'worlds',accent:'#099bb8'},
  videos:{title:'VIDÉOS',en:'VIDEOS',subtitle:'Regarde, observe et apprends.',art:'videos',accent:'#e54749'},
};
const c = (id:string,title:string,en:string,icon:string,to:Destination,subtitle=''):ScreenCard=>({id,title,en,icon,to,subtitle});
export const mainCards: ScreenCard[] = [
 c('world','Monde','World','🌍',{screen:'world'},'Pays & continents'),c('learn','Apprendre','Learn','📖',{screen:'apprendre'},'Lettres, sciences & découvertes'),
 c('play','Jouer','Play','🎮',{screen:'jouer'},'Jeux & aventures'),c('stories','Histoires','Stories','📚',{screen:'histoires'},'Lire & écouter'),
 c('live','Live World','Live World','📷',{screen:'live'},'Caméras du monde'),c('music','Musique','Music','🎵',{screen:'musique'},'Instruments & comptines'),
 c('draw','Dessiner','Draw','🎨',{screen:'dessiner'},'Créer & colorier'),c('rewards','Mes récompenses','My rewards','⭐',{screen:'recompenses'},'Badges & tenues')
];
export const extraCards:ScreenCard[]=[c('quiz','Quiz','Quiz','🧠',{screen:'quiz'}),c('challenges','Défis du jour','Daily challenges','🏆',{screen:'defis'}),c('worlds','Mes mondes','My worlds','🪐',{screen:'mondes'}),c('videos','Vidéos','Videos','🎬',{screen:'videos'})];
export const hubCards: Partial<Record<ActiveScreen,ScreenCard[]>>={
 apprendre:[c('letters','Lettres','Letters','A',{screen:'apprendre',activity:'alphabet'}),c('numbers','Nombres','Numbers','123',{screen:'apprendre',activity:'chiffres'}),c('science','Sciences','Science','⚗️',{screen:'apprendre',activity:'sciences'}),c('world','Monde','World','🌍',{screen:'world'}),c('animals','Animaux','Animals','🦁',{screen:'apprendre',activity:'animaux'}),c('space','Espace','Space','🪐',{screen:'apprendre',activity:'espace'}),c('art','Art','Art','🎨',{screen:'dessiner'}),c('languages','Langues','Languages','🗣️',{screen:'apprendre',activity:'alphabet'})],
 jouer:[c('puzzles','Puzzles','Puzzles','🧩',{screen:'jouer',activity:'builder'}),c('math','Maths','Maths','123',{screen:'jouer',activity:'speedmath'}),c('geography','Géographie','Geography','🌍',{screen:'quiz',activity:'Culture & Histoire'}),c('animals','Animaux','Animals','🦁',{screen:'jouer',activity:'safari'}),c('memory','Mémoire','Memory','🧠',{screen:'jouer',activity:'memory'}),c('logic','Logique','Logic','🧊',{screen:'jouer',activity:'maze'}),c('french','Français','French','ABC',{screen:'apprendre',activity:'alphabet'}),c('english','English','English','ABC',{screen:'apprendre',activity:'english'}),c('all','Tous les jeux','All games','🎮',{screen:'jouer',activity:'selector'})],
 histoires:[c('forest','Fanti dans la forêt','Fanti in the forest','🌲',{screen:'histoires',activity:'forest'}),c('desert','Le trésor du désert','The desert treasure','🏜️',{screen:'histoires',activity:'desert'}),c('space','Le voyage dans l’espace','Space adventure','🚀',{screen:'histoires',activity:'space'}),c('create','Créer mon histoire','Create my story','✨',{screen:'histoires',activity:'create'})],
 dessiner:[c('free','Dessin libre','Free drawing','🖌️',{screen:'dessiner',activity:'free'}),c('coloring','Coloriage','Coloring','🦋',{screen:'dessiner',activity:'coloring'}),c('letters','Tracer lettres','Trace letters','A',{screen:'dessiner',activity:'letters'}),c('numbers','Tracer chiffres','Trace numbers','123',{screen:'dessiner',activity:'numbers'}),c('shapes','Formes','Shapes','🔵',{screen:'dessiner',activity:'shapes'}),c('music','Créer musique','Create music','🎵',{screen:'musique',activity:'piano'})],
 musique:[c('piano','Piano','Piano','🎹',{screen:'musique',activity:'piano'}),c('xylophone','Xylophone','Xylophone','🌈',{screen:'musique',activity:'xylophone'}),c('drums','Percussions','Drums','🥁',{screen:'musique',activity:'drums'}),c('karaoke','Comptines','Songs','🎤',{screen:'musique',activity:'karaoke'})],
 quiz:[c('math','Maths & chiffres','Maths & numbers','🔢',{screen:'quiz',activity:'Maths & Chiffres'}),c('animals','Animaux & nature','Animals & nature','🐘',{screen:'quiz',activity:'Animaux & Nature'}),c('science','Sciences & planètes','Science & planets','🚀',{screen:'quiz',activity:'Sciences & Planètes'}),c('culture','Culture & histoire','Culture & history','🌍',{screen:'quiz',activity:'Culture & Histoire'})]
};
export const continents=['Afrique','Europe','Asie','Amérique','Océanie','Antarctique'];
export const countries = [
 {id:'ivory-coast',name:'Côte d’Ivoire',flag:'🇨🇮',continent:'Afrique',city:'Abidjan',fact:'La capitale politique est Yamoussoukro. Le cacao est une grande richesse du pays.',topics:['Yamoussoukro','Abidjan','Cacao','Danses','Océan','Savane']},
 {id:'france',name:'France',flag:'🇫🇷',continent:'Europe',city:'Paris',fact:'Paris est la capitale de la France. La tour Eiffel se trouve au bord de la Seine.',topics:['Tour Eiffel','Culture','Animaux','Gastronomie','Villes','Histoire']},
 {id:'usa',name:'États-Unis',flag:'🇺🇸',continent:'Amérique',city:'New York',fact:'Washington est la capitale des États-Unis. La statue de la Liberté se trouve à New York.',topics:['Statue de la Liberté','Culture','Parcs naturels','Cuisine','Villes','Histoire']},
 {id:'kenya',name:'Kenya',flag:'🇰🇪',continent:'Afrique',city:'Nairobi',fact:'Nairobi est la capitale du Kenya. Ses savanes accueillent de nombreux animaux sauvages.',topics:['Nairobi','Safari','Lions','Mont Kenya','Culture','Océan Indien']},
 {id:'japan',name:'Japon',flag:'🇯🇵',continent:'Asie',city:'Tokyo',fact:'Tokyo est la capitale du Japon. Le mont Fuji est un volcan célèbre du pays.',topics:['Tokyo','Sakura','Robotique','Manga','Mont Fuji','Océan']},
 {id:'egypt',name:'Égypte',flag:'🇪🇬',continent:'Afrique',city:'Le Caire',fact:'Le Nil traverse l’Égypte. Les pyramides de Gizeh sont des monuments de l’Antiquité.',topics:['Le Caire','Pyramides','Nil','Pharaons','Désert','Sphinx']},
 {id:'australia',name:'Australie',flag:'🇦🇺',continent:'Océanie',city:'Sydney',fact:'Canberra est la capitale de l’Australie. On y trouve des kangourous et la Grande Barrière de corail.',topics:['Sydney','Kangourous','Coraux','Culture','Nature','Océan']},
];
export function parseDestination(hash:string):Destination {
 const [path,query='']=hash.replace(/^#\/?/,'').split('?');
 const screen=Object.keys(screenMeta).includes(path)?path as ActiveScreen:'home';
 const params=new URLSearchParams(query);
 return {screen,activity:params.get('activity')||undefined,country:params.get('country')||undefined};
}
export function destinationHash(to:Destination){const p=new URLSearchParams();if(to.activity)p.set('activity',to.activity);if(to.country)p.set('country',to.country);return `#/${to.screen}${p.size?'?'+p.toString():''}`;}
