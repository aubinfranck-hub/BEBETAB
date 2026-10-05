import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import { MascotFanti } from "../MascotFanti";
import {
  Volume2,
  Sparkles,
  ArrowLeft,
  Search,
  BookOpen,
  Languages,
  RotateCcw,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  CheckCircle2,
  XCircle,
  Lightbulb,
  GraduationCap,
  MessageCircle
} from "lucide-react";
import {
  ENCARTA_ARTICLES,
  ENCARTA_CATEGORIES,
  EncartaArticle
} from "./encartaData";

interface LearningModuleProps {
  user: UserProfile;
  onAwardXP: (xp: number, stars: number) => void;
  onBack: () => void;
}

export const LearningModule: React.FC<LearningModuleProps> = ({
  user,
  onAwardXP,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLang, setActiveLang] = useState<"fr" | "en">(user.language);
  const [selectedArticle, setSelectedArticle] = useState<EncartaArticle | null>(null);

  // States for alphabet tracing & counting
  const [tracedLetter, setTracedLetter] = useState("A");
  
  // Quiz state for the open article
  const [quizAnsweredIndex, setQuizAnsweredIndex] = useState<number | null>(null);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);

  const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const numbersData = Array.from({ length: 10 }, (_, i) => ({
    num: i + 1,
    wordFr: ["Un", "Deux", "Trois", "Quatre", "Cinq", "Six", "Sept", "Huit", "Neuf", "Dix"][i],
    wordEn: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"][i],
    emoji: "🍎",
  }));

  const colorsShapesData = [
    { nameFr: "Rouge", nameEn: "Red", color: "bg-red-500", hex: "#EF4444" },
    { nameFr: "Bleu", nameEn: "Blue", color: "bg-blue-500", hex: "#3B82F6" },
    { nameFr: "Jaune", nameEn: "Yellow", color: "bg-yellow-400", hex: "#FACC15" },
    { nameFr: "Vert", nameEn: "Green", color: "bg-emerald-500", hex: "#10B981" },
    { nameFr: "Violet", nameEn: "Purple", color: "bg-purple-500", hex: "#A855F7" },
    { nameFr: "Orange", nameEn: "Orange", color: "bg-orange-500", hex: "#F97316" },
  ];

  // Filtered Encarta Articles
  const filteredArticles = useMemo(() => {
    return ENCARTA_ARTICLES.filter((article) => {
      const matchTab = activeTab === "all" || article.category === activeTab;
      const title = activeLang === "fr" ? article.titleFr : article.titleEn;
      const summary = activeLang === "fr" ? article.summaryFr : article.summaryEn;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        title.toLowerCase().includes(q) ||
        summary.toLowerCase().includes(q) ||
        article.categoryLabelFr.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [activeTab, searchQuery, activeLang]);

  const speakItem = (textFr: string, textEn: string) => {
    soundFx.playTap();
    const text = activeLang === "fr" ? textFr : textEn;
    const langCode = activeLang === "fr" ? "fr-FR" : "en-US";
    speakText(text, langCode);
    onAwardXP(3, 1);
  };

  const handleOpenArticle = (article: EncartaArticle) => {
    soundFx.playTap();
    setSelectedArticle(article);
    setQuizAnsweredIndex(null);
    setQuizSuccess(null);
    const title = activeLang === "fr" ? article.titleFr : article.titleEn;
    const summary = activeLang === "fr" ? article.summaryFr : article.summaryEn;
    speakText(`${title}. ${summary}`, activeLang === "fr" ? "fr-FR" : "en-US");
    onAwardXP(5, 1);
  };

  const handleRandomArticle = () => {
    soundFx.playVictory();
    const randomIdx = Math.floor(Math.random() * ENCARTA_ARTICLES.length);
    handleOpenArticle(ENCARTA_ARTICLES[randomIdx]);
  };

  const handleArticleQuizChoice = (idx: number) => {
    if (!selectedArticle || quizAnsweredIndex !== null) return;
    setQuizAnsweredIndex(idx);
    const isCorrect = idx === selectedArticle.quizQuestion.correctIndex;
    setQuizSuccess(isCorrect);

    if (isCorrect) {
      soundFx.playVictory();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      const exp = activeLang === "fr" ? selectedArticle.quizQuestion.explanationFr : selectedArticle.quizQuestion.explanationEn;
      speakText(`Bravo ! C'est la bonne réponse ! ${exp}`, activeLang === "fr" ? "fr-FR" : "en-US");
      onAwardXP(15, 3);
    } else {
      soundFx.playPop();
      speakText(
        activeLang === "fr"
          ? "Dommage ! Réessaye une prochaine fois !"
          : "Oops! Try again next time!",
        activeLang === "fr" ? "fr-FR" : "en-US"
      );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 min-h-screen">
      {/* Encarta Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-5 sm:p-7 text-white shadow-2xl border-4 border-yellow-400 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute -right-8 -bottom-8 text-white/10 text-9xl font-black select-none pointer-events-none">
          ENCARTA
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 z-10 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-bold backdrop-blur transition-all active:scale-95 border border-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-slate-900 font-black text-xs rounded-full shadow mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Encarta Enfants • Encyclopédie Interactive</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md flex items-center gap-2">
                <span>🌍</span> Encyclopédie Découverte
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 font-medium max-w-xl mt-1">
                Explore le monde, l'espace, les animaux, l'histoire et la science grâce à nos fiches multimédias interactives !
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Random Article Button */}
            <button
              onClick={handleRandomArticle}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-black text-xs sm:text-sm rounded-2xl shadow-lg border-2 border-amber-200 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Fiche Surprise 🎲</span>
            </button>

            {/* Language FR/EN Toggle */}
            <button
              onClick={() => {
                const next = activeLang === "fr" ? "en" : "fr";
                setActiveLang(next);
                speakText(
                  next === "fr" ? "Mode Encyclopédie Français !" : "English Encyclopedia Mode!",
                  next === "fr" ? "fr-FR" : "en-US"
                );
              }}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md border border-white/30 flex items-center gap-2 active:scale-95 transition-all backdrop-blur"
            >
              <Languages className="w-4 h-4" />
              <span>{activeLang === "fr" ? "Français 🇫🇷" : "English 🇬🇧"}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeLang === "fr"
                ? "Rechercher un sujet dans Encarta (ex: Lune, Volcan, T-Rex, Égypte...)"
                : "Search a topic in Encarta (e.g., Moon, Volcano, T-Rex, Egypt...)"
            }
            className="w-full pl-12 pr-10 py-3.5 bg-white text-slate-900 font-bold placeholder-slate-400 rounded-2xl shadow-inner border-2 border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300/50 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Domain Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ENCARTA_CATEGORIES.map((cat) => {
          const isSelected = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playTap();
                setActiveTab(cat.id);
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all shadow-md border-2 flex items-center gap-2 ${
                isSelected
                  ? "bg-amber-400 text-slate-900 border-yellow-200 scale-105 ring-4 ring-yellow-200/50"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{activeLang === "fr" ? cat.labelFr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area according to Category */}
      {activeTab === "alphabet" ? (
        /* Alphabet Section */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-200 grid grid-cols-4 sm:grid-cols-6 gap-3">
            {alphabetList.map((char) => (
              <button
                key={char}
                onClick={() => {
                  setTracedLetter(char);
                  speakItem(`Lettre ${char}`, `Letter ${char}`);
                }}
                className={`aspect-square rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md border-3 transition-all active:scale-90 ${
                  tracedLetter === char
                    ? "bg-yellow-400 text-slate-900 border-amber-500 scale-110 ring-4 ring-yellow-200"
                    : "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
                }`}
              >
                {char}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-b from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl border-4 border-yellow-300 flex flex-col items-center justify-center text-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-yellow-300">
              Écriture Encarta & Prononciation
            </span>
            <div className="w-32 h-32 bg-white text-slate-900 rounded-3xl font-black text-7xl flex items-center justify-center shadow-inner border-4 border-yellow-300">
              {tracedLetter}
            </div>

            <button
              onClick={() => speakItem(`La lettre ${tracedLetter}`, `Letter ${tracedLetter}`)}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-all text-sm"
            >
              <Volume2 className="w-5 h-5" />
              <span>Écouter le son</span>
            </button>
          </div>
        </div>
      ) : activeTab === "chiffres" ? (
        /* Numbers Section */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {numbersData.map((item) => (
            <div
              key={item.num}
              onClick={() =>
                speakItem(
                  `${item.wordFr} ! ${item.num} pommes !`,
                  `${item.wordEn}! ${item.num} apples!`
                )
              }
              className="cursor-pointer bg-white rounded-3xl p-6 shadow-xl border-4 border-emerald-300 hover:scale-105 transition-all flex items-center justify-between gap-4"
            >
              <div className="w-16 h-16 bg-emerald-500 text-white font-black text-3xl rounded-2xl flex items-center justify-center shadow">
                {item.num}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-800">
                  {activeLang === "fr" ? item.wordFr : item.wordEn}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1 text-lg">
                  {Array.from({ length: Math.min(item.num, 6) }).map((_, idx) => (
                    <span key={idx}>{item.emoji}</span>
                  ))}
                  {item.num > 6 && (
                    <span className="text-xs font-bold text-slate-500">+{item.num - 6}</span>
                  )}
                </div>
              </div>
              <Volume2 className="w-6 h-6 text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>
      ) : (
        /* Encarta Encyclopedic Cards Grid */
        <div>
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg border-4 border-slate-200 space-y-4">
              <span className="text-6xl">🔍</span>
              <h3 className="text-2xl font-black text-slate-800">
                {activeLang === "fr" ? "Aucun sujet trouvé" : "No articles found"}
              </h3>
              <p className="text-slate-600 text-sm font-medium max-w-md mx-auto">
                {activeLang === "fr"
                  ? "Essaie de chercher un autre mot ou clique sur 'Tout explorer' !"
                  : "Try searching for another word or click 'Explore All'!"}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="px-6 py-2.5 bg-yellow-400 text-slate-900 font-black rounded-2xl shadow"
              >
                Tout réinitialiser
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => {
                const title = activeLang === "fr" ? article.titleFr : article.titleEn;
                const summary = activeLang === "fr" ? article.summaryFr : article.summaryEn;
                const catLabel = activeLang === "fr" ? article.categoryLabelFr : article.categoryLabelEn;
                const didYouKnow = activeLang === "fr" ? article.didYouKnowFr : article.didYouKnowEn;

                return (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenArticle(article)}
                    className="cursor-pointer bg-white rounded-3xl shadow-xl border-4 border-slate-200 overflow-hidden flex flex-col justify-between hover:border-yellow-400 transition-all group"
                  >
                    {/* Header Banner */}
                    <div className={`bg-gradient-to-r ${article.headerColor} p-5 text-white relative`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-black uppercase tracking-wider text-yellow-200">
                          {catLabel}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakItem(`${title}. ${summary}`, `${title}. ${summary}`);
                          }}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                          title="Écouter le résumé"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center gap-4">
                        <span className="text-5xl group-hover:scale-110 transition-transform">
                          {article.icon}
                        </span>
                        <div>
                          <h3 className="text-xl font-black drop-shadow text-white">
                            {title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">
                        {summary}
                      </p>

                      {/* Did You Know Preview */}
                      <div className="p-3 bg-amber-50 rounded-2xl border-2 border-amber-200 text-xs text-amber-900 font-bold flex items-start gap-2.5">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="line-clamp-2">{didYouKnow}</p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-black text-indigo-600 group-hover:text-indigo-800">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>Ouvrir la fiche Encarta</span>
                        </span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Encarta Article Modal / Detailed Reader */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border-4 border-yellow-400 overflow-hidden relative my-auto"
            >
              {/* Article Header */}
              <div className={`bg-gradient-to-r ${selectedArticle.headerColor} p-6 sm:p-8 text-white relative`}>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute right-4 top-4 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-slate-900 font-black text-xs rounded-full shadow mb-3">
                  <GraduationCap className="w-4 h-4" />
                  <span>
                    {activeLang === "fr"
                      ? selectedArticle.categoryLabelFr
                      : selectedArticle.categoryLabelEn}
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  <span className="text-6xl sm:text-7xl">{selectedArticle.icon}</span>
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow">
                      {activeLang === "fr" ? selectedArticle.titleFr : selectedArticle.titleEn}
                    </h2>
                    <p className="text-xs sm:text-sm text-yellow-100 font-medium mt-1">
                      {activeLang === "fr" ? selectedArticle.summaryFr : selectedArticle.summaryEn}
                    </p>
                  </div>
                </div>

                {/* Audio Reader Control */}
                <button
                  onClick={() => {
                    const title = activeLang === "fr" ? selectedArticle.titleFr : selectedArticle.titleEn;
                    const paragraphs = (activeLang === "fr" ? selectedArticle.fullContentFr : selectedArticle.fullContentEn).join(" ");
                    speakText(`${title}. ${paragraphs}`, activeLang === "fr" ? "fr-FR" : "en-US");
                  }}
                  className="mt-5 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-xs sm:text-sm rounded-2xl shadow-lg border-2 border-white flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Volume2 className="w-5 h-5 text-slate-900" />
                  <span>
                    {activeLang === "fr" ? "Écouter la fiche complète 🔊" : "Listen to full article 🔊"}
                  </span>
                </button>
              </div>

              {/* Article Body Content */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Fanti's Kid Explanation Card */}
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 rounded-3xl p-5 border-4 border-sky-300 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="shrink-0 scale-90 sm:scale-100">
                    <MascotFanti
                      outfit="Explorateur"
                      mood="excited"
                      size="md"
                      interactive={true}
                      speechBubble={activeLang === "fr" ? selectedArticle.fantiExplanationFr : selectedArticle.fantiExplanationEn}
                    />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-black">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Fanti l'Éléphant t'explique tout ! 🐘</span>
                    </div>
                    <p className="text-slate-800 font-extrabold text-sm sm:text-base leading-relaxed bg-white p-3.5 rounded-2xl border-2 border-sky-200 shadow-sm">
                      "{activeLang === "fr" ? selectedArticle.fantiExplanationFr : selectedArticle.fantiExplanationEn}"
                    </p>
                    <button
                      onClick={() => {
                        const explanation = activeLang === "fr" ? selectedArticle.fantiExplanationFr : selectedArticle.fantiExplanationEn;
                        speakText(`Coucou ! ${explanation}`, activeLang === "fr" ? "fr-FR" : "en-US");
                      }}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl shadow border border-sky-300 flex items-center justify-center sm:justify-start gap-2 active:scale-95 transition-all mx-auto sm:mx-0"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Écouter Fanti raconter 🔊</span>
                    </button>
                  </div>
                </div>

                {/* Key Stats Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedArticle.keyStats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 text-center">
                      <div className="text-xs font-extrabold text-slate-500 uppercase">
                        {activeLang === "fr" ? stat.labelFr : stat.labelEn}
                      </div>
                      <div className="text-sm sm:text-base font-black text-indigo-900 mt-0.5">
                        {activeLang === "fr" ? stat.valueFr : stat.valueEn}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Article Paragraphs */}
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>
                      {activeLang === "fr" ? "En savoir plus :" : "Learn more:"}
                    </span>
                  </h4>
                  {(activeLang === "fr" ? selectedArticle.fullContentFr : selectedArticle.fullContentEn).map((p, idx) => (
                    <p key={idx} className="text-slate-700 font-medium text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Did You Know Box */}
                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-5 rounded-3xl border-3 border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                    <span>Le Saviez-Vous ? (Fun Fact Encarta)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 font-bold leading-relaxed">
                    {activeLang === "fr" ? selectedArticle.didYouKnowFr : selectedArticle.didYouKnowEn}
                  </p>
                </div>

                {/* Interactive Flash Quiz on this Article */}
                <div className="bg-indigo-900 text-white p-6 rounded-3xl border-4 border-yellow-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-yellow-300 text-sm">
                      <HelpCircle className="w-5 h-5" />
                      <span>
                        {activeLang === "fr" ? "Question Flash Encarta" : "Encarta Flash Question"}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-yellow-400 text-slate-900 font-black text-xs rounded-full">
                      +15 XP • +3 Stars ⭐
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-extrabold text-white">
                    {activeLang === "fr"
                      ? selectedArticle.quizQuestion.questionFr
                      : selectedArticle.quizQuestion.questionEn}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(activeLang === "fr"
                      ? selectedArticle.quizQuestion.optionsFr
                      : selectedArticle.quizQuestion.optionsEn
                    ).map((opt, idx) => {
                      const isSelected = quizAnsweredIndex === idx;
                      const isCorrect = idx === selectedArticle.quizQuestion.correctIndex;
                      let btnStyle = "bg-white/10 hover:bg-white/20 text-white border-white/20";

                      if (quizAnsweredIndex !== null) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-500 text-white border-emerald-300 font-black";
                        } else if (isSelected) {
                          btnStyle = "bg-rose-500 text-white border-rose-300 font-black";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizAnsweredIndex !== null}
                          onClick={() => handleArticleQuizChoice(idx)}
                          className={`p-3 rounded-2xl text-xs sm:text-sm font-bold border-2 text-left transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizAnsweredIndex !== null && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-yellow-300" />
                          )}
                          {quizAnsweredIndex !== null && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-200" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSuccess !== null && (
                    <div className={`p-4 rounded-2xl text-xs font-bold ${quizSuccess ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400" : "bg-rose-500/20 text-rose-200 border border-rose-400"}`}>
                      {activeLang === "fr"
                        ? selectedArticle.quizQuestion.explanationFr
                        : selectedArticle.quizQuestion.explanationEn}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-2xl hover:bg-slate-700"
                >
                  Fermer la fiche
                </button>
                <button
                  onClick={handleRandomArticle}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black text-xs rounded-2xl shadow border border-amber-200 flex items-center gap-1.5"
                >
                  <span>Fiche suivante</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningModule;
