import React, { useState, useEffect } from "react";
import { UserProfile, KidsVideo } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import { MascotFanti } from "../MascotFanti";
import { getQuizForVideo, VideoComprehensionQuestion } from "./videoQuizData";
import {
  Trophy,
  Star,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Film,
  Award,
  X
} from "lucide-react";

interface VideoComprehensionQuizModalProps {
  video: KidsVideo & { views?: string; rating?: number; tag?: string; fantiIntro?: string };
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAwardXP?: (xp: number, stars: number) => void;
  onReplayVideo?: () => void;
}

export const VideoComprehensionQuizModal: React.FC<VideoComprehensionQuizModalProps> = ({
  video,
  user,
  isOpen,
  onClose,
  onAwardXP,
  onReplayVideo,
}) => {
  const [questions, setQuestions] = useState<VideoComprehensionQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [fantiMood, setFantiMood] = useState<"happy" | "excited" | "thinking" | "proud">("excited");
  const [fantiBubble, setFantiBubble] = useState<string>("");

  // Initialize or reset questions whenever the modal opens or the video changes
  useEffect(() => {
    if (isOpen && video) {
      const qList = getQuizForVideo(video, user.ageGroup);
      setQuestions(qList);
      setCurrentIdx(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setQuizFinished(false);
      setFantiMood("excited");

      const welcomeMsg = `Super vidéo ! C'est parti pour le petit quiz de Fanti sur : "${video.title}" !`;
      setFantiBubble(welcomeMsg);
      speakText(welcomeMsg, user.language === "fr" ? "fr-FR" : "en-US");
    }
  }, [isOpen, video?.id]);

  // Read current question aloud when question index changes
  useEffect(() => {
    if (isOpen && questions.length > 0 && !quizFinished) {
      const currentQ = questions[currentIdx];
      if (currentQ) {
        setFantiMood("thinking");
        setFantiBubble(`Question ${currentIdx + 1} sur ${questions.length} : ${currentQ.question}`);
        // Small delay so speech doesn't overlap
        const timer = setTimeout(() => {
          speakText(
            `Question ${currentIdx + 1} : ${currentQ.question}`,
            user.language === "fr" ? "fr-FR" : "en-US"
          );
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIdx, quizFinished, questions]);

  if (!isOpen || !video) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      soundFx.playVictory();
      confetti({ particleCount: 50, spread: 60 });
      setScore((s) => s + 1);
      setFantiMood("excited");
      setFantiBubble(`Bravo ! C'est la bonne réponse ! 🌟 ${currentQ.explanation}`);
      speakText(`Bravo ! C'est la bonne réponse ! ${currentQ.explanation}`, user.language === "fr" ? "fr-FR" : "en-US");
    } else {
      soundFx.playTap();
      setFantiMood("happy");
      const correctText = currentQ.options[currentQ.correctIndex]?.text || "";
      setFantiBubble(`Presque ! La bonne réponse était : "${correctText}". ${currentQ.explanation}`);
      speakText(
        `Oups ! La bonne réponse était : ${correctText}. ${currentQ.explanation}`,
        user.language === "fr" ? "fr-FR" : "en-US"
      );
    }
  };

  const handleNext = () => {
    soundFx.playTap();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      setQuizFinished(true);
      setFantiMood("proud");
      soundFx.playTrumpet();
      confetti({ particleCount: 110, spread: 80 });

      // Reward calculation:
      // Base: 25 XP & 3 Stars for quiz completion
      // Bonus: +10 XP & +2 Stars for perfect score (3/3)
      const isPerfect = score + (selectedOption === currentQ.correctIndex ? 1 : 0) === questions.length;
      const totalEarnedXP = isPerfect ? 35 : 25;
      const totalEarnedStars = isPerfect ? 5 : 3;

      if (onAwardXP) {
        onAwardXP(totalEarnedXP, totalEarnedStars);
      }

      const finalSpeech = isPerfect
        ? `Score parfait ! Tu as répondu correctement à toutes les questions ! Tu gagnes ${totalEarnedXP} XP et ${totalEarnedStars} étoiles !`
        : `Super travail d'écoute ! Tu termines le quiz avec succès ! Tu remportes ${totalEarnedXP} XP et ${totalEarnedStars} étoiles !`;

      setFantiBubble(finalSpeech);
      speakText(finalSpeech, user.language === "fr" ? "fr-FR" : "en-US");
    }
  };

  const handleRestartQuiz = () => {
    soundFx.playPop();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setFantiMood("excited");
    setFantiBubble(`C'est reparti pour un tour ! Prêt ?`);
    speakText(`C'est reparti pour un tour !`, user.language === "fr" ? "fr-FR" : "en-US");
  };

  const speakCurrentQuestion = () => {
    if (!currentQ) return;
    soundFx.playTap();
    speakText(
      `${currentQ.question}. Choix 1 : ${currentQ.options[0]?.text}. Choix 2 : ${currentQ.options[1]?.text}. Choix 3 : ${currentQ.options[2]?.text}.`,
      user.language === "fr" ? "fr-FR" : "en-US"
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-gradient-to-b from-white via-amber-50/40 to-sky-50 rounded-3xl p-4 sm:p-8 max-w-2xl w-full shadow-2xl border-4 border-amber-300 space-y-6 relative animate-fadeIn my-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playTap();
            onClose();
          }}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all z-20 active:scale-95 shadow"
          title="Fermer le quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Bar */}
        <div className="flex items-center gap-3 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-md font-black text-2xl shrink-0">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-rose-500 text-white font-black text-[11px] rounded-lg uppercase tracking-wider shadow-sm">
                Quiz de Compréhension
              </span>
              <span className="text-xs text-slate-500 font-extrabold truncate max-w-xs">
                {video.title}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {quizFinished ? "Résultat du Quiz Éducatif 🏆" : "Vérifie ce que tu as appris !"}
            </h2>
          </div>
        </div>

        {/* Fanti Elephant Companion Banner */}
        <div className="bg-white/90 rounded-2xl p-4 border-2 border-amber-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="shrink-0 scale-90 sm:scale-100">
            <MascotFanti
              outfit="Chef"
              mood={fantiMood}
              size="md"
              interactive={true}
              speechBubble={fantiBubble}
            />
          </div>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Professeur Fanti t'aide à comprendre ! 🐘</span>
            </div>
            <p className="text-slate-800 font-extrabold text-sm sm:text-base leading-relaxed bg-amber-50/80 p-3 rounded-xl border border-amber-200">
              "{fantiBubble || "Écoute bien la question et choisis la bonne réponse !"}"
            </p>
            {!quizFinished && currentQ && (
              <button
                onClick={speakCurrentQuestion}
                className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl flex items-center justify-center sm:justify-start gap-2 shadow active:scale-95 transition-all mx-auto sm:mx-0"
              >
                <Volume2 className="w-4 h-4" />
                <span>Réécouter la question & les choix 🔊</span>
              </button>
            )}
          </div>
        </div>

        {/* QUIZ IN PROGRESS VIEW */}
        {!quizFinished && currentQ && (
          <div className="space-y-5">
            {/* Progress Bar & Indicators */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-600">
                <span>
                  Question {currentIdx + 1} sur {questions.length}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-black">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  Score actuel : {score} point{score > 1 ? "s" : ""}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentIdx + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Text Box */}
            <div className="bg-white rounded-2xl p-5 border-3 border-amber-300 shadow-md text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQ.correctIndex;
                let btnStyle = "bg-white border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 shadow";

                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = "bg-emerald-50 border-3 border-emerald-500 text-emerald-950 font-black shadow-lg scale-[1.01]";
                  } else if (isSelected && !isCorrectOption) {
                    btnStyle = "bg-rose-50 border-3 border-rose-400 text-rose-950 opacity-90";
                  } else {
                    btnStyle = "bg-slate-50 border-2 border-slate-200 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl font-bold text-left flex items-center justify-between gap-3 transition-all active:scale-98 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0 shadow-inner">
                        {opt.emoji}
                      </span>
                      <span className="text-sm sm:text-base font-extrabold leading-snug">
                        {opt.text}
                      </span>
                    </div>

                    {isAnswered && (
                      <div className="shrink-0">
                        {isCorrectOption ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                            <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                          </div>
                        ) : isSelected ? (
                          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow">
                            <XCircle className="w-5 h-5 stroke-[3]" />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation and Next Button when answered */}
            {isAnswered && (
              <div className="space-y-3 pt-2 animate-fadeIn">
                <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                  selectedOption === currentQ.correctIndex
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}>
                  <span className="text-2xl shrink-0">
                    {selectedOption === currentQ.correctIndex ? "🎉" : "💡"}
                  </span>
                  <div>
                    <p className="font-black text-sm">
                      {selectedOption === currentQ.correctIndex ? "Excellente réponse !" : "Bon à savoir :"}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold mt-0.5">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition-all animate-bounce"
                  >
                    <span>{currentIdx < questions.length - 1 ? "Question suivante" : "Voir mon résultat"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUIZ FINISHED / SUMMARY VIEW */}
        {quizFinished && (
          <div className="space-y-6 text-center animate-scaleUp py-2">
            <div className="relative inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center text-5xl shadow-2xl border-4 border-white animate-pulse">
                🏆
              </div>
              <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-rose-500 text-white font-black text-xs rounded-full shadow-lg border-2 border-white">
                +{score === questions.length ? "35 XP" : "25 XP"}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {score === questions.length
                  ? "🌟 Félicitations ! Champion du Quiz !"
                  : "👏 Bravo pour tes efforts !"}
              </h3>
              <p className="text-sm font-bold text-slate-600 max-w-md mx-auto">
                Tu as répondu correctement à{" "}
                <span className="text-amber-600 font-black text-base">{score}</span> sur{" "}
                <span className="text-slate-900 font-black text-base">{questions.length}</span> questions sur la vidéo{" "}
                <span className="font-extrabold text-slate-800">"{video.title}"</span> !
              </p>
            </div>

            {/* Stars Bar */}
            <div className="flex items-center justify-center gap-2 py-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 ${
                    i < score
                      ? "bg-amber-400 border-amber-200 text-yellow-950 scale-105"
                      : "bg-slate-100 border-slate-200 text-slate-300"
                  }`}
                >
                  ⭐
                </div>
              ))}
            </div>

            {/* Earned Rewards Card */}
            <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-rose-100 p-4 rounded-2xl border-2 border-amber-300 flex items-center justify-around text-slate-900 shadow-sm max-w-md mx-auto">
              <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>+{score === questions.length ? 35 : 25} Points d'XP</span>
              </div>
              <div className="h-6 w-0.5 bg-amber-300" />
              <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>+{score === questions.length ? 5 : 3} Étoiles d'or</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={handleRestartQuiz}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 active:scale-95 transition-all shadow"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rejouer le quiz 🔄</span>
              </button>

              {onReplayVideo && (
                <button
                  onClick={() => {
                    soundFx.playTap();
                    onClose();
                    onReplayVideo();
                  }}
                  className="px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center gap-2 active:scale-95 transition-all shadow"
                >
                  <Film className="w-4 h-4" />
                  <span>Revoir la vidéo 📺</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundFx.playVictory();
                  onClose();
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl flex items-center gap-2 active:scale-95 transition-all"
              >
                <Award className="w-5 h-5" />
                <span>Continuer l'aventure 🌟</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
