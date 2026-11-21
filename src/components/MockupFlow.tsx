import React, { useEffect, useState } from "react";
import { BebeTabTicker } from "./BebeTabTicker";

// Écrans de BébéTab tels que dessinés dans les maquettes : image plein écran + zones cliquables.
type Zone = { l: number; t: number; w: number; h: number; go?: string; toast?: string; nom?: string; video?: boolean };
type Video = { id: string; title: string; thumbnail: string; theme: string; ageGroup: string };
const AGES = ["2-4", "5-7", "8-10"];
const THEMES_VIDEO = [["monde", "Monde"], ["apprendre", "Apprendre"], ["histoires", "Histoires"], ["musique", "Musique"], ["jouer", "Jouer"], ["dessiner", "Dessiner"]];
type Ecran = { img: string; zones: Zone[] };

const ECRANS: Record<string, Ecran> = {
  accueil: { img: "/screens/accueil.jpg", zones: [
    { l: 38.3, t: 2.1, w: 42.5, h: 6.9, toast: "Profil de l'enfant" },
    { l: 81.8, t: 1.6, w: 10.9, h: 5.8, toast: "Langue FR / EN" },
    { l: 93.4, t: 1.9, w: 5.3, h: 7.4, go: "parents" },
    { l: 66.5, t: 11.5, w: 32.2, h: 28.1, go: "bientot", nom: "Live World" },
    { l: 35.9, t: 57.4, w: 27.4, h: 14.9, go: "monde" },
    { l: 67, t: 44.5, w: 7.8, h: 14.5, video: true, nom: "Vidéos" },
    { l: 75.5, t: 44.5, w: 7.8, h: 14.5, go: "bientot", nom: "Jeux du jour" },
    { l: 83.1, t: 44.5, w: 7.8, h: 14.5, go: "histoire" },
    { l: 90.6, t: 44.5, w: 7.8, h: 14.5, toast: "Chanson du jour" },
    { l: 0.9, t: 74.4, w: 12.1, h: 21.3, go: "monde" },
    { l: 13.3, t: 74.4, w: 12.1, h: 21.3, go: "sciences" },
    { l: 25.6, t: 74.4, w: 11.8, h: 21.3, go: "bientot", nom: "Jouer" },
    { l: 37.6, t: 74.4, w: 12, h: 21.3, go: "histoire" },
    { l: 49.8, t: 74.4, w: 12.1, h: 21.3, go: "bientot", nom: "Live World" },
    { l: 62.1, t: 74.4, w: 12.1, h: 21.3, go: "bientot", nom: "Musique" },
    { l: 74.3, t: 74.4, w: 11.9, h: 21.3, go: "bientot", nom: "Dessiner" },
    { l: 86.6, t: 74.4, w: 12.1, h: 21.3, go: "bientot", nom: "Mes récompenses" },
  ]},
  monde: { img: "/screens/menu.jpg", zones: [
    { l: 36.8, t: 43.6, w: 25.7, h: 6.4, toast: "Explorer le monde : continents bientôt disponibles" },
    { l: 0.9, t: 53.7, w: 23.9, h: 20.7, go: "monde" },
    { l: 25.7, t: 53.7, w: 23.9, h: 20.7, go: "sciences" },
    { l: 50.4, t: 53.7, w: 23.9, h: 20.7, go: "bientot", nom: "Jouer" },
    { l: 75.1, t: 53.7, w: 23.9, h: 20.7, go: "histoire" },
    { l: 0.9, t: 75.7, w: 23.9, h: 21.5, go: "bientot", nom: "Live World" },
    { l: 25.7, t: 75.7, w: 23.9, h: 21.5, go: "bientot", nom: "Musique" },
    { l: 50.4, t: 75.7, w: 23.9, h: 21.5, go: "bientot", nom: "Dessiner" },
    { l: 75.1, t: 75.7, w: 23.9, h: 21.5, go: "bientot", nom: "Mes récompenses" },
  ]},
  sciences: { img: "/screens/sciences.jpg", zones: [
    { l: 53.5, t: 20.7, w: 19.7, h: 30.8, toast: "Animaux" },
    { l: 74.6, t: 20.7, w: 20.5, h: 30.8, toast: "Plantes" },
    { l: 53.5, t: 53.7, w: 19.7, h: 30.8, toast: "Corps" },
    { l: 74.6, t: 53.7, w: 20.5, h: 30.8, toast: "Espace" },
    { l: 32.3, t: 83.4, w: 36.8, h: 13.8, toast: "Commencer" },
  ]},
  histoire: { img: "/screens/histoire.jpg", zones: [
    { l: 71.8, t: 77.6, w: 15.5, h: 15.9, toast: "Écouter" },
    { l: 2.2, t: 2.6, w: 5.4, h: 8, go: "accueil" },
    { l: 91.9, t: 2.6, w: 5.5, h: 8, go: "parents" },
  ]},
  parents: { img: "/screens/parents.jpg", zones: [
    { l: 35.4, t: 86.6, w: 55.4, h: 10.6, toast: "Enregistré" },
    { l: 30.6, t: 16.9, w: 65.6, h: 20.8, toast: "Profil enfant" },
    { l: 30.6, t: 40.9, w: 65.6, h: 20.8, toast: "Temps d'écran" },
    { l: 30.6, t: 64.9, w: 65.6, h: 20.8, toast: "Vidéos autorisées" },
  ]},
};

