import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MascotOutfit, WorldTheme } from "../types";
import { soundFx, speakText } from "../utils/audio";
import { MessageCircle, Sparkles, Volume2, Mic, X, Send, PhoneCall, MessageSquare } from "lucide-react";
import { GeminiLiveVoice } from "./GeminiLiveVoice";

interface MascotFantiProps {
  outfit?: MascotOutfit;
  world?: WorldTheme;
  speechBubble?: string;
  mood?: "happy" | "excited" | "singing" | "thinking" | "proud" | "sleeping";
  isSleeping?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  onOpenChat?: () => void;
  primaryColor?: string;
}

export const MascotFanti: React.FC<MascotFantiProps> = ({
  outfit = "Explorateur",
  speechBubble,
  mood = "happy",
  isSleeping = false,
  size = "md",
  interactive = true,
  onOpenChat,
  primaryColor = "#3B82F6",
}) => {
  const [isWaving, setIsWaving] = useState(false);
  const [localBubble, setLocalBubble] = useState<string | null>(speechBubble || null);

  const isAsleep = isSleeping || mood === "sleeping";

  // Sync external speechBubble
  React.useEffect(() => {
    if (speechBubble) {
      setLocalBubble(speechBubble);
    }
  }, [speechBubble]);

  const handleTap = () => {
    if (isAsleep) {
      soundFx.playSnore();
      setLocalBubble("Zzz... 😴 Fanti dort paisiblement !");
      speakText("Zzz... Fanti dort paisiblement ! C'est l'heure de se reposer !");
      return;
    }

    soundFx.playTrumpet();
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1200);

    const greetings = [
      "Bonjour petit champion ! Prêt à apprendre ?",
      "Bravo ! Tu es super fort aujourd'hui !",
      "J'adore jouer avec toi ! Regarde ma trompe !",
      "Tu veux faire un dessin ou écouter une histoire ?",
    ];
    const randomGreet = greetings[Math.floor(Math.random() * greetings.length)];
    setLocalBubble(randomGreet);
    speakText(randomGreet);

    if (onOpenChat) {
      onOpenChat();
    }
  };

  // Dimension scaling
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-28 h-28",
    lg: "w-40 h-40",
    xl: "w-56 h-56",
  };

  // Outfit decoration accessories
  const renderOutfitAccessory = () => {
    switch (outfit) {
      case "Explorateur":
        return (
          <path
            d="M 25 22 Q 50 10 75 22 L 70 30 Q 50 25 30 30 Z"
            fill="#D97706"
            stroke="#92400E"
            strokeWidth="2"
          />
        );
      case "Astronaute":
        return (
          <ellipse cx="50" cy="25" rx="32" ry="18" fill="rgba(219, 234, 254, 0.6)" stroke="#60A5FA" strokeWidth="3" />
        );
      case "Artiste":
        return (
          <path d="M 28 25 C 28 15, 60 12, 70 20 C 75 25, 65 32, 50 28 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
        );
      case "Chef":
        return (
          <g>
            <path d="M 32 25 L 32 12 Q 50 2 68 12 L 68 25 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
            <line x1="32" y1="25" x2="68" y2="25" stroke="#EF4444" strokeWidth="3" />
          </g>
        );
      case "Magicien":
        return (
          <g>
            <path d="M 25 28 L 50 2 L 75 28 Z" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2" />
            <polygon points="50,10 52,15 57,15 53,18 55,23 50,20 45,23 47,18 43,15 48,15" fill="#FBBF24" />
          </g>
        );
      case "Super-Héros":
        return (
          <path d="M 20 40 Q 50 15 80 40 L 85 80 Q 50 95 15 80 Z" fill="#EF4444" opacity="0.85" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center select-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {localBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 z-20 max-w-xs px-4 py-2 bg-white rounded-2xl shadow-xl border-4 border-yellow-400 text-center text-slate-800 font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer"
            onClick={() => speakText(localBubble)}
          >
            <span>{localBubble}</span>
            <Volume2 className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-yellow-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animated Zzz when sleeping */}
      {isAsleep && (
        <div className="absolute -top-12 right-0 pointer-events-none flex flex-col items-center z-20">
          <motion.span
            animate={{ y: [-5, -28], x: [0, 8, -4], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.9] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeOut" }}
            className="text-3xl font-black text-indigo-300 drop-shadow-[0_2px_8px_rgba(99,102,241,0.8)] select-none"
          >
            Z
          </motion.span>
          <motion.span
            animate={{ y: [0, -22], x: [-4, 6, -2], opacity: [0, 1, 0], scale: [0.7, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.8, delay: 0.9, ease: "easeOut" }}
            className="text-2xl font-black text-purple-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.8)] select-none"
          >
            z
          </motion.span>
          <motion.span
            animate={{ y: [5, -16], x: [2, -5, 2], opacity: [0, 1, 0], scale: [0.6, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.8, delay: 1.7, ease: "easeOut" }}
            className="text-lg font-black text-blue-300 drop-shadow-[0_2px_8px_rgba(59,130,246,0.8)] select-none"
          >
            z
          </motion.span>
        </div>
      )}

      {/* Mascot Container */}
      <motion.div
        whileHover={{ scale: interactive ? 1.08 : 1 }}
        whileTap={{ scale: interactive ? 0.92 : 1 }}
        animate={
          isAsleep
            ? { y: [0, 6, 0], scale: [1, 1.02, 1] }
            : isWaving
            ? { rotate: [0, -10, 10, -10, 0], y: [0, -8, 0] }
            : { y: [0, -4, 0] }
        }
        transition={{
          y: { duration: isAsleep ? 3.5 : 2.5, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.6 },
        }}
        onClick={interactive ? handleTap : undefined}
        className={`${sizeClasses[size]} relative cursor-pointer drop-shadow-2xl`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Shadow underneath */}
          <ellipse cx="50" cy="92" rx="35" ry="8" fill="rgba(0,0,0,0.15)" />

          {/* Elephant Ears */}
          <motion.ellipse
            cx="22"
            cy="48"
            rx="20"
            ry="24"
            fill={primaryColor}
            stroke="#1E3A8A"
            strokeWidth="3"
            animate={{ rotate: isWaving ? [-10, 15, -10] : [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <ellipse cx="22" cy="48" rx="13" ry="16" fill="#F472B6" opacity="0.75" />

          <motion.ellipse
            cx="78"
            cy="48"
            rx="20"
            ry="24"
            fill={primaryColor}
            stroke="#1E3A8A"
            strokeWidth="3"
            animate={{ rotate: isWaving ? [10, -15, 10] : [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <ellipse cx="78" cy="48" rx="13" ry="16" fill="#F472B6" opacity="0.75" />

          {/* Body */}
          <circle cx="50" cy="55" r="32" fill={primaryColor} stroke="#1E3A8A" strokeWidth="3" />
          <ellipse cx="50" cy="62" rx="20" ry="18" fill="#DBEAFE" />

          {/* Outfit Accessory / Nightcap Header */}
          {isAsleep ? (
            <g>
              {/* Bonnet de Nuit Nuit Magique */}
              <path d="M 28 28 C 30 10, 62 5, 76 15 Q 85 24, 82 34 Z" fill="#4338CA" stroke="#1E1B4B" strokeWidth="2.5" />
              <path d="M 28 28 Q 52 33 76 28" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              <circle cx="82" cy="34" r="5.5" fill="#FFFFFF" stroke="#E0E7FF" strokeWidth="1.5" />
              <polygon points="45,15 47,19 52,19 48,22 50,26 45,23 40,26 42,22 38,19 43,19" fill="#FBBF24" />
            </g>
          ) : (
            renderOutfitAccessory()
          )}

          {/* Eyes: Closed if Sleeping, Open otherwise */}
          {isAsleep ? (
            <g>
              <path d="M 34 43 Q 40 48 46 43" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 54 43 Q 60 48 66 43" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ) : (
            <>
              <circle cx="40" cy="42" r="5.5" fill="#FFFFFF" />
              <circle cx="40" cy="42" r="3" fill="#1E293B" />
              <circle cx="41.5" cy="40.5" r="1.2" fill="#FFFFFF" />

              <circle cx="60" cy="42" r="5.5" fill="#FFFFFF" />
              <circle cx="60" cy="42" r="3" fill="#1E293B" />
              <circle cx="61.5" cy="40.5" r="1.2" fill="#FFFFFF" />
            </>
          )}

          {/* Cheeks */}
          <ellipse cx="33" cy="50" rx="4" ry="2.5" fill="#F43F5E" opacity="0.6" />
          <ellipse cx="67" cy="50" rx="4" ry="2.5" fill="#F43F5E" opacity="0.6" />

          {/* Elephant Trunk */}
          <motion.path
            d="M 50 50 Q 50 72 65 68 Q 72 65 70 58 Q 65 52 58 56"
            fill="none"
            stroke={primaryColor}
            strokeWidth="11"
            strokeLinecap="round"
            animate={{
              d: isWaving
                ? [
                    "M 50 50 Q 50 72 65 68 Q 72 65 70 58 Q 65 52 58 56",
                    "M 50 50 Q 40 70 30 60 Q 25 50 35 48 Q 45 50 48 55",
                    "M 50 50 Q 50 72 65 68 Q 72 65 70 58 Q 65 52 58 56",
                  ]
                : "M 50 50 Q 50 72 65 68 Q 72 65 70 58 Q 65 52 58 56",
            }}
            transition={{ duration: 0.8 }}
          />
          {/* Trunk Outline */}
          <path
            d="M 50 50 Q 50 72 65 68"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* Little Star / Sparkle Floating */}
          <g>
            <polygon
              points="82,20 84,25 89,25 85,28 87,33 82,30 77,33 79,28 75,25 80,25"
              fill="#F59E0B"
            />
          </g>
        </svg>

        {/* AI Voice Badge Button overlay */}
        {interactive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenChat) onOpenChat();
            }}
            className="absolute -bottom-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center border-2 border-white"
            title="Parler avec Fanti"
          >
            <MessageCircle className="w-5 h-5 animate-bounce" />
          </button>
        )}
      </motion.div>
    </div>
  );
};

// --- FANTI AI VOICE & CHAT MODAL ---
interface FantiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  ageGroup: string;
  currentWorld: WorldTheme;
}

export const FantiChatModal: React.FC<FantiChatModalProps> = ({
  isOpen,
  onClose,
  ageGroup,
  currentWorld,
}) => {
  const [chatMode, setChatMode] = useState<"text" | "live">("live");
  const [messages, setMessages] = useState<
    { sender: "user" | "fanti"; text: string; mood?: string }[]
  >([
    {
      sender: "fanti",
      text: "Coucou ! Je suis Lia (Fanti) ton ami éléphant ! Tu peux me parler par texte ou lancer un Appel Vocal Gemini Live en direct ! 🐘✨",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [fantiColor, setFantiColor] = useState("#3B82F6");

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;
    const userMsg = inputText.trim();
    setInputText("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsSending(true);

    try {
      const res = await fetch("/api/fanti/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          ageGroup,
          currentWorld,
        }),
      });
      if (!res.ok) throw new Error("Fanti indisponible");
      const data = await res.json();
      const text = data.text || "Youpi ! Fanti t'écoute !";
      if (data.color) setFantiColor(data.color);

      setMessages((prev) => [
        ...prev,
        { sender: "fanti", text, mood: data.mood },
      ]);
      speakText(text);
      soundFx.playVictory();
    } catch (e) {
      const fallback = "Fanti t'adore ! Veux-tu qu'on joue au quiz ou au jeu de musique ensemble ?";
      setMessages((prev) => [...prev, { sender: "fanti", text: fallback }]);
      speakText(fallback);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 shadow-2xl border-4 border-yellow-300 flex flex-col max-h-[90vh] text-white relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-all z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 mb-4 pr-12">
          <button
            onClick={() => setChatMode("live")}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow ${
              chatMode === "live"
                ? "bg-gradient-to-r from-emerald-400 to-green-500 text-slate-900 ring-2 ring-yellow-300"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Gemini Live 🎙️ En Direct</span>
          </button>

          <button
            onClick={() => setChatMode("text")}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow ${
              chatMode === "text"
                ? "bg-yellow-400 text-slate-900 ring-2 ring-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Texte & Vocaux</span>
          </button>
        </div>

        {chatMode === "live" ? (
          <GeminiLiveVoice
            ageGroup={ageGroup}
            currentWorld={currentWorld}
            onClose={onClose}
          />
        ) : (
          <>
            {/* Header with Mascot */}
            <div className="flex items-center gap-4 border-b border-white/20 pb-4 mb-3">
              <MascotFanti size="sm" primaryColor={fantiColor} interactive={false} />
              <div>
                <h2 className="text-2xl font-black tracking-wide text-yellow-300 drop-shadow">
                  Discute avec Lia (Fanti)
                </h2>
                <p className="text-xs text-blue-100 font-medium">
                  Pose des questions, demande une comptine ou une blague !
                </p>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-black/15 rounded-2xl mb-4 border border-white/10">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.sender === "fanti" && (
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0 shadow">
                      🐘
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-semibold shadow-md ${
                      m.sender === "user"
                        ? "bg-yellow-400 text-slate-900 rounded-br-none"
                        : "bg-white text-slate-800 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                    {m.sender === "fanti" && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="ml-2 inline-flex items-center text-xs text-blue-600 hover:underline"
                      >
                        <Volume2 className="w-3.5 h-3.5 ml-1 inline" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex items-center gap-2 text-yellow-200 text-sm font-bold animate-pulse p-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> Lia réfléchit...
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-bold">
              {[
                "Raconte-moi une histoire",
                "Pourquoi le ciel est bleu ?",
                "Chante une chanson !",
                "Quel est ton animal préféré ?",
              ].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(chip);
                  }}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full whitespace-nowrap text-white border border-white/30 transition-all shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Écris un message à Lia..."
                className="flex-1 px-4 py-3 bg-white text-slate-800 placeholder-slate-400 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !inputText.trim()}
                className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-slate-900 font-black rounded-2xl shadow-lg transition-all flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
