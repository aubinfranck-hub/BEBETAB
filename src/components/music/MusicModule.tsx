import React, { useState } from "react";
import { UserProfile } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import { ArrowLeft, Music, Volume2, Play, Pause, Sparkles } from "lucide-react";

interface MusicModuleProps {
  user: UserProfile;
  onAwardXP: (xp: number, stars: number) => void;
  onBack: () => void;
}

export const MusicModule: React.FC<MusicModuleProps> = ({
  user,
  onAwardXP,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    "piano" | "xylophone" | "drums" | "karaoke"
  >("piano");

  // Piano Notes (C4 to C5)
  const pianoKeys = [
    { note: "DO", freq: 261.63, key: "C", color: "bg-red-500" },
    { note: "RÉ", freq: 293.66, key: "D", color: "bg-orange-500" },
    { note: "MI", freq: 329.63, key: "E", color: "bg-yellow-400" },
    { note: "FA", freq: 349.23, key: "F", color: "bg-emerald-500" },
    { note: "SOL", freq: 392.0, key: "G", color: "bg-cyan-500" },
    { note: "LA", freq: 440.0, key: "A", color: "bg-blue-500" },
    { note: "SI", freq: 493.88, key: "B", color: "bg-purple-500" },
    { note: "DO 2", freq: 523.25, key: "C2", color: "bg-pink-500" },
  ];

  // Karaoke Songs
  const songs = [
    {
      id: "crocodiles",
      title: "Ah les crocodiles 🐊",
      lyrics: "Un crocodile, s'en allant à la guerre, Disait au revoir à ses petits enfants...",
      melody: [261, 293, 329, 349, 392, 440, 523],
    },
    {
      id: "souris",
      title: "Une souris verte 🐭",
      lyrics: "Une souris verte, qui courait dans l'herbe, Je l'attrape par la queue...",
      melody: [329, 349, 392, 440, 392, 349, 329],
    },
    {
      id: "lune",
      title: "Au clair de la lune 🌕",
      lyrics: "Au clair de la lune, mon ami Pierrot, Prête-moi ta plume pour écrire un mot...",
      melody: [261, 261, 261, 293, 329, 293, 261],
    },
  ];

  const [activeSong, setActiveSong] = useState(songs[0]);
  const [isPlayingSong, setIsPlayingSong] = useState(false);

  const playSongMelody = (song: typeof songs[0]) => {
    setActiveSong(song);
    setIsPlayingSong(true);
    speakText(`Comptine : ${song.title}. ${song.lyrics}`, "fr-FR", () => {
      setIsPlayingSong(false);
    });

    song.melody.forEach((freq, idx) => {
      setTimeout(() => {
        soundFx.playPianoNote(freq);
      }, idx * 400);
    });
    onAwardXP(15, 2);
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
              <span>🎵</span> Studio de Musique & Comptines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Joue du piano, du xylophone, de la batterie et chante les comptines !
            </p>
          </div>
        </div>
      </div>

      {/* Instrument Mode Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "piano", label: "Piano 🎹" },
          { id: "xylophone", label: "Xylophone 🎼" },
          { id: "drums", label: "Batterie 🥁" },
          { id: "karaoke", label: "Comptines & Karaoke 🎤" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              soundFx.playTap();
              setActiveTab(tab.id as any);
            }}
            className={`px-5 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all shadow-md border-2 ${
              activeTab === tab.id
                ? "bg-purple-600 text-white border-white scale-105"
                : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- PIANO --- */}
      {activeTab === "piano" && (
        <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border-4 border-yellow-300 flex flex-col items-center gap-6">
          <h3 className="text-2xl font-black text-yellow-300">
            Piano Lumineux
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 w-full h-64">
            {pianoKeys.map((k, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playPianoNote(k.freq);
                  onAwardXP(2, 1);
                }}
                className="bg-white hover:bg-yellow-100 active:bg-yellow-300 rounded-2xl p-3 flex flex-col justify-between items-center shadow-lg border-b-8 border-slate-300 active:border-b-2 active:translate-y-1 transition-all"
              >
                <div className={`w-4 h-4 rounded-full ${k.color}`} />
                <span className="font-black text-xl text-slate-900">
                  {k.note}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {k.key}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- XYLOPHONE --- */}
      {activeTab === "xylophone" && (
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-4 border-purple-200 flex flex-col items-center gap-6">
          <h3 className="text-2xl font-black text-slate-800">
            Xylophone Coloré
          </h3>
          <div className="flex items-center justify-center gap-3 w-full h-64 px-4">
            {pianoKeys.map((k, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playXylophoneNote(k.freq);
                  onAwardXP(2, 1);
                }}
                style={{ height: `${100 - idx * 8}%` }}
                className={`w-12 sm:w-16 ${k.color} text-white font-black text-lg rounded-2xl shadow-xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all border-4 border-white`}
              >
                {k.note}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- DRUMS --- */}
      {activeTab === "drums" && (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 shadow-2xl border-4 border-white flex flex-col items-center gap-6 text-white">
          <h3 className="text-2xl font-black text-yellow-300">Batterie</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-2xl">
            <button
              onClick={() => {
                soundFx.playDrum("kick");
                onAwardXP(2, 1);
              }}
              className="aspect-square bg-red-500 hover:bg-red-400 active:scale-95 rounded-3xl font-black text-xl shadow-2xl border-4 border-white flex flex-col items-center justify-center gap-2"
            >
              <span className="text-4xl">🥁</span>
              <span>Grosse Caisse</span>
            </button>

            <button
              onClick={() => {
                soundFx.playDrum("snare");
                onAwardXP(2, 1);
              }}
              className="aspect-square bg-amber-500 hover:bg-amber-400 active:scale-95 rounded-3xl font-black text-xl shadow-2xl border-4 border-white flex flex-col items-center justify-center gap-2"
            >
              <span className="text-4xl">🪘</span>
              <span>Caisse Claire</span>
            </button>

            <button
              onClick={() => {
                soundFx.playDrum("hihat");
                onAwardXP(2, 1);
              }}
              className="aspect-square bg-yellow-400 text-slate-900 hover:bg-yellow-300 active:scale-95 rounded-3xl font-black text-xl shadow-2xl border-4 border-white flex flex-col items-center justify-center gap-2"
            >
              <span className="text-4xl">🔔</span>
              <span>Charleston</span>
            </button>

            <button
              onClick={() => {
                soundFx.playDrum("cymbal");
                onAwardXP(2, 1);
              }}
              className="aspect-square bg-purple-500 hover:bg-purple-400 active:scale-95 rounded-3xl font-black text-xl shadow-2xl border-4 border-white flex flex-col items-center justify-center gap-2"
            >
              <span className="text-4xl">✨</span>
              <span>Cymbale</span>
            </button>
          </div>
        </div>
      )}

      {/* --- KARAOKE --- */}
      {activeTab === "karaoke" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200 flex flex-col justify-between gap-4"
              >
                <div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">
                    {song.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 bg-purple-50 p-3 rounded-2xl border border-purple-100 italic">
                    "{song.lyrics}"
                  </p>
                </div>

                <button
                  onClick={() => playSongMelody(song)}
                  disabled={isPlayingSong}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Chanter la comptine</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
