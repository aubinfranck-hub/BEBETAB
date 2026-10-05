import React, { useEffect, useRef, useState } from "react";

/**
 * GeckoMascot — un petit geko coloré qui se balade sur l'écran.
 * Avec effet traînée magique d'étincelles colorées derrière son passage.
 *
 * Usage dans l'appli KidsLive :
 *   <GeckoMascot />
 * à placer une seule fois, en dehors du flux normal (ex: juste avant </App>).
 * Le composant est en position fixed, pointer-events-none : il ne bloque
 * jamais les clics/touch de l'appli en dessous.
 */

const GECKO_SIZE = 90; // px

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "star";
  dx: number;
  dy: number;
  duration: number;
}

const PARTICLE_COLORS = [
  "#22d3ee", // cyan
  "#34d399", // emerald
  "#fbbf24", // amber
  "#fb7185", // rose
  "#a78bfa", // purple
  "#38bdf8", // sky
  "#f43f5e", // pink
];

export const GeckoMascot: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 100, y: 200 });
  const [dir, setDir] = useState(1); // 1 = droite, -1 = gauche
  const [walking, setWalking] = useState(true);
  const [blink, setBlink] = useState(false);
  const [particles, setParticles] = useState<TrailParticle[]>([]);

  const target = useRef({ x: 100, y: 200 });
  const lastParticleTime = useRef(0);
  const particleIdCounter = useRef(0);
  const speed = 55; // px/seconde

  // Choisit une nouvelle destination aléatoire à l'écran
  const pickNewTarget = () => {
    const margin = GECKO_SIZE;
    const maxX = window.innerWidth - margin;
    const maxY = window.innerHeight - margin;
    target.current = {
      x: Math.max(margin, Math.random() * maxX),
      y: Math.max(margin, Math.random() * maxY),
    };
  };

  useEffect(() => {
    pickNewTarget();
    let raf: number;
    let last = performance.now();
    let pauseUntil = 0;

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      setPos((prev) => {
        if (now < pauseUntil) {
          setWalking(false);
          return prev;
        }
        const dx = target.current.x - prev.x;
        const dy = target.current.y - prev.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 4) {
          // Arrivé : petite pause puis nouvelle destination
          pauseUntil = now + 800 + Math.random() * 1500;
          setWalking(false);
          pickNewTarget();
          return prev;
        }

        setWalking(true);
        const currentDir = dx >= 0 ? 1 : -1;
        setDir(currentDir);
        const move = speed * dt;
        const ratio = Math.min(move / dist, 1);
        const nextX = prev.x + dx * ratio;
        const nextY = prev.y + dy * ratio;

        // Spawn magical trail particles behind the gecko's tail
        if (now - lastParticleTime.current > 75) {
          lastParticleTime.current = now;
          // Rear offset according to direction
          const tailOffsetX = currentDir === 1 ? 10 : GECKO_SIZE - 10;
          const tailOffsetY = GECKO_SIZE * 0.35;

          const pX = nextX + tailOffsetX + (Math.random() * 8 - 4);
          const pY = nextY + tailOffsetY + (Math.random() * 8 - 4);
          const pSize = Math.floor(Math.random() * 6) + 4; // 4 - 10px
          const pColor = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
          const pShape = Math.random() > 0.4 ? "star" : "circle";
          const pDx = (Math.random() - 0.5) * 24;
          const pDy = -12 - Math.random() * 20; // float gently upwards
          const pDuration = 700 + Math.random() * 300;
          const newId = ++particleIdCounter.current;

          setParticles((prevP) => [
            ...prevP.slice(-30), // keep max 30 active particles
            {
              id: newId,
              x: pX,
              y: pY,
              size: pSize,
              color: pColor,
              shape: pShape,
              dx: pDx,
              dy: pDy,
              duration: pDuration,
            },
          ]);
        }

        return {
          x: nextX,
          y: nextY,
        };
      });

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Clignement d'yeux occasionnel
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 2500 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);

  const removeParticle = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes gecko-leg-front {
          0%, 100% { transform: rotate(-18deg); }
          50% { transform: rotate(18deg); }
        }
        @keyframes gecko-leg-back {
          0%, 100% { transform: rotate(18deg); }
          50% { transform: rotate(-18deg); }
        }
        @keyframes gecko-tail-sway {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(12deg); }
        }
        @keyframes gecko-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes trail-float {
          0% {
            opacity: 0.9;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--p-dx), var(--p-dy)) scale(0.2) rotate(90deg);
          }
        }
        .gecko-leg-fl { transform-origin: top center; animation: gecko-leg-front 0.35s ease-in-out infinite; }
        .gecko-leg-bl { transform-origin: top center; animation: gecko-leg-back 0.35s ease-in-out infinite; }
        .gecko-leg-fr { transform-origin: top center; animation: gecko-leg-back 0.35s ease-in-out infinite; }
        .gecko-leg-br { transform-origin: top center; animation: gecko-leg-front 0.35s ease-in-out infinite; }
        .gecko-tail { transform-origin: right center; animation: gecko-tail-sway 0.6s ease-in-out infinite; }
        .gecko-body-bob { animation: gecko-bob 0.35s ease-in-out infinite; }
        .gecko-particle {
          position: absolute;
          animation: trail-float var(--p-duration) ease-out forwards;
        }
      `}</style>

      {/* Magical Dust Trail Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="gecko-particle"
          onAnimationEnd={() => removeParticle(p.id)}
          style={
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              "--p-dx": `${p.dx}px`,
              "--p-dy": `${p.dy}px`,
              "--p-duration": `${p.duration}ms`,
            } as React.CSSProperties
          }
        >
          {p.shape === "star" ? (
            <svg viewBox="0 0 24 24" width="100%" height="100%" fill={p.color}>
              <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41Z" />
            </svg>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}`,
              }}
            />
          )}
        </div>
      ))}

      {/* Gecko Character */}
      <div
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width: GECKO_SIZE,
          height: GECKO_SIZE * 0.6,
          transform: `scaleX(${dir})`,
          transition: "transform 0.15s ease",
        }}
      >
        <div className={walking ? "gecko-body-bob" : ""} style={{ width: "100%", height: "100%" }}>
          <svg
            viewBox="0 0 200 120"
            width="100%"
            height="100%"
            style={{ display: "block", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.25))" }}
          >
            <defs>
              <linearGradient id="geckoBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="45%" stopColor="#34d399" />
                <stop offset="75%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
              <linearGradient id="geckoBelly" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef9c3" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>

            {/* Queue */}
            <path
              className="gecko-leg-fl gecko-tail"
              d="M170,70 Q195,55 198,30 Q199,20 190,22 Q192,40 178,55 Q168,62 160,70 Z"
              fill="url(#geckoBody)"
            />

            {/* Pattes arrière */}
            <g className="gecko-leg-br" style={{ transformOrigin: "150px 78px" }}>
              <path d="M150,78 L162,100 L172,98 L158,76 Z" fill="url(#geckoBody)" />
            </g>
            <g className="gecko-leg-bl" style={{ transformOrigin: "140px 78px" }}>
              <path d="M140,78 L150,102 L160,99 L148,76 Z" fill="url(#geckoBody)" opacity="0.9" />
            </g>

            {/* Pattes avant */}
            <g className="gecko-leg-fr" style={{ transformOrigin: "60px 80px" }}>
              <path d="M60,80 L48,102 L38,98 L54,78 Z" fill="url(#geckoBody)" />
            </g>
            <g className="gecko-leg-fl" style={{ transformOrigin: "50px 80px" }}>
              <path d="M50,80 L38,104 L28,100 L44,78 Z" fill="url(#geckoBody)" opacity="0.9" />
            </g>

            {/* Corps */}
            <ellipse cx="105" cy="65" rx="70" ry="30" fill="url(#geckoBody)" />
            {/* Ventre */}
            <ellipse cx="105" cy="80" rx="50" ry="14" fill="url(#geckoBelly)" opacity="0.8" />

            {/* Motifs colorés sur le dos */}
            <circle cx="90" cy="50" r="6" fill="#fb7185" opacity="0.85" />
            <circle cx="115" cy="48" r="5" fill="#a78bfa" opacity="0.85" />
            <circle cx="135" cy="55" r="5.5" fill="#facc15" opacity="0.85" />
            <circle cx="70" cy="58" r="4.5" fill="#38bdf8" opacity="0.85" />

            {/* Tête */}
            <ellipse cx="38" cy="55" rx="30" ry="24" fill="url(#geckoBody)" />

            {/* Yeux */}
            <g>
              <ellipse cx="28" cy="45" rx="10" ry={blink ? 1 : 10} fill="white" />
              <ellipse cx="28" cy="45" rx="10" ry={blink ? 1 : 10} fill="none" stroke="#0f172a" strokeWidth="1.5" />
              {!blink && <circle cx="30" cy="45" r="5" fill="#0f172a" />}
              {!blink && <circle cx="32" cy="43" r="1.6" fill="white" />}
            </g>
            <g>
              <ellipse cx="50" cy="42" rx="9" ry={blink ? 1 : 9} fill="white" />
              <ellipse cx="50" cy="42" rx="9" ry={blink ? 1 : 9} fill="none" stroke="#0f172a" strokeWidth="1.5" />
              {!blink && <circle cx="52" cy="42" r="4.5" fill="#0f172a" />}
              {!blink && <circle cx="53.5" cy="40.5" r="1.4" fill="white" />}
            </g>

            {/* Sourire */}
            <path d="M15,62 Q28,72 42,63" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GeckoMascot;
