import React, { useState } from "react";
import { UserProfile, KidsVideo } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import { MascotFanti } from "../MascotFanti";
import { VideoComprehensionQuizModal } from "./VideoComprehensionQuizModal";
import {
  ArrowLeft,
  Tv,
  Play,
  Search,
  Sparkles,
  Flame,
  Music,
  BookOpen,
  Film,
  Compass,
  Star,
  Heart,
  PlusCircle,
  Volume2,
  CheckCircle2,
  Smile,
  Palette,
  HelpCircle,
  Award,
  Zap
} from "lucide-react";

interface VideosModuleProps {
  user: UserProfile;
  onAwardXP?: (xp: number, stars: number) => void;
  onBack: () => void;
}

export const VideosModule: React.FC<VideosModuleProps> = ({
  user,
  onAwardXP,
  onBack,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<(KidsVideo & { views: string; rating: number; tag: string; fantiIntro: string }) | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newVideoUrl, setNewVideoUrl] = useState<string>("");
  const [newVideoTitle, setNewVideoTitle] = useState<string>("");
  const [newVideoCat, setNewVideoCat] = useState<string>("comptines");
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
  
  // Interactive Quiz States
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [quizVideo, setQuizVideo] = useState<(KidsVideo & { views: string; rating: number; tag: string; fantiIntro: string }) | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, { score: number; total: number }>>({});
  const [autoTriggerEnabled, setAutoTriggerEnabled] = useState<boolean>(true);

  const initialVideos: (KidsVideo & { views: string; rating: number; tag: string; fantiIntro: string })[] = [
    {
      id: "v1",
      youtubeId: "X23X4S6220s",
      title: "Mondes des Titounis - Ah les Crocodiles & 30 min de Comptines",
      category: "comptines",
      duration: "30 min",
      thumbnail: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80",
      ageGroup: "2-4",
      views: "1.2M",
      rating: 4.9,
      tag: "🔥 Top #1 Comptines",
      fantiIntro: "Chantons ensemble la célèbre chanson des crocodiles avec les Titounis !"
    },
    {
      id: "v2",
      youtubeId: "6H1D6X_R3yM",
      title: "Une Souris Verte & les Plus Belles Comptines Mignonnes",
      category: "comptines",
      duration: "20 min",
      thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
      ageGroup: "2-4",
      views: "980K",
      rating: 4.9,
      tag: "🎵 Chansons Douces",
      fantiIntro: "Une petite souris verte qui courrait dans l'herbe ! Viens chanter avec Fanti !"
    },
    {
      id: "v3",
      youtubeId: "Y7d0S30c23s",
      title: "L'Alphabet ABC en Chanson avec les Animaux Rigolos",
      category: "apprentissage",
      duration: "10 min",
      thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80",
      ageGroup: "2-4",
      views: "850K",
      rating: 4.8,
      tag: "🔤 ABC Facile",
      fantiIntro: "Apprends toutes les lettres de A à Z en t'amusant avec les animaux !"
    },
    {
      id: "v4",
      youtubeId: "mJ943s7K2_k",
      title: "Apprendre à Compter de 1 à 20 en Chanson",
      category: "apprentissage",
      duration: "12 min",
      thumbnail: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80",
      ageGroup: "2-4",
      views: "720K",
      rating: 4.9,
      tag: "🔢 Chiffres & Fruits",
      fantiIntro: "Compte avec moi 1, 2, 3... jusqu'à 20 avec de délicieux fruits !"
    },
    {
      id: "v5",
      youtubeId: "9I248590132",
      title: "Voyage dans l'Espace : La Terre, la Lune et les Planètes",
      category: "sciences",
      duration: "14 min",
      thumbnail: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80",
      ageGroup: "5-7",
      views: "920K",
      rating: 5.0,
      tag: "🚀 Top Découverte",
      fantiIntro: "Embarque dans notre fusée spatiale pour explorer Saturne et les étoiles !"
    },
    {
      id: "v6",
      youtubeId: "34928420942",
      title: "Le Monde des Dinosaures : T-Rex, Diplodocus et Tricératops",
      category: "sciences",
      duration: "18 min",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      ageGroup: "5-7",
      views: "1.5M",
      rating: 4.9,
      tag: "🦕 Incontournable",
      fantiIntro: "Découvre comment vivaient les géants de la préhistoire !"
    },
    {
      id: "v7",
      youtubeId: "f3Q5L03m8I8",
      title: "Les Animaux de la Savane : Lions, Girafes et Éléphants",
      category: "animaux" as any,
      duration: "15 min",
      thumbnail: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&auto=format&fit=crop&q=80",
      ageGroup: "2-4",
      views: "1.1M",
      rating: 5.0,
      tag: "🦁 Savane Africaine",
      fantiIntro: "Viens visiter mon pays d'origine ! Voici la grande savane africaine !"
    },
    {
      id: "v8",
      youtubeId: "qT7d76B2d2s",
      title: "Découverte de l'Océan : Dauphins, Tortues et Récifs de Corail",
      category: "animaux" as any,
      duration: "16 min",
      thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80",
      ageGroup: "5-7",
      views: "890K",
      rating: 4.8,
      tag: "🐬 Monde Sous-Marin",
      fantiIntro: "Plonge avec les dauphins au milieu du récif de corail féérique !"
    },
    {
      id: "v9",
      youtubeId: "m3Wf0eS_H0s",
      title: "L'Âne Trotro : Épisodes rigolos et histoires du soir",
      category: "dessins_animes",
      duration: "25 min",
      thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      ageGroup: "2-4",
      views: "1.8M",
      rating: 4.9,
      tag: "🐴 Dessin Animé",
      fantiIntro: "Trotro est trop trop rigolo ! Regarde ses bêtises et ses rires !"
    },
    {
      id: "v10",
      youtubeId: "e5N8Y49Z6Xs",
      title: "Petit Ours Brun : Les Aventures de l'Enfance",
      category: "dessins_animes",
      duration: "22 min",
      thumbnail: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
      ageGroup: "2-4",
      views: "2.1M",
      rating: 5.0,
      tag: "🐻 Petit Ours Brun",
      fantiIntro: "Aujourd'hui Petit Ours Brun apprend plein de choses nouvelles à l'école !"
    },
    {
      id: "v11",
      youtubeId: "dQw4w9WgXcQ",
      title: "Dessiner des Animaux Faciles : L'Éléphant, le Lion et le Chat",
      category: "art",
      duration: "12 min",
      thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80",
      ageGroup: "5-7",
      views: "430K",
      rating: 4.7,
      tag: "🎨 Dessin Créatif",
      fantiIntro: "Prends tes feutres et tes crayons ! Dessine Fanti l'éléphant pas à pas !"
    },
    {
      id: "v12",
      youtubeId: "1-J8Z28i_Yk",
      title: "Comptines d'Afrique : Rythmes Joyeux & Danse des Animaux",
      category: "comptines",
      duration: "28 min",
      thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
      ageGroup: "2-4",
      views: "640K",
      rating: 4.9,
      tag: "🎵 Musique du Monde",
      fantiIntro: "Tapons des mains au rythme des djembe et des musiques ensoleillées !"
    }
  ];

  const [videosList, setVideosList] = useState(initialVideos);

  const categories = [
    { id: "all", label: "🔥 Tout / Populaire", icon: Flame },
    { id: "favorites", label: "❤️ Mes Favoris", icon: Heart },
    { id: "comptines", label: "🎵 Comptines & Chansons", icon: Music },
    { id: "apprentissage", label: "🔤 ABC & Chiffres", icon: BookOpen },
    { id: "sciences", label: "🚀 Sciences & Espace", icon: Compass },
    { id: "animaux", label: "🦁 Animaux & Nature", icon: Smile },
    { id: "dessins_animes", label: "📺 Cartoons & Dessins Animés", icon: Film },
    { id: "art", label: "🎨 Dessin & Créations", icon: Palette },
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playPop();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFinishVideo = (vid: typeof selectedVideo) => {
    if (!vid) return;
    soundFx.playVictory();
    confetti({ particleCount: 70, spread: 60 });

    if (!watchedVideos.includes(vid.id)) {
      setWatchedVideos((prev) => [...prev, vid.id]);
    }

    if (onAwardXP) {
      onAwardXP(15, 3);
    }

    speakText(
      user.language === "fr"
        ? "Bravo champion ! Tu as gagné 15 XP et 3 étoiles ! Maintenant, place au super quiz de compréhension de Fanti !"
        : "Awesome! You earned 15 XP and 3 stars! Now let's test what you learned with Fanti's quiz!",
      user.language === "fr" ? "fr-FR" : "en-US"
    );

    // Automatically trigger the interactive comprehension quiz!
    if (autoTriggerEnabled) {
      setTimeout(() => {
        setQuizVideo(vid);
        setShowQuizModal(true);
      }, 1000);
    }
  };

  const handleOpenQuiz = (vid: typeof selectedVideo, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!vid) return;
    soundFx.playPop();
    setQuizVideo(vid);
    setShowQuizModal(true);
  };

  const handleQuizCompleted = (videoId: string, score: number, total: number) => {
    setCompletedQuizzes((prev) => ({
      ...prev,
      [videoId]: { score, total },
    }));
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return;

    // Extract YouTube ID
    let ytId = newVideoUrl.trim();
    if (ytId.includes("v=")) {
      ytId = ytId.split("v=")[1].split("&")[0];
    } else if (ytId.includes("youtu.be/")) {
      ytId = ytId.split("youtu.be/")[1].split("?")[0];
    }

    const newVid = {
      id: `v_custom_${Date.now()}`,
      youtubeId: ytId,
      title: newVideoTitle.trim(),
      category: newVideoCat as any,
      duration: "Nouveau",
      thumbnail: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80",
      ageGroup: user.ageGroup,
      views: "Nouveau",
      rating: 5.0,
      tag: "✨ Ajouté récemment",
      fantiIntro: `Super vidéo "${newVideoTitle}" ajoutée spécialement pour toi !`
    };

    setVideosList((prev) => [newVid, ...prev]);
    setSelectedVideo(newVid);
    setShowAddModal(false);
    setNewVideoUrl("");
    setNewVideoTitle("");
    soundFx.playVictory();
    confetti({ particleCount: 60 });
    speakText("Ta nouvelle vidéo a été ajoutée avec succès !");
  };

  const filteredVideos = videosList.filter((vid) => {
    let matchesCategory = true;
    if (activeCategory === "favorites") {
      matchesCategory = favorites.includes(vid.id);
    } else if (activeCategory !== "all") {
      matchesCategory = vid.category === activeCategory;
    }

    const matchesSearch =
      searchQuery.trim() === "" ||
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 select-none">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/95 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-rose-300">
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
              <span>📺</span> Vidéos & Cartoons Sécurisés
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Comptines, dessins animés, sciences & animaux pour apprendre en s'amusant.
            </p>
          </div>
        </div>

        {/* Search & Add Video Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher une vidéo..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 font-bold text-slate-800 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 border border-slate-200"
            />
          </div>

          <button
            onClick={() => {
              soundFx.playPop();
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter une Vidéo ➕</span>
          </button>
        </div>
      </div>

      {/* ACTIVE VIDEO PLAYER VIEW */}
      {selectedVideo && (
        <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-yellow-300 space-y-4 animate-fadeIn">
          {/* Top Bar of Video Player */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <span className="px-3 py-1 bg-yellow-400 text-slate-950 font-black text-xs rounded-full shadow inline-block mb-1">
                {selectedVideo.tag || "▶️ Mode Cinéma Kids"}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white">
                {selectedVideo.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleFavorite(selectedVideo.id, e)}
                className={`p-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all border ${
                  favorites.includes(selectedVideo.id)
                    ? "bg-rose-600 text-white border-rose-400"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                }`}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(selectedVideo.id) ? "fill-current" : ""}`} />
                <span className="text-xs font-black">
                  {favorites.includes(selectedVideo.id) ? "Favori ❤️" : "Ajouter ❤️"}
                </span>
              </button>

              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-2xl shadow active:scale-95"
              >
                Fermer ✖
              </button>
            </div>
          </div>

          {/* Fanti Elephant Video Host Guide */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="shrink-0 scale-90 sm:scale-100">
              <MascotFanti
                outfit="Super-Héros"
                mood="excited"
                size="md"
                interactive={true}
                speechBubble={selectedVideo.fantiIntro}
              />
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500 text-white rounded-full text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fanti t'accompagne pendant le film ! 🐘</span>
              </div>
              <p className="text-slate-100 font-extrabold text-sm sm:text-base leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-700">
                "{selectedVideo.fantiIntro}"
              </p>
              <button
                onClick={() => speakText(`Coucou ! ${selectedVideo.fantiIntro}`, user.language === "fr" ? "fr-FR" : "en-US")}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl flex items-center justify-center sm:justify-start gap-2 active:scale-95 transition-all mx-auto sm:mx-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>Écouter Fanti 🔊</span>
              </button>
            </div>
          </div>

          {/* YouTube Embed Player */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border-2 border-slate-700 shadow-2xl">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId.replace("v=", "")}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Interactive Quiz Automatic Prompt & Status */}
          <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 rounded-2xl p-3 border border-amber-400/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-400 text-slate-900 rounded-xl text-lg font-black shrink-0">
                🧠
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-300">
                    Quiz de Compréhension Éducatif
                  </span>
                  {autoTriggerEnabled && (
                    <span className="px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-black rounded-full flex items-center gap-1 shadow-sm">
                      <Zap className="w-3 h-3 fill-current" /> Auto-déclenchement activé
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-semibold">
                  {completedQuizzes[selectedVideo.id]
                    ? `🏆 Quiz déjà réussi avec ${completedQuizzes[selectedVideo.id].score}/${completedQuizzes[selectedVideo.id].total} ⭐ ! Tu peux rejouer pour réviser.`
                    : "Termine la vidéo ou clique ci-dessous pour vérifier ce que tu as appris et gagner +25 XP et des étoiles !"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoTriggerEnabled(!autoTriggerEnabled)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  autoTriggerEnabled
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
                title="Activer ou désactiver le déclenchement automatique du quiz"
              >
                Auto-Quiz : {autoTriggerEnabled ? "OUI ✅" : "NON"}
              </button>

              <button
                onClick={() => handleOpenQuiz(selectedVideo)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg border border-amber-300 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Lancer le Quiz direct 🧠</span>
              </button>
            </div>
          </div>

          {/* Reward Button After Watching */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
              👁️ {selectedVideo.views} vues • Durée : {selectedVideo.duration}
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleOpenQuiz(selectedVideo)}
                className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl border border-amber-300 flex items-center gap-2 active:scale-95 transition-all"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Tester ma Compréhension 🧠</span>
              </button>

              <button
                onClick={() => handleFinishVideo(selectedVideo)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm rounded-2xl shadow-xl border border-emerald-300 flex items-center gap-2 active:scale-95 transition-all animate-bounce"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>J'ai terminé ! 🎓 (+15 XP & Déclencher Quiz)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playTap();
                setActiveCategory(cat.id);
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all shadow-md shrink-0 border-2 ${
                isActive
                  ? "bg-rose-500 text-white border-white scale-105"
                  : "bg-white text-slate-700 border-rose-100 hover:bg-rose-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              {cat.id === "favorites" && favorites.length > 0 && (
                <span className="px-1.5 py-0.5 bg-yellow-400 text-slate-900 rounded-full text-[10px] font-black">
                  {favorites.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Video Grid Catalog */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border-4 border-dashed border-rose-200 shadow-md">
          <div className="text-6xl">📺</div>
          <h3 className="text-2xl font-black text-slate-800">Aucune vidéo trouvée</h3>
          <p className="text-slate-600 font-semibold max-w-md mx-auto text-sm">
            Essaie une autre catégorie ou utilise le bouton "Ajouter une Vidéo ➕" pour ajouter ta vidéo préférée !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => {
            const isFav = favorites.includes(vid.id);
            const isWatched = watchedVideos.includes(vid.id);
            return (
              <div
                key={vid.id}
                onClick={() => {
                  soundFx.playTap();
                  setSelectedVideo(vid);
                  speakText(`Lancement de : ${vid.title}`, user.language === "fr" ? "fr-FR" : "en-US");
                }}
                className="cursor-pointer bg-white rounded-3xl p-4 shadow-xl border-4 border-rose-200 hover:scale-103 transition-all flex flex-col justify-between gap-3 group relative overflow-hidden"
              >
                {/* Top Tag Badge & Favorite Heart */}
                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur text-yellow-300 font-black text-[11px] rounded-xl border border-yellow-400/40 shadow-lg">
                    {vid.tag}
                  </span>

                  <button
                    onClick={(e) => toggleFavorite(vid.id, e)}
                    className="p-2 bg-white/90 backdrop-blur rounded-full text-rose-500 shadow hover:scale-110 active:scale-95 transition-transform"
                    title="Ajouter aux favoris"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
                  </button>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-125 transition-transform border-4 border-white">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2.5 py-0.5 bg-black/80 text-white font-black text-xs rounded-lg">
                    {vid.duration}
                  </span>
                  {isWatched && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-500 text-white font-black text-[10px] rounded-lg flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3" /> Vue
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                    <span className="flex items-center gap-1 text-amber-500 font-black">
                      <Star className="w-3.5 h-3.5 fill-current" /> {vid.rating}
                    </span>
                    <span>👀 {vid.views}</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base line-clamp-2 leading-snug">
                    {vid.title}
                  </h4>

                  {/* Quiz Info & Direct Launch Button */}
                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
                    {completedQuizzes[vid.id] ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-lg flex items-center gap-1">
                        🏆 Réussi : {completedQuizzes[vid.id].score}/{completedQuizzes[vid.id].total} ⭐
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-black rounded-lg flex items-center gap-1 border border-amber-200/60">
                        🧠 Quiz Compréhension
                      </span>
                    )}

                    <button
                      onClick={(e) => handleOpenQuiz(vid, e)}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all ml-auto"
                      title="Lancer le quiz de compréhension"
                    >
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      <span>Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD VIDEO MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-rose-300 space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>➕</span> Proposer une Vidéo YouTube
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Lien ou Identifiant de la vidéo YouTube :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: https://www.youtube.com/watch?v=X23X4S6220s"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full p-3 bg-slate-100 border border-slate-300 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Titre de la vidéo :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mes comptines préférées"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="w-full p-3 bg-slate-100 border border-slate-300 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Catégorie :
                </label>
                <select
                  value={newVideoCat}
                  onChange={(e) => setNewVideoCat(e.target.value)}
                  className="w-full p-3 bg-slate-100 border border-slate-300 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
                >
                  <option value="comptines">🎵 Comptines & Chansons</option>
                  <option value="apprentissage">🔤 ABC & Chiffres</option>
                  <option value="sciences">🚀 Sciences & Espace</option>
                  <option value="animaux">🦁 Animaux & Nature</option>
                  <option value="dessins_animes">📺 Cartoons & Dessins Animés</option>
                  <option value="art">🎨 Dessin & Créations</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-lg border border-rose-300 active:scale-95 transition-all"
                >
                  Ajouter à la bibliothèque 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE VIDEO COMPREHENSION QUIZ MODAL */}
      {quizVideo && (
        <VideoComprehensionQuizModal
          video={quizVideo}
          user={user}
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            setQuizVideo(null);
          }}
          onAwardXP={(xp, stars) => {
            if (onAwardXP) onAwardXP(xp, stars);
            handleQuizCompleted(quizVideo.id, 3, 3);
          }}
          onReplayVideo={() => {
            setSelectedVideo(quizVideo);
            setShowQuizModal(false);
          }}
        />
      )}
    </div>
  );
};
