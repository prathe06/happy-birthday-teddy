import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, ArrowRightCircle } from 'lucide-react';
import { BubuBear } from '../characters/BubuBear';
import { DuduBear } from '../characters/DuduBear';
import { GoldenHeart } from '../characters/GoldenHeart';
import { soundManager } from '../../utils/sound';

interface Level2HeartCollectionProps {
  onComplete: (heartsCollected: number) => void;
  alreadyCompleted: boolean;
}

interface HeartItem {
  id: number;
  x: number;
  y: number;
  value: 1 | 2;
}

interface Obstacle {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'cloud' | 'bush' | 'mushroom' | 'stone';
}

interface PopParticle {
  id: number;
  x: number;
  y: number;
  label: string;
}

const ARENA_W = 640;
const ARENA_H = 400;
const PLAYER_RADIUS = 24;
const HEART_RADIUS = 20;
const TARGET_HEARTS = 12;
const MAX_ACTIVE_HEARTS = 4;
const PLAYER_SPEED = 240;

const OBSTACLES: Obstacle[] = [
  { id: 'obs-1', x: 145, y: 85, w: 84, h: 52, kind: 'cloud' },
  { id: 'obs-2', x: 410, y: 85, w: 84, h: 54, kind: 'bush' },
  { id: 'obs-3', x: 155, y: 260, w: 78, h: 52, kind: 'mushroom' },
  { id: 'obs-4', x: 405, y: 260, w: 86, h: 50, kind: 'stone' },
];

function rectsOverlapWithCircle(
  cx: number,
  cy: number,
  r: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < r * r;
}

function collidesAnyObstacle(x: number, y: number, radius: number): boolean {
  return OBSTACLES.some((o) =>
    rectsOverlapWithCircle(x, y, radius, o.x, o.y, o.w, o.h)
  );
}

function spawnSafeHeart(
  id: number,
  playerX: number,
  playerY: number,
  existing: HeartItem[],
  allowBonus: boolean
): HeartItem {
  const pad = 42;
  const value: 1 | 2 = allowBonus && Math.random() < 0.28 ? 2 : 1;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const x = pad + Math.random() * (ARENA_W - pad * 2);
    const y = pad + Math.random() * (ARENA_H - pad * 2);

    if (collidesAnyObstacle(x, y, HEART_RADIUS + 10)) continue;
    if (Math.hypot(x - playerX, y - playerY) < 90) continue;
    if (existing.some((h) => Math.hypot(h.x - x, h.y - y) < 68)) continue;
    return { id, x, y, value };
  }
  return { id, x: ARENA_W / 2, y: ARENA_H / 2, value: 1 };
}

