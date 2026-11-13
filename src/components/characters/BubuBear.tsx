import React from 'react';
import { BearMood } from '../../types/game';

interface BubuBearProps {
  mood?: BearMood;
  size?: number;
  facing?: 'left' | 'right';
  walking?: boolean;
  partyHat?: boolean;
  className?: string;
}

export const BubuBear: React.FC<BubuBearProps> = ({
  mood = 'idle',
  size = 110,
  facing = 'right',
  walking = false,
  partyHat = false,
  className = '',
}) => {
  const animClass = walking ? 'animate-bear-walk' : 'animate-bear-bounce';
  const flipTransform = facing === 'left' ? 'scaleX(-1)' : undefined;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${animClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: flipTransform }}
        aria-label="Bubu the cute white bear"
      >
        {/* Soft shadow */}
        <ellipse cx="70" cy="126" rx="34" ry="7" fill="#E2CFCB" opacity="0.55" />

        {/* Party Hat (Final celebration) */}
        {partyHat && (
          <g>
            <path
              d="M55 24L70 3L85 24Z"
              fill="#BAE6FD"
              stroke="#4A3531"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <path d="M60 17H80" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            <circle cx="70" cy="4" r="4.5" fill="#FFD700" stroke="#4A3531" strokeWidth="2" />
          </g>
        )}

        {/* Ears */}
        <circle cx="38" cy="34" r="13" fill="#FFFDF9" stroke="#4A3531" strokeWidth="3.2" />
        <circle cx="38" cy="34" r="7" fill="#FBCFE8" />
        <circle cx="102" cy="34" r="13" fill="#FFFDF9" stroke="#4A3531" strokeWidth="3.2" />
        <circle cx="102" cy="34" r="7" fill="#FBCFE8" />

        {/* Chubby Body */}
        <ellipse
          cx="70"
          cy="97"
          rx="32"
          ry="27"
          fill="#FFFDF9"
          stroke="#4A3531"
          strokeWidth="3.2"
        />
        {/* Tummy patch */}
        <ellipse cx="70" cy="100" rx="18" ry="15" fill="#FFF5F7" />

        {/* Little feet */}
        <ellipse cx="52" cy="120" rx="10" ry="7" fill="#FFFDF9" stroke="#4A3531" strokeWidth="3" />
        <ellipse cx="88" cy="120" rx="10" ry="7" fill="#FFFDF9" stroke="#4A3531" strokeWidth="3" />

        {/* Left & Right Arms */}
        {mood === 'cheering' || mood === 'celebrating' ? (
          <>
            <path
              d="M42 84C30 72 28 58 36 55C42 53 47 64 49 76"
              fill="#FFFDF9"
              stroke="#4A3531"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M98 84C110 72 112 58 104 55C98 53 93 64 91 76"
              fill="#FFFDF9"
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
              fill="#FFFDF9"
              stroke="#4A3531"
              strokeWidth="3"
            />
            <ellipse
              cx="103"
              cy="93"
              rx="10"
              ry="7.5"
              transform="rotate(-24 103 93)"
              fill="#FFFDF9"
              stroke="#4A3531"
              strokeWidth="3"
            />
          </>
        )}

        {/* Chubby Head */}
        <ellipse
          cx="70"
          cy="56"
          rx="39"
          ry="33"
          fill="#FFFDF9"
          stroke="#4A3531"
          strokeWidth="3.2"
        />

        {/* Rosy Cheeks */}
        <ellipse cx="44" cy="64" rx="7" ry="4.5" fill="#FDA4AF" opacity="0.65" />
        <ellipse cx="96" cy="64" rx="7" ry="4.5" fill="#FDA4AF" opacity="0.65" />

        {/* Eyes based on mood */}
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
            <path
              d="M83 53.5H92"
              stroke="#4A3531"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="52" cy="54" r="4" fill="#4A3531" />
            <circle cx="50.7" cy="52.5" r="1.4" fill="#FFFFFF" />
            <circle cx="88" cy="54" r="4" fill="#4A3531" />
            <circle cx="86.7" cy="52.5" r="1.4" fill="#FFFFFF" />
          </>
        )}

        {/* Snout & Mouth */}
        <ellipse cx="70" cy="63" rx="9" ry="6.5" fill="#FFF1F2" />
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

        {/* Cute Pastel Camera Prop when mood === 'camera' */}
        {mood === 'camera' && (
          <g transform="translate(46, 77)">
            <rect
              x="0"
              y="5"
              width="48"
              height="31"
              rx="8"
              fill="#BAE6FD"
              stroke="#4A3531"
              strokeWidth="2.8"
            />
            <rect
              x="14"
              y="0"
              width="20"
              height="7"
              rx="3"
              fill="#E0F2FE"
              stroke="#4A3531"
              strokeWidth="2.5"
            />
            <circle cx="38" cy="11" r="2.8" fill="#FFD700" stroke="#4A3531" strokeWidth="1.8" />
            <circle cx="24" cy="21" r="10.5" fill="#FFFDF7" stroke="#4A3531" strokeWidth="2.8" />
            <circle cx="24" cy="21" r="6.2" fill="#475569" />
            <circle cx="21.5" cy="18.5" r="2" fill="#E0F2FE" />
            {/* Tiny golden heart badge on camera */}
            <path
              d="M9 15.5C9 14.3 10 13.5 11 13.5C11.6 13.5 12 13.9 12.2 14.3C12.4 13.9 12.8 13.5 13.4 13.5C14.4 13.5 15.4 14.3 15.4 15.5C15.4 17.6 12.2 19.5 12.2 19.5C12.2 19.5 9 17.6 9 15.5Z"
              fill="#FFD700"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
