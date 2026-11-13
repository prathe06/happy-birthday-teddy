/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GameHeader } from './components/GameHeader';
import { Level1Welcome } from './components/levels/Level1Welcome';
import { Level2HeartCollection } from './components/levels/Level2HeartCollection';
import { Level3MemoryQuiz } from './components/levels/Level3MemoryQuiz';
import { Level4PhotographerMission } from './components/levels/Level4PhotographerMission';
import { Level5SecretEnvelope } from './components/levels/Level5SecretEnvelope';
import { Level6BirthdaySurprise } from './components/levels/Level6BirthdaySurprise';
import { GameProgress, LevelId } from './types/game';
import { soundManager } from './utils/sound';

const STORAGE_KEY = 'teddy_birthday_adventure_progress_v1';

const INITIAL_PROGRESS: GameProgress = {
  currentLevel: 1,
  highestUnlockedLevel: 1,
  completedLevels: [],
  goldenHeartsTotal: 0,
  quizSolvedIndices: [],
  missionAccepted: false,
  envelopeUnlocked: false,
};

function loadSavedProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<GameProgress>;
    const highest =
      parsed.highestUnlockedLevel &&
      parsed.highestUnlockedLevel >= 1 &&
      parsed.highestUnlockedLevel <= 6
        ? (parsed.highestUnlockedLevel as LevelId)
        : 1;
    const current =
      parsed.currentLevel &&
      parsed.currentLevel >= 1 &&
      parsed.currentLevel <= highest
        ? (parsed.currentLevel as LevelId)
        : 1;

    return {
      currentLevel: current,
      highestUnlockedLevel: highest,
      completedLevels: Array.isArray(parsed.completedLevels)
        ? parsed.completedLevels.filter((l): l is LevelId => l >= 1 && l <= 6)
        : [],
      goldenHeartsTotal:
        typeof parsed.goldenHeartsTotal === 'number'
          ? parsed.goldenHeartsTotal
          : 0,
      quizSolvedIndices: Array.isArray(parsed.quizSolvedIndices)
        ? parsed.quizSolvedIndices
        : [],
      missionAccepted: Boolean(parsed.missionAccepted),
      envelopeUnlocked: Boolean(parsed.envelopeUnlocked),
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export default function App() {
  const [progress, setProgress] = useState<GameProgress>(loadSavedProgress);
  const [bgmOn, setBgmOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [progress]);

  useEffect(() => {
    return () => {
      soundManager.stopBgm();
    };
  }, []);

  const advanceToLevel = (
    completedLevel: LevelId,
    nextLevel: LevelId,
    bonusHearts = 0
  ) => {
    setProgress((prev) => {
      const completedSet = new Set<LevelId>(prev.completedLevels);
      completedSet.add(completedLevel);
      const nextHighest = Math.max(
        prev.highestUnlockedLevel,
        nextLevel
      ) as LevelId;

      return {
        ...prev,
        currentLevel: nextLevel,
        highestUnlockedLevel: nextHighest,
        completedLevels: Array.from(completedSet),
        goldenHeartsTotal: prev.goldenHeartsTotal + bonusHearts,
      };
    });
  };

  const handleSelectLevel = (level: LevelId) => {
    if (level > progress.highestUnlockedLevel) return;
    soundManager.playClick();
    setShowResetConfirm(false);
    setProgress((prev) => ({
      ...prev,
      currentLevel: level,
    }));
  };

  const handleToggleBgm = () => {
    const active = soundManager.toggleBgm();
    setBgmOn(active);
  };

  const handleToggleSfx = () => {
    const next = !sfxOn;
    soundManager.setSfxEnabled(next);
    setSfxOn(next);
    if (next) {
      soundManager.playClick();
    }
  };

  const performFullReset = () => {
    soundManager.playClick();
    setShowResetConfirm(false);
    setProgress(INITIAL_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleHeaderResetClick = () => {
    soundManager.playClick();
    if (progress.highestUnlockedLevel === 1 && progress.goldenHeartsTotal === 0) {
      performFullReset();
    } else {
      setShowResetConfirm((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF0F6] via-[#FFFDF7] to-[#E0F2FE] text-[#4A3531]">
      <GameHeader
        currentLevel={progress.currentLevel}
        highestUnlockedLevel={progress.highestUnlockedLevel}
        completedLevels={progress.completedLevels}
        goldenHeartsTotal={progress.goldenHeartsTotal}
        bgmOn={bgmOn}
        sfxOn={sfxOn}
        onSelectLevel={handleSelectLevel}
        onToggleBgm={handleToggleBgm}
        onToggleSfx={handleToggleSfx}
        onResetGame={handleHeaderResetClick}
      />

      {/* Inline Reset Confirmation Bar (no browser alert/confirm) */}
      {showResetConfirm && (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 mt-2">
          <div className="bg-white border border-[#FCA5A5] rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs text-xs sm:text-sm">
            <span className="font-bold text-[#7F1D1D]">
              Restart the adventure from Level 1?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-[#FAF6F4] border border-[#E7D8D3] font-bold text-[#6E5650] hover:bg-[#F3ECE9] cursor-pointer"
              >
                Keep Playing
              </button>
              <button
                type="button"
                onClick={performFullReset}
                className="px-3 py-1.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] font-bold text-[#991B1B] hover:bg-[#FECACA] cursor-pointer"
              >
                Yes, Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Stage */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={progress.currentLevel}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {progress.currentLevel === 1 && (
              <Level1Welcome
                isAlreadyUnlocked={progress.highestUnlockedLevel > 1}
                onStart={() => {
                  soundManager.playLevelComplete();
                  advanceToLevel(1, 2, 0);
                }}
              />
            )}

            {progress.currentLevel === 2 && (
              <Level2HeartCollection
                alreadyCompleted={progress.completedLevels.includes(2)}
                onComplete={(heartsCollected) => {
                  advanceToLevel(2, 3, heartsCollected);
                }}
              />
            )}

            {progress.currentLevel === 3 && (
              <Level3MemoryQuiz
                solvedIndices={progress.quizSolvedIndices}
                onSolveQuestion={(index) => {
                  setProgress((prev) => {
                    if (prev.quizSolvedIndices.includes(index)) return prev;
                    return {
                      ...prev,
                      quizSolvedIndices: [...prev.quizSolvedIndices, index],
                      goldenHeartsTotal: prev.goldenHeartsTotal + 1,
                    };
                  });
                }}
                onComplete={() => {
                  advanceToLevel(3, 4, 0);
                }}
              />
            )}

            {progress.currentLevel === 4 && (
              <Level4PhotographerMission
                missionAccepted={progress.missionAccepted}
                onAcceptMission={() => {
                  setProgress((prev) => ({
                    ...prev,
                    missionAccepted: true,
                    goldenHeartsTotal: prev.missionAccepted
                      ? prev.goldenHeartsTotal
                      : prev.goldenHeartsTotal + 2,
                  }));
                }}
                onContinue={() => {
                  advanceToLevel(4, 5, 0);
                }}
              />
            )}

            {progress.currentLevel === 5 && (
              <Level5SecretEnvelope
                envelopeUnlocked={progress.envelopeUnlocked}
                onUnlockEnvelope={() => {
                  setProgress((prev) => ({
                    ...prev,
                    envelopeUnlocked: true,
                    goldenHeartsTotal: prev.envelopeUnlocked
                      ? prev.goldenHeartsTotal
                      : prev.goldenHeartsTotal + 3,
                  }));
                }}
                onContinue={() => {
                  advanceToLevel(5, 6, 0);
                }}
              />
            )}

            {progress.currentLevel === 6 && (
              <Level6BirthdaySurprise onPlayAgain={performFullReset} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