// Lecteur de vidéos : liste depuis /api/education/videos, lecture via YouTube sans cookies.
const VideoPlayer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [choisie, setChoisie] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [theme, setTheme] = useState<string>("");
  const filtrees = (videos || []).filter(v => (!age || v.ageGroup === age) && (!theme || v.theme === theme));
  const chip = (actif: boolean) => "px-3 py-1 rounded-full text-sm font-black " + (actif ? "bg-yellow-300 text-blue-900" : "bg-white/80 text-blue-700");
  useEffect(() => {
    fetch("/api/education/videos")
      .then(r => r.json())
      .then(d => setVideos(Array.isArray(d.videos) ? d.videos : []))
      .catch(() => setVideos([]));
  }, []);
  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex flex-col p-4 overflow-auto">
      <div className="flex justify-between items-center mb-3">
        <div className="text-white text-2xl font-black">Vidéos du jour</div>
        <button onClick={onClose} className="px-5 py-2 rounded-full bg-white text-blue-700 font-black">Fermer</button>
      </div>
      {choisie && (
        <div className="relative w-full max-w-4xl mx-auto mb-4" style={{ aspectRatio: "16 / 9" }}>
          <iframe className="absolute inset-0 w-full h-full rounded-2xl" src={"https://www.youtube-nocookie.com/embed/" + choisie + "?autoplay=1&rel=0"} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title="Vidéo" />
        </div>
      )}
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        <button className={chip(!age)} onClick={() => setAge("")}>Tous les âges</button>
        {AGES.map(a => <button key={a} className={chip(age === a)} onClick={() => setAge(a)}>{a} ans</button>)}
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <button className={chip(!theme)} onClick={() => setTheme("")}>Tous les thèmes</button>
        {THEMES_VIDEO.map(([id, nom]) => <button key={id} className={chip(theme === id)} onClick={() => setTheme(id)}>{nom}</button>)}
      </div>
      {videos === null && <div className="text-white text-center">Chargement…</div>}
      {videos && filtrees.length === 0 && <div className="text-white text-center">Aucune vidéo pour ce filtre.</div>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto w-full">
        {filtrees.slice(0, 24).map(v => (
          <button key={v.id} onClick={() => setChoisie(v.id)} className="text-left bg-white rounded-2xl overflow-hidden shadow">
            <img src={v.thumbnail} alt="" className="w-full aspect-video object-cover" />
            <div className="p-2 text-sm font-bold text-blue-900 line-clamp-2">{v.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const MockupFlow: React.FC = () => {
  const [lecteur, setLecteur] = useState<boolean>(false);
  const [courant, setCourant] = useState<string>("accueil");
  const [historique, setHistorique] = useState<string[]>([]);
  const [toast, setToast] = useState<string>("");
  const [bientot, setBientot] = useState<string>("");

  const ecran = ECRANS[courant];

  const aller = (cible: string) => {
    setHistorique(h => [...h, courant]);
    setCourant(cible);
    setBientot("");
    window.scrollTo(0, 0);
  };
  const retour = () => {
    setHistorique(h => {
      const copie = [...h];
      const precedent = copie.pop();
      if (precedent) setCourant(precedent);
      return copie;
    });
    setBientot("");
  };
  const activer = (z: Zone) => {
    if (z.video) { setLecteur(true); return; }
    if (z.toast) {
      setToast(z.toast);
      window.setTimeout(() => setToast(""), 1800);
      return;
    }
    if (z.go === "bientot") { setBientot(z.nom || ""); setHistorique(h => [...h, courant]); setCourant("bientot"); return; }
    if (z.go) aller(z.go);
  };

  return (
    <div className="min-h-screen bg-[#0ba9e7] pb-16">
      {courant === "bientot" ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-white text-center p-6">
          <div className="text-4xl font-black mb-3">{bientot}</div>
          <div className="text-lg opacity-90">Écran en cours de création</div>
          <button onClick={retour} className="mt-6 px-6 py-3 rounded-full bg-white text-blue-700 font-black">Retour</button>
        </div>
      ) : (
        <div className="relative w-full max-w-[1672px] mx-auto" style={{ aspectRatio: "1672 / 941" }}>
          <img src={ecran.img} alt="" className="absolute inset-0 w-full h-full object-contain select-none" draggable={false} />
          {ecran.zones.map((z, i) => (
            <button
              key={i}
              onClick={() => activer(z)}
              aria-label={z.nom || z.toast || "Ouvrir"}
              className="absolute bg-transparent focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-2xl"
              style={{ left: z.l + "%", top: z.t + "%", width: z.w + "%", height: z.h + "%" }}
            />
          ))}
          {historique.length > 0 && (
            <button onClick={retour} className="absolute top-2 left-2 px-4 py-2 rounded-full bg-white/90 text-blue-700 font-black shadow">← Retour</button>
          )}
        </div>
      )}
      {lecteur && <VideoPlayer onClose={() => setLecteur(false)} />}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 px-6 py-3 rounded-full bg-white text-blue-800 font-black shadow-lg">{toast}</div>
      )}
      <BebeTabTicker />
    </div>
  );
};
