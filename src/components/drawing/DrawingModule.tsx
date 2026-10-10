import React, { useRef, useState, useEffect } from "react";
import { UserProfile } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Eraser,
  Download,
  Trash2,
  Sparkles,
  Smile,
  Paintbrush,
  PenTool,
} from "lucide-react";

interface DrawingModuleProps {
  mode?: string;
  user: UserProfile;
  onAwardXP: (xp: number, stars: number) => void;
  onBack: () => void;
}

export const DrawingModule: React.FC<DrawingModuleProps> = ({
  mode = "free",
  user,
  onAwardXP,
  onBack,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState("#EF4444");
  const [lineWidth, setLineWidth] = useState(12);
  const [tool, setTool] = useState<"brush" | "glitter" | "stamp" | "eraser">(
    "brush"
  );
  const [activeStamp, setActiveStamp] = useState("🐘");
  const [isDrawing, setIsDrawing] = useState(false);

  const colors = [
    "#EF4444", // Red
    "#F97316", // Orange
    "#FACC15", // Yellow
    "#10B981", // Green
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#1E293B", // Dark
  ];

  const stamps = ["🐘", "⭐", "❤️", "👑", "🌈", "🎈", "🌸", "🚀"];

  const [guide, setGuide] = useState(mode === "numbers" ? "1" : "A");
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let previousWidth = 0, previousHeight = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const saved = document.createElement('canvas');
      saved.width = canvas.width; saved.height = canvas.height;
      saved.getContext('2d')?.drawImage(canvas, 0, 0);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, rect.width, rect.height);
      if (previousWidth) ctx.drawImage(saved,0,0,saved.width,saved.height,0,0,rect.width,rect.height);
      else if (mode === 'letters' || mode === 'numbers') {
        ctx.fillStyle='#DCE6F1';ctx.font=`900 ${Math.min(rect.width,rect.height)*.75}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(guide,rect.width/2,rect.height/2);
      } else if (mode === 'coloring' || mode === 'shapes') {
        ctx.strokeStyle='#ABC0D8';ctx.lineWidth=3;
        ctx.beginPath();ctx.arc(rect.width*.3,rect.height*.45,rect.height*.22,0,Math.PI*2);ctx.stroke();
        ctx.strokeRect(rect.width*.58,rect.height*.22,rect.height*.4,rect.height*.4);
      }
      previousWidth=rect.width;previousHeight=rect.height;
    };
    resize();const observer=new ResizeObserver(resize);observer.observe(canvas);
    return()=>observer.disconnect();
  }, [mode, guide]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === "stamp") {
      soundFx.playPop();
      ctx.font = `${lineWidth * 3}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(activeStamp, x, y);
      onAwardXP(5, 1);
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === "stamp") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = lineWidth * 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "brush") {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "glitter") {
      // Magic sparkle glitter brush
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(x, y);
      ctx.stroke();

      // Random sparkles around line
      for (let i = 0; i < 3; i++) {
        const sx = x + (Math.random() - 0.5) * 20;
        const sy = y + (Math.random() - 0.5) * 20;
        ctx.fillStyle = ["#FACC15", "#EC4899", "#3B82F6", "#FFFFFF"][
          Math.floor(Math.random() * 4)
        ];
        ctx.fillRect(sx, sy, 3, 3);
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onAwardXP(5, 1);
    }
  };

  const clearCanvas = () => {
    soundFx.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
  };

  const downloadCanvas = () => {
    soundFx.playVictory();
    confetti({ particleCount: 70 });
    speakText("Superbe dessin enregistré ! Bravo l'artiste !");

    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `Dessin_Fanti_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    onAwardXP(20, 2);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/90 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-pink-300">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-transform active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🎨</span> Atelier Dessin Magique
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Utilise les pinceaux, les paillettes et les tampons de Fanti !
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-slate-100 hover:bg-rose-100 text-rose-600 font-black text-xs rounded-2xl shadow border-2 border-rose-200 flex items-center gap-1 active:scale-95"
          >
            <Trash2 className="w-4 h-4" /> Effacer
          </button>
          <button
            onClick={downloadCanvas}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs rounded-2xl shadow-md border-2 border-white flex items-center gap-1 active:scale-95"
          >
            <Download className="w-4 h-4" /> Sauvegarder
          </button>
        </div>
      </div>

      {/* Main Drawing Canvas & Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Toolbar Left/Top */}
        <div className="w-full lg:w-64 bg-white/90 backdrop-blur rounded-3xl p-5 shadow-xl border-4 border-pink-200 space-y-5">
          {/* Tool Selector */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 block mb-2">
              Outils
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundFx.playTap();
                  setTool("brush");
                }}
                className={`p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 border-2 ${
                  tool === "brush"
                    ? "bg-pink-500 text-white border-pink-600"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <Paintbrush className="w-4 h-4" /> Pinceau
              </button>

              <button
                onClick={() => {
                  soundFx.playTap();
                  setTool("glitter");
                }}
                className={`p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 border-2 ${
                  tool === "glitter"
                    ? "bg-purple-600 text-white border-purple-700"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" /> Paillettes
              </button>

              <button
                onClick={() => {
                  soundFx.playTap();
                  setTool("stamp");
                }}
                className={`p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 border-2 ${
                  tool === "stamp"
                    ? "bg-yellow-400 text-slate-900 border-amber-500"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <Smile className="w-4 h-4" /> Tampons
              </button>

              <button
                onClick={() => {
                  soundFx.playTap();
                  setTool("eraser");
                }}
                className={`p-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 border-2 ${
                  tool === "eraser"
                    ? "bg-slate-800 text-white border-slate-900"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <Eraser className="w-4 h-4" /> Gomme
              </button>
            </div>
          </div>

          {/* Color Palette */}
          {tool !== "eraser" && tool !== "stamp" && (
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-2">
                Couleurs
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      soundFx.playTap();
                      setColor(c);
                    }}
                    style={{ backgroundColor: c }}
                    className={`w-10 h-10 rounded-full shadow border-2 transition-transform active:scale-90 ${
                      color === c ? "scale-125 border-slate-900 ring-2 ring-yellow-400" : "border-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stamps Selector */}
          {tool === "stamp" && (
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-2">
                Choisis un Tampon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {stamps.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      soundFx.playTap();
                      setActiveStamp(st);
                    }}
                    className={`p-2 text-2xl rounded-2xl border-2 flex items-center justify-center ${
                      activeStamp === st
                        ? "bg-yellow-300 border-amber-500 scale-110"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Line Thickness Slider */}
          <div>
            <label className="text-xs font-black uppercase text-slate-500 block mb-1">
              Taille du trait : {lineWidth}px
            </label>
            <input
              type="range"
              min="4"
              max="40"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>
        </div>

        {(mode === 'letters' || mode === 'numbers') && <div className="flex flex-wrap gap-2">{(mode === 'letters' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') : '0123456789'.split('')).map(value=><button key={value} onClick={()=>setGuide(value)} className="rounded-xl bg-white p-3 font-black text-blue-700">{value}</button>)}</div>}
        {/* Canvas Board */}
        <div className="flex-1 bg-white rounded-3xl p-2 shadow-2xl border-4 border-yellow-300 relative overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-[min(65vh,40rem)] touch-none cursor-crosshair rounded-2xl bg-white"
          />
        </div>
      </div>
    </div>
  );
};
