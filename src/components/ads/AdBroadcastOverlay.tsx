import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Volume2, VolumeX, Sparkles, AlertCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { soundFx } from "../../utils/audio";

interface AdData {
  id: string;
  title: string;
  type: "video" | "image";
  url: string;
  duration: number;
  sponsor?: string;
  locked: boolean;
  createdAt: number;
}

interface AdBroadcastOverlayProps {
  onRewardUser?: (stars: number) => void;
}

export const AdBroadcastOverlay: React.FC<AdBroadcastOverlayProps> = ({ onRewardUser }) => {
  const [activeAd, setActiveAd] = useState<AdData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Poll or SSE connection to Ad Stream
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource("/api/ads/stream");

        eventSource.addEventListener("initial", (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            if (data.activeAd) {
              handleNewAd(data.activeAd);
            } else {
              setActiveAd(null);
            }
          } catch (err) {}
        });

        eventSource.addEventListener("ad_start", (e: MessageEvent) => {
          try {
            const ad = JSON.parse(e.data);
            handleNewAd(ad);
          } catch (err) {}
        });

        eventSource.addEventListener("ad_stop", () => {
          setActiveAd(null);
          setIsFinished(false);
        });

        eventSource.onerror = () => {
          if (eventSource) {
            eventSource.close();
          }
        };
      } catch (err) {
        console.error("SSE connection error:", err);
      }
    };

    connectSSE();

    // Fallback polling every 3s
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/ads/current");
        if (res.ok) {
          const data = await res.json();
          if (data.activeAd && (!activeAd || activeAd.id !== data.activeAd.id)) {
            handleNewAd(data.activeAd);
          } else if (!data.activeAd && activeAd) {
            setActiveAd(null);
            setIsFinished(false);
          }
        }
      } catch (e) {}
    }, 3000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeAd]);

  const handleNewAd = (ad: AdData) => {
    soundFx.playVictory();
    setActiveAd(ad);
    setIsFinished(false);
    setRewardClaimed(false);
    setTimeLeft(ad.duration || 15);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAdFinished();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAdFinished = () => {
    setIsFinished(true);
    soundFx.playVictory();

    // Record view in backend
    fetch("/api/ads/view", { method: "POST" }).catch(() => {});

    if (onRewardUser && !rewardClaimed) {
      onRewardUser(10);
      setRewardClaimed(true);
    }
  };

  // Block ESC key or exit attempts
  useEffect(() => {
    if (!activeAd) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeAd.locked && (!isFinished || activeAd.locked)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [activeAd, isFinished]);

  if (!activeAd) return null;

  const progressPercent = activeAd.duration
    ? Math.min(100, Math.max(0, ((activeAd.duration - timeLeft) / activeAd.duration) * 100))
    : 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 select-none touch-none pointer-events-auto overflow-hidden text-white"
        style={{ userSelect: "none" }}
      >
        {/* Top Header Bar */}
        <div className="w-full max-w-4xl flex items-center justify-between bg-slate-900/80 border-2 border-yellow-400/40 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl text-slate-900 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow animate-pulse">
              <Sparkles className="w-4 h-4" />
              Sponsor Officiel
            </span>
            <div>
              <h4 className="text-sm sm:text-base font-black text-yellow-300 drop-shadow line-clamp-1">
                {activeAd.title}
              </h4>
              <p className="text-xs text-slate-300 font-bold">
                {activeAd.sponsor || "Partenaire BéBé-TAB World"}
              </p>
            </div>
          </div>

          {/* Locked Status Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/90 border border-rose-400 text-white rounded-xl text-xs font-black shadow animate-pulse">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Diffusion Verrouillée</span>
            </div>

            {/* Mute button for video */}
            {activeAd.type === "video" && (
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (videoRef.current) videoRef.current.muted = !isMuted;
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar Header */}
        <div className="w-full max-w-4xl my-2 bg-slate-800/80 h-3 rounded-full overflow-hidden border border-white/20 p-0.5 shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Ad Media Display Area */}
        <div className="relative w-full max-w-4xl flex-1 my-2 bg-black rounded-3xl border-4 border-yellow-300/60 shadow-2xl overflow-hidden flex items-center justify-center">
          {activeAd.type === "video" ? (
            <video
              ref={videoRef}
              src={activeAd.url}
              autoPlay
              playsInline
              muted={isMuted}
              onEnded={() => {
                setTimeLeft(0);
                handleAdFinished();
              }}
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <img
              src={activeAd.url}
              alt={activeAd.title}
              className="w-full h-full object-contain bg-black/80"
            />
          )}

          {/* On-screen Watermark & Countdown Overlay */}
          <div className="absolute top-4 right-4 bg-black/75 border-2 border-yellow-400 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-2xl backdrop-blur">
            <span className="text-2xl font-black text-yellow-300">{timeLeft}s</span>
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">
              {isFinished ? "Terminé !" : "Restantes"}
            </span>
          </div>

          {/* Completion Celebration Badge */}
          {isFinished && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-20 h-20 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center mb-4 shadow-2xl animate-bounce border-4 border-white">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-yellow-300 mb-2">
                Publicité Terminée ! 🎉
              </h3>
              <p className="text-base text-emerald-300 font-extrabold mb-4">
                Bravo ! Tu as gagné +10 Étoiles Magiques ⭐ pour avoir regardé l'annonce.
              </p>
              <p className="text-xs text-slate-400 italic">
                L'administrateur va bientôt libérer l'écran...
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer Mandatory Banner */}
        <div className="w-full max-w-4xl bg-rose-950/80 border-2 border-rose-500/50 rounded-2xl p-3 flex items-center justify-between text-xs sm:text-sm font-extrabold text-rose-200 backdrop-blur shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
            <span>
              🔒 Mode Diffusion Intégrale : Impossible de fermer ou de sortir pendant la publicité.
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-yellow-300 font-black">
            <span>BéBé-TAB Ad Engine</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
