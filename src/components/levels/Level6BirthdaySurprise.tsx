import React, { useEffect, useState } from 'react';
import { Flame, Music, RotateCcw, Sparkles } from 'lucide-react';
import { BubuBear } from '../characters/BubuBear';
import { DuduBear } from '../characters/DuduBear';
import { GoldenHeart } from '../characters/GoldenHeart';
import { soundManager } from '../../utils/sound';

interface Level6BirthdaySurpriseProps {
  onPlayAgain: () => void;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  kind: 'heart' | 'ribbon';
  color: string;
  size: number;
}

const CONFETTI_PIECES: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: (i * 37 + 5) % 96,
  delay: (i % 7) * 0.65,
  duration: 4.0 + (i % 4) * 0.9,
  kind: i % 2 === 0 ? 'heart' : 'ribbon',
  color: ['#FFD700', '#7DD3FC', '#FBCFE8', '#FDE047'][i % 4],
  size: i % 2 === 0 ? 18 + (i % 3) * 4 : 10,
}));

const WISH_BALLOONS = [
  {
    id: 0,
    label: 'Wish #1',
    color: 'bg-[#FEF9C3] border-[#FDE047] text-[#854D0E]',
    wish: 'May every sunrise bring you calm mornings and big reasons to smile!',
  },
  {
    id: 1,
    label: 'Wish #2',
    color: 'bg-[#E0F2FE] border-[#7DD3FC] text-[#075985]',
    wish: 'May your lens always catch the purest light and happiest stories!',
  },
  {
    id: 2,
    label: 'Wish #3',
    color: 'bg-[#FCE7F3] border-[#F9A8D4] text-[#9D174D]',
    wish: 'Wishing you unstoppable success, good health, and joyful adventures!',
  },
];

