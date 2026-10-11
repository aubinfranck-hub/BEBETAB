import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Volume2, VolumeX, Sparkles, ShieldAlert, X } from "lucide-react";
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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Les identifiants sont gardés dans des refs : les gestionnaires SSE / sondage vivent toute la
  // durée du composant et ne doivent jamais relire un état périmé (sinon la pub redémarrait en boucle).
  const currentIdRef = useRef<string | null>(null);
  const dismissedIdsRef = useRef<Set<string>>(new Set());
  const rewardedIdsRef = useRef<Set<string>>(new Set());
  const onRewardRef = useRef(onRewardUser);
  onRewardRef.current = onRewardUser;

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const finishAd = useCallback((ad: AdData) => {
    clearTimer();
    setTimeLeft(0);
    setIsFinished(true);
    soundFx.playVictory();

    // Une vue et une récompense par annonce, même si le serveur renvoie l'annonce plusieurs fois.
    if (!rewardedIdsRef.current.has(ad.id)) {
      rewardedIdsRef.current.add(ad.id);
      fetch("/api/ads/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: ad.id }),
      }).catch(() => {});
      onRewardRef.current?.(10);
    }
  }, []);

  const startAd = useCallback(
    (ad: AdData) => {
      if (ad.id === currentIdRef.current || dismissedIdsRef.current.has(ad.id)) return;
      currentIdRef.current = ad.id;
      soundFx.playVictory();
      setActiveAd(ad);
      setIsFinished(false);

      let remaining = ad.duration || 15;
      setTimeLeft(remaining);

      clearTimer();
      timerRef.current = setInterval(() => {
        remaining -= 1;
        setTimeLeft(Math.max(0, remaining));
        if (remaining <= 0) finishAd(ad);
      }, 1000);
    },
    [finishAd]
  );

  const stopAd = useCallback(() => {
    clearTimer();
    currentIdRef.current = null;
    setActiveAd(null);
    setIsFinished(false);
  }, []);

  // L'enfant peut toujours continuer une fois l'annonce terminée (ou tout de suite si elle n'est pas verrouillée).
  const dismissAd = () => {
    if (activeAd) dismissedIdsRef.current.add(activeAd.id);
    stopAd();
  };

  // Flux SSE (une seule connexion) + sondage de secours toutes les 3 s.
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const connectSSE = () => {
      if (cancelled) return;
      try {
        eventSource = new EventSource("/api/ads/stream");

        eventSource.addEventListener("initial", (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            if (data.activeAd) startAd(data.activeAd);
            else if (currentIdRef.current) stopAd();
          } catch (err) {}
        });

        eventSource.addEventListener("ad_start", (e: MessageEvent) => {
          try {
            startAd(JSON.parse(e.data));
          } catch (err) {}
        });

        eventSource.addEventListener("ad_stop", () => {
          stopAd();
        });

        eventSource.onerror = () => {
          eventSource?.close();
          eventSource = null;
          if (!cancelled) reconnectTimer = setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        console.error("SSE connection error:", err);
      }
    };

    connectSSE();

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/ads/current");
        if (!res.ok) return;
        const data = await res.json();
        if (data.activeAd) startAd(data.activeAd);
        else if (currentIdRef.current) stopAd();
      } catch (e) {}
    }, 3000);

    return () => {
      cancelled = true;
      eventSource?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clearInterval(pollInterval);
      clearTimer();
    };
  }, [startAd, stopAd]);

  // Pendant une annonce verrouillée (et seulement tant qu'elle dure), on bloque les touches.
  const lockedNow = !!activeAd && activeAd.locked && !isFinished;
  useEffect(() => {
    if (!lockedNow) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [lockedNow]);

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
        className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 select-none pointer-events-auto overflow-hidden text-white"
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

          <div className="flex items-center gap-3">
            {lockedNow && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/90 border border-rose-400 text-white rounded-xl text-xs font-black shadow animate-pulse">
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">Diffusion Verrouillée</span>
              </div>
            )}

            {/* Mute button for video */}
            {activeAd.type === "video" && (
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (videoRef.current) videoRef.current.muted = !isMuted;
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                aria-label={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
              </button>
            )}

            {/* Une annonce non verrouillée peut toujours être fermée */}
            {!lockedNow && !isFinished && (
              <button
                onClick={dismissAd}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                aria-label="Fermer la publicité"
              >
                <X className="w-5 h-5" />
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
              onEnded={() => finishAd(activeAd)}
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <img
              src={activeAd.url}
              alt={activeAd.title}
              referrerPolicy="no-referrer"
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
              <button
                onClick={dismissAd}
                className="px-8 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-slate-900 font-black rounded-2xl shadow-xl border-2 border-white active:scale-95 transition-transform"
              >
                Continuer ▶
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer Banner */}
        <div className="w-full max-w-4xl bg-rose-950/80 border-2 border-rose-500/50 rounded-2xl p-3 flex items-center justify-between text-xs sm:text-sm font-extrabold text-rose-200 backdrop-blur shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <span>
              {lockedNow
                ? "🔒 Un instant : cette annonce se termine dans quelques secondes, puis tu pourras continuer."
                : "Tu peux fermer cette annonce quand tu veux."}
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
