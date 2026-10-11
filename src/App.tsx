import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserProfile, ActiveScreen, WorldTheme, MascotOutfit } from "./types";
import { HomeLauncher } from "./components/HomeLauncher";
import { LearningModule } from "./components/learning/LearningModule";
import { GamesModule } from "./components/games/GamesModule";
import { DrawingModule } from "./components/drawing/DrawingModule";
import { MusicModule } from "./components/music/MusicModule";
import { StoriesModule } from "./components/stories/StoriesModule";
import { QuizModule } from "./components/quiz/QuizModule";
import { RewardsModule } from "./components/rewards/RewardsModule";
import { WorldsModule } from "./components/worlds/WorldsModule";
import { WorldExplorerModule } from "./components/worlds/WorldExplorerModule";
import { LiveWorldModule } from "./components/worlds/LiveWorldModule";
import { VideosModule } from "./components/videos/VideosModule";
import { DailyChallengesModule } from "./components/defis/DailyChallengesModule";
import { ParentsPortal } from "./components/parents/ParentsPortal";
import { FantiChatModal, MascotFanti } from "./components/MascotFanti";
import { AdBroadcastOverlay } from "./components/ads/AdBroadcastOverlay";
import { AdminAdDashboard } from "./components/ads/AdminAdDashboard";
import { GeckoMascot } from "./components/GeckoMascot";
import { soundFx } from "./utils/audio";
import { PremiumModal } from "./components/PremiumModal";
import { BebeTabFrame } from "./components/BebeTabFrame";
import { ReferenceScreens } from "./components/ReferenceScreens";
import { CountryModule } from "./components/CountryModule";

