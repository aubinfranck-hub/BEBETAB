import React from "react";
import { UserProfile, MascotOutfit } from "../../types";
import { MascotFanti } from "../MascotFanti";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import { ArrowLeft, Trophy, Star, Gem, CheckCircle2, Lock } from "lucide-react";

interface RewardsModuleProps {
  user: UserProfile;
  onEquipOutfit: (outfit: MascotOutfit) => void;
  onUnlockOutfit: (outfit: MascotOutfit, costStars: number) => void;
  onBack: () => void;
}

export const RewardsModule: React.FC<RewardsModuleProps> = ({
  user,
  onEquipOutfit,
  onUnlockOutfit,
  onBack,
}) => {
  const outfitsList: {
    name: MascotOutfit;
    emoji: string;
    costStars: number;
    description: string;
  }[] = [
    { name: "Explorateur", emoji: "🤠", costStars: 0, description: "Tenue d'aventurier pour visiter la jungle !" },
    { name: "Astronaute", emoji: "👨‍🚀", costStars: 10, description: "Casque et combinaison spatiale !" },
    { name: "Artiste", emoji: "🎨", costStars: 15, description: "Béret rose et palette de peinture !" },
    { name: "Chef", emoji: "🧑‍🍳", costStars: 20, description: "Toque de grand chef cuisinier !" },
    { name: "Magicien", emoji: "🧙‍♂️", costStars: 25, description: "Chapeau pointu et étoiles dorées !" },
    { name: "Super-Héros", emoji: "🦸‍♂️", costStars: 30, description: "Cape rouge et masque volant !" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-yellow-300">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-transform active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🏆</span> Salle des Trophées & Dressing de Fanti
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Echange tes étoiles ⭐ contre de superbes tenues pour Fanti !
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-300 font-black text-amber-900 text-sm">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span>Étoiles disponibles : {user.stars}</span>
        </div>
      </div>

      {/* Dressing Room & Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mascot Live Preview */}
        <div className="bg-gradient-to-b from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl border-4 border-white flex flex-col items-center justify-center text-center gap-4">
          <span className="text-xs font-black uppercase text-yellow-300 tracking-widest">
            Aperçu de Fanti
          </span>
          <MascotFanti size="xl" outfit={user.currentOutfit} interactive={false} />
          <h3 className="text-2xl font-black text-yellow-300">
            Fanti {user.currentOutfit}
          </h3>
        </div>

        {/* Outfits List */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outfitsList.map((out) => {
            const isUnlocked = user.unlockedOutfits.includes(out.name);
            const isEquipped = user.currentOutfit === out.name;

            return (
              <div
                key={out.name}
                className={`bg-white rounded-3xl p-5 shadow-lg border-4 flex flex-col justify-between gap-3 ${
                  isEquipped ? "border-amber-400 ring-4 ring-yellow-200" : "border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{out.emoji}</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-lg">
                      {out.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {out.description}
                    </p>
                  </div>
                </div>

                {isUnlocked ? (
                  <button
                    onClick={() => {
                      soundFx.playVictory();
                      onEquipOutfit(out.name);
                      speakText(`Fanti met sa tenue de ${out.name} !`);
                    }}
                    disabled={isEquipped}
                    className={`w-full py-2.5 font-black text-xs rounded-2xl shadow flex items-center justify-center gap-1 active:scale-95 transition-all ${
                      isEquipped
                        ? "bg-emerald-500 text-white"
                        : "bg-amber-400 hover:bg-yellow-300 text-slate-900"
                    }`}
                  >
                    {isEquipped ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Équipé
                      </>
                    ) : (
                      "Porter cette tenue"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (user.stars >= out.costStars) {
                        soundFx.playVictory();
                        confetti({ particleCount: 80 });
                        onUnlockOutfit(out.name, out.costStars);
                        speakText(`Bravo ! Tu as débloqué la tenue de ${out.name} !`);
                      } else {
                        soundFx.playTap();
                        speakText(`Il te manque des étoiles ! Gagne encore ${out.costStars - user.stars} étoiles !`);
                      }
                    }}
                    className={`w-full py-2.5 font-black text-xs rounded-2xl shadow flex items-center justify-center gap-1 active:scale-95 transition-all ${
                      user.stars >= out.costStars
                        ? "bg-purple-600 hover:bg-purple-500 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    <Lock className="w-4 h-4" /> Débloquer ({out.costStars} ⭐)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-4 border-amber-200 space-y-4">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" /> Tes Badges d'Apprentissage
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {user.badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl p-4 text-center border-2 flex flex-col items-center gap-2 shadow-sm ${
                b.unlocked
                  ? "bg-amber-50 border-amber-300 text-slate-900"
                  : "bg-slate-100 border-slate-200 text-slate-400 opacity-60"
              }`}
            >
              <span className="text-4xl">{b.icon}</span>
              <h4 className="font-extrabold text-xs">{b.title}</h4>
              <p className="text-[10px] font-medium leading-tight">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
