import React, { useState } from "react";
import { UserProfile, AgeGroup } from "../../types";
import { soundFx } from "../../utils/audio";
import {
  Lock,
  Unlock,
  Clock,
  BarChart3,
  UserCheck,
  ShieldAlert,
  X,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

interface ParentsPortalProps {
  user: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onClose: () => void;
  onOpenAdminAdDashboard?: () => void;
}

export const ParentsPortal: React.FC<ParentsPortalProps> = ({
  user,
  onUpdateProfile,
  onClose,
  onOpenAdminAdDashboard,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Question « pour adultes » tirée au hasard à chaque ouverture et après chaque erreur.
  // (Barrière de confort côté navigateur : elle ne remplace pas une vraie authentification.)
  const newChallenge = () => {
    const a = 12 + Math.floor(Math.random() * 8); // 12 à 19
    const b = 3 + Math.floor(Math.random() * 7); // 3 à 9
    return { a, b, answer: String(a * b) };
  };
  const [challenge, setChallenge] = useState(newChallenge);
  const [failures, setFailures] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  // Compte à rebours du blocage (3 erreurs = 30 secondes d'attente).
  React.useEffect(() => {
    if (lockedUntil <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [lockedUntil]);
  const secondsLeft = Math.max(0, Math.ceil((lockedUntil - now) / 1000));

  const handlePinSubmit = () => {
    if (secondsLeft > 0) return;
    if (pinInput.trim() === challenge.answer) {
      soundFx.playVictory();
      setIsUnlocked(true);
      setPinError(false);
      setFailures(0);
    } else {
      soundFx.playTap();
      setPinError(true);
      setPinInput("");
      setChallenge(newChallenge());
      const next = failures + 1;
      if (next >= 3) {
        setFailures(0);
        setNow(Date.now());
        setLockedUntil(Date.now() + 30_000);
      } else {
        setFailures(next);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-rose-300 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* --- SECURITY LOCK GATE --- */}
        {!isUnlocked ? (
          <div className="text-center space-y-6 py-6">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-rose-200">
              <Lock className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Espace Contrôle Parental
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                Résolvez ce calcul pour vérifier que vous êtes un adulte :
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 max-w-xs mx-auto space-y-4">
              <span className="text-3xl font-black text-slate-800 tracking-wider">
                {challenge.a} × {challenge.b} = ?
              </span>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                disabled={secondsLeft > 0}
                placeholder="Votre réponse"
                className="w-full text-center text-xl font-black p-3 bg-white border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-rose-200 focus:outline-none disabled:opacity-50"
              />

              {pinError && secondsLeft === 0 && (
                <p className="text-xs font-bold text-rose-600">
                  Réponse incorrecte. Une nouvelle question vous est proposée.
                </p>
              )}
              {secondsLeft > 0 && (
                <p className="text-xs font-bold text-rose-600">
                  Trop d'erreurs. Réessayez dans {secondsLeft} s.
                </p>
              )}

              <button
                onClick={handlePinSubmit}
                disabled={secondsLeft > 0}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-black rounded-xl shadow-md transition-all active:scale-95"
              >
                Déverrouiller l'espace parents
              </button>
            </div>
          </div>
        ) : (
          /* --- PARENTAL PORTAL SETTINGS & STATS --- */
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                <Unlock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Tableau de Bord Parents
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Paramètres de sécurité, temps d'écran et rapport d'apprentissage.
                </p>
              </div>
            </div>

            {/* Profile Age Switcher */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" /> Tranche d'Âge de l'Enfant
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {(["2-4", "5-7", "8-10"] as AgeGroup[]).map((age) => (
                  <button
                    key={age}
                    onClick={() => onUpdateProfile({ ageGroup: age })}
                    className={`py-3 rounded-xl font-black text-xs border-2 transition-all ${
                      user.ageGroup === age
                        ? "bg-purple-600 text-white border-purple-700 shadow"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {age} ans
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Time Limit Setup */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> Limite de Temps d'Écran
              </h3>
              <p className="text-xs text-slate-500">
                Temps d'utilisation quotidien maximal avant blocage bienveillant.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "Illimité", value: 0 },
                  { label: "15 min", value: 15 },
                  { label: "30 min", value: 30 },
                  { label: "60 min", value: 60 },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      onUpdateProfile({ screenTimeLimitMinutes: item.value })
                    }
                    className={`py-2.5 rounded-xl font-extrabold text-xs border-2 transition-all ${
                      user.screenTimeLimitMinutes === item.value
                        ? "bg-amber-500 text-white border-amber-600 shadow"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200/80">
                <button
                  onClick={() => {
                    soundFx.playTap();
                    onUpdateProfile({ isLockedByTime: !user.isLockedByTime });
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                    user.isLockedByTime
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {user.isLockedByTime
                    ? "☀️ Déverrouiller & Réveiller Fanti"
                    : "🌙 Simuler le Sommeil de Fanti (Limite temps d'écran)"}
                </button>
              </div>
            </div>

            {/* Activity Stats & Progress Report */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" /> Statistiques d'Apprentissage
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Points XP
                  </span>
                  <span className="text-2xl font-black text-purple-600">
                    {user.xp} XP
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Étoiles Gagnées
                  </span>
                  <span className="text-2xl font-black text-amber-500">
                    {user.stars} ⭐
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-400 font-bold uppercase block">
                    Mondes Débloqués
                  </span>
                  <span className="text-2xl font-black text-emerald-600">
                    {user.unlockedWorlds.length} / 8
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Ad Broadcast Dashboard Launcher Button */}
            {onOpenAdminAdDashboard && (
              <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 p-5 rounded-2xl border-2 border-amber-400/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-amber-600" />
                      Régie Publicitaire Live (Dashboard Admin)
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Diffuser une photo/vidéo en direct à tous les utilisateurs connectés avec verrouillage strict d'écran.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminAdDashboard();
                  }}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-sm rounded-xl shadow-lg border border-amber-300 transition-all active:scale-95"
                >
                  Ouvrir le Dashboard Régie Pub 📺
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 text-white font-black rounded-xl shadow-md text-sm active:scale-95"
            >
              Enregistrer & Quitter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
