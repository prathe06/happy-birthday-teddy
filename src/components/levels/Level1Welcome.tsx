import React from 'react';
import { Camera, Heart, HelpCircle, Mail, PartyPopper, Play, Sparkles } from 'lucide-react';
import { BubuBear } from '../characters/BubuBear';
import { DuduBear } from '../characters/DuduBear';
import { GoldenHeart } from '../characters/GoldenHeart';

interface Level1WelcomeProps {
  onStart: () => void;
  isAlreadyUnlocked: boolean;
}

const ADVENTURE_STOPS = [
  { label: 'Meadow Hunt', icon: Heart, bg: 'bg-[#FEF9C3]', border: 'border-[#FDE047]', text: 'text-[#854D0E]' },
  { label: 'Memory Quiz', icon: HelpCircle, bg: 'bg-[#FCE7F3]', border: 'border-[#F9A8D4]', text: 'text-[#9D174D]' },
  { label: 'Photo Mission', icon: Camera, bg: 'bg-[#E0F2FE]', border: 'border-[#7DD3FC]', text: 'text-[#0369A1]' },
  { label: 'Secret Letter', icon: Mail, bg: 'bg-[#FFF3E0]', border: 'border-[#FDBA74]', text: 'text-[#9A3412]' },
  { label: 'Cake Party', icon: PartyPopper, bg: 'bg-[#ECFDF5]', border: 'border-[#6EE7B7]', text: 'text-[#065F46]' },
];

export const Level1Welcome: React.FC<Level1WelcomeProps> = ({
  onStart,
  isAlreadyUnlocked,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E0F2FE]/80 via-[#FFFDF7] to-[#FCE7F3]/60 border border-[#F3DCE4] rounded-3xl shadow-sm p-5 sm:p-9 text-center">
      {/* Pastel Sky Bunting Flags */}
      <svg
        viewBox="0 0 800 54"
        className="w-full max-w-2xl mx-auto mb-2 pointer-events-none"
        fill="none"
        aria-hidden="true"
      >
        <path d="M10 8Q400 38 790 8" stroke="#D4A383" strokeWidth="2.5" />
        {[
          { x: 60, y: 14, c: '#FBCFE8' },
          { x: 140, y: 21, c: '#FFD700' },
          { x: 220, y: 25, c: '#BAE6FD' },
          { x: 300, y: 27, c: '#FBCFE8' },
          { x: 380, y: 28, c: '#FFD700' },
          { x: 460, y: 27, c: '#BAE6FD' },
          { x: 540, y: 25, c: '#FBCFE8' },
          { x: 620, y: 21, c: '#FFD700' },
          { x: 700, y: 15, c: '#BAE6FD' },
        ].map((flag, i) => (
          <polygon
            key={i}
            points={`${flag.x - 18},${flag.y} ${flag.x + 18},${flag.y} ${flag.x},${flag.y + 24}`}
            fill={flag.c}
            stroke="#4A3531"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      {/* Floating Golden Hearts */}
      <div className="pointer-events-none absolute top-14 left-6 opacity-80 animate-float-slow">
        <GoldenHeart size={24} />
      </div>
      <div
        className="pointer-events-none absolute top-16 right-8 opacity-80 animate-float-slow"
        style={{ animationDelay: '0.9s' }}
      >
        <GoldenHeart size={22} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <p className="text-xs sm:text-sm font-bold tracking-wide text-[#9D174D] mb-2">
          Level 1 · The Welcome World
        </p>

        {/* Storybook Meadow Scene */}
        <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#E0F2FE]/60 via-[#FFFDF7] to-[#DCFCE7]/55 border border-[#EADAD3] px-5 pt-5 pb-4 my-2 overflow-hidden">
          {/* Little Sun & Cloud */}
          <div className="flex justify-between items-center px-2 mb-1 opacity-90">
            <div className="w-10 h-10 rounded-full bg-[#FDE047] border-2 border-[#F59E0B] shadow-2xs" />
            <div className="px-3 py-1 rounded-full bg-white/90 border border-[#BAE6FD] text-[11px] font-bold text-[#0369A1]">
              Birthday Quest Map
            </div>
          </div>

          <div className="flex items-end justify-center gap-3 sm:gap-7 py-2">
            <div className="flex flex-col items-center">
              <div className="mb-1 px-3 py-1 rounded-xl bg-[#FEF9C3] border border-[#FDE047] text-xs font-bold text-[#713F12] shadow-2xs">
                Welcome, Teddy!
              </div>
              <DuduBear mood="cheering" size={108} facing="right" />
              <span className="text-xs font-bold text-[#6E5650] mt-1">Dudu · Guide</span>
            </div>

            <div className="mb-12 animate-heart-bob">
              <GoldenHeart size={36} />
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-1 px-3 py-1 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-xs font-bold text-[#075985] shadow-2xs">
                Let&apos;s explore!
              </div>
              <BubuBear mood="happy" size={108} facing="left" />
              <span className="text-xs font-bold text-[#6E5650] mt-1">Bubu · Player</span>
            </div>
          </div>
        </div>

        {/* Exact Welcome Copy */}
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4A3531] mt-4">
          Hey Teddy! 💛
        </h2>

        <p className="mt-2.5 text-base sm:text-lg font-semibold text-[#5E4742] leading-relaxed">
          Someone has prepared a little adventure just for you!
        </p>

        <p className="mt-1 text-base sm:text-lg font-semibold text-[#7D635D]">
          Are you ready for your birthday mission?
        </p>

        {/* Mini Adventure Roadmap Preview */}
        <div className="mt-5 w-full grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ADVENTURE_STOPS.map((stop, idx) => {
            const Icon = stop.icon;
            return (
              <div
                key={stop.label}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-bold ${stop.bg} ${stop.border} ${stop.text} ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{stop.label}</span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-6 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#FFD700] hover:bg-[#FACC15] active:scale-[0.98] text-[#4A3531] font-display font-bold text-lg sm:text-xl border-2 border-[#B45309] shadow-[0_4px_0_#B45309] hover:shadow-[0_2px_0_#B45309] hover:translate-y-[2px] transition-all cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{isAlreadyUnlocked ? 'CONTINUE / START GAME' : 'START GAME'}</span>
          <Sparkles className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
