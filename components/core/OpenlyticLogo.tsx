import React from 'react';

interface OpenlyticMarkProps {
  className?: string;
  gradientId?: string;
}

interface OpenlyticLogoProps {
  className?: string;
  light?: boolean;
  markClassName?: string;
  gradientId?: string;
}

// Openlytic brand mark: an open envelope over a rising analytics pulse,
// drawn in the indigo -> violet brand gradient.
export const OpenlyticMark = ({
  className = 'h-9 w-9',
  gradientId = 'oly-mark'
}: OpenlyticMarkProps) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill={`url(#${gradientId})`} />
    <path
      d="M10 13.5c0-1.2.9-2 2-2h16c1.1 0 2 .8 2 2v13c0 1.2-.9 2-2 2H12c-1.1 0-2-.8-2-2v-13Z"
      fill="#FFFFFF"
      fillOpacity="0.16"
    />
    <path
      d="M10.5 14.4 20 21.6l9.5-7.2"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 24.6c2.2-2.6 3.6-4.2 4.3-4.9"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M29 24.6c-2.2-2.6-3.6-4.2-4.3-4.9"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M13 10h8"
      stroke="#C7D2FE"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeOpacity="0.7"
    />
  </svg>
);

export const OpenlyticLogo = ({
  light = false,
  markClassName = 'h-8 w-8',
  gradientId = 'oly-mark'
}: OpenlyticLogoProps) => (
  <div className="flex items-center gap-2.5">
    <OpenlyticMark className={markClassName} gradientId={gradientId} />
    <span
      className={`font-poppins text-xl font-semibold tracking-tight ${
        light ? 'text-white' : 'text-ink'
      }`}
    >
      Openlytic
    </span>
  </div>
);

export default OpenlyticLogo;