export const Level2HeartCollection: React.FC<Level2HeartCollectionProps> = ({
  onComplete,
  alreadyCompleted,
}) => {
  const [playerPos, setPlayerPos] = useState({ x: 320, y: 205 });
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  const [bubuHappyFlash, setBubuHappyFlash] = useState(false);

  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [collected, setCollected] = useState(0);
  const [particles, setParticles] = useState<PopParticle[]>([]);
  const [completedRun, setCompletedRun] = useState(false);

  const playerRef = useRef({ x: 320, y: 205 });
  const keysRef = useRef<Set<string>>(new Set());
  const pointerTargetRef = useRef<{ x: number; y: number } | null>(null);
  const heartsRef = useRef<HeartItem[]>([]);
  const collectedRef = useRef(0);
  const nextHeartIdRef = useRef(1);
  const nextParticleIdRef = useRef(1);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const completedRef = useRef(false);

  const initHearts = useCallback(() => {
    const initial: HeartItem[] = [];
    for (let i = 0; i < MAX_ACTIVE_HEARTS; i += 1) {
      const item = spawnSafeHeart(
        nextHeartIdRef.current++,
        320,
        205,
        initial,
        i === 0
      );
      initial.push(item);
    }
    heartsRef.current = initial;
    setHearts(initial);
  }, []);

  const resetMiniGame = useCallback(() => {
    playerRef.current = { x: 320, y: 205 };
    setPlayerPos({ x: 320, y: 205 });
    setFacing('right');
    setIsWalking(false);
    collectedRef.current = 0;
    setCollected(0);
    completedRef.current = false;
    setCompletedRun(false);
    pointerTargetRef.current = null;
    keysRef.current.clear();
    initHearts();
  }, [initHearts]);

  useEffect(() => {
    initHearts();
  }, [initHearts]);

  useEffect(() => {
    const validKeys = new Set([
      'arrowup',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'w',
      'a',
      's',
      'd',
    ]);

    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (validKeys.has(k)) {
        e.preventDefault();
        keysRef.current.add(k);
        pointerTargetRef.current = null;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current.delete(k);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!completedRef.current) {
        let dx = 0;
        let dy = 0;

        const keys = keysRef.current;
        if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
        if (keys.has('arrowright') || keys.has('d')) dx += 1;
        if (keys.has('arrowup') || keys.has('w')) dy -= 1;
        if (keys.has('arrowdown') || keys.has('s')) dy += 1;

        if (dx === 0 && dy === 0 && pointerTargetRef.current) {
          const tx = pointerTargetRef.current.x - playerRef.current.x;
          const ty = pointerTargetRef.current.y - playerRef.current.y;
          const dist = Math.hypot(tx, ty);
          if (dist > 8) {
            dx = tx / dist;
            dy = ty / dist;
          } else {
            pointerTargetRef.current = null;
          }
        }

        const moving = dx !== 0 || dy !== 0;
        setIsWalking(moving);

        if (moving) {
          const len = Math.hypot(dx, dy);
          const vx = (dx / len) * PLAYER_SPEED * dt;
          const vy = (dy / len) * PLAYER_SPEED * dt;

          if (dx < -0.1) setFacing('left');
          if (dx > 0.1) setFacing('right');

          const nextX = Math.max(
            PLAYER_RADIUS + 8,
            Math.min(ARENA_W - PLAYER_RADIUS - 8, playerRef.current.x + vx)
          );
          if (!collidesAnyObstacle(nextX, playerRef.current.y, PLAYER_RADIUS)) {
            playerRef.current.x = nextX;
          }

          const nextY = Math.max(
            PLAYER_RADIUS + 8,
            Math.min(ARENA_H - PLAYER_RADIUS - 8, playerRef.current.y + vy)
          );
          if (!collidesAnyObstacle(playerRef.current.x, nextY, PLAYER_RADIUS)) {
            playerRef.current.y = nextY;
          }

          setPlayerPos({ x: playerRef.current.x, y: playerRef.current.y });
        }

        const currentHearts = heartsRef.current;
        let gainedPoints = 0;
        const remaining: HeartItem[] = [];

        for (const h of currentHearts) {
          const dist = Math.hypot(
            h.x - playerRef.current.x,
            h.y - playerRef.current.y
          );
          if (dist < PLAYER_RADIUS + HEART_RADIUS) {
            gainedPoints += h.value;
            const pid = nextParticleIdRef.current++;
            setParticles((prev) => [
              ...prev,
              { id: pid, x: h.x, y: h.y, label: h.value === 2 ? '+2' : '+1' },
            ]);
            window.setTimeout(() => {
              setParticles((prev) => prev.filter((p) => p.id !== pid));
            }, 850);
          } else {
            remaining.push(h);
          }
        }

        if (gainedPoints > 0) {
          soundManager.playHeartCollect();
          setBubuHappyFlash(true);
          window.setTimeout(() => setBubuHappyFlash(false), 380);

          const updatedTotal = Math.min(
            TARGET_HEARTS,
            collectedRef.current + gainedPoints
          );
          collectedRef.current = updatedTotal;
          setCollected(updatedTotal);

          const stillNeeded = TARGET_HEARTS - updatedTotal;
          while (remaining.length < Math.min(MAX_ACTIVE_HEARTS, stillNeeded)) {
            remaining.push(
              spawnSafeHeart(
                nextHeartIdRef.current++,
                playerRef.current.x,
                playerRef.current.y,
                remaining,
                stillNeeded >= 2
              )
            );
          }

          heartsRef.current = remaining;
          setHearts([...remaining]);

          if (updatedTotal >= TARGET_HEARTS) {
            completedRef.current = true;
            setCompletedRun(true);
            setIsWalking(false);
            soundManager.playLevelComplete();
          }
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const setVirtualKey = (key: string, active: boolean) => {
    if (active) {
      keysRef.current.add(key);
      pointerTargetRef.current = null;
    } else {
      keysRef.current.delete(key);
    }
  };

  const handleArenaPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (completedRef.current || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const lx = ((e.clientX - rect.left) / rect.width) * ARENA_W;
    const ly = ((e.clientY - rect.top) / rect.height) * ARENA_H;
    pointerTargetRef.current = { x: lx, y: ly };
  };

  const progressPct = Math.round((collected / TARGET_HEARTS) * 100);

  const getDuduHint = () => {
    if (completedRun) return 'Level 3 is unlocked and waiting for you!';
    if (collected === 0) return 'Catch regular (+1) & big glowing (+2) Golden Hearts!';
    if (collected < 6) return 'Great start! Keep guiding Bubu around the meadow!';
    if (collected < 10) return 'Over halfway there! Watch out for the cosy bushes!';
    return 'Almost there—just a couple more Golden Hearts!';
  };

  return (
    <section className="bg-white/95 border border-[#F3DCE4] rounded-3xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-bold text-[#0369A1]">
            Level 2 · Golden Heart Collection
          </p>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#4A3531]">
            Help Bubu collect {TARGET_HEARTS} Golden Hearts!
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FEF9C3] border border-[#FDE047]">
            <GoldenHeart size={22} glow={false} />
            <span className="font-display font-bold text-base text-[#713F12] tabular-nums">
              {collected} / {TARGET_HEARTS}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              resetMiniGame();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FFFDF7] border border-[#E7D8D3] text-xs font-bold text-[#6E5650] hover:bg-[#FFF5F7] cursor-pointer min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3.5 rounded-full bg-[#F5ECE8] border border-[#EADAD3] overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-[#FACC15] to-[#F59E0B] transition-all duration-200 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Playable 2D Pastel Meadow Arena */}
      <div
        ref={arenaRef}
        onPointerDown={(e) => {
          handleArenaPointer(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons > 0) handleArenaPointer(e);
        }}
        className="relative w-full aspect-[16/10] max-h-[430px] rounded-3xl overflow-hidden border-2 border-[#E2D4CE] bg-gradient-to-br from-[#ECFDF5]/60 via-[#FFFDF7] to-[#E0F2FE]/80 select-none touch-none cursor-crosshair"
      >
        {/* Decorative meadow path & wildflowers */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-65"
          viewBox="0 0 640 400"
          preserveAspectRatio="none"
        >
          <path
            d="M40 340 Q 200 220 320 205 T 600 70"
            stroke="#FDE68A"
            strokeWidth="28"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
          <circle cx="70" cy="60" r="18" fill="#FBCFE8" opacity="0.4" />
          <circle cx="570" cy="340" r="24" fill="#BAE6FD" opacity="0.45" />
          <circle cx="320" cy="48" r="12" fill="#FEF08A" opacity="0.55" />
          <circle cx="80" cy="340" r="13" fill="#FEF08A" opacity="0.5" />
        </svg>

        {/* Obstacles */}
        {OBSTACLES.map((obs) => (
          <div
            key={obs.id}
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: `${(obs.x / ARENA_W) * 100}%`,
              top: `${(obs.y / ARENA_H) * 100}%`,
              width: `${(obs.w / ARENA_W) * 100}%`,
              height: `${(obs.h / ARENA_H) * 100}%`,
            }}
          >
            {obs.kind === 'cloud' && (
              <svg viewBox="0 0 90 56" className="w-full h-full drop-shadow-xs">
                <path
                  d="M20 46H72C80 46 86 40 86 32C86 25 80 19 73 19C71 10 63 4 53 4C43 4 35 10 33 18C31 17 28 16 25 16C15 16 8 23 8 32C8 40 13 46 20 46Z"
                  fill="#E0F2FE"
                  stroke="#7DD3FC"
                  strokeWidth="3"
                />
              </svg>
            )}
            {obs.kind === 'bush' && (
              <svg viewBox="0 0 90 58" className="w-full h-full drop-shadow-xs">
                <path
                  d="M15 48H75C82 48 86 41 84 33C82 26 76 22 69 22C66 11 56 5 45 5C34 5 24 11 21 22C14 22 8 27 6 34C4 41 8 48 15 48Z"
                  fill="#FCE7F3"
                  stroke="#F9A8D4"
                  strokeWidth="3"
                />
                <circle cx="32" cy="28" r="4" fill="#FFD700" />
                <circle cx="56" cy="24" r="4" fill="#FFD700" />
                <circle cx="45" cy="36" r="3.5" fill="#FFFDF7" />
              </svg>
            )}
            {obs.kind === 'mushroom' && (
              <svg viewBox="0 0 84 56" className="w-full h-full drop-shadow-xs">
                <rect x="32" y="28" width="20" height="22" rx="8" fill="#FFFDF7" stroke="#D6C1B8" strokeWidth="3" />
                <path
                  d="M12 31C12 15 26 6 42 6C58 6 72 15 72 31Z"
                  fill="#FBCFE8"
                  stroke="#F472B6"
                  strokeWidth="3"
                />
                <circle cx="31" cy="18" r="4.5" fill="#FFFDF7" />
                <circle cx="51" cy="21" r="3.5" fill="#FFFDF7" />
              </svg>
            )}
            {obs.kind === 'stone' && (
              <svg viewBox="0 0 90 54" className="w-full h-full drop-shadow-xs">
                <ellipse cx="45" cy="30" rx="38" ry="18" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
                <ellipse cx="36" cy="24" rx="14" ry="6" fill="#F8FAFC" opacity="0.7" />
              </svg>
            )}
          </div>
        ))}

        {/* Golden Yellow Hearts (+1 normal & +2 mega golden heart) */}
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-heart-bob flex items-center justify-center"
            style={{
              left: `${(heart.x / ARENA_W) * 100}%`,
              top: `${(heart.y / ARENA_H) * 100}%`,
              width:
                heart.value === 2
                  ? 'clamp(36px, 7.2vw, 48px)'
                  : 'clamp(28px, 5.8vw, 38px)',
              height:
                heart.value === 2
                  ? 'clamp(36px, 7.2vw, 48px)'
                  : 'clamp(28px, 5.8vw, 38px)',
            }}
          >
            {heart.value === 2 && (
              <span className="absolute -top-2 -right-2 px-1 rounded-md bg-[#FEF9C3] border border-[#D97706] text-[10px] font-display font-bold text-[#854D0E]">
                +2
              </span>
            )}
            <GoldenHeart size={heart.value === 2 ? 46 : 36} className="w-full h-full" />
          </div>
        ))}

        {/* Collection Particle Popups */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pop-fade font-display font-bold text-sm sm:text-base text-[#B45309] flex items-center gap-1"
            style={{
              left: `${(p.x / ARENA_W) * 100}%`,
              top: `${(p.y / ARENA_H) * 100}%`,
            }}
          >
            <span>{p.label}</span>
            <GoldenHeart size={16} glow={false} />
          </div>
        ))}

        {/* Playable Bubu Character */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: `${(playerPos.x / ARENA_W) * 100}%`,
            top: `${(playerPos.y / ARENA_H) * 100}%`,
            width: 'clamp(46px, 9vw, 66px)',
            height: 'clamp(46px, 9vw, 66px)',
          }}
        >
          <BubuBear
            mood={completedRun ? 'celebrating' : bubuHappyFlash ? 'excited' : 'idle'}
            facing={facing}
            walking={isWalking}
            size={64}
            className="w-full h-full"
          />
        </div>

        {/* Level Complete Overlay */}
        {completedRun && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center p-5 text-center z-20">
            <div className="flex items-center gap-3 mb-2">
              <DuduBear mood="cheering" size={82} facing="right" />
              <GoldenHeart size={34} className="animate-heart-bob" />
              <BubuBear mood="celebrating" size={82} facing="left" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3531]">
              Awesome Job, Teddy! 💛
            </h3>
            <p className="text-sm sm:text-base font-semibold text-[#6E5650] mt-1">
              You collected all {TARGET_HEARTS} Golden Hearts and unlocked Level 3!
            </p>
            <button
              type="button"
              onClick={() => onComplete(TARGET_HEARTS)}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFD700] hover:bg-[#FACC15] text-[#4A3531] font-display font-bold text-base sm:text-lg border-2 border-[#B45309] shadow-[0_3px_0_#B45309] transition-all cursor-pointer"
            >
              <span>Unlock Level 3</span>
              <ArrowRightCircle className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <DuduBear mood={completedRun ? 'celebrating' : 'happy'} size={58} facing="right" />
          <div className="bg-[#FFFDF7] border border-[#EADAD3] rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#5E4742]">
            <p className="font-bold text-[#4A3531]">{getDuduHint()}</p>
            <p className="text-[11px] sm:text-xs text-[#7D635D] mt-0.5">
              Move with Arrow Keys / WASD, tap inside the meadow, or use the D-pad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 w-[156px] shrink-0 select-none touch-none">
          <div />
          <button
            type="button"
            aria-label="Move Up"
            onPointerDown={() => setVirtualKey('arrowup', true)}
            onPointerUp={() => setVirtualKey('arrowup', false)}
            onPointerLeave={() => setVirtualKey('arrowup', false)}
            onPointerCancel={() => setVirtualKey('arrowup', false)}
            className="h-11 rounded-xl bg-[#E0F2FE] active:bg-[#7DD3FC] border border-[#7DD3FC] text-[#075985] flex items-center justify-center shadow-2xs cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />
          <button
            type="button"
            aria-label="Move Left"
            onPointerDown={() => setVirtualKey('arrowleft', true)}
            onPointerUp={() => setVirtualKey('arrowleft', false)}
            onPointerLeave={() => setVirtualKey('arrowleft', false)}
            onPointerCancel={() => setVirtualKey('arrowleft', false)}
            className="h-11 rounded-xl bg-[#E0F2FE] active:bg-[#7DD3FC] border border-[#7DD3FC] text-[#075985] flex items-center justify-center shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Move Down"
            onPointerDown={() => setVirtualKey('arrowdown', true)}
            onPointerUp={() => setVirtualKey('arrowdown', false)}
            onPointerLeave={() => setVirtualKey('arrowdown', false)}
            onPointerCancel={() => setVirtualKey('arrowdown', false)}
            className="h-11 rounded-xl bg-[#E0F2FE] active:bg-[#7DD3FC] border border-[#7DD3FC] text-[#075985] flex items-center justify-center shadow-2xs cursor-pointer"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Move Right"
            onPointerDown={() => setVirtualKey('arrowright', true)}
            onPointerUp={() => setVirtualKey('arrowright', false)}
            onPointerLeave={() => setVirtualKey('arrowright', false)}
            onPointerCancel={() => setVirtualKey('arrowright', false)}
            className="h-11 rounded-xl bg-[#E0F2FE] active:bg-[#7DD3FC] border border-[#7DD3FC] text-[#075985] flex items-center justify-center shadow-2xs cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {alreadyCompleted && !completedRun && (
        <div className="mt-4 pt-3 border-t border-[#F3DCE4] flex justify-end">
          <button
            type="button"
            onClick={() => onComplete(0)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#075985] font-bold text-sm cursor-pointer"
          >
            <span>Skip to Level 3</span>
            <ArrowRightCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
