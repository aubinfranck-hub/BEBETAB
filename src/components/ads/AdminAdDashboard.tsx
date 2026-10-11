import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Radio,
  Play,
  Square,
  Users,
  Eye,
  Tv,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  Video,
  Image as ImageIcon,
  ShieldAlert,
  Flame,
  RefreshCw,
} from "lucide-react";
import { soundFx } from "../../utils/audio";

interface PresetAd {
  title: string;
  sponsor: string;
  type: "video" | "image";
  url: string;
  duration: number;
  previewImg: string;
}

const PRESET_ADS: PresetAd[] = [
  {
    title: "LEGO Duplo - Le Monde des Animaux",
    sponsor: "LEGO France Kids",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 15,
    previewImg: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Disney Channel - Super Dessins Animés 2026",
    sponsor: "Disney Junior",
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 20,
    previewImg: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Parc Safari Aventure - Entrées Offertes !",
    sponsor: "Safari Park Zoo",
    type: "image",
    url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=1000&auto=format&fit=crop&q=80",
    duration: 12,
    previewImg: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Orange Kids - La Tablette Sécurisée 100% Protégée",
    sponsor: "Orange Digital Center",
    type: "image",
    url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
    duration: 10,
    previewImg: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=60",
  },
];

interface AdminAdDashboardProps {
  onClose?: () => void;
}

