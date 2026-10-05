import React, { useState, useEffect } from "react";
import { UserProfile, WorldTheme } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import { MascotFanti } from "../MascotFanti";
import {
  ArrowLeft,
  Globe2,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Compass,
  Trophy,
  Star,
  Check
} from "lucide-react";

interface WorldsModuleProps {
  user: UserProfile;
  onChangeWorld: (world: WorldTheme) => void;
  onAwardXP?: (xp: number, stars: number) => void;
  onBack: () => void;
}

export const WorldsModule: React.FC<WorldsModuleProps> = ({
  user,
  onChangeWorld,
  onAwardXP,
  onBack,
}) => {
  const [currentTourIndex, setCurrentTourIndex] = useState<number>(0);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [visitedCount, setVisitedCount] = useState<number>(1);

  const worldsList: {
    name: WorldTheme;
    emoji: string;
    description: string;
    gradient: string;
    borderColor: string;
    fantiSpeechFr: string;
    fantiSpeechEn: string;
    hotspots: { id: string; nameFr: string; nameEn: string; emoji: string; textFr: string; textEn: string }[];
  }[] = [
    {
      name: "Jungle",
      emoji: "🌴",
      description: "Des arbres géants, des singes rigolos et des perroquets colorés !",
      gradient: "from-emerald-600 via-teal-500 to-green-700",
      borderColor: "border-green-300",
      fantiSpeechFr: "Bienvenue dans la grande Jungle sauvage ! Écoute les oiseaux chanter et touche les animaux pour les découvrir !",
      fantiSpeechEn: "Welcome to the wild Jungle! Listen to the birds sing and tap the animals to explore!",
      hotspots: [
        { id: "toucan", nameFr: "Toucan Coloré", nameEn: "Colorful Toucan", emoji: "🦜", textFr: "Le toucan chante joyeusement tout en haut du grand baobab !", textEn: "The toucan sings happily high up in the baobab tree!" },
        { id: "singe", nameFr: "Singe Rigolo", nameEn: "Funny Monkey", emoji: "🐒", textFr: "Ouah ouah ! Le petit singe fait des pirouettes sur les lianes !", textEn: "Ooh ooh! The tiny monkey does flips on the vines!" },
        { id: "bananes", nameFr: "Bananier Magique", nameEn: "Magic Banana Tree", emoji: "🍌", textFr: "Miam ! De délicieuses bananes jaunes pour le goûter !", textEn: "Yum! Delicious yellow bananas for a snack!" },
        { id: "cascade", nameFr: "Cascade d'Eau", nameEn: "Waterfall", emoji: "🌊", textFr: "L'eau fraîche et transparente coule entre les rochers !", textEn: "Fresh clear water flows between the rocks!" }
      ]
    },
    {
      name: "Océan",
      emoji: "🌊",
      description: "Plonge avec les dauphins, les poissons lumineux et les tortues !",
      gradient: "from-blue-600 via-cyan-500 to-sky-700",
      borderColor: "border-cyan-300",
      fantiSpeechFr: "Plonge avec moi sous l'eau ! Découvre les mystères de l'océan et les trésors marins !",
      fantiSpeechEn: "Dive underwater with me! Discover ocean mysteries and marine treasures!",
      hotspots: [
        { id: "dauphin", nameFr: "Dauphin Joueur", nameEn: "Playful Dolphin", emoji: "🐬", textFr: "Le dauphin fait des bonds acrobatiques dans les vagues !", textEn: "The dolphin does acrobatic leaps in the waves!" },
        { id: "tortue", nameFr: "Tortue de Mer", nameEn: "Sea Turtle", emoji: "🐢", textFr: "La grande tortue nage avec élégance au-dessus des coraux !", textEn: "The sea turtle swims gracefully over corals!" },
        { id: "tresor", nameFr: "Trésor Englouti", nameEn: "Sunken Treasure", emoji: "👑", textFr: "Un coffre secret rempli d'étoiles et de pièces brillantes !", textEn: "A secret chest filled with stars and shiny coins!" },
        { id: "corail", nameFr: "Récif de Corail", nameEn: "Coral Reef", emoji: "🪸", textFr: "Des milliers de petits poissons multicolores jouent à cache-cache !", textEn: "Thousands of tiny colorful fish play hide and seek!" }
      ]
    },
    {
      name: "Espace",
      emoji: "🚀",
      description: "Voyage entre les étoiles, les fusées et les petites planètes !",
      gradient: "from-slate-900 via-indigo-900 to-purple-950",
      borderColor: "border-yellow-300",
      fantiSpeechFr: "Attache ta ceinture ! Nous nous envolons dans l'Espace parmi les étoiles et les fusées !",
      fantiSpeechEn: "Fasten your seatbelt! We are blasting off into Space among stars and rockets!",
      hotspots: [
        { id: "fusee", nameFr: "Fusée Spatial", nameEn: "Space Rocket", emoji: "🚀", textFr: "Décollage imminant ! 3... 2... 1... Feu vers la Lune !", textEn: "Blast off! 3... 2... 1... Liftoff to the Moon!" },
        { id: "saturne", nameFr: "Planète Saturne", nameEn: "Planet Saturn", emoji: "🪐", textFr: "Saturne brille avec ses magnifiques anneaux de glace dorée !", textEn: "Saturn glows with its magnificent golden ice rings!" },
        { id: "astronaute", nameFr: "Astronaute", nameEn: "Astronaut", emoji: "👨‍🚀", textFr: "Flotte doucement en apesanteur comme un vrai spationaute !", textEn: "Float gently in zero gravity like a real astronaut!" },
        { id: "etoile", nameFr: "Étoile Filante", nameEn: "Shooting Star", emoji: "⭐️", textFr: "Fais un beau vœu magique sous l'étoile qui traverse le ciel !", textEn: "Make a magical wish upon the shooting star crossing the sky!" }
      ]
    },
    {
      name: "Dinosaures",
      emoji: "🦖",
      description: "Explore le monde préhistorique des gentils diplodocus et T-Rex !",
      gradient: "from-amber-700 via-orange-600 to-yellow-800",
      borderColor: "border-amber-300",
      fantiSpeechFr: "Remontons le temps jusqu'à l'époque des Dinosaures géants ! Sois prêt pour de grandes découvertes !",
      fantiSpeechEn: "Let's travel back in time to the age of giant Dinosaurs! Get ready for big discoveries!",
      hotspots: [
        { id: "trex", nameFr: "T-Rex Gentil", nameEn: "Friendly T-Rex", emoji: "🦖", textFr: "Roaar ! Le T-Rex protège fièrement sa vallée préhistorique !", textEn: "Roar! The T-Rex proudly guards his prehistoric valley!" },
        { id: "diplodocus", nameFr: "Diplodocus Géant", nameEn: "Giant Diplodocus", emoji: "🦕", textFr: "Son long cou monte tout en haut des plus grands arbres !", textEn: "Its long neck reaches right up to the highest treetops!" },
        { id: "oeuf", nameFr: "Œuf de Dinosaure", nameEn: "Dinosaur Egg", emoji: "🥚", textFr: "Craque ! Un mignon petit bébé dinosaure pointe le bout de son nez !", textEn: "Crack! A cute baby dinosaur hatches out of the egg!" },
        { id: "volcan", nameFr: "Volcan en Éruption", nameEn: "Erupting Volcano", emoji: "🌋", textFr: "Regarde le volcan s'illuminer avec sa lave étincelante !", textEn: "Look at the volcano glowing with its sparkling lava!" }
      ]
    },
    {
      name: "Savane",
      emoji: "🐘",
      description: "Le royaume de Fanti l'éléphant, des girafes et des majestueux lions !",
      gradient: "from-yellow-500 via-amber-500 to-orange-600",
      borderColor: "border-yellow-200",
      fantiSpeechFr: "Bienvenue dans la Savane africaine ! C'est le monde préféré de Fanti l'éléphant !",
      fantiSpeechEn: "Welcome to the African Savanna! This is Fanti the elephant's favorite world!",
      hotspots: [
        { id: "lion", nameFr: "Lion Majestueux", nameEn: "Majestic Lion", emoji: "🦁", textFr: "Grrr ! Le roi de la savane rugit doucement au soleil !", textEn: "Roar! The king of the savanna roars softly in the sun!" },
        { id: "girafe", nameFr: "Girafe Élégante", nameEn: "Elegant Giraffe", emoji: "🦒", textFr: "La girafe tend son long cou pour attraper des feuilles délicieuses !", textEn: "The giraffe stretches her long neck to nibble delicious leaves!" },
        { id: "fanti_savane", nameFr: "Éléphant Fanti", nameEn: "Fanti Elephant", emoji: "🐘", textFr: "Pfffft ! Fanti fait une shower de fraîcheur avec sa trompe !", textEn: "Pfffft! Fanti sprays a cool water shower with his trunk!" },
        { id: "baobab", nameFr: "Arbre Baobab", nameEn: "Baobab Tree", emoji: "🌳", textFr: "Un arbre géant légendaire qui offre de l'ombre à tous les animaux !", textEn: "A legendary giant tree providing shade for all animals!" }
      ]
    },
    {
      name: "Royaume Magique",
      emoji: "🏰",
      description: "Châteaux féériques, baguettes magiques et licornes scintillantes !",
      gradient: "from-purple-600 via-pink-500 to-fuchsia-700",
      borderColor: "border-pink-300",
      fantiSpeechFr: "Bienvenue au Royaume Magique ! Ici, les rêves prennent vie avec de la poussière d'étoiles !",
      fantiSpeechEn: "Welcome to the Magic Kingdom! Here, dreams come alive with stardust!",
      hotspots: [
        { id: "licorne", nameFr: "Licorne Féérique", nameEn: "Fairy Unicorn", emoji: "🦄", textFr: "La licorne s'envole sur un arc-en-ciel brillant de milles couleurs !", textEn: "The unicorn flies over a bright rainbow of a thousand colors!" },
        { id: "baguette", nameFr: "Baguette Magique", nameEn: "Magic Wand", emoji: "🪄", textFr: "Turlututu ! Abracadabra ! De la poussière d'étoiles scintillante !", textEn: "Abracadabra! Sparkling stardust everywhere!" },
        { id: "chateau", nameFr: "Château Fort", nameEn: "Enchanted Castle", emoji: "🏰", textFr: "Un château féérique aux tours dorées étincelantes !", textEn: "A fairytale castle with sparkling golden towers!" },
        { id: "couronne", nameFr: "Couronne Royale", nameEn: "Royal Crown", emoji: "👑", textFr: "Pose la couronne magique sur ta tête pour devenir prince ou princesse !", textEn: "Put the magic crown on your head to become a prince or princess!" }
      ]
    },
    {
      name: "Ville",
      emoji: "🚒",
      description: "Camions de pompiers, bus rigolos et petites maisons colorées !",
      gradient: "from-red-600 via-rose-500 to-orange-600",
      borderColor: "border-rose-300",
      fantiSpeechFr: "Découvre la Grande Ville animée ! Regarde les véhicules et les pompiers en action !",
      fantiSpeechEn: "Explore the bustling Big City! Watch vehicles and firefighters in action!",
      hotspots: [
        { id: "pompier", nameFr: "Camion Pompier", nameEn: "Fire Truck", emoji: "🚒", textFr: "Pin-pon pin-pon ! Le camion de pompiers roule pour aider !", textEn: "Wuu-wuu! The fire truck drives out to save the day!" },
        { id: "bus", nameFr: "Bus des Enfants", nameEn: "Kids Bus", emoji: "🚌", textFr: "Vroum vroum ! Le bus jaune emmène tous les copains à la fête !", textEn: "Vroom vroom! The yellow bus takes all friends to the party!" },
        { id: "feu", nameFr: "Feu Tricolore", nameEn: "Traffic Light", emoji: "🚦", textFr: "Rouge pour s'arrêter, vert pour rouler en toute sécurité !", textEn: "Red to stop, green to go safely!" },
        { id: "ecole", nameFr: "École Joyeuse", nameEn: "Happy School", emoji: "🏫", textFr: "Une grande cour de récréation avec des jeux et des toboggans !", textEn: "A big playground filled with games and slides!" }
      ]
    },
    {
      name: "Ferme",
      emoji: "🚜",
      description: "Chant du coq, petits poussins, tracteur vert et gentils moutons !",
      gradient: "from-lime-600 via-emerald-600 to-teal-700",
      borderColor: "border-lime-300",
      fantiSpeechFr: "Cocorico ! Bienvenue à la Ferme joyeuse ! Viens saluer tous nos copains les animaux !",
      fantiSpeechEn: "Cock-a-doodle-doo! Welcome to the happy Farm! Come greet all our animal friends!",
      hotspots: [
        { id: "coq", nameFr: "Coq Matinal", nameEn: "Morning Rooster", emoji: "🐓", textFr: "Cocorico ! Le soleil se lève sur les champs de blé !", textEn: "Cock-a-doodle-doo! The sun rises over the wheat fields!" },
        { id: "tracteur", nameFr: "Tracteur Vert", nameEn: "Green Tractor", emoji: "🚜", textFr: "Pout pout ! Le fermier prépare la terre pour les récoltes !", textEn: "Puff puff! The farmer prepares the land for harvest!" },
        { id: "vache", nameFr: "Vache Douce", nameEn: "Sweet Cow", emoji: "🐮", textFr: "Meuh ! Un bon verre de lait chaud pour faire le plein d'énergie !", textEn: "Moo! A delicious glass of warm milk for energy!" },
        { id: "poussins", nameFr: "Bébés Poussins", nameEn: "Baby Chicks", emoji: "🐥", textFr: "Piou piou ! Les petits poussins jaunes trottinent derrière maman poule !", textEn: "Peep peep! Cute yellow chicks waddle behind mama hen!" }
      ]
    }
  ];

  const currentWorldData = worldsList[currentTourIndex];

  // Auto-play effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTourActive && isAutoPlay) {
      timer = setInterval(() => {
        handleNextWorld();
      }, 9000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTourActive, isAutoPlay, currentTourIndex]);

  // Handle start/launch full continuous tour
  const handleStartTour = (startIndex: number = 0) => {
    setCurrentTourIndex(startIndex);
    setIsTourActive(true);
    setSelectedHotspot(null);
    soundFx.playVictory();
    confetti({ particleCount: 70, spread: 60 });
    
    const world = worldsList[startIndex];
    speakText(user.language === "fr" ? world.fantiSpeechFr : world.fantiSpeechEn, user.language === "fr" ? "fr-FR" : "en-US");
  };

  // Handle navigation to Next World in tour
  const handleNextWorld = () => {
    soundFx.playVictory();
    confetti({ particleCount: 60, spread: 50 });
    
    const nextIdx = (currentTourIndex + 1) % worldsList.length;
    setCurrentTourIndex(nextIdx);
    setSelectedHotspot(null);
    setVisitedCount((prev) => prev + 1);

    if (onAwardXP) {
      onAwardXP(15, 3);
    }

    const nextWorld = worldsList[nextIdx];
    speakText(
      user.language === "fr"
        ? `Monde suivant ! ${nextWorld.fantiSpeechFr}`
        : `Next world! ${nextWorld.fantiSpeechEn}`,
      user.language === "fr" ? "fr-FR" : "en-US"
    );
  };

  // Handle navigation to Previous World
  const handlePrevWorld = () => {
    soundFx.playPop();
    const prevIdx = (currentTourIndex - 1 + worldsList.length) % worldsList.length;
    setCurrentTourIndex(prevIdx);
    setSelectedHotspot(null);

    const prevWorld = worldsList[prevIdx];
    speakText(
      user.language === "fr" ? prevWorld.fantiSpeechFr : prevWorld.fantiSpeechEn,
      user.language === "fr" ? "fr-FR" : "en-US"
    );
  };

  // Handle Hotspot Click
  const handleHotspotClick = (hotspot: typeof currentWorldData.hotspots[0]) => {
    soundFx.playPop();
    confetti({ particleCount: 30, spread: 40 });
    setSelectedHotspot(hotspot.id);

    const text = user.language === "fr" ? hotspot.textFr : hotspot.textEn;
    speakText(text, user.language === "fr" ? "fr-FR" : "en-US");
  };

  // Handle Set World as Active Theme
  const handleSetCurrentWorld = (worldName: WorldTheme) => {
    soundFx.playVictory();
    confetti({ particleCount: 80 });
    onChangeWorld(worldName);
    speakText(
      user.language === "fr"
        ? `C'est parfait ! Le monde ${worldName} est maintenant ton thème principal !`
        : `Awesome! ${worldName} is now your main world theme!`,
      user.language === "fr" ? "fr-FR" : "en-US"
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-cyan-300">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-transform active:scale-95"
            title="Retour"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🌍</span> La Grande Visite des 8 Mondes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Monde actif : <span className="font-extrabold text-purple-700">{user.currentWorld}</span>
            </p>
          </div>
        </div>

        {/* Global Tour Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {!isTourActive ? (
            <button
              onClick={() => handleStartTour(0)}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:scale-105 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 animate-bounce active:scale-95 transition-all"
            >
              <Compass className="w-5 h-5" />
              <span>Lancer la Visite Guidée 🚀</span>
            </button>
          ) : (
            <button
              onClick={() => setIsTourActive(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs sm:text-sm rounded-xl transition-all"
            >
              Vue d'ensemble 📋
            </button>
          )}
        </div>
      </div>

      {/* ACTIVE TOUR MODE VIEW */}
      {isTourActive ? (
        <div className="space-y-6">
          {/* Progress Bar Header */}
          <div className="bg-white/90 backdrop-blur rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-purple-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentWorldData.emoji}</span>
              <div>
                <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
                  Étape {currentTourIndex + 1} sur {worldsList.length} • Visites : {visitedCount}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  {currentWorldData.name}
                </h3>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {worldsList.map((w, idx) => {
                const isActive = idx === currentTourIndex;
                return (
                  <button
                    key={w.name}
                    onClick={() => handleStartTour(idx)}
                    className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-purple-600 text-white scale-110 shadow-md ring-2 ring-yellow-400"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {w.emoji}
                  </button>
                );
              })}
            </div>

            {/* AutoPlay Toggle */}
            <button
              onClick={() => {
                setIsAutoPlay(!isAutoPlay);
                soundFx.playPop();
              }}
              className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 border transition-all ${
                isAutoPlay
                  ? "bg-emerald-500 text-white border-emerald-300 shadow-md animate-pulse"
                  : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
              }`}
            >
              {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAutoPlay ? "Défilement Auto ON 🤖" : "Mode Auto OFF"}</span>
            </button>
          </div>

          {/* MAIN WORLD HERO CARD */}
          <div
            className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${currentWorldData.gradient} text-white shadow-2xl border-4 ${currentWorldData.borderColor} space-y-6 relative overflow-hidden`}
          >
            {/* Background Decorative Emoji */}
            <div className="absolute right-4 bottom-4 text-9xl opacity-10 pointer-events-none select-none">
              {currentWorldData.emoji}
            </div>

            {/* Fanti Elephant Mascot Guide */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border-2 border-white/30 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="shrink-0 scale-90 sm:scale-100">
                <MascotFanti
                  outfit="Explorateur"
                  mood="excited"
                  size="md"
                  interactive={true}
                  speechBubble={user.language === "fr" ? currentWorldData.fantiSpeechFr : currentWorldData.fantiSpeechEn}
                />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-slate-900 rounded-full text-xs font-black shadow">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fanti guide la visite 🐘</span>
                </div>
                <p className="text-white font-extrabold text-base sm:text-lg leading-relaxed bg-black/20 backdrop-blur p-4 rounded-2xl border border-white/20 shadow-inner">
                  "{user.language === "fr" ? currentWorldData.fantiSpeechFr : currentWorldData.fantiSpeechEn}"
                </p>
                <button
                  onClick={() =>
                    speakText(
                      user.language === "fr" ? currentWorldData.fantiSpeechFr : currentWorldData.fantiSpeechEn,
                      user.language === "fr" ? "fr-FR" : "en-US"
                    )
                  }
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-black text-xs rounded-xl border border-white/40 flex items-center justify-center sm:justify-start gap-2 active:scale-95 transition-all mx-auto sm:mx-0"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Écouter la présentation de Fanti 🔊</span>
                </button>
              </div>
            </div>

            {/* Interactive Hotspots Section */}
            <div className="space-y-3">
              <h4 className="text-lg font-black text-yellow-300 drop-shadow flex items-center gap-2">
                <span>🔍</span> Touche les éléments pour les découvrir :
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentWorldData.hotspots.map((hs) => {
                  const isSelected = selectedHotspot === hs.id;
                  return (
                    <button
                      key={hs.id}
                      onClick={() => handleHotspotClick(hs)}
                      className={`p-4 rounded-2xl bg-white/15 hover:bg-white/25 border-2 ${
                        isSelected
                          ? "border-yellow-400 bg-white/35 scale-105 shadow-xl ring-2 ring-yellow-300"
                          : "border-white/20 hover:scale-102"
                      } transition-all flex flex-col items-center text-center space-y-2 group active:scale-95`}
                    >
                      <span className="text-4xl group-hover:scale-110 transition-transform">
                        {hs.emoji}
                      </span>
                      <span className="font-black text-xs sm:text-sm text-white drop-shadow">
                        {user.language === "fr" ? hs.nameFr : hs.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Hotspot Detail Box */}
              {selectedHotspot && (
                <div className="bg-black/30 backdrop-blur p-4 rounded-2xl border-2 border-yellow-300/60 shadow-lg text-center space-y-2 animate-fadeIn">
                  {(() => {
                    const hs = currentWorldData.hotspots.find((h) => h.id === selectedHotspot);
                    if (!hs) return null;
                    return (
                      <>
                        <div className="text-3xl">{hs.emoji}</div>
                        <p className="text-yellow-200 font-extrabold text-sm sm:text-base">
                          {user.language === "fr" ? hs.textFr : hs.textEn}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* WORLD NAVIGATION ACTIONS (CONTINUING THE TOUR) */}
            <div className="pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevWorld}
                  className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm rounded-2xl border border-white/40 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Précédent</span>
                </button>

                {user.currentWorld === currentWorldData.name ? (
                  <span className="px-4 py-3 bg-yellow-400 text-slate-900 font-black text-xs rounded-2xl shadow flex items-center gap-1.5 border border-white">
                    <Check className="w-4 h-4" /> Monde Actuel
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetCurrentWorld(currentWorldData.name)}
                    className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-lg border border-emerald-300 active:scale-95 transition-all"
                  >
                    Activer ce Monde
                  </button>
                )}
              </div>

              {/* CONTINUATION BUTTON TO NEXT WORLD */}
              <button
                onClick={handleNextWorld}
                className="px-7 py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2 active:scale-95 transition-all animate-pulse"
              >
                <span>Continuer la Visite (Monde Suivant)</span>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GRID VIEW OF ALL 8 WORLDS */
        <div className="space-y-6">
          {/* Hero Banner to start guided tour */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-4 border-yellow-300 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-slate-950 font-black text-xs rounded-full shadow">
                <Trophy className="w-4 h-4" />
                <span>Voyage Interactif • 8 Mondes Magiques</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black drop-shadow">
                Prêt pour la Grande Visite Continue ? 🚀
              </h3>
              <p className="text-sm font-bold text-white/90 max-w-xl">
                Suis Fanti l'éléphant dans une merveilleuse aventure à travers la Jungle, l'Océan, l'Espace, les Dinosaures et bien plus !
              </p>
            </div>

            <button
              onClick={() => handleStartTour(0)}
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3 shrink-0 active:scale-95 transition-all hover:scale-105"
            >
              <Compass className="w-6 h-6 text-slate-950" />
              <span>Démarrer le Voyage 🌍</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {worldsList.map((w, idx) => {
              const isCurrent = user.currentWorld === w.name;
              return (
                <div
                  key={w.name}
                  onClick={() => handleStartTour(idx)}
                  className={`cursor-pointer rounded-3xl p-6 bg-gradient-to-br ${w.gradient} text-white shadow-xl border-4 ${w.borderColor} hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group`}
                >
                  <div className="flex items-center justify-between z-10">
                    <span className="text-5xl group-hover:scale-110 transition-transform">
                      {w.emoji}
                    </span>
                    {isCurrent && (
                      <span className="px-3 py-1 bg-yellow-400 text-slate-900 font-black text-xs rounded-full shadow flex items-center gap-1 border border-white">
                        <CheckCircle2 className="w-4 h-4" /> Actif
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 z-10">
                    <h3 className="text-2xl font-black text-yellow-300 drop-shadow">
                      {w.name}
                    </h3>
                    <p className="text-xs font-semibold text-white/90 line-clamp-3">
                      {w.description}
                    </p>
                  </div>

                  <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white font-black text-xs rounded-xl border border-white/40 active:scale-95 transition-all z-10 flex items-center justify-center gap-1.5">
                    <span>Visiter ce monde</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
