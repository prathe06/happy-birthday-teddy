import React from 'react';

interface GoldenHeartProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const GoldenHeart: React.FC<GoldenHeartProps> = ({
  className = '',
  size = 28,
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={
        glow
          ? { filter: 'drop-shadow(0 3px 6px rgba(245, 158, 11, 0.35))' }
          : undefined
      }
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldHeartGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE55C" />
          <stop offset="55%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path
        d="M32 54.5C32 54.5 9.5 40.2 9.5 23.2C9.5 15.6 15.3 10.2 22.3 10.2C26.7 10.2 30.2 12.6 32 15.6C33.8 12.6 37.3 10.2 41.7 10.2C48.7 10.2 54.5 15.6 54.5 23.2C54.5 40.2 32 54.5 32 54.5Z"
        fill="url(#goldHeartGrad)"
        stroke="#B45309"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Cute glossy highlight */}
      <ellipse
        cx="21.5"
        cy="20"
        rx="4.2"
        ry="2.5"
        transform="rotate(-28 21.5 20)"
        fill="#FFFBEB"
        opacity="0.88"
      />
      <circle cx="18" cy="25.5" r="1.5" fill="#FFFBEB" opacity="0.75" />
    </svg>
  );
};