export const AdminAdDashboard: React.FC<AdminAdDashboardProps> = ({ onClose }) => {
  const [stats, setStats] = useState({ activeClients: 1, totalAdViews: 0 });
  const [activeAd, setActiveAd] = useState<any | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [title, setTitle] = useState(PRESET_ADS[0].title);
  const [sponsor, setSponsor] = useState(PRESET_ADS[0].sponsor);
  const [type, setType] = useState<"video" | "image">(PRESET_ADS[0].type);
  const [url, setUrl] = useState(PRESET_ADS[0].url);
  const [duration, setDuration] = useState(PRESET_ADS[0].duration);
  // Par défaut l'annonce ne bloque pas l'écran ; si on active le verrou, il ne dure que le temps de l'annonce.
  const [locked, setLocked] = useState(false);

  // Authentification administrateur : le jeton vit uniquement dans cet onglet (sessionStorage).
  const [authed, setAuthed] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [checkingToken, setCheckingToken] = useState(false);
  const tokenRef = React.useRef<string>("");

  const authHeaders = (): Record<string, string> => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenRef.current}`,
  });

  const logout = (text?: string) => {
    tokenRef.current = "";
    try {
      sessionStorage.removeItem("bebe_tab_admin_token");
    } catch (e) {}
    setAuthed(false);
    if (text) setMessage({ text, type: "error" });
  };

  const verifyToken = async (candidate: string) => {
    setCheckingToken(true);
    try {
      const res = await fetch("/api/ads/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${candidate}` },
        body: "{}",
      });
      if (res.ok) {
        tokenRef.current = candidate;
        try {
          sessionStorage.setItem("bebe_tab_admin_token", candidate);
        } catch (e) {}
        setAuthed(true);
        setMessage(null);
      } else if (res.status === 503) {
        setMessage({ text: "La console est désactivée sur le serveur (ADMIN_TOKEN non défini).", type: "error" });
      } else if (res.status === 429) {
        setMessage({ text: "Trop de tentatives, réessaie dans quelques minutes.", type: "error" });
      } else {
        setMessage({ text: "Jeton administrateur invalide.", type: "error" });
      }
    } catch (e) {
      setMessage({ text: "Erreur de connexion au serveur.", type: "error" });
    } finally {
      setCheckingToken(false);
    }
  };

  // Reprend la session de l'onglet si un jeton y est déjà enregistré.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("bebe_tab_admin_token");
      if (saved) verifyToken(saved);
    } catch (e) {}
  }, []);

  // Fetch current state periodically
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/ads/current");
        if (res.ok) {
          const data = await res.json();
          setActiveAd(data.activeAd);
          setStats(data.stats);
          setIsBroadcasting(!!data.activeAd);
        }
      } catch (e) {}
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  // Launch Broadcast
  const handleStartBroadcast = async () => {
    if (!url.trim() || !title.trim()) {
      setMessage({ text: "Veuillez remplir le titre et l'URL de l'annonce.", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/ads/broadcast", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title,
          sponsor,
          type,
          url,
          duration,
          locked,
        }),
      });

      if (res.status === 401) return logout("Session administrateur expirée : reconnecte-toi.");
      const data = await res.json();
      if (res.ok && data.success) {
        soundFx.playVictory();
        setActiveAd(data.activeAd);
        setIsBroadcasting(true);
        setMessage({
          text: `🚀 Publicité lancée en direct vers ${data.activeClients || 1} appareil(s) connecté(s) !`,
          type: "success",
        });
      } else {
        setMessage({ text: data.error || "Échec du lancement.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Erreur de connexion au serveur.", type: "error" });
    }
  };

  // Stop Broadcast
  const handleStopBroadcast = async () => {
    try {
      const res = await fetch("/api/ads/stop", { method: "POST", headers: authHeaders(), body: "{}" });
      if (res.status === 401) return logout("Session administrateur expirée : reconnecte-toi.");
      if (res.ok) {
        soundFx.playTap();
        setActiveAd(null);
        setIsBroadcasting(false);
        setMessage({ text: "🛑 La publicité a été arrêtée sur tous les écrans.", type: "success" });
      } else {
        setMessage({ text: "Impossible d'arrêter la publicité.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Erreur lors de l'arrêt.", type: "error" });
    }
  };

  const applyPreset = (preset: PresetAd) => {
    setTitle(preset.title);
    setSponsor(preset.sponsor);
    setType(preset.type);
    setUrl(preset.url);
    setDuration(preset.duration);
    soundFx.playTap();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-slate-900 border-4 border-amber-400 rounded-3xl p-5 sm:p-8 shadow-2xl text-white relative overflow-hidden my-auto"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl shadow-lg border border-amber-300">
              <Tv className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-3xl font-black text-amber-300 tracking-wide">
                  Régie Publicitaire Live
                </h2>
                <span className="px-3 py-1 bg-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-full animate-bounce">
                  Dashboard
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-semibold">
                Diffuser une photo ou vidéo sponsorisée en temps réel à tous les appareils connectés avec verrouillage d'écran
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Message Alert (connexion) */}
        {!authed && message && (
          <div className="p-4 rounded-2xl mb-6 font-extrabold text-sm flex items-center gap-2 border bg-rose-950/80 border-rose-500/50 text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Connexion administrateur */}
        {!authed && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tokenInput.trim()) verifyToken(tokenInput.trim());
            }}
            className="max-w-md mx-auto bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-amber-300 font-black">
              <Lock className="w-5 h-5" /> Accès réservé à l'administrateur
            </div>
            <p className="text-xs text-slate-400 font-semibold">
              Saisis le jeton administrateur défini sur le serveur (variable ADMIN_TOKEN). Il n'est conservé que dans cet onglet.
            </p>
            <input
              type="password"
              autoComplete="off"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Jeton administrateur"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={checkingToken || !tokenInput.trim()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl"
            >
              {checkingToken ? "Vérification…" : "Se connecter"}
            </button>
          </form>
        )}

        {authed && (
        <>
        {/* Real-time Status Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/80 border-2 border-emerald-500/40 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{stats.activeClients || 1}</span>
              <p className="text-xs text-slate-400 font-bold">Appareil(s) Connecté(s)</p>
            </div>
          </div>

          <div className="bg-slate-800/80 border-2 border-amber-500/40 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{stats.totalAdViews}</span>
              <p className="text-xs text-slate-400 font-bold">Total Vues Réalisées</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border-2 flex items-center gap-4 shadow-lg ${
              isBroadcasting
                ? "bg-rose-950/80 border-rose-500 text-rose-200"
                : "bg-slate-800/80 border-slate-700 text-slate-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                isBroadcasting ? "bg-rose-500 text-white animate-pulse" : "bg-slate-700 text-slate-400"
              }`}
            >
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-wider block">
                {isBroadcasting ? "🔴 EN DIRECT À L'ÉCRAN" : "⚪ AUCUNE PUB ACTIVE"}
              </span>
              <p className="text-xs font-semibold">
                {isBroadcasting ? activeAd?.title : "Prêt à diffuser"}
              </p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-2xl mb-6 font-extrabold text-sm flex items-center gap-2 border ${
              message.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
                : "bg-rose-950/80 border-rose-500/50 text-rose-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Main Control Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              1. Choisir une Publicité Prédéfinie
            </h3>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2">
              {PRESET_ADS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    title === preset.title
                      ? "bg-amber-500/20 border-amber-400 text-yellow-200 ring-2 ring-amber-400"
                      : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                  }`}
                >
                  <img
                    src={preset.previewImg}
                    alt={preset.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-600"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-black truncate">{preset.title}</p>
                    <span className="text-[10px] text-amber-300/80 font-bold block truncate">
                      {preset.sponsor} • {preset.duration}s
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <h3 className="text-lg font-black text-amber-300 flex items-center gap-2 pt-2 border-t border-slate-700">
              <Upload className="w-5 h-5 text-amber-400" />
              2. Configuration Personnalisée
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Titre de l'annonce</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Super Concours Lego Duplo"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Sponsor / Marque</label>
                  <input
                    type="text"
                    value={sponsor}
                    onChange={(e) => setSponsor(e.target.value)}
                    placeholder="Ex: Disney France"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Format Média</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setType("video")}
                      className={`py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 ${
                        type === "video" ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Vidéo
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("image")}
                      className={`py-1.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1 ${
                        type === "image" ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Photo
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  URL Directe du Média ({type === "video" ? "Vidéo MP4" : "Image JPG/PNG"})
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Durée d'affichage (Secondes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 bg-rose-950/50 border border-rose-500/40 rounded-xl cursor-pointer hover:bg-rose-900/40">
                    <input
                      type="checkbox"
                      checked={locked}
                      onChange={(e) => setLocked(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                    />
                    <div className="text-xs font-black text-rose-200 leading-tight">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-400" /> Verrouillage Stricte
                      </span>
                      <span className="text-[10px] text-rose-300/80 font-normal block">
                        Bloque l'écran pendant la durée de l'annonce
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Preview & Controls Column */}
          <div className="lg:col-span-5 bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-lg font-black text-amber-300 flex items-center gap-2 mb-3">
                <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
                Aperçu Écran en Direct
              </h3>

              <div className="relative aspect-video bg-black rounded-2xl border-2 border-slate-600 overflow-hidden shadow-inner flex items-center justify-center">
                {type === "video" ? (
                  <video
                    src={url}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img src={url} alt="Preview" className="w-full h-full object-contain" />
                )}

                {/* On-screen Watermark */}
                <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Lock className="w-3 h-3" /> VERROUILLAGE {locked ? "ACTIF" : "OFF"}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-yellow-300 text-xs font-black px-2 py-0.5 rounded-md">
                  ⏱️ {duration}s
                </div>
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <button
                onClick={handleStartBroadcast}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 font-black text-base rounded-2xl shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-wide border-2 border-yellow-200"
              >
                <Radio className="w-6 h-6 animate-pulse" />
                <span>DIFFUSER LA PUB À TOUS LES CONNECTÉS 🚀</span>
              </button>

              {isBroadcasting && (
                <button
                  onClick={handleStopBroadcast}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Square className="w-5 h-5 fill-current" />
                  <span>STOPPER LA PUBLICITÉ EN DIRECT 🛑</span>
                </button>
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </motion.div>
    </div>
  );
};
