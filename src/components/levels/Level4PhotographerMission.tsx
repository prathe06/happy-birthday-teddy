import React, { useState } from 'react';
import { Camera, ArrowRightCircle, Check, SlidersHorizontal } from 'lucide-react';
import { BubuBear } from '../characters/BubuBear';
import { DuduBear } from '../characters/DuduBear';
import { GoldenHeart } from '../characters/GoldenHeart';
import { BearMood } from '../../types/game';
import { soundManager } from '../../utils/sound';

interface Level4PhotographerMissionProps {
  missionAccepted: boolean;
  onAcceptMission: () => void;
  onContinue: () => void;
}

type FrameTone = 'golden' | 'sky' | 'rose';
type PoseMode = 'smile' | 'cheer' | 'focus';

const TONE_STYLES: Record<FrameTone, { label: string; bg: string }> = {
  golden: { label: 'Golden Hour', bg: 'from-[#FEF9C3]/80 via-[#FFFDF7] to-[#FDE68A]/50' },
  sky: { label: 'Baby Blue', bg: 'from-[#E0F2FE]/80 via-[#FFFDF7] to-[#BAE6FD]/50' },
  rose: { label: 'Pastel Pink', bg: 'from-[#FCE7F3]/80 via-[#FFFDF7] to-[#FBCFE8]/50' },
};

const POSE_MOODS: Record<PoseMode, { label: string; dudu: BearMood; caption: string }> = {
  smile: { label: 'Sweet Smile', dudu: 'happy', caption: 'Natural & warm!' },
  cheer: { label: 'Big Cheer', dudu: 'cheering', caption: 'Hands up celebration!' },
  focus: { label: 'Candid Look', dudu: 'excited', caption: 'Ready for the click!' },
};

export const Level4PhotographerMission: React.FC<Level4PhotographerMissionProps> = ({
  missionAccepted,
  onAcceptMission,
  onContinue,
}) => {
  const [shutterActive, setShutterActive] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [tone, setTone] = useState<FrameTone>('golden');
  const [pose, setPose] = useState<PoseMode>('cheer');

  const handleMissionClick = () => {
    soundManager.playCameraShutter();
    setShutterActive(true);
    setFlashActive(true);

    window.setTimeout(() => {
      setFlashActive(false);
    }, 240);

    window.setTimeout(() => {
      setShutterActive(false);
      onAcceptMission();
      soundManager.playLevelComplete();
    }, 520);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#E0F2FE]/60 via-[#FFFDF7] to-[#FFF0F6]/70 border border-[#BAE6FD] rounded-3xl shadow-sm p-5 sm:p-8 text-center">
      {flashActive && (
        <div className="pointer-events-none fixed inset-0 bg-white/85 z-50 transition-opacity duration-200" />
      )}

      <div className="max-w-xl mx-auto flex flex-col items-center">
        <p className="text-xs sm:text-sm font-bold text-[#0369A1] mb-2">
          Level 4 · The Photographer&apos;s Mission
        </p>

        {/* Interactive Camera Viewfinder Studio */}
        <div
          className={`relative w-full max-w-md rounded-3xl bg-gradient-to-br ${TONE_STYLES[tone].bg} border-2 border-[#7DD3FC] p-5 sm:p-6 shadow-xs my-2 overflow-hidden transition-colors duration-300`}
        >
          {/* Viewfinder Corner Brackets */}
          <div className="pointer-events-none absolute top-3 left-3 w-5 h-5 border-t-3 border-l-3 border-[#F59E0B] rounded-tl-md" />
          <div className="pointer-events-none absolute top-3 right-3 w-5 h-5 border-t-3 border-r-3 border-[#F59E0B] rounded-tr-md" />
          <div className="pointer-events-none absolute bottom-3 left-3 w-5 h-5 border-b-3 border-l-3 border-[#F59E0B] rounded-bl-md" />
          <div className="pointer-events-none absolute bottom-3 right-3 w-5 h-5 border-b-3 border-r-3 border-[#F59E0B] rounded-br-md" />

          {/* Viewfinder HUD bar */}
          <div className="flex items-center justify-between text-[11px] font-bold text-[#5E4742] px-2 mb-1">
            <span>ISO 200 · f/1.8</span>
            <span>{POSE_MOODS[pose].caption}</span>
          </div>

          {/* Shutter Blades */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 bg-[#4A3531] transition-all duration-200 z-20 ${
              shutterActive ? 'h-1/2' : 'h-0'
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 bg-[#4A3531] transition-all duration-200 z-20 ${
              shutterActive ? 'h-1/2' : 'h-0'
            }`}
          />

          <div className="flex items-end justify-center gap-3 sm:gap-5 py-2">
            <BubuBear mood="camera" size={114} facing="right" />
            <div className="mb-10 animate-heart-bob">
              <GoldenHeart size={28} />
            </div>
            <DuduBear
              mood={missionAccepted ? 'celebrating' : POSE_MOODS[pose].dudu}
              size={106}
              facing="left"
            />
          </div>

          {/* Interactive Viewfinder Controls */}
          <div className="mt-3 pt-3 border-t border-black/10 flex flex-col gap-2 text-xs">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1 font-bold text-[#6E5650] mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter:
              </span>
              {(Object.keys(TONE_STYLES) as FrameTone[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setTone(key);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    tone === key
                      ? 'bg-[#FFD700] border-[#B45309] text-[#4A3531]'
                      : 'bg-white/80 border-[#E2D4CE] text-[#6E5650] hover:bg-white'
                  }`}
                >
                  {TONE_STYLES[key].label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="font-bold text-[#6E5650] mr-1">Dudu Pose:</span>
              {(Object.keys(POSE_MOODS) as PoseMode[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setPose(key);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    pose === key
                      ? 'bg-[#E0F2FE] border-[#0284C7] text-[#075985]'
                      : 'bg-white/80 border-[#E2D4CE] text-[#6E5650] hover:bg-white'
                  }`}
                >
                  {POSE_MOODS[key].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exact Mission Copy */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3531] mt-4">
          Photographer sir, one important mission awaits!
        </h2>

        <p className="mt-2.5 text-base sm:text-lg font-semibold text-[#5E4742]">
          Capture one perfect picture together in our next meet.
        </p>

        {!missionAccepted ? (
          <button
            type="button"
            onClick={handleMissionClick}
            className="mt-6 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#FFD700] hover:bg-[#FACC15] active:scale-[0.98] text-[#4A3531] font-display font-bold text-lg border-2 border-[#B45309] shadow-[0_4px_0_#B45309] cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>Mission Accepted!</span>
          </button>
        ) : (
          <div className="mt-6 w-full max-w-md flex flex-col items-center gap-4">
            <div className="w-full bg-white border-2 border-dashed border-[#F59E0B] rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#FEF9C3] border border-[#FDE047] flex items-center justify-center shrink-0">
                  <GoldenHeart size={26} glow={false} />
                </div>
                <div>
                  <p className="font-display font-bold text-sm sm:text-base text-[#4A3531] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Next Meet Photo Pass Reserved!</span>
                  </p>
                  <p className="text-xs sm:text-sm text-[#6E5650]">
                    Preset saved: {TONE_STYLES[tone].label} · {POSE_MOODS[pose].label}. Ready for our next meet!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onContinue();
              }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FFD700] hover:bg-[#FACC15] text-[#4A3531] font-display font-bold text-base sm:text-lg border-2 border-[#B45309] shadow-[0_4px_0_#B45309] cursor-pointer"
            >
              <span>Unlock Level 5</span>
              <ArrowRightCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
