import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, PhoneCall, PhoneOff, Volume2, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { MascotFanti } from "./MascotFanti";

interface GeminiLiveVoiceProps {
  ageGroup?: string;
  currentWorld?: string;
  onClose?: () => void;
}

export const GeminiLiveVoice: React.FC<GeminiLiveVoiceProps> = ({
  ageGroup = "5-7",
  currentWorld = "Jungle",
  onClose,
}) => {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<{ sender: "user" | "lia"; text: string }[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Helper to convert Float32Array (16kHz) to 16-bit PCM Base64
  const floatTo16BitPCMBase64 = (float32Array: Float32Array): string => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Helper to decode Base64 24kHz raw PCM into Float32
  const base64ToFloat32PCM = (base64: string): Float32Array => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const dataView = new DataView(bytes.buffer);
    const float32 = new Float32Array(Math.floor(bytes.length / 2));
    for (let i = 0; i < float32.length; i++) {
      const int16 = dataView.getInt16(i * 2, true);
      float32[i] = int16 / 32768.0;
    }
    return float32;
  };

  // Play audio chunk from model (24kHz)
  const playModelAudioChunk = (base64Audio: string) => {
    if (!outputAudioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      outputAudioCtxRef.current = new AudioCtxClass({ sampleRate: 24000 });
    }
    const ctx = outputAudioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const float32Data = base64ToFloat32PCM(base64Audio);
    if (float32Data.length === 0) return;

    // Calculate level for animation
    let sum = 0;
    for (let i = 0; i < float32Data.length; i += 10) {
      sum += Math.abs(float32Data[i]);
    }
    const level = Math.min(1, (sum / (float32Data.length / 10)) * 5);
    setAudioLevel(level);

    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    const startTime = Math.max(currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + audioBuffer.duration;

    activeSourcesRef.current.push(source);
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
      if (activeSourcesRef.current.length === 0) {
        setAudioLevel(0);
      }
    };
  };

  // Stop playback on interruption
  const stopPlayback = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setAudioLevel(0);
  };

  // Start Gemini Live Call
  const startLiveSession = async () => {
    try {
      setStatus("connecting");
      setErrorMessage(null);

      // 1. Setup Microphone input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtxClass({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      // 2. Setup WebSocket connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        // Send initial greeting context
        ws.send(
          JSON.stringify({
            text: `Bonjour Lia ! L'enfant a ${ageGroup} ans et se trouve dans le monde ${currentWorld}. Dis-lui un grand bonjour magique !`,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            setErrorMessage(data.error);
            setStatus("error");
            return;
          }
          if (data.interrupted) {
            stopPlayback();
          }
          if (data.audio) {
            playModelAudioChunk(data.audio);
          }
          if (data.text) {
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === "lia") {
                return [...prev.slice(0, -1), { sender: "lia", text: last.text + data.text }];
              }
              return [...prev, { sender: "lia", text: data.text }];
            });
          }
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      ws.onerror = () => {
        setErrorMessage("Erreur de connexion WebSocket au serveur Gemini Live.");
        setStatus("error");
      };

      ws.onclose = () => {
        setStatus("disconnected");
      };

      // Handle microphone audio processing
      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && !isMuted) {
          const channelData = e.inputBuffer.getChannelData(0);
          const base64PCM = floatTo16BitPCMBase64(channelData);
          wsRef.current.send(JSON.stringify({ audio: base64PCM }));
        }
      };
    } catch (err: any) {
      console.error("Failed to access microphone or connect:", err);
      setErrorMessage(
        err.name === "NotAllowedError"
          ? "Accès au microphone refusé. Veuillez autoriser le micro."
          : "Impossible de démarrer la session Gemini Live."
      );
      setStatus("error");
    }
  };

  // Disconnect & cleanup
  const stopLiveSession = () => {
    stopPlayback();
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("disconnected");
  };

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 text-white">
      {/* Visual Live Container */}
      <div className="w-full max-w-md bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 border-4 border-yellow-300 shadow-2xl flex flex-col items-center relative overflow-hidden">
        {/* Glowing Ambient Background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse pointer-events-none"
          style={{ opacity: status === "connected" ? 0.8 : 0.2 }}
        />

        {/* Live Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 text-white rounded-full text-xs font-black tracking-wider uppercase mb-4 shadow-lg animate-bounce">
          <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          <span>Gemini Live 🎙️ Voice Realtime</span>
        </div>

        {/* Mascot Character with Audio Ring Wave */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Glowing Voice Ring */}
          <motion.div
            animate={{
              scale: status === "connected" ? [1, 1.15 + audioLevel * 0.4, 1] : 1,
              opacity: status === "connected" ? [0.4, 0.8, 0.4] : 0.2,
            }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 blur-xl"
          />

          <MascotFanti size="lg" interactive={false} primaryColor="#EC4899" />
        </div>

        <h3 className="text-2xl font-black text-yellow-300 drop-shadow mb-1">
          Appel Vocal avec Lia (Fanti)
        </h3>
        <p className="text-xs text-blue-200 font-bold mb-4 text-center">
          Parle directement à Lia ! Elle t'écoute et te répond en direct par la voix.
        </p>

        {/* Status Indicators */}
        {status === "connecting" && (
          <div className="flex items-center gap-2 text-yellow-300 font-extrabold text-sm mb-4 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" /> Connexion vocale Gemini Live en cours...
          </div>
        )}

        {status === "error" && (
          <div className="w-full p-3 bg-red-500/30 border border-red-400/50 rounded-2xl text-red-200 text-xs font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-300" />
            <span>{errorMessage || "Erreur de connexion au service vocal."}</span>
          </div>
        )}

        {/* Live Transcripts Box */}
        <div className="w-full max-h-36 overflow-y-auto bg-black/40 backdrop-blur rounded-2xl p-3 my-2 border border-white/10 text-xs space-y-2">
          {transcripts.length === 0 ? (
            <p className="text-slate-400 italic text-center py-2">
              {status === "connected"
                ? "🎙️ Lia t'écoute ! Dis-lui 'Coucou Lia !'"
                : "Appuie sur le bouton vert ci-dessous pour démarrer l'appel vocal."}
            </p>
          ) : (
            transcripts.slice(-3).map((t, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl ${
                  t.sender === "lia" ? "bg-purple-600/50 text-yellow-200" : "bg-blue-600/50 text-white"
                }`}
              >
                <span className="font-extrabold mr-1">
                  {t.sender === "lia" ? "🐘 Lia:" : "👶 Toi:"}
                </span>
                <span>{t.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center gap-3 mt-4 w-full justify-center">
          {status === "connected" ? (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center transition-all ${
                  isMuted ? "bg-amber-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                }`}
                title={isMuted ? "Activer le micro" : "Couper le micro"}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6 animate-pulse" />}
              </button>

              <button
                onClick={stopLiveSession}
                className="px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 active:scale-95 transition-transform text-sm"
              >
                <PhoneOff className="w-5 h-5" />
                <span>Raccrocher</span>
              </button>
            </>
          ) : (
            <button
              onClick={startLiveSession}
              disabled={status === "connecting"}
              className="px-8 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-slate-900 font-black rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 active:scale-95 transition-transform text-base disabled:opacity-50"
            >
              <PhoneCall className="w-6 h-6 text-slate-900" />
              <span>Démarrer l'Appel Vocal 🎙️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
