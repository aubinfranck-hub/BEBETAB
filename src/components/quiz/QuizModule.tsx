import React, { useState, useEffect } from "react";
import { UserProfile, QuizQuestion } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";

interface QuizModuleProps {
  initialSubject?: string;
  user: UserProfile;
  onAwardXP: (xp: number, stars: number) => void;
  onBack: () => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  initialSubject,
  user,
  onAwardXP,
  onBack,
}) => {
  const [subject, setSubject] = useState(initialSubject || "Maths & Chiffres");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subjects = [
    "Maths & Chiffres 🔢",
    "Animaux & Nature 🐘",
    "Sciences & Planètes 🚀",
    "Culture & Histoire 🌍",
  ];

  const fetchQuiz = async (subj: string) => {
    soundFx.playTap();
    setIsLoading(true);
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIdx(0);
    setScore(0);

    try {
      const res = await fetch("/api/fanti/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageGroup: user.ageGroup,
          subject: subj,
        }),
      });
      if (!res.ok) throw new Error("Quiz indisponible");
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        speakText(
          `Question 1 : ${data.questions[0].question}`,
          "fr-FR"
        );
      }
    } catch (e) {
      setQuestions([{id:1,question:"Combien font 2 + 3 ?",options:["4","5","6"],correctIndex:1,explanation:"Deux et trois font cinq."},{id:2,question:"Quel animal possède une trompe ?",options:["Lion","Éléphant","Chat"],correctIndex:1,explanation:"L’éléphant utilise sa trompe pour boire et saisir des objets."}]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz(subject);
  }, []);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const q = questions[currentIdx];
    if (index === q.correctIndex) {
      soundFx.playVictory();
      confetti({ particleCount: 60, spread: 70 });
      setScore((s) => s + 1);
      speakText(`Bravo ! C'est la bonne réponse ! ${q.explanation}`);
      onAwardXP(20, 2);
    } else {
      soundFx.playTap();
      speakText(`Oups ! La bonne réponse était : ${q.options[q.correctIndex]}. ${q.explanation}`);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setSelectedOption(null);
      setIsAnswered(false);
      speakText(`Question ${next + 1} : ${questions[next].question}`);
    } else {
      // Quiz Finished
      soundFx.playVictory();
      confetti({ particleCount: 120, spread: 90 });
      speakText(
        `Félicitations ! Tu as terminé le quiz avec ${score + (selectedOption === questions[currentIdx]?.correctIndex ? 1 : 0)} bonnes réponses sur ${questions.length} !`
      );
      onAwardXP(50, 5);
      setCurrentIdx(questions.length); // End screen
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-purple-300">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-transform active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🧩</span> Quiz Rigolo de Fanti
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Réponds aux questions adaptées pour ton âge ({user.ageGroup} ans) !
            </p>
          </div>
        </div>
      </div>

      {/* Subject Picker */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {subjects.map((subj) => (
          <button
            key={subj}
            onClick={() => {
              setSubject(subj);
              fetchQuiz(subj);
            }}
            className={`px-5 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all shadow-md border-2 ${
              subject === subj
                ? "bg-purple-600 text-white border-white scale-105"
                : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white/90 backdrop-blur rounded-3xl p-12 text-center shadow-xl border-4 border-purple-300 space-y-4">
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto animate-spin" />
          <h3 className="text-2xl font-black text-slate-800">
            Fanti prépare ton quiz...
          </h3>
        </div>
      )}

      {/* Active Question Card */}
      {!isLoading && questions.length > 0 && currentIdx < questions.length && (
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-purple-300 space-y-6">
          <div className="flex items-center justify-between text-xs font-black uppercase text-purple-600 border-b pb-3">
            <span>Question {currentIdx + 1} / {questions.length}</span>
            <span>Score : {score} ⭐</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {questions[currentIdx].question}
            </h3>

            <button
              onClick={() => speakText(questions[currentIdx].question)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-900 text-xs font-black rounded-xl"
            >
              <Volume2 className="w-4 h-4" /> Réécouter la question
            </button>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {questions[currentIdx].options.map((opt, idx) => {
              let btnStyle = "bg-slate-50 text-slate-800 border-slate-200 hover:bg-purple-50";
              if (isAnswered) {
                if (idx === questions[currentIdx].correctIndex) {
                  btnStyle = "bg-emerald-500 text-white border-emerald-600 shadow-lg";
                } else if (idx === selectedOption) {
                  btnStyle = "bg-rose-500 text-white border-rose-600";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-5 rounded-3xl font-black text-lg text-center border-4 shadow-md transition-all active:scale-95 ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200 text-purple-900 space-y-2">
              <p className="font-extrabold text-sm">
                💡 {questions[currentIdx].explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-3 bg-purple-600 text-white font-black rounded-xl shadow-md active:scale-95 transition-all text-sm"
              >
                Question Suivante ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* End Screen */}
      {!isLoading && currentIdx >= questions.length && questions.length > 0 && (
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 text-center shadow-2xl border-4 border-yellow-300 space-y-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
          <h3 className="text-3xl font-black text-slate-900">
            Quiz Terminé ! Bravo Champion !
          </h3>
          <p className="text-xl font-extrabold text-purple-600">
            Tu as obtenu {score} / {questions.length} réponses correctes !
          </p>

          <button
            onClick={() => fetchQuiz(subject)}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black rounded-2xl shadow-lg flex items-center gap-2 mx-auto active:scale-95"
          >
            <RotateCcw className="w-5 h-5" /> Refaire un Quiz
          </button>
        </div>
      )}
    </div>
  );
};