export default function App() {
  // User Profile State with local persistence
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("bebe_tab_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: "Petit Champion",
      ageGroup: "5-7",
      xp: 120,
      level: 1,
      stars: 15,
      diamonds: 5,
      unlockedWorlds: [
        "Jungle",
        "Océan",
        "Espace",
        "Dinosaures",
        "Savane",
        "Royaume Magique",
        "Ville",
        "Ferme",
      ],
      currentWorld: "Jungle",
      unlockedOutfits: ["Explorateur"],
      currentOutfit: "Explorateur",
      totalTimeMinutes: 5,
      screenTimeLimitMinutes: 0, // Unlimited default
      isLockedByTime: false,
      language: "fr",
      plan: "free",
      badges: [
        {
          id: "b1",
          title: "Premier Quiz",
          description: "A répondu à sa première question !",
          icon: "🧩",
          unlocked: true,
        },
        {
          id: "b2",
          title: "Artiste en Herbe",
          description: "A créé un super dessin magique !",
          icon: "🎨",
          unlocked: true,
        },
        {
          id: "b3",
          title: "Mélomane",
          description: "A joué du piano et chanté !",
          icon: "🎵",
          unlocked: true,
        },
        {
          id: "b4",
          title: "Grand Conteur",
          description: "A écouté une histoire complète !",
          icon: "📖",
          unlocked: false,
        },
        {
          id: "b5",
          title: "Génie des Maths",
          description: "A réussi 10 calculs rapides !",
          icon: "🔢",
          unlocked: false,
        },
        {
          id: "b6",
          title: "Voyageur des Mondes",
          description: "A visité tous les mondes !",
          icon: "🌍",
          unlocked: false,
        },
      ],
    };
  });

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("home");
  const [isParentsOpen, setIsParentsOpen] = useState(false);
  const [isFantiChatOpen, setIsFantiChatOpen] = useState(false);
  const [isAdminAdDashboardOpen, setIsAdminAdDashboardOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("bebe_tab_user", JSON.stringify(user));
  }, [user]);

  // Screen time limit counter
  useEffect(() => {
    const timer = setInterval(() => {
      setUser((prev) => {
        const nextMins = prev.totalTimeMinutes + 1;
        const shouldLock =
          prev.screenTimeLimitMinutes > 0 &&
          nextMins >= prev.screenTimeLimitMinutes;
        return {
          ...prev,
          totalTimeMinutes: nextMins,
          isLockedByTime: shouldLock,
        };
      });
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  // Award XP and Stars Helper
  const handleAwardXP = (gainedXP: number, gainedStars: number) => {
    setUser((prev) => {
      const newXP = prev.xp + gainedXP;
      const newStars = prev.stars + gainedStars;
      const newLevel = Math.floor(newXP / 100) + 1;
      return {
        ...prev,
        xp: newXP,
        stars: newStars,
        level: newLevel,
      };
    });
  };

  // Dynamic Theme Gradients per World
  const worldGradients: Record<WorldTheme, string> = {
    Jungle: "from-emerald-400 via-teal-300 to-amber-200",
    Océan: "from-sky-400 via-cyan-300 to-blue-200",
    Espace: "from-indigo-950 via-purple-900 to-slate-900 text-white",
    Dinosaures: "from-amber-400 via-orange-300 to-yellow-200",
    Savane: "from-yellow-300 via-amber-200 to-orange-200",
    "Royaume Magique": "from-purple-400 via-pink-300 to-indigo-200",
    Ville: "from-rose-400 via-red-300 to-orange-200",
    Ferme: "from-lime-400 via-emerald-300 to-teal-200",
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${worldGradients[user.currentWorld]} font-sans transition-colors duration-700 flex flex-col justify-between select-none pb-12`}
    >
      {/* Screen Time Rest Screen with Fade-to-Black Night Animation */}
      {user.isLockedByTime ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6 overflow-hidden select-none"
        >
          {/* Night Sky Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-90">
            {/* Glowing Crescent Moon */}
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 right-10 text-6xl sm:text-7xl drop-shadow-[0_0_30px_rgba(253,224,71,0.7)]"
            >
              🌙
            </motion.div>

            {/* Twinkling Night Stars */}
            {[
              { top: "12%", left: "10%", delay: 0 },
              { top: "22%", left: "32%", delay: 0.5 },
              { top: "15%", left: "65%", delay: 1 },
              { top: "32%", left: "82%", delay: 1.5 },
              { top: "65%", left: "12%", delay: 0.8 },
              { top: "78%", left: "75%", delay: 1.2 },
              { top: "82%", left: "30%", delay: 0.3 },
              { top: "45%", left: "8%", delay: 1.8 },
            ].map((star, idx) => (
              <motion.div
                key={idx}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.2, 0.7] }}
                transition={{ repeat: Infinity, duration: 2.8, delay: star.delay }}
                style={{ top: star.top, left: star.left }}
                className="absolute text-yellow-200 text-xl sm:text-2xl drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
              >
                ✨
              </motion.div>
            ))}

            {/* Subtle Gradient Glow at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-indigo-950/90 via-purple-950/40 to-transparent" />
          </div>

          {/* Sleeping Mascot with Bonnet & ZZZ */}
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="z-10 relative"
          >
            <MascotFanti
              size="xl"
              isSleeping={true}
              mood="sleeping"
              interactive={true}
              speechBubble="Zzz... Fanti fait de doux rêves ! 💤"
            />
          </motion.div>

          {/* Night Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="bg-slate-900/90 backdrop-blur-2xl border-2 border-indigo-500/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.3)] max-w-md space-y-4 z-10"
          >
            <div className="inline-block px-4 py-1.5 bg-indigo-950/80 text-indigo-300 rounded-full text-xs font-black uppercase tracking-wider border border-indigo-500/40 shadow">
              🌙 Pause Temps d'Écran
            </div>

            <h2 className="text-3xl font-black text-yellow-300 drop-shadow">
              C'est l'heure de se reposer ! 🐘💤
            </h2>

            <p className="text-sm font-semibold text-slate-300 leading-relaxed">
              Tu as super bien travaillé aujourd'hui ! Fanti s'est endormi pour faire de doux rêves.
              Ferme les yeux, repose-toi et à bientôt pour de nouvelles découvertes ! 🌟
            </p>

            <button
              onClick={() => setIsParentsOpen(true)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl border border-white/20 active:scale-95 transition-all"
            >
              🔓 Déverrouiller (Espace Parents)
            </button>
          </motion.div>
        </motion.div>
      ) : (
        /* Main Application Router */
        <main className="flex-1 w-full">
          {activeScreen === "home" ? (
            <HomeLauncher
              user={user}
              onNavigate={(screen) => setActiveScreen(screen)}
              onOpenFantiChat={() => setIsFantiChatOpen(true)}
              onOpenParents={() => setIsParentsOpen(true)}
              onOpenPremium={() => setIsPremiumOpen(true)}
            />
          ) : (
            <ReferenceScreens
              screen={activeScreen}
              user={user}
              onBack={() => setActiveScreen("home")}
              onParents={() => setIsParentsOpen(true)}
              onPremium={() => setIsPremiumOpen(true)}
              onNavigate={(screen) => setActiveScreen(screen)}
              onAwardXP={handleAwardXP}
            />
          )}
        </main>
      )}

      {/* Fanti AI Chat Voice Dialog Modal */}
      <FantiChatModal
        isOpen={isFantiChatOpen}
        onClose={() => setIsFantiChatOpen(false)}
        ageGroup={user.ageGroup}
        currentWorld={user.currentWorld}
      />

      <PremiumModal isOpen={isPremiumOpen} plan={user.plan} onClose={() => setIsPremiumOpen(false)} onChoosePlan={(plan) => setUser((prev) => ({ ...prev, plan }))} />

      {/* Parents Control Portal Modal */}
      {isParentsOpen && (
        <ParentsPortal
          user={user}
          onUpdateProfile={(updates) => setUser((prev) => ({ ...prev, ...updates }))}
          onClose={() => setIsParentsOpen(false)}
          onOpenAdminAdDashboard={() => setIsAdminAdDashboardOpen(true)}
        />
      )}

      {/* Admin Ad Broadcast Dashboard Modal */}
      {isAdminAdDashboardOpen && (
        <AdminAdDashboard onClose={() => setIsAdminAdDashboardOpen(false)} />
      )}

      {/* Mandatory Broadcast Ad Overlay for connected clients */}
      {user.plan === "free" && <AdBroadcastOverlay
        onRewardUser={(_stars) => {
          setUser((prev) => ({
            ...prev,
            stars: prev.stars + 10,
            xp: prev.xp + 50,
          }));
        }}
      />}

      {/* Animated Gecko Mascot */}
      <GeckoMascot />
    </div>
  );
}
