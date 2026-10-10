import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../../types";
import { soundFx, speakText } from "../../utils/audio";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Sparkles,
  Volume2,
  Gamepad2,
  Flame,
  Star,
  Zap,
  Check,
  Award,
} from "lucide-react";

interface GamesModuleProps {
  initialGame?: string;
  user: UserProfile;
  onAwardXP: (xp: number, stars: number) => void;
  onBack: () => void;
}

export const GamesModule: React.FC<GamesModuleProps> = ({
  initialGame,
  user,
  onAwardXP,
  onBack,
}) => {
  const [activeGame, setActiveGame] = useState<
    "selector" | "balloons" | "memory" | "intrus" | "speedmath" | "tapmole" | "piano" | "tictactoe" | "maze" | "garden" | "cooking" | "builder" | "safari" | "space"
  >(["selector","balloons","memory","intrus","speedmath","tapmole","piano","tictactoe","maze","garden","cooking","builder","safari","space"].includes(initialGame || "") ? initialGame as "selector" | "balloons" | "memory" | "intrus" | "speedmath" | "tapmole" | "piano" | "tictactoe" | "maze" | "garden" | "cooking" | "builder" | "safari" | "space" : "selector");

  // --- BALLOONS GAME STATE ---
  const [balloons, setBalloons] = useState<
    { id: number; char: string; color: string; left: number; speed: number; isGold?: boolean }[]
  >([]);
  const [balloonScore, setBalloonScore] = useState(0);

  useEffect(() => {
    if (activeGame !== "balloons") return;
    const chars = ["A", "B", "C", "1", "2", "3", "⭐", "🐘", "🎈", "🦁", "🍎"];
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-emerald-500",
      "bg-yellow-400 text-slate-900",
      "bg-purple-500",
      "bg-pink-500",
    ];

    const interval = setInterval(() => {
      if (balloons.length < 9) {
        const isGold = Math.random() < 0.2;
        const newB = {
          id: Date.now() + Math.random(),
          char: isGold ? "🌟" : chars[Math.floor(Math.random() * chars.length)],
          color: isGold ? "bg-amber-400 border-2 border-yellow-200 text-slate-900" : colors[Math.floor(Math.random() * colors.length)],
          left: Math.floor(Math.random() * 80) + 10,
          speed: Math.random() * 3 + 3,
          isGold,
        };
        setBalloons((prev) => [...prev, newB]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeGame, balloons]);

  const handlePopBalloon = (id: number, char: string, isGold?: boolean) => {
    soundFx.playPop();
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    const points = isGold ? 3 : 1;
    setBalloonScore((s) => s + points);
    onAwardXP(points * 10, points);

    if (isGold) {
      soundFx.playVictory();
      confetti({ particleCount: 30, spread: 40 });
      speakText("Super Ballon d'Or ! +3 Points !");
    } else if ((balloonScore + points) % 10 === 0) {
      soundFx.playVictory();
      confetti({ particleCount: 50, spread: 60 });
      speakText(`Bravo ! Score de ${balloonScore + points} ballons !`);
    }
  };

  // --- MEMORY GAME STATE ---
  const allIcons = ["🐘", "🦁", "🐒", "🐬", "🍎", "🚀", "🍕", "🚗", "🐸", "🦒"];
  const [memoryDifficulty, setMemoryDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [memoryCards, setMemoryCards] = useState<
    { id: number; icon: string; isFlipped: boolean; isMatched: boolean }[]
  >([]);
  const [flippedIdxs, setFlippedIdxs] = useState<number[]>([]);

  const startMemoryGame = (diff = memoryDifficulty) => {
    const pairCount = diff === "easy" ? 4 : diff === "medium" ? 6 : 8;
    const selectedIcons = allIcons.slice(0, pairCount);
    const deck = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, idx) => ({
        id: idx,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setMemoryCards(deck);
    setFlippedIdxs([]);
  };

  useEffect(() => {
    if (activeGame === "memory") {
      startMemoryGame();
    }
  }, [activeGame, memoryDifficulty]);

  const handleCardClick = (idx: number) => {
    if (
      flippedIdxs.length === 2 ||
      memoryCards[idx].isFlipped ||
      memoryCards[idx].isMatched
    ) {
      return;
    }

    soundFx.playTap();
    const newCards = [...memoryCards];
    newCards[idx].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIdxs, idx];
    setFlippedIdxs(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].icon === newCards[second].icon) {
        // Match!
        setTimeout(() => {
          soundFx.playVictory();
          newCards[first].isMatched = true;
          newCards[second].isMatched = true;
          setMemoryCards([...newCards]);
          setFlippedIdxs([]);
          onAwardXP(25, 2);

          if (newCards.every((c) => c.isMatched)) {
            confetti({ particleCount: 100, spread: 80 });
            speakText("Gagné ! Tu as une mémoire extraordinaire !");
          }
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedIdxs([]);
        }, 900);
      }
    }
  };

  // --- FIND ODD ONE OUT GAME STATE ---
  const oddQuestions = [
    { items: ["🍎", "🍌", "🍇", "🚗"], oddIndex: 3, reason: "La voiture n'est pas un fruit !" },
    { items: ["🐶", "🐱", "🐰", "✈️"], oddIndex: 3, reason: "L'avion n'est pas un animal !" },
    { items: ["⚽", "🏀", "🎾", "🍦"], oddIndex: 3, reason: "La glace n'est pas un ballon !" },
    { items: ["🦁", "🐯", "🦒", "🎸"], oddIndex: 3, reason: "La guitare est un instrument !" },
    { items: ["🚀", "🛸", "🚁", "🍕"], oddIndex: 3, reason: "La pizza est à manger !" },
  ];
  const [oddIdx, setOddIdx] = useState(0);

  const handleOddSelect = (selected: number) => {
    const q = oddQuestions[oddIdx];
    if (selected === q.oddIndex) {
      soundFx.playVictory();
      confetti({ particleCount: 60 });
      speakText(`Bravo ! ${q.reason}`);
      onAwardXP(20, 2);
      setTimeout(() => {
        setOddIdx((prev) => (prev + 1) % oddQuestions.length);
      }, 1500);
    } else {
      soundFx.playTap();
      speakText("Essaie encore ! Cherche celui qui est différent des trois autres !");
    }
  };

  // --- SPEED MATH GAME STATE ---
  const [mathNum1, setMathNum1] = useState(2);
  const [mathNum2, setMathNum2] = useState(3);
  const [mathScore, setMathScore] = useState(0);
  const [mathOptions, setMathOptions] = useState<number[]>([]);

  const generateMathQuestion = () => {
    const n1 = Math.floor(Math.random() * 5) + 1;
    const n2 = Math.floor(Math.random() * 5) + 1;
    setMathNum1(n1);
    setMathNum2(n2);
    const correct = n1 + n2;
    const opts = new Set<number>();
    opts.add(correct);
    while (opts.size < 4) {
      const wrong = Math.floor(Math.random() * 10) + 1;
      opts.add(wrong);
    }
    setMathOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    if (activeGame === "speedmath") {
      generateMathQuestion();
    }
  }, [activeGame]);

  const handleMathSelect = (ans: number) => {
    if (ans === mathNum1 + mathNum2) {
      soundFx.playVictory();
      confetti({ particleCount: 40 });
      setMathScore((s) => s + 1);
      onAwardXP(15, 1);
      speakText(`Excellence ! ${mathNum1} plus ${mathNum2} égale ${ans} !`);
      generateMathQuestion();
    } else {
      soundFx.playTap();
      speakText("Pas tout à fait ! Compte avec tes doigts !");
    }
  };

  // --- TAP-A-MOLE / ATTRAPE-ANIMAUX STATE ---
  const [moleHoles, setMoleHoles] = useState<string[]>(Array(6).fill(""));
  const [activeMoleIndex, setActiveMoleIndex] = useState<number | null>(null);
  const [moleScore, setMoleScore] = useState(0);

  useEffect(() => {
    if (activeGame !== "tapmole") return;
    const animals = ["🐘", "🦁", "🐒", "🐰", "🐸"];
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 6);
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
      const newHoles = Array(6).fill("");
      newHoles[randomIndex] = randomAnimal;
      setMoleHoles(newHoles);
      setActiveMoleIndex(randomIndex);
    }, 1200);

    return () => clearInterval(interval);
  }, [activeGame]);

  const handleTapMole = (index: number) => {
    if (index === activeMoleIndex && moleHoles[index]) {
      soundFx.playPop();
      setMoleScore((s) => s + 1);
      onAwardXP(15, 1);
      setMoleHoles(Array(6).fill(""));
      setActiveMoleIndex(null);

      if ((moleScore + 1) % 5 === 0) {
        soundFx.playVictory();
        confetti({ particleCount: 50 });
        speakText(`Bravo ! Tu as attrapé ${moleScore + 1} animaux !`);
      }
    }
  };

  // --- PIANO / XYLOPHONE GAME STATE ---
  const [instrumentMode, setInstrumentMode] = useState<"piano" | "xylophone">("piano");
  const [activeGuideStep, setActiveGuideStep] = useState(0);
  const [currentSong, setCurrentSong] = useState<{ name: string; notes: number[] } | null>(null);

  const pianoNotes = [
    { name: "Do", note: "C4", freq: 261.63, color: "bg-red-500 hover:bg-red-600 text-white" },
    { name: "Ré", note: "D4", freq: 293.66, color: "bg-orange-500 hover:bg-orange-600 text-white" },
    { name: "Mi", note: "E4", freq: 329.63, color: "bg-amber-400 hover:bg-amber-500 text-slate-900" },
    { name: "Fa", note: "F4", freq: 349.23, color: "bg-emerald-500 hover:bg-emerald-600 text-white" },
    { name: "Sol", note: "G4", freq: 392.00, color: "bg-cyan-500 hover:bg-cyan-600 text-white" },
    { name: "La", note: "A4", freq: 440.00, color: "bg-blue-500 hover:bg-blue-600 text-white" },
    { name: "Si", note: "B4", freq: 493.88, color: "bg-purple-500 hover:bg-purple-600 text-white" },
    { name: "Do²", note: "C5", freq: 523.25, color: "bg-pink-500 hover:bg-pink-600 text-white" },
  ];

  const nurserySongs = [
    { name: "Ah les crocodiles", notes: [0, 1, 2, 3, 4, 4, 3, 2, 1] },
    { name: "Au clair de la lune", notes: [0, 0, 0, 1, 2, 1, 0, 2, 1, 1, 0] },
    { name: "Frère Jacques", notes: [0, 1, 2, 0, 0, 1, 2, 0, 2, 3, 4] },
  ];

  const handlePlayKey = (index: number) => {
    const item = pianoNotes[index];
    if (instrumentMode === "piano") {
      soundFx.playPianoNote(item.freq);
    } else {
      soundFx.playXylophoneNote(item.freq);
    }

    if (currentSong) {
      const expectedIndex = currentSong.notes[activeGuideStep];
      if (index === expectedIndex) {
        if (activeGuideStep + 1 >= currentSong.notes.length) {
          soundFx.playVictory();
          confetti({ particleCount: 70 });
          speakText(`Bravo ! Tu as joué toute la chanson ${currentSong.name} !`);
          onAwardXP(30, 3);
          setActiveGuideStep(0);
          setCurrentSong(null);
        } else {
          setActiveGuideStep((prev) => prev + 1);
        }
      }
    }
  };

  // --- TIC-TAC-TOE (MORPION KIDS) STATE ---
  const [tttBoard, setTttBoard] = useState<string[]>(Array(9).fill(""));
  const [tttTurn, setTttTurn] = useState<"🐘" | "🦁">("🐘");
  const [tttWinner, setTttWinner] = useState<string | null>(null);
  const [isVsAi, setIsVsAi] = useState(true);

  const checkTttWinner = (board: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every((cell) => cell !== "")) return "DRAW";
    return null;
  };

  const handleTttClick = (index: number) => {
    if (tttBoard[index] || tttWinner) return;

    soundFx.playTap();
    const newBoard = [...tttBoard];
    newBoard[index] = tttTurn;
    setTttBoard(newBoard);

    const win = checkTttWinner(newBoard);
    if (win) {
      setTttWinner(win);
      if (win === "🐘") {
        soundFx.playVictory();
        confetti({ particleCount: 60 });
        speakText("Bravo ! Fanti a gagné la partie !");
        onAwardXP(20, 2);
      } else if (win === "🦁") {
        soundFx.playVictory();
        speakText("Bravo au Lion !");
      } else {
        soundFx.playTap();
        speakText("Match nul ! Belle partie !");
      }
      return;
    }

    const nextTurn = tttTurn === "🐘" ? "🦁" : "🐘";
    setTttTurn(nextTurn);

    if (isVsAi && nextTurn === "🦁") {
      setTimeout(() => {
        const emptyIndices = newBoard
          .map((val, idx) => (val === "" ? idx : null))
          .filter((val): val is number => val !== null);
        if (emptyIndices.length > 0) {
          const aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const aiBoard = [...newBoard];
          aiBoard[aiChoice] = "🦁";
          setTttBoard(aiBoard);
          soundFx.playTap();

          const aiWin = checkTttWinner(aiBoard);
          if (aiWin) {
            setTttWinner(aiWin);
            if (aiWin === "🦁") {
              speakText("Le Lion a gagné cette fois ! Réessaie !");
            } else if (aiWin === "DRAW") {
              speakText("Match nul ! Super duel !");
            }
          } else {
            setTttTurn("🐘");
          }
        }
      }, 500);
    }
  };

  const resetTtt = () => {
    setTttBoard(Array(9).fill(""));
    setTttTurn("🐘");
    setTttWinner(null);
  };

  // --- MAZE AVENTURE STATE ---
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [starsCollected, setStarsCollected] = useState<string[]>([]);
  const [mazeWon, setMazeWon] = useState(false);

  const mazeWalls = new Set(["1,0", "1,2", "3,1", "2,3", "3,3", "0,3"]);
  const starPositions = ["2,0", "0,2", "4,2"];
  const trophyPos = { x: 4, y: 4 };

  const handleMovePlayer = (dx: number, dy: number) => {
    if (mazeWon) return;
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;

    if (nx < 0 || nx > 4 || ny < 0 || ny > 4) return;
    if (mazeWalls.has(`${nx},${ny}`)) {
      soundFx.playTap();
      return;
    }

    soundFx.playTap();
    setPlayerPos({ x: nx, y: ny });

    const key = `${nx},${ny}`;
    if (starPositions.includes(key) && !starsCollected.includes(key)) {
      soundFx.playVictory();
      setStarsCollected((prev) => [...prev, key]);
      speakText("Étoile attrapée ! Super !");
      onAwardXP(10, 1);
    }

    if (nx === trophyPos.x && ny === trophyPos.y) {
      soundFx.playVictory();
      confetti({ particleCount: 80, spread: 70 });
      setMazeWon(true);
      speakText("Victoire ! Tu as traversé le labyrinthe magique !");
      onAwardXP(30, 3);
    }
  };

  const resetMaze = () => {
    setPlayerPos({ x: 0, y: 0 });
    setStarsCollected([]);
    setMazeWon(false);
  };

  // --- JARDIN MAGIQUE D'ADIBOU (GARDEN) STATE ---
  const plantTypes = [
    { id: "carotte", name: "Carotte Gourmande", seedIcon: "🌱", grownIcon: "🥕", bg: "bg-orange-100", xp: 15 },
    { id: "tournesol", name: "Tournesol Magique", seedIcon: "🌱", grownIcon: "🌻", bg: "bg-amber-100", xp: 20 },
    { id: "fraise", name: "Fraise Sucrée", seedIcon: "🌱", grownIcon: "🍓", bg: "bg-rose-100", xp: 15 },
    { id: "pomme", name: "Pommier Rouge", seedIcon: "🌱", grownIcon: "🍎", bg: "bg-red-100", xp: 20 },
  ];
  const [selectedSeed, setSelectedSeed] = useState(plantTypes[0]);
  const [waterLevel, setWaterLevel] = useState(0); // 0 to 3
  const [sunLevel, setSunLevel] = useState(0); // 0 to 3
  const [gardenHarvests, setGardenHarvests] = useState(0);

  const plantStage = waterLevel >= 3 && sunLevel >= 3 ? 3 : waterLevel >= 1 || sunLevel >= 1 ? 2 : 1;

  const handleWaterPlant = () => {
    soundFx.playPop();
    if (waterLevel < 3) {
      setWaterLevel((w) => w + 1);
      speakText("Arrosage magique ! La plante grandit !");
    }
  };

  const handleSunPlant = () => {
    soundFx.playPop();
    if (sunLevel < 3) {
      setSunLevel((s) => s + 1);
      speakText("Soleil brillant !");
    }
  };

  const handleHarvestPlant = () => {
    soundFx.playVictory();
    confetti({ particleCount: 60, spread: 60 });
    setGardenHarvests((h) => h + 1);
    speakText(`Bravo ! Tu as récolté une magnifique ${selectedSeed.name} !`);
    onAwardXP(selectedSeed.xp, 2);
    setWaterLevel(0);
    setSunLevel(0);
  };

  // --- ATELIER CUISINE TOCA & SMOOTHIE STATE ---
  const smoothieIngredients = [
    { id: "banane", name: "Banane", icon: "🍌", color: "bg-yellow-300" },
    { id: "fraise", name: "Fraise", icon: "🍓", color: "bg-rose-400" },
    { id: "glace", name: "Glace Vanille", icon: "🍦", color: "bg-amber-100" },
    { id: "chocolat", name: "Chocolat", icon: "🍫", color: "bg-amber-800" },
    { id: "kiwi", name: "Kiwi Frais", icon: "🥝", color: "bg-emerald-400" },
    { id: "lait", name: "Lait Magique", icon: "🥛", color: "bg-sky-100" },
  ];
  const [blenderList, setBlenderList] = useState<typeof smoothieIngredients>([]);
  const [isBlending, setIsBlending] = useState(false);
  const [smoothieReady, setSmoothieReady] = useState(false);

  const handleAddIngredient = (ing: typeof smoothieIngredients[0]) => {
    if (blenderList.length < 4 && !isBlending && !smoothieReady) {
      soundFx.playPop();
      setBlenderList((prev) => [...prev, ing]);
    }
  };

  const handleStartBlend = () => {
    if (blenderList.length === 0) return;
    setIsBlending(true);
    soundFx.playTap();
    speakText("Mixage en cours... Vrrr !");
    setTimeout(() => {
      setIsBlending(false);
      setSmoothieReady(true);
      soundFx.playVictory();
      speakText("Le smoothie magique est prêt ! Donne-le à Fanti !");
    }, 2000);
  };

  const handleFeedFanti = () => {
    soundFx.playVictory();
    confetti({ particleCount: 70 });
    speakText("Miam ! C'est trop bon ! Merci beaucoup !");
    onAwardXP(25, 2);
    setBlenderList([]);
    setSmoothieReady(false);
  };

  // --- CONSTRUCTEUR DE BRIQUES DUPLO STATE ---
  const builderModels = [
    { id: "house", name: "Maison Colorée", icon: "🏠", reqBlocks: 6 },
    { id: "car", name: "Voiture de Course", icon: "🏎️", reqBlocks: 6 },
    { id: "rocket", name: "Fusée Spatiale", icon: "🚀", reqBlocks: 8 },
  ];
  const [activeBuilderModel, setActiveBuilderModel] = useState(builderModels[0]);
  const [placedBlocks, setPlacedBlocks] = useState<string[]>([]);
  const blockColors = [
    { name: "Rouge", bg: "bg-red-500", border: "border-red-700" },
    { name: "Bleu", bg: "bg-blue-500", border: "border-blue-700" },
    { name: "Jaune", bg: "bg-yellow-400", border: "border-yellow-600" },
    { name: "Vert", bg: "bg-emerald-500", border: "border-emerald-700" },
  ];

  const handleAddBuilderBlock = (colorBg: string) => {
    if (placedBlocks.length < activeBuilderModel.reqBlocks) {
      soundFx.playPop();
      const newPlaced = [...placedBlocks, colorBg];
      setPlacedBlocks(newPlaced);

      if (newPlaced.length === activeBuilderModel.reqBlocks) {
        soundFx.playVictory();
        confetti({ particleCount: 80, spread: 70 });
        speakText(`Super ! Tu as construit une magnifique ${activeBuilderModel.name} !`);
        onAwardXP(30, 3);
      }
    }
  };

  // --- GAME 12: SAFARI JUNGLE RUNNER STATE ---
  const [safariDistance, setSafariDistance] = useState(0);
  const [safariGems, setSafariGems] = useState(0);
  const [safariLives, setSafariLives] = useState(3);
  const [safariPlayerAction, setSafariPlayerAction] = useState<"ground" | "jumping" | "sliding">("ground");
  const [isSafariPlaying, setIsSafariPlaying] = useState(false);
  const [safariObstacles, setSafariObstacles] = useState<
    { id: number; x: number; type: "boulder" | "vine" | "diamond" | "banana" }[]
  >([]);

  const startSafariGame = () => {
    setSafariDistance(0);
    setSafariGems(0);
    setSafariLives(3);
    setSafariPlayerAction("ground");
    setSafariObstacles([]);
    setIsSafariPlaying(true);
    soundFx.playTap();
    speakText("Course Safari ! Saute sur les rochers et glisse sous les lianes ! C'est parti !");
  };

  // Safari Game End Effect
  useEffect(() => {
    if (activeGame === "safari" && isSafariPlaying && safariLives <= 0) {
      setIsSafariPlaying(false);
      soundFx.playTap();
      speakText("Oh mince ! Fanti a trébuché ! Tu as parcouru une super distance !");
      onAwardXP(20, 2);
    }
  }, [safariLives, isSafariPlaying, activeGame, onAwardXP]);

  // Safari Game Loop
  useEffect(() => {
    if (activeGame !== "safari" || !isSafariPlaying) return;

    const gameInterval = setInterval(() => {
      setSafariDistance((d) => d + 2);

      let gemsToAdd = 0;
      let livesToDeduct = 0;

      setSafariObstacles((prev) => {
        const nextObs = prev
          .map((obs) => ({ ...obs, x: obs.x - 4 }))
          .filter((obs) => obs.x > -10);

        // Spawn new obstacle
        if (nextObs.length === 0 || (nextObs[nextObs.length - 1].x < 65 && Math.random() < 0.3)) {
          const types: ("boulder" | "vine" | "diamond" | "banana")[] = [
            "boulder",
            "vine",
            "diamond",
            "banana",
          ];
          const randomType = types[Math.floor(Math.random() * types.length)];
          nextObs.push({
            id: Date.now() + Math.random(),
            x: 100,
            type: randomType,
          });
        }

        // Collision Check near player position (x around 12% to 28%)
        nextObs.forEach((obs) => {
          if (obs.x >= 12 && obs.x <= 28) {
            if (obs.type === "diamond" || obs.type === "banana") {
              gemsToAdd += 1;
              obs.x = -20; // collect
            } else if (obs.type === "boulder" && safariPlayerAction !== "jumping") {
              livesToDeduct += 1;
              obs.x = -20;
            } else if (obs.type === "vine" && safariPlayerAction !== "sliding") {
              livesToDeduct += 1;
              obs.x = -20;
            }
          }
        });

        return nextObs;
      });

      if (gemsToAdd > 0) {
        soundFx.playPop();
        setSafariGems((g) => g + gemsToAdd);
      }

      if (livesToDeduct > 0) {
        soundFx.playTap();
        setSafariLives((l) => Math.max(0, l - livesToDeduct));
      }
    }, 100);

    return () => clearInterval(gameInterval);
  }, [activeGame, isSafariPlaying, safariPlayerAction]);

  const handleSafariJump = () => {
    if (safariPlayerAction !== "ground") return;
    soundFx.playPop();
    setSafariPlayerAction("jumping");
    setTimeout(() => setSafariPlayerAction("ground"), 800);
  };

  const handleSafariSlide = () => {
    if (safariPlayerAction !== "ground") return;
    soundFx.playTap();
    setSafariPlayerAction("sliding");
    setTimeout(() => setSafariPlayerAction("ground"), 800);
  };

  // --- GAME 13: CHASSE AU TRÉSOR SPATIALE STATE ---
  const [spaceDistance, setSpaceDistance] = useState(0);
  const [spaceFuel, setSpaceFuel] = useState(100);
  const [spaceCrystals, setSpaceCrystals] = useState(0);
  const [spaceLane, setSpaceLane] = useState<0 | 1 | 2>(1); // 0=Left, 1=Center, 2=Right
  const [isSpacePlaying, setIsSpacePlaying] = useState(false);
  const [spaceObjects, setSpaceObjects] = useState<
    { id: number; lane: 0 | 1 | 2; y: number; type: "asteroid" | "crystal" | "fuel" }[]
  >([]);

  const startSpaceGame = () => {
    setSpaceDistance(0);
    setSpaceFuel(100);
    setSpaceCrystals(0);
    setSpaceLane(1);
    setSpaceObjects([]);
    setIsSpacePlaying(true);
    soundFx.playTap();
    speakText("Pilote la Fusée Spatiale ! Esquive les astéroïdes et attrape les cristaux cosmiques !");
  };

  // Space Game End Effect
  useEffect(() => {
    if (activeGame === "space" && isSpacePlaying && spaceFuel <= 0) {
      setIsSpacePlaying(false);
      soundFx.playVictory();
      confetti({ particleCount: 70 });
      speakText("Plus d'essence spatiale ! Super mission dans la galaxie !");
      onAwardXP(35, 3);
    }
  }, [spaceFuel, isSpacePlaying, activeGame, onAwardXP]);

  // Space Game Loop
  useEffect(() => {
    if (activeGame !== "space" || !isSpacePlaying) return;

    const spaceInterval = setInterval(() => {
      setSpaceDistance((d) => d + 5);
      setSpaceFuel((f) => Math.max(0, f - 1));

      let crystalGained = false;
      let fuelGained = false;
      let asteroidHit = false;

      setSpaceObjects((prev) => {
        const nextObjs = prev
          .map((obj) => ({ ...obj, y: obj.y + 6 }))
          .filter((obj) => obj.y < 110);

        if (nextObjs.length === 0 || (nextObjs[nextObjs.length - 1].y > 35 && Math.random() < 0.4)) {
          const lanes: (0 | 1 | 2)[] = [0, 1, 2];
          const types: ("asteroid" | "crystal" | "fuel")[] = ["asteroid", "crystal", "fuel"];
          nextObjs.push({
            id: Date.now() + Math.random(),
            lane: lanes[Math.floor(Math.random() * lanes.length)],
            y: 0,
            type: types[Math.floor(Math.random() * types.length)],
          });
        }

        // Collision Check with Rocket (y near 70-90%)
        nextObjs.forEach((obj) => {
          if (obj.y >= 70 && obj.y <= 90 && obj.lane === spaceLane) {
            if (obj.type === "crystal") {
              crystalGained = true;
              obj.y = 200;
            } else if (obj.type === "fuel") {
              fuelGained = true;
              obj.y = 200;
            } else if (obj.type === "asteroid") {
              asteroidHit = true;
              obj.y = 200;
            }
          }
        });

        return nextObjs;
      });

      if (crystalGained) {
        soundFx.playVictory();
        setSpaceCrystals((c) => c + 1);
      }
      if (fuelGained) {
        soundFx.playPop();
        setSpaceFuel((f) => Math.min(100, f + 25));
      }
      if (asteroidHit) {
        soundFx.playTap();
        setSpaceFuel((f) => Math.max(0, f - 20));
      }
    }, 120);

    return () => clearInterval(spaceInterval);
  }, [activeGame, isSpacePlaying, spaceLane]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-white/90 backdrop-blur rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-emerald-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeGame !== "selector") {
                setActiveGame("selector");
              } else {
                onBack();
              }
            }}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-transform active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🎮</span> Top Jeux Interactifs Kids
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Apprends en t'amusant avec nos 8 super jeux interactifs !
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border-2 border-yellow-400 rounded-2xl text-yellow-800 font-black text-xs sm:text-sm shadow">
          <Trophy className="w-5 h-5 text-yellow-600 animate-bounce" />
          <span>{user.stars} ⭐ Stars Gagnées</span>
        </div>
      </div>

      {/* Game Selector Menu */}
      {activeGame === "selector" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
              <h3 className="text-xl font-black text-slate-900">Les Super Jeux d'Aventure & d'Éveil Kids</h3>
            </div>
            <span className="px-3 py-1 bg-amber-200 text-amber-900 font-black text-xs rounded-full">
              ✨ 13 Jeux Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Game 12: Safari Jungle Runner */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("safari");
                startSafariGame();
              }}
              className="cursor-pointer bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 text-white rounded-3xl p-6 shadow-xl border-4 border-lime-300 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:scale-110 transition-transform">🦁</span>
                <span className="px-3 py-1 bg-amber-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🔥 AVENTURE #1 JUNGLE
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-yellow-300 mb-1">
                  Safari Jungle Runner 🏃‍♂️
                </h3>
                <p className="text-xs text-emerald-100 font-bold leading-relaxed">
                  Guide Fanti dans la jungle sauvage ! Saute les rochers, glisse sous les lianes et ramasse des diamants magiques !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-300 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +35 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer l'Aventure ▶</span>
              </div>
            </div>

            {/* Game 13: Space Rocket Adventure */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("space");
                startSpaceGame();
              }}
              className="cursor-pointer bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 text-white rounded-3xl p-6 shadow-xl border-4 border-cyan-300 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:rotate-12 transition-transform">🚀</span>
                <span className="px-3 py-1 bg-cyan-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🌌 ESPACE & FUSÉE
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-cyan-200 mb-1">
                  Chasse au Trésor Spatiale 🌠
                </h3>
                <p className="text-xs text-cyan-100 font-bold leading-relaxed">
                  Pilote la fusée de Fanti ! Esquive les astéroïdes géants et attrape les cristaux cosmiques dans la galaxie !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-cyan-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +35 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Décoller ▶</span>
              </div>
            </div>
            {/* Game 1: Balloon Pop */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("balloons");
                speakText("C'est parti pour le jeu Éclate Ballons !");
              }}
              className="cursor-pointer bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl border-4 border-yellow-300 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:rotate-12 transition-transform">🎈</span>
                <span className="px-3 py-1 bg-yellow-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🔥 Top #1 Éclate
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-yellow-300 mb-1">
                  Éclate-Ballons 🎈
                </h3>
                <p className="text-xs text-pink-100 font-bold">
                  Fais éclater les ballons magiques, attrape les ballons d'or et accumule les étoiles !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +10 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 2: Memory */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("memory");
                speakText("Jeu de mémoire ! Trouve toutes les paires !");
              }}
              className="cursor-pointer bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-3xl p-6 shadow-xl border-4 border-green-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:scale-110 transition-transform">🃏</span>
                <span className="px-3 py-1 bg-emerald-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🧠 Mémoire
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-green-200 mb-1">
                  Jeu de Mémoire 🃏
                </h3>
                <p className="text-xs text-emerald-100 font-bold">
                  Retrouve les paires d'animaux identiques avec 3 niveaux de difficulté !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-green-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +25 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 3: Odd One Out */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("intrus");
                speakText("Trouve l'intrus ! Quel objet est différent ?");
              }}
              className="cursor-pointer bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white rounded-3xl p-6 shadow-xl border-4 border-amber-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:-rotate-12 transition-transform">🔍</span>
                <span className="px-3 py-1 bg-amber-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  💡 Logique
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-yellow-200 mb-1">
                  Trouver l'Intrus 🔍
                </h3>
                <p className="text-xs text-amber-100 font-bold">
                  Entraîne ton sens de l'observation et devine ce qui n'a pas sa place.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +20 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 4: Speed Math */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("speedmath");
                speakText("Maths Rapides ! Compte les chiffres !");
              }}
              className="cursor-pointer bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl p-6 shadow-xl border-4 border-indigo-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:scale-110 transition-transform">🧮</span>
                <span className="px-3 py-1 bg-indigo-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🔢 Calcul
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-yellow-300 mb-1">
                  Calcul & Chiffres 🧮
                </h3>
                <p className="text-xs text-indigo-100 font-bold">
                  Additionne les chiffres rigolos et gagne le titre de Champion des Maths !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +15 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 5: Tap-a-Mole */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("tapmole");
                speakText("Attrape les animaux rigolos avant qu'ils ne se cachent !");
              }}
              className="cursor-pointer bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl border-4 border-sky-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:bounce transition-transform">🐾</span>
                <span className="px-3 py-1 bg-sky-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  ⚡ Réflexes
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-sky-200 mb-1">
                  Attrape-Animaux 🐾
                </h3>
                <p className="text-xs text-sky-100 font-bold">
                  Tape rapidement sur les animaux qui sortent des buissons magiques !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-sky-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +15 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 6: Piano & Xylophone */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("piano");
                speakText("Piano et Xylophone Magique ! Joue des mélodies !");
              }}
              className="cursor-pointer bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl border-4 border-pink-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:rotate-12 transition-transform">🎹</span>
                <span className="px-3 py-1 bg-pink-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🎵 Musique
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-yellow-300 mb-1">
                  Piano & Xylophone 🎹
                </h3>
                <p className="text-xs text-pink-100 font-bold">
                  Joue les notes colorées et apprends les chansons célèbres !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +30 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 7: Morpion Kids */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("tictactoe");
                speakText("Morpion des Animaux ! Joue contre Fanti l'Éléphant !");
              }}
              className="cursor-pointer bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl border-4 border-yellow-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:scale-110 transition-transform">❌⭕</span>
                <span className="px-3 py-1 bg-yellow-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  ⚔️ Duel Kids
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1">
                  Morpion Animaux ❌⭕
                </h3>
                <p className="text-xs text-yellow-100 font-bold">
                  Joue au tic-tac-toe avec Fanti l'éléphant et le lion rigolo !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +20 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 8: Labyrinthe Étoilé */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("maze");
                speakText("Labyrinthe Étoilé ! Guide Fanti vers le trophée d'or !");
              }}
              className="cursor-pointer bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 text-white rounded-3xl p-6 shadow-xl border-4 border-emerald-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:rotate-6 transition-transform">🌀</span>
                <span className="px-3 py-1 bg-emerald-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🗺️ Aventure
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-yellow-300 mb-1">
                  Labyrinthe Étoilé 🌀
                </h3>
                <p className="text-xs text-emerald-100 font-bold">
                  Guide Fanti, esquive les obstacles et ramasse les 3 étoiles cachées !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +30 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 9: Le Jardin d'Adibou */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("garden");
                speakText("Le Jardin Magique ! Plante des graines et arrose ton potager !");
              }}
              className="cursor-pointer bg-gradient-to-br from-lime-500 via-emerald-500 to-green-600 text-white rounded-3xl p-6 shadow-xl border-4 border-lime-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:scale-110 transition-transform">🌻</span>
                <span className="px-3 py-1 bg-lime-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🌱 Nature & Jardin
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-yellow-200 mb-1">
                  Jardin Magique 🥕
                </h3>
                <p className="text-xs text-lime-100 font-bold">
                  Sème des graines, arrose avec l'arrosoir magique et récolte des fruits sucrés !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +20 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 10: Atelier Cuisine Toca */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("cooking");
                speakText("Atelier Smoothie Toca ! Prépare de délicieuses recettes pour Fanti !");
              }}
              className="cursor-pointer bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white rounded-3xl p-6 shadow-xl border-4 border-yellow-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:rotate-12 transition-transform">🍹</span>
                <span className="px-3 py-1 bg-amber-200 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  👨‍🍳 Cuisine Kids
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1">
                  Smoothie Maker 🍌
                </h3>
                <p className="text-xs text-amber-100 font-bold">
                  Choisis tes fruits préférés, mixe dans le blender géant et régale Fanti !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +25 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>

            {/* Game 11: Constructeur Duplo */}
            <div
              onClick={() => {
                soundFx.playTap();
                setActiveGame("builder");
                speakText("Constructeur de Briques ! Empile les blocs pour créer des maisons et des fusées !");
              }}
              className="cursor-pointer bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white rounded-3xl p-6 shadow-xl border-4 border-cyan-200 hover:scale-105 transition-all flex flex-col justify-between h-64 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-5xl group-hover:-rotate-12 transition-transform">🧱</span>
                <span className="px-3 py-1 bg-cyan-300 text-slate-900 font-black text-xs rounded-full uppercase shadow">
                  🏗️ Briques Duplo
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-yellow-300 mb-1">
                  Atelier Briques 🏠
                </h3>
                <p className="text-xs text-cyan-100 font-bold">
                  Assemble des briques de couleur virtuelles pour construire des fusées et voitures !
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-black text-yellow-200 pt-2 border-t border-white/20">
                <span>⭐ Récompense: +30 XP</span>
                <span className="bg-white/20 px-3 py-1 rounded-xl">Jouer ▶</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- GAME 1: BALLOONS POPPER --- */}
      {activeGame === "balloons" && (
        <div className="relative w-full h-[550px] bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 rounded-3xl p-6 border-4 border-white shadow-2xl overflow-hidden flex flex-col justify-between select-none">
          {/* Score Header */}
          <div className="z-10 flex items-center justify-between bg-white/80 backdrop-blur px-6 py-3 rounded-2xl border-2 border-sky-300 shadow">
            <span className="font-black text-lg text-slate-800">
              🎈 Score : <span className="text-purple-600 text-xl">{balloonScore}</span>
            </span>
            <button
              onClick={() => setActiveGame("selector")}
              className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl shadow active:scale-95"
            >
              Quitter le jeu ✖
            </button>
          </div>

          {/* Floating Balloons Canvas */}
          <div className="relative flex-1 w-full overflow-hidden">
            <AnimatePresence>
              {balloons.map((b) => (
                <motion.button
                  key={b.id}
                  initial={{ y: 500, opacity: 1 }}
                  animate={{ y: -80 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: b.speed, ease: "linear" }}
                  onClick={() => handlePopBalloon(b.id, b.char, b.isGold)}
                  style={{ left: `${b.left}%` }}
                  className={`absolute w-20 h-24 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] ${b.color} text-white font-black text-3xl flex items-center justify-center shadow-xl border-2 border-white/50 active:scale-125 transition-transform cursor-pointer`}
                >
                  {b.char}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-400" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- GAME 2: MEMORY GAME --- */}
      {activeGame === "memory" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-emerald-300 shadow-xl flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800">
                Retrouve les paires ! 🃏
              </h3>
              <p className="text-xs text-slate-600 font-bold">Choisis ton niveau de difficulté :</p>
            </div>

            <div className="flex items-center gap-2">
              {(["easy", "medium", "hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setMemoryDifficulty(diff);
                    startMemoryGame(diff);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase ${
                    memoryDifficulty === diff
                      ? "bg-emerald-500 text-white shadow ring-2 ring-emerald-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {diff === "easy" ? "Facile (8)" : diff === "medium" ? "Moyen (12)" : "Expert (16)"}
                </button>
              ))}

              <button
                onClick={() => startMemoryGame()}
                className="px-4 py-2 bg-slate-800 text-white font-black text-xs rounded-xl shadow flex items-center gap-1 active:scale-95 ml-2"
              >
                <RotateCcw className="w-4 h-4" /> Relancer
              </button>
            </div>
          </div>

          <div
            className={`grid gap-4 w-full max-w-xl ${
              memoryDifficulty === "easy"
                ? "grid-cols-4"
                : memoryDifficulty === "medium"
                ? "grid-cols-4"
                : "grid-cols-4 sm:grid-cols-4"
            }`}
          >
            {memoryCards.map((card, idx) => (
              <motion.div
                key={card.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-2xl cursor-pointer flex items-center justify-center font-black text-4xl shadow-md border-4 transition-all ${
                  card.isFlipped || card.isMatched
                    ? "bg-yellow-300 border-yellow-500"
                    : "bg-gradient-to-br from-emerald-500 to-teal-600 border-white text-white"
                }`}
              >
                {card.isFlipped || card.isMatched ? card.icon : "❓"}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* --- GAME 3: FIND THE ODD ONE OUT --- */}
      {activeGame === "intrus" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-amber-300 shadow-xl flex flex-col items-center text-center gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-800">
              Trouve l'intrus ! 🔍 (Niveau {oddIdx + 1})
            </h3>
            <p className="text-sm font-bold text-slate-600">
              Clique sur l'élément qui n'a pas sa place parmi les trois autres.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl">
            {oddQuestions[oddIdx].items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleOddSelect(idx)}
                className="aspect-square bg-gradient-to-tr from-amber-100 to-yellow-50 hover:bg-amber-200 border-4 border-amber-300 rounded-3xl text-6xl flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- GAME 4: SPEED MATH --- */}
      {activeGame === "speedmath" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-indigo-300 shadow-xl flex flex-col items-center text-center gap-6">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-2xl font-black text-slate-800">
              Maths & Addition 🧮
            </h3>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-900 font-black text-sm rounded-xl">
              Score : {mathScore} ⭐
            </span>
          </div>

          <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-4 border-indigo-200 max-w-md w-full shadow-inner">
            <span className="text-6xl font-black text-indigo-900 block tracking-wider">
              {mathNum1} + {mathNum2} = ?
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {mathOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleMathSelect(opt)}
                className="py-5 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-slate-900 font-black text-3xl rounded-2xl shadow-lg border-2 border-white active:scale-95 transition-transform"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- GAME 5: TAP-A-MOLE --- */}
      {activeGame === "tapmole" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-sky-300 shadow-xl flex flex-col items-center text-center gap-6">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-2xl font-black text-slate-800">
              Attrape-Animaux 🐾
            </h3>
            <span className="px-4 py-2 bg-sky-100 text-sky-900 font-black text-sm rounded-xl">
              Score : {moleScore} 🐾
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {moleHoles.map((animal, i) => (
              <button
                key={i}
                onClick={() => handleTapMole(i)}
                className="aspect-square bg-gradient-to-b from-emerald-600 to-green-700 border-4 border-emerald-400 rounded-3xl text-5xl flex items-center justify-center shadow-inner relative overflow-hidden active:scale-95 transition-all"
              >
                {animal ? (
                  <motion.span
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                  >
                    {animal}
                  </motion.span>
                ) : (
                  <span className="text-xs font-bold text-emerald-200">🌿 Buisson</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- GAME 6: PIANO & XYLOPHONE --- */}
      {activeGame === "piano" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-pink-300 shadow-xl flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <span>🎹</span> Piano & Xylophone Magique
              </h3>
              <p className="text-xs text-slate-600 font-bold">Appuie sur les touches colorées pour faire de la musique !</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playTap();
                  setInstrumentMode("piano");
                }}
                className={`px-4 py-2 rounded-xl font-black text-xs uppercase shadow transition-all ${
                  instrumentMode === "piano"
                    ? "bg-purple-600 text-white ring-2 ring-purple-300"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🎹 Piano
              </button>
              <button
                onClick={() => {
                  soundFx.playTap();
                  setInstrumentMode("xylophone");
                }}
                className={`px-4 py-2 rounded-xl font-black text-xs uppercase shadow transition-all ${
                  instrumentMode === "xylophone"
                    ? "bg-amber-500 text-slate-900 ring-2 ring-amber-300"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🎼 Xylophone
              </button>
            </div>
          </div>

          {/* Guided Songs Banner */}
          <div className="w-full bg-pink-50 border-2 border-pink-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                {currentSong ? `Chanson active : ${currentSong.name} (Note ${activeGuideStep + 1}/${currentSong.notes.length})` : "Choisis une chanson guidée :"}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {nurserySongs.map((song) => (
                <button
                  key={song.name}
                  onClick={() => {
                    soundFx.playTap();
                    setCurrentSong(song);
                    setActiveGuideStep(0);
                    speakText(`Chanson : ${song.name}. Suis les touches qui brillent !`);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs shadow transition-transform active:scale-95 ${
                    currentSong?.name === song.name
                      ? "bg-rose-500 text-white"
                      : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-100"
                  }`}
                >
                  🎵 {song.name}
                </button>
              ))}
              {currentSong && (
                <button
                  onClick={() => {
                    setCurrentSong(null);
                    setActiveGuideStep(0);
                  }}
                  className="px-3 py-1.5 bg-slate-700 text-white rounded-xl font-black text-xs"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>

          {/* Interactive Keyboard Keys */}
          <div className="grid grid-cols-8 gap-2 w-full max-w-2xl py-4">
            {pianoNotes.map((keyObj, i) => {
              const isGuided = currentSong && currentSong.notes[activeGuideStep] === i;
              return (
                <motion.button
                  key={keyObj.note}
                  whileTap={{ scale: 0.9, y: 8 }}
                  onClick={() => handlePlayKey(i)}
                  className={`h-48 rounded-2xl flex flex-col justify-between p-3 font-black text-center shadow-lg border-2 border-white/50 cursor-pointer relative overflow-hidden transition-all ${keyObj.color} ${
                    isGuided ? "ring-4 ring-yellow-400 animate-bounce shadow-2xl" : ""
                  }`}
                >
                  <span className="text-xs opacity-90">{keyObj.note}</span>
                  <span className="text-xl sm:text-2xl font-black tracking-tight">{keyObj.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- GAME 7: MORPION KIDS (TIC TAC TOE) --- */}
      {activeGame === "tictactoe" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-amber-300 shadow-xl flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800">
                Morpion des Animaux ❌⭕
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                {tttWinner
                  ? tttWinner === "DRAW"
                    ? "Match Nul !"
                    : `Gagnant : ${tttWinner} ! 🎉`
                  : `Au tour de : ${tttTurn}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playTap();
                  setIsVsAi(!isVsAi);
                  resetTtt();
                }}
                className="px-3 py-1.5 bg-amber-100 border border-amber-300 text-amber-900 font-black text-xs rounded-xl shadow"
              >
                {isVsAi ? "🤖 Mode VS Ordinateur" : "👥 Mode 2 Joueurs"}
              </button>
              <button
                onClick={resetTtt}
                className="px-4 py-2 bg-slate-800 text-white font-black text-xs rounded-xl shadow active:scale-95 flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" /> Recommencer
              </button>
            </div>
          </div>

          {/* 3x3 Grid Board */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs aspect-square p-3 bg-amber-100 rounded-3xl border-4 border-amber-300 shadow-inner">
            {tttBoard.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleTttClick(idx)}
                className="aspect-square bg-white rounded-2xl text-5xl font-black flex items-center justify-center shadow hover:bg-amber-50 active:scale-95 transition-all border-2 border-amber-200"
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- GAME 8: LABYRINTHE ÉTOILÉ --- */}
      {activeGame === "maze" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-emerald-300 shadow-xl flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800">
                Labyrinthe Étoilé 🌀
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                Étoiles collectées : {starsCollected.length}/3 ⭐
              </p>
            </div>

            <button
              onClick={resetMaze}
              className="px-4 py-2 bg-slate-800 text-white font-black text-xs rounded-xl shadow active:scale-95 flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Recommencer
            </button>
          </div>

          {/* 5x5 Maze Board */}
          <div className="grid grid-cols-5 gap-2 w-full max-w-sm aspect-square p-3 bg-emerald-100 rounded-3xl border-4 border-emerald-300 shadow-inner">
            {Array.from({ length: 25 }).map((_, i) => {
              const x = i % 5;
              const y = Math.floor(i / 5);
              const key = `${x},${y}`;
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const isWall = mazeWalls.has(key);
              const isStar = starPositions.includes(key) && !starsCollected.includes(key);
              const isTrophy = trophyPos.x === x && trophyPos.y === y;

              return (
                <div
                  key={key}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-black shadow-sm transition-all ${
                    isWall
                      ? "bg-slate-700 text-slate-400 border-2 border-slate-800"
                      : isPlayer
                      ? "bg-yellow-300 border-4 border-yellow-500 scale-105"
                      : "bg-white border border-emerald-200"
                  }`}
                >
                  {isPlayer ? "🐘" : isTrophy ? "🏆" : isStar ? "⭐" : isWall ? "🧱" : ""}
                </div>
              );
            })}
          </div>

          {/* D-Pad Controls */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleMovePlayer(0, -1)}
              className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-2xl rounded-2xl shadow-lg active:scale-90"
            >
              ⬆️
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleMovePlayer(-1, 0)}
                className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-2xl rounded-2xl shadow-lg active:scale-90"
              >
                ⬅️
              </button>
              <button
                onClick={() => handleMovePlayer(0, 1)}
                className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-2xl rounded-2xl shadow-lg active:scale-90"
              >
                ⬇️
              </button>
              <button
                onClick={() => handleMovePlayer(1, 0)}
                className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-2xl rounded-2xl shadow-lg active:scale-90"
              >
                ➡️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- GAME 9: LE JARDIN MAGIQUE D'ADIBOU --- */}
      {activeGame === "garden" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-lime-300 shadow-xl flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <span>🌻</span> Le Jardin Magique d'Adibou
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                Récoltes effectuées : {gardenHarvests} 🧺 | Plante active : {selectedSeed.name}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {plantTypes.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => {
                    soundFx.playTap();
                    setSelectedSeed(plant);
                    setWaterLevel(0);
                    setSunLevel(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs shadow ${
                    selectedSeed.id === plant.id
                      ? "bg-lime-600 text-white ring-2 ring-lime-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {plant.grownIcon} {plant.name}
                </button>
              ))}
            </div>
          </div>

          {/* Garden Pot Visual */}
          <div className="relative w-full max-w-sm h-64 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-200 rounded-3xl border-4 border-amber-400 p-4 shadow-inner flex flex-col items-center justify-end overflow-hidden">
            {/* Sun Rays Effect */}
            {sunLevel > 0 && (
              <div className="absolute top-3 right-4 text-4xl animate-spin" style={{ animationDuration: "12s" }}>
                ☀️
              </div>
            )}

            {/* Plant Stage Visual */}
            <motion.div
              key={`${plantStage}-${selectedSeed.id}`}
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-7xl sm:text-8xl mb-6 z-10 filter drop-shadow-md cursor-pointer"
              onClick={() => {
                if (plantStage === 3) handleHarvestPlant();
              }}
            >
              {plantStage === 1 ? selectedSeed.seedIcon : plantStage === 2 ? "🌿" : selectedSeed.grownIcon}
            </motion.div>

            {/* Soil */}
            <div className="w-full h-16 bg-amber-800 border-t-4 border-amber-900 rounded-b-2xl flex items-center justify-center text-amber-200 font-bold text-xs">
              🤎 Terreau fertile
            </div>
          </div>

          {/* Care Actions */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={handleWaterPlant}
              disabled={waterLevel >= 3}
              className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm rounded-2xl shadow-lg disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              🚿 Arroser ({waterLevel}/3)
            </button>
            <button
              onClick={handleSunPlant}
              disabled={sunLevel >= 3}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-sm rounded-2xl shadow-lg disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              ☀️ Donner du Soleil ({sunLevel}/3)
            </button>
            {plantStage === 3 && (
              <motion.button
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                onClick={handleHarvestPlant}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl shadow-xl flex items-center gap-2"
              >
                🧺 Récolter Maintenant ! (+{selectedSeed.xp} XP)
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* --- GAME 10: ATELIER CUISINE TOCA & SMOOTHIE --- */}
      {activeGame === "cooking" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-amber-300 shadow-xl flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <span>🍹</span> Smoothie Maker Toca
              </h3>
              <p className="text-xs text-slate-600 font-bold">Choisis jusqu'à 4 ingrédients gourmands !</p>
            </div>
            {blenderList.length > 0 && (
              <button
                onClick={() => {
                  setBlenderList([]);
                  setSmoothieReady(false);
                }}
                className="px-3 py-1.5 bg-rose-100 text-rose-700 font-black text-xs rounded-xl"
              >
                Vider le bol
              </button>
            )}
          </div>

          {/* Blender Visual */}
          <div className="relative w-full max-w-sm h-64 bg-amber-50 rounded-3xl border-4 border-amber-300 p-4 shadow-inner flex flex-col items-center justify-between overflow-hidden">
            {/* Mascot Reaction */}
            <div className="text-4xl">
              {smoothieReady ? "🐘😍 Mmm !" : isBlending ? "🐘🌀 Vrrr !" : "🐘😋 Fanti a faim !"}
            </div>

            {/* Blender Container */}
            <div className={`relative w-36 h-40 bg-sky-200/50 border-4 border-sky-400 rounded-b-3xl rounded-t-lg flex flex-wrap items-end justify-center p-2 gap-1 overflow-hidden transition-all ${isBlending ? "animate-spin" : ""}`}>
              {blenderList.map((ing, idx) => (
                <span key={idx} className="text-2xl animate-bounce">
                  {ing.icon}
                </span>
              ))}
              {smoothieReady && (
                <div className="absolute inset-0 bg-pink-400/80 flex items-center justify-center text-4xl">
                  🍹
                </div>
              )}
            </div>

            {/* Blend Controls */}
            {smoothieReady ? (
              <button
                onClick={handleFeedFanti}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-lg active:scale-95 animate-pulse"
              >
                🐘 Donner le Smoothie à Fanti !
              </button>
            ) : (
              <button
                onClick={handleStartBlend}
                disabled={blenderList.length === 0 || isBlending}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-sm rounded-xl shadow-lg disabled:opacity-50 active:scale-95"
              >
                {isBlending ? "Mixage en cours..." : "🌪️ Mixe le Smoothie !"}
              </button>
            )}
          </div>

          {/* Ingredient Selector Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full max-w-md">
            {smoothieIngredients.map((ing) => (
              <button
                key={ing.id}
                onClick={() => handleAddIngredient(ing)}
                disabled={blenderList.length >= 4 || isBlending || smoothieReady}
                className={`p-3 rounded-2xl font-black text-center shadow border-2 border-white/50 flex flex-col items-center gap-1 transition-all ${ing.color} disabled:opacity-40 hover:scale-105 active:scale-95`}
              >
                <span className="text-3xl">{ing.icon}</span>
                <span className="text-[10px] text-slate-900 font-extrabold">{ing.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- GAME 11: CONSTRUCTEUR DE BRIQUES DUPLO --- */}
      {activeGame === "builder" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-indigo-300 shadow-xl flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <span>🧱</span> Atelier Briques Duplo World
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                Modèle : {activeBuilderModel.name} ({placedBlocks.length}/{activeBuilderModel.reqBlocks} briques)
              </p>
            </div>

            <div className="flex items-center gap-2">
              {builderModels.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => {
                    soundFx.playTap();
                    setActiveBuilderModel(mod);
                    setPlacedBlocks([]);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs shadow ${
                    activeBuilderModel.id === mod.id
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {mod.icon} {mod.name}
                </button>
              ))}
            </div>
          </div>

          {/* Construction Stage */}
          <div className="relative w-full max-w-sm h-64 bg-slate-100 rounded-3xl border-4 border-indigo-200 p-4 shadow-inner flex flex-col items-center justify-end gap-2 overflow-hidden">
            {placedBlocks.length === activeBuilderModel.reqBlocks && (
              <div className="absolute top-4 text-5xl animate-bounce">
                🎉 {activeBuilderModel.icon}
              </div>
            )}

            <div className="flex flex-col items-center gap-1 w-full max-w-[200px]">
              {placedBlocks.map((bg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  className={`w-full h-8 rounded-lg shadow-md border-2 border-white/50 ${bg} flex items-center justify-center font-black text-white text-xs`}
                >
                  🧱 Brique #{idx + 1}
                </motion.div>
              ))}
            </div>

            {placedBlocks.length === 0 && (
              <span className="text-xs text-slate-400 font-bold mb-8">
                Clique sur les briques ci-dessous pour construire ta structure !
              </span>
            )}
          </div>

          {/* Color Palettes */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {blockColors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleAddBuilderBlock(color.bg)}
                disabled={placedBlocks.length >= activeBuilderModel.reqBlocks}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs text-white shadow-lg border-2 ${color.border} ${color.bg} active:scale-95 disabled:opacity-40`}
              >
                + Brique {color.name}
              </button>
            ))}
            <button
              onClick={() => setPlacedBlocks([])}
              className="px-4 py-2.5 bg-slate-700 text-white font-black text-xs rounded-2xl shadow"
            >
              Recommencer
            </button>
          </div>
        </div>
      )}

      {/* --- GAME 12: SAFARI JUNGLE RUNNER UI --- */}
      {activeGame === "safari" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-emerald-300 shadow-xl flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <span>🦁</span> Safari Jungle Runner
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                Distance : <span className="text-emerald-600 font-black text-base">{safariDistance}m</span> | Diamants : <span className="text-amber-500 font-black text-base">{safariGems} 💎</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-600">Vies :</span>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="text-xl">
                  {i < safariLives ? "❤️" : "🖤"}
                </span>
              ))}
            </div>
          </div>

          {/* Jungle Runner Screen Stage */}
          <div className="relative w-full max-w-2xl h-64 bg-gradient-to-b from-sky-300 via-emerald-100 to-amber-200 rounded-3xl border-4 border-emerald-500 shadow-inner flex flex-col justify-end overflow-hidden">
            {/* Background Jungle Foliage */}
            <div className="absolute top-2 left-0 right-0 flex justify-between px-4 text-3xl opacity-80 pointer-events-none">
              <span>🌴</span>
              <span>🦜</span>
              <span>🌴</span>
              <span>🐒</span>
              <span>🌴</span>
            </div>

            {/* Fanti Runner Avatar */}
            <motion.div
              animate={
                safariPlayerAction === "jumping"
                  ? { y: -70, rotate: -10 }
                  : safariPlayerAction === "sliding"
                  ? { scaleY: 0.5, y: 20 }
                  : { y: [0, -6, 0] }
              }
              transition={
                safariPlayerAction === "ground"
                  ? { repeat: Infinity, duration: 0.3 }
                  : { duration: 0.2 }
              }
              className="absolute left-16 bottom-10 text-6xl sm:text-7xl z-20 filter drop-shadow-lg"
            >
              🐘
            </motion.div>

            {/* Obstacles & Items moving along ground */}
            {safariObstacles.map((obs) => (
              <div
                key={obs.id}
                style={{ left: `${obs.x}%` }}
                className={`absolute z-10 text-4xl sm:text-5xl transition-all ${
                  obs.type === "vine" ? "top-6" : "bottom-10"
                }`}
              >
                {obs.type === "boulder" && "🪨"}
                {obs.type === "vine" && "🌿"}
                {obs.type === "diamond" && "💎"}
                {obs.type === "banana" && "🍌"}
              </div>
            ))}

            {/* Ground Line */}
            <div className="w-full h-10 bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 border-t-4 border-amber-800 flex items-center justify-around text-xs text-white font-black overflow-hidden">
              <span className="animate-pulse">🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿</span>
            </div>

            {/* Game Over Overlay */}
            {!isSafariPlaying && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white gap-3 z-30">
                <span className="text-5xl animate-bounce">🏆</span>
                <h4 className="text-2xl font-black text-yellow-300">Course Terminée !</h4>
                <p className="text-sm font-bold text-emerald-200">
                  Distance : {safariDistance}m | Diamants récoltés : {safariGems} 💎
                </p>
                <button
                  onClick={startSafariGame}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-xl active:scale-95"
                >
                  🚀 Recommencer l'Aventure !
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons for Kids */}
          <div className="flex items-center gap-4 flex-wrap justify-center w-full max-w-md">
            <button
              onClick={handleSafariJump}
              disabled={!isSafariPlaying}
              className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg border-2 border-emerald-300 active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              ⬆️ SAUTER (Rocher 🪨)
            </button>
            <button
              onClick={handleSafariSlide}
              disabled={!isSafariPlaying}
              className="flex-1 py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-base sm:text-lg rounded-2xl shadow-lg border-2 border-yellow-200 active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              ⬇️ GLISSER (Liane 🌿)
            </button>
          </div>
        </div>
      )}

      {/* --- GAME 13: CHASSE AU TRÉSOR SPATIALE UI --- */}
      {activeGame === "space" && (
        <div className="w-full bg-white/90 backdrop-blur rounded-3xl p-6 border-4 border-cyan-300 shadow-xl flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <span>🚀</span> Chasse au Trésor Spatiale
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                Distance : <span className="text-cyan-600 font-black text-base">{spaceDistance} km</span> | Cristaux : <span className="text-purple-600 font-black text-base">{spaceCrystals} 🔮</span>
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
              <span className="text-xs font-black text-slate-700">Essence :</span>
              <div className="w-24 h-3 bg-slate-300 rounded-full overflow-hidden">
                <div
                  style={{ width: `${spaceFuel}%` }}
                  className={`h-full transition-all ${
                    spaceFuel > 40 ? "bg-emerald-500" : spaceFuel > 20 ? "bg-amber-400" : "bg-rose-500 animate-pulse"
                  }`}
                />
              </div>
              <span className="text-xs font-extrabold text-slate-800">{spaceFuel}%</span>
            </div>
          </div>

          {/* Space Flight Window Stage */}
          <div className="relative w-full max-w-md h-72 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 rounded-3xl border-4 border-cyan-400 shadow-2xl overflow-hidden flex flex-col justify-between p-2">
            {/* Twinkling Stars Background */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
              <div className="absolute top-4 left-10 text-xs animate-ping">✨</div>
              <div className="absolute top-12 right-12 text-xs animate-pulse">⭐</div>
              <div className="absolute top-32 left-1/3 text-xs animate-ping">✨</div>
              <div className="absolute top-48 right-1/4 text-xs animate-pulse">⭐</div>
            </div>

            {/* 3 Lane Dividers */}
            <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20 border-x border-cyan-500/30">
              <div className="w-1/3 border-r border-dashed border-cyan-300" />
              <div className="w-1/3 border-r border-dashed border-cyan-300" />
              <div className="w-1/3" />
            </div>

            {/* Falling Space Objects */}
            {spaceObjects.map((obj) => (
              <div
                key={obj.id}
                style={{
                  top: `${obj.y}%`,
                  left: obj.lane === 0 ? "16%" : obj.lane === 1 ? "50%" : "84%",
                }}
                className="absolute transform -translate-x-1/2 text-4xl sm:text-5xl transition-all z-10"
              >
                {obj.type === "asteroid" && "☄️"}
                {obj.type === "crystal" && "🔮"}
                {obj.type === "fuel" && "⛽"}
              </div>
            ))}

            {/* Player Rocket Ship */}
            <motion.div
              animate={{
                left: spaceLane === 0 ? "16%" : spaceLane === 1 ? "50%" : "84%",
                y: [0, -3, 0],
              }}
              transition={{
                left: { type: "spring", stiffness: 300, damping: 25 },
                y: { repeat: Infinity, duration: 0.5 },
              }}
              className="absolute bottom-4 transform -translate-x-1/2 text-5xl sm:text-6xl z-20 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
            >
              🚀
            </motion.div>

            {/* Game Over Screen */}
            {!isSpacePlaying && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white gap-3 z-30">
                <span className="text-5xl animate-bounce">🌌</span>
                <h4 className="text-2xl font-black text-cyan-300">Mission Spatiale Réussie !</h4>
                <p className="text-xs font-bold text-slate-300">
                  Distance : {spaceDistance} km | Cristaux récoltés : {spaceCrystals} 🔮
                </p>
                <button
                  onClick={startSpaceGame}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-black text-sm rounded-2xl shadow-xl active:scale-95"
                >
                  🚀 Décoller à nouveau !
                </button>
              </div>
            )}
          </div>

          {/* Steering Controls */}
          <div className="flex items-center gap-4 justify-center w-full max-w-sm">
            <button
              onClick={() => {
                soundFx.playTap();
                setSpaceLane((l) => (l === 0 ? 0 : ((l - 1) as 0 | 1 | 2)));
              }}
              disabled={!isSpacePlaying || spaceLane === 0}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl shadow-lg border-2 border-indigo-300 active:scale-95 disabled:opacity-40"
            >
              ⬅️ Gauche
            </button>
            <button
              onClick={() => {
                soundFx.playTap();
                setSpaceLane((l) => (l === 2 ? 2 : ((l + 1) as 0 | 1 | 2)));
              }}
              disabled={!isSpacePlaying || spaceLane === 2}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl shadow-lg border-2 border-indigo-300 active:scale-95 disabled:opacity-40"
            >
              Droite ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

