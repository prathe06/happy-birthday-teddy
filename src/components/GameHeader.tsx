import React from 'react';
import { Lock, Music, RotateCcw, Volume2, VolumeX, Check } from 'lucide-react';
import { LevelId, LevelMeta } from '../types/game';
import { GoldenHeart } from './characters/GoldenHeart';

export const LEVELS: LevelMeta[] = [
  { id: 1, shortLabel: 'Welcome', title: 'The Welcome World' },
  { id: 2, shortLabel: 'Hearts', title: 'Golden Heart Collection' },
  { id: 3, shortLabel: 'Quiz', title: 'Our Little Memory Quiz' },
  { id: 4, shortLabel: 'Camera', title: "The Photographer's Mission" },
  { id: 5, shortLabel: 'Letter', title: 'The Secret Envelope' },
  { id: 6, shortLabel: 'Surprise', title: 'The Birthday Surprise' },
];

interface GameHeaderProps {
  currentLevel: LevelId;
  highestUnlockedLevel: LevelId;
  completedLevels: LevelId[];
  goldenHeartsTotal: number;
  bgmOn: boolean;
  sfxOn: boolean;
  onSelectLevel: (level: LevelId) => void;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  onResetGame: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  currentLevel,
  highestUnlockedLevel,
  completedLevels,
  goldenHeartsTotal,
  bgmOn,
  sfxOn,
  onSelectLevel,
  onToggleBgm,
  onToggleSfx,
  onResetGame,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4">
      <div className="bg-white/90 backdrop-blur-sm border border-[#F3DCE4] rounded-2xl shadow-sm px-3.5 py-2.5 sm:px-5 sm:py-3 flex flex-col gap-2.5">
        {/* Top Row: Title + Audio & Heart Stats */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-base sm:text-xl font-bold text-[#4A3531] truncate">
              Teddy&apos;s Little Birthday Adventure
            </h1>
            <p className="text-xs text-[#7D635D] truncate">
              A tiny adventure made just for you.
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Total Golden Hearts Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FEF9C3] border border-[#FDE047] text-[#854D0E]"
              title="Golden Hearts Collected"
            >
              <GoldenHeart size={18} glow={false} />
              <span className="font-display font-bold text-sm tabular-nums">
                {goldenHeartsTotal}
              </span>
            </div>

            {/* Optional Music Toggle (never autoplays) */}
            <button
              type="button"
              onClick={onToggleBgm}
              aria-label={bgmOn ? 'Mute background music' : 'Play background music'}
              title={bgmOn ? 'Music On (Click to mute)' : 'Music Off (Click to play)'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                bgmOn
                  ? 'bg-[#E0F2FE] border-[#7DD3FC] text-[#0369A1]'
                  : 'bg-[#FFFDF7] border-[#E7D8D3] text-[#6E5650] hover:bg-[#FFF5F7]'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{bgmOn ? 'Music On' : 'Music Off'}</span>
            </button>

            {/* SFX Toggle */}
            <button
              type="button"
              onClick={onToggleSfx}
              aria-label={sfxOn ? 'Mute sound effects' : 'Enable sound effects'}
              title={sfxOn ? 'Sound Effects On' : 'Sound Effects Off'}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-all cursor-pointer ${
                sfxOn
                  ? 'bg-[#FCE7F3] border-[#F9A8D4] text-[#9D174D]'
                  : 'bg-[#FFFDF7] border-[#E7D8D3] text-[#9CA3AF]'
              }`}
            >
              {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset Progress */}
            <button
              type="button"
              onClick={onResetGame}
              aria-label="Restart adventure from Level 1"
              title="Restart adventure"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FFFDF7] border border-[#E7D8D3] text-[#6E5650] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] hover:text-[#991B1B] transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Visible Sequential Level Progression */}
        <nav aria-label="Game levels" className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {LEVELS.map((lvl) => {
            const unlocked = lvl.id <= highestUnlockedLevel;
            const active = lvl.id === currentLevel;
            const completed = completedLevels.includes(lvl.id);

            return (
              <button
                key={lvl.id}
                type="button"
                disabled={!unlocked}
                onClick={() => unlocked && onSelectLevel(lvl.id)}
                title={unlocked ? `Level ${lvl.id}: ${lvl.title}` : `Complete previous level to unlock`}
                className={`flex-1 min-w-[78px] flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  active
                    ? 'bg-[#FFD700] border-[#D97706] text-[#4A3531] shadow-xs cursor-pointer'
                    : unlocked
                    ? completed
                      ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] hover:bg-[#D1FAE5] cursor-pointer'
                      : 'bg-[#E0F2FE] border-[#BAE6FD] text-[#075985] hover:bg-[#BAE6FD]/60 cursor-pointer'
                    : 'bg-[#F8F4F2] border-[#ECE3DF] text-[#A89691] cursor-not-allowed opacity-75'
                }`}
              >
                <span className="tabular-nums">{lvl.id}.</span>
                <span>{lvl.shortLabel}</span>
                {!unlocked ? (
                  <Lock className="w-3 h-3 shrink-0" />
                ) : completed && !active ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
