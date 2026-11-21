import React, { useEffect, useState } from "react";

// Bandeau du bas de l'écran : pubs et projets de l'équipe, défilants.
interface TickerItem { id: string; text: string; link?: string }

export const BebeTabTicker: React.FC = () => {
  const [items, setItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    let active = true;
    const charger = async () => {
      try {
        const r = await fetch("/api/ticker");
        if (!r.ok) return;
        const d = await r.json();
        if (active && Array.isArray(d.ads)) setItems(d.ads);
      } catch { /* bandeau vide hors ligne */ }
    };
    void charger();
    const minuteur = window.setInterval(charger, 5 * 60 * 1000);
    return () => { active = false; window.clearInterval(minuteur); };
  }, []);

  if (items.length === 0) return null;

  const ligne = items.map(i => (
    <span key={i.id} className="mx-8 font-black text-blue-800 whitespace-nowrap">
      {i.link ? <a href={i.link} target="_blank" rel="noopener noreferrer" className="underline">{i.text}</a> : i.text}
    </span>
  ));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 overflow-hidden bg-white/95 border-t-4 border-white shadow-[0_-6px_20px_rgba(0,60,100,.2)] py-2" aria-label="Bandeau de l'équipe">
      <div className="inline-flex animate-[bebetab-defile_30s_linear_infinite]">
        {ligne}{ligne}
      </div>
      <style>{`@keyframes bebetab-defile{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
};
