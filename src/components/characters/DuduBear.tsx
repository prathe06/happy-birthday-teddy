import React from 'react';
import { BearMood } from '../../types/game';

interface DuduBearProps {
  mood?: BearMood;
  size?: number;
  facing?: 'left' | 'right';
  partyHat?: boolean;
  className?: string;
}

export const DuduBear: React.FC<DuduBearProps> = ({
  mood = 'idle',
  size = 114,
  facing = 'left',
  partyHat = false,
  className = '',
}) => {
  const flipTransform = facing === 'right' ? 'scaleX(-1)' : undefined;

  return (
    <div
      className={`inline-flex items-center justify-center select-none animate-bear-bounce ${className}`}
      style={{ width: size, height: size, animationDelay: '0.3s' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: flipTransform }}
        aria-label="Dudu the cute brown bear"
      >
        {/* Soft shadow */}
        <ellipse cx="70" cy="126" rx="34" ry="7" fill="#DEC8BE" opacity="0.55" />

        {/* Party Hat */}
        {partyHat && (
          <g>
            <path
              d="M55 24L70 3L85 24Z"
              fill="#FBCFE8"
              stroke="#4A3531"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <path d="M60 17H80" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            <circle cx="70" cy="4" r="4.5" fill="#FFD700" stroke="#4A3531" strokeWidth="2" />
          </g>
        )}

        {/* Ears */}
        <circle cx="38" cy="34" r="13" fill="#D4A383" stroke="#4A3531" strokeWidth="3.2" />
        <circle cx="38" cy="34" r="7" fill="#B8805D" />
        <circle cx="102" cy="34" r="13" fill="#D4A383" stroke="#4A3531" strokeWidth="3.2" />
        <circle cx="102" cy="34" r="7" fill="#B8805D" />

        {/* Body */}
        <ellipse
          cx="70"
          cy="97"
          rx="32"
          ry="27"
          fill="#D4A383"
          stroke="#4A3531"
          strokeWidth="3.2"
        />
        {/* Tummy patch */}
        <ellipse cx="70" cy="100" rx="18" ry="15" fill="#EBD0BC" />

        {/* Feet */}
        <ellipse cx="52" cy="120" rx="10" ry="7" fill="#D4A383" stroke="#4A3531" strokeWidth="3" />
        <ellipse cx="88" cy="120" rx="10" ry="7" fill="#D4A383" stroke="#4A3531" strokeWidth="3" />

        {/* Arms */}
        {mood === 'cheering' || mood === 'celebrating' ? (
          <>
            <path
              d="M42 84C30 72 28 58 36 55C42 53 47 64 49 76"
              fill="#D4A383"
              stroke="#4A3531"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M98 84C110 72 112 58 104 55C98 53 93 64 91 76"
              fill="#D4A383"
              stroke="#4A3531"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <ellipse
              cx="37"
              cy="93"
              rx="10"
              ry="7.5"
              transform="rotate(24 37 93)"
              fill="#D4A383"
              stroke="#4A3531"
              strokeWidth="3"
            />
            <ellipse
              cx="103"
              cy="93"
              rx="10"
              ry="7.5"
              transform="rotate(-24 103 93)"
              fill="#D4A383"
              stroke="#4A3531"
              strokeWidth="3"
            />
          </>
        )}

        {/* Head */}
        <ellipse
          cx="70"
          cy="56"
          rx="39"
          ry="33"
          fill="#D4A383"
          stroke="#4A3531"
          strokeWidth="3.2"
        />

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="64" rx="7" ry="4.5" fill="#FB7185" opacity="0.45" />
        <ellipse cx="96" cy="64" rx="7" ry="4.5" fill="#FB7185" opacity="0.45" />

        {/* Eyes */}
        {mood === 'happy' || mood === 'celebrating' || mood === 'cheering' ? (
          <>
            <path
              d="M47 55C49.5 50.5 54.5 50.5 57 55"
              stroke="#4A3531"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M83 55C85.5 50.5 90.5 50.5 93 55"
              stroke="#4A3531"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="52" cy="54" r="3.6" fill="#4A3531" />
            <path d="M83 53.5H92" stroke="#4A3531" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="52" cy="54" r="4" fill="#4A3531" />
            <circle cx="50.7" cy="52.5" r="1.4" fill="#FFFFFF" />
            <circle cx="88" cy="54" r="4" fill="#4A3531" />
            <circle cx="86.7" cy="52.5" r="1.4" fill="#FFFFFF" />
          </>
        )}

        {/* Muzzle */}
        <ellipse cx="70" cy="63" rx="10" ry="7" fill="#F3DFD0" />
        <ellipse cx="70" cy="60.5" rx="3.4" ry="2.4" fill="#4A3531" />

        {mood === 'excited' || mood === 'celebrating' || mood === 'cheering' ? (
          <path
            d="M64 65.5C65.5 70 74.5 70 76 65.5Z"
            fill="#FB7185"
            stroke="#4A3531"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        ) : mood === 'thinking' ? (
          <path
            d="M66.5 66.5Q70 65 73.5 66.5"
            stroke="#4A3531"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M64.5 65C66 68 68.5 68 70 65.5C71.5 68 74 68 75.5 65"
            stroke="#4A3531"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Optional mini envelope when holdingEnvelope */}
        {mood === 'envelope' && (
          <g transform="translate(46, 80)">
            <rect
              x="0"
              y="0"
              width="48"
              height="32"
              rx="6"
              fill="#FFFDF7"
              stroke="#4A3531"
              strokeWidth="2.8"
            />
            <path d="M2 3L24 19L46 3" stroke="#4A3531" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="24" cy="18" r="5.5" fill="#FFD700" stroke="#B45309" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