export const Level6BirthdaySurprise: React.FC<Level6BirthdaySurpriseProps> = ({
  onPlayAgain,
}) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [openedWishes, setOpenedWishes] = useState<number[]>([]);
  const [confettiKey, setConfettiKey] = useState(0);

  useEffect(() => {
    soundManager.playBirthdayCelebration();
  }, []);

  const toggleCandles = () => {
    soundManager.playClick();
    setCandlesLit((prev) => {
      const next = !prev;
      if (!next) {
        soundManager.playLevelComplete();
      }
      return next;
    });
  };

  const popBalloon = (id: number) => {
    if (openedWishes.includes(id)) return;
    soundManager.playHeartCollect();
    setOpenedWishes((prev) => [...prev, id]);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF0F6] via-[#FFFDF7] to-[#E0F2FE]/80 border border-[#F3DCE4] rounded-3xl shadow-sm p-6 sm:p-10 text-center">
      {/* Falling Confetti & Golden Yellow Hearts */}
      <div
        key={confettiKey}
        className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      >
        {CONFETTI_PIECES.map((piece) => (
          <div
            key={piece.id}
            className="absolute top-0"
            style={{
              left: `${piece.left}%`,
              animation: `confettiFall ${piece.duration}s linear ${piece.delay}s infinite`,
            }}
          >
            {piece.kind === 'heart' ? (
              <GoldenHeart size={piece.size} glow={false} />
            ) : (
              <span
                className="block rounded-sm"
                style={{
                  width: piece.size,
                  height: piece.size * 1.5,
                  backgroundColor: piece.color,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <p className="text-xs sm:text-sm font-bold text-[#9D174D] mb-2">
          Final Level · The Birthday Surprise
        </p>

        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#4A3531] tracking-tight">
          HAPPY BIRTHDAY TEDDY!
        </h2>

        {/* Celebrating Dudu & Bubu + Interactive Pastel Birthday Cake */}
        <div className="mt-5 mb-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <DuduBear mood="celebrating" partyHat size={112} facing="right" />

          <div className="flex flex-col items-center">
            <svg
              width="176"
              height="160"
              viewBox="0 0 180 165"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Birthday cake for Teddy"
            >
              <ellipse cx="90" cy="148" rx="76" ry="11" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="2.5" />
              <rect x="28" y="102" width="124" height="44" rx="12" fill="#FBCFE8" stroke="#4A3531" strokeWidth="3" />
              <path
                d="M28 112C38 121 48 121 58 112C68 121 78 121 88 112C98 121 108 121 118 112C128 121 138 121 152 112"
                stroke="#FFFDF7"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <rect x="46" y="64" width="88" height="40" rx="11" fill="#FFFDF7" stroke="#4A3531" strokeWidth="3" />
              <path
                d="M46 74C56 82 66 82 76 74C86 82 96 82 106 74C116 82 126 82 134 74"
                stroke="#BAE6FD"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="62" cy="130" r="4" fill="#FFD700" />
              <circle cx="90" cy="132" r="4.5" fill="#FFD700" />
              <circle cx="118" cy="130" r="4" fill="#FFD700" />

              {[68, 90, 112].map((cx, i) => (
                <g key={cx}>
                  <rect
                    x={cx - 4}
                    y="38"
                    width="8"
                    height="26"
                    rx="3"
                    fill={i === 1 ? '#FFD700' : '#BAE6FD'}
                    stroke="#4A3531"
                    strokeWidth="2.2"
                  />
                  <line x1={cx} y1="38" x2={cx} y2="33" stroke="#4A3531" strokeWidth="2" />
                  {candlesLit && (
                    <g className="animate-candle" style={{ transformOrigin: `${cx}px 30px` }}>
                      <path
                        d={`M${cx} 17C${cx - 5} 24 ${cx - 5} 31 ${cx} 33C${cx + 5} 31 ${cx + 5} 24 ${cx} 17Z`}
                        fill="#F59E0B"
                      />
                      <path
                        d={`M${cx} 21C${cx - 2.5} 25 ${cx - 2.5} 29 ${cx} 31C${cx + 2.5} 29 ${cx + 2.5} 25 ${cx} 21Z`}
                        fill="#FEF08A"
                      />
                    </g>
                  )}
                </g>
              ))}
            </svg>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
              <button
                type="button"
                onClick={toggleCandles}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FEF9C3] border border-[#FDE047] text-xs font-bold text-[#713F12] shadow-2xs cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{candlesLit ? 'Blow Candles' : 'Relight Candles'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playBirthdayCelebration();
                  setConfettiKey((k) => k + 1);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#E0F2FE] border border-[#7DD3FC] text-xs font-bold text-[#075985] shadow-2xs cursor-pointer"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Play Birthday Tune</span>
              </button>
            </div>
          </div>

          <BubuBear mood="celebrating" partyHat size={112} facing="left" />
        </div>

        {/* Interactive Pop-to-Reveal Wish Balloons (Fresh Wishes!) */}
        <div className="w-full mt-3 mb-2">
          <p className="text-xs font-bold text-[#7D635D] mb-2">
            Tap each party balloon for a birthday wish ({openedWishes.length}/3 opened):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {WISH_BALLOONS.map((b) => {
              const opened = openedWishes.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => popBalloon(b.id)}
                  className={`rounded-2xl border p-3.5 text-center transition-all min-h-[76px] flex flex-col items-center justify-center ${
                    opened
                      ? 'bg-white border-[#EADAD3] text-[#4A3531] cursor-default'
                      : `${b.color} hover:scale-[1.02] active:scale-95 cursor-pointer`
                  }`}
                >
                  {opened ? (
                    <p className="text-xs sm:text-sm font-semibold leading-snug">
                      {b.wish}
                    </p>
                  ) : (
                    <div className="flex items-center gap-1.5 font-display font-bold text-sm">
                      <GoldenHeart size={18} glow={false} />
                      <span>Pop {b.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exact Final Message */}
        <div className="mt-4 bg-white/90 border border-[#F3DCE4] rounded-2xl px-5 py-5 sm:px-8 max-w-xl shadow-2xs">
          <div className="flex justify-center mb-2">
            <GoldenHeart size={30} className="animate-heart-bob" />
          </div>
          <p className="text-base sm:text-lg font-bold text-[#4A3531] leading-relaxed">
            Two meets. Two matching outfit memories. Zero pictures together. And
            one little adventure made just for you. 💛
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="mt-7 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#FFD700] hover:bg-[#FACC15] active:scale-[0.98] text-[#4A3531] font-display font-bold text-lg border-2 border-[#B45309] shadow-[0_4px_0_#B45309] cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>PLAY AGAIN</span>
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
