import React from 'react';

interface BrandLogoProps {
  className?: string;
}

/**
 * Ate & Served Brand Logo
 * Faithful vector reproduction of the uploaded ornate orange hand gesture emblem (#eb5e28).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'w-11 h-11' }) => {
  return (
    <svg
      viewBox="0 0 120 135"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ate & Served Logo"
    >
      {/* Outer Hand Silhouette & Fingers */}
      <g
        stroke="#eb5e28"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Index & Middle Finger Pinch Loop (Left side) */}
        <path d="M53 118 C46 105 42 93 41 76 C40 60 35 48 28 38 C26 35 28 32 32 33 C40 35 46 46 50 56 C52 60 56 60 61 58" />

        {/* Curled Middle Finger resting above Index */}
        <path d="M31 32 C29 27 30 23 33 24 C45 28 57 33 65 39 C68 42 70 46 72 50 L62 57" />

        {/* Tall Ring Finger (Top Center) */}
        <path d="M72 50 C68 36 62 21 59 12 C57 6 61 2 64 5 C70 12 75 26 81 47" />

        {/* Outstretched Pinky / Right Finger */}
        <path d="M81 47 C86 39 91 29 94 22 C96 17 100 17 102 18 C100 26 98 37 94 49 C88 66 80 83 76 96 C75 101 77 107 80 112" />

        {/* Wrist Cuff Base */}
        <path d="M53 118 C61 121 72 119 80 112" />

        {/* Palm Crease & Thumb Mound Line */}
        <path d="M42 73 C48 63 55 59 62 57 C63 68 61 78 55 86 C51 91 49 96 49 101" />
        <path d="M54 87 C60 81 65 75 69 69" />
        <path d="M62 57 L66 63" />

        {/* Finger Joint Accents & Henna/Tattoo Geometric Motifs */}
        {/* Index finger nail & joint */}
        <path d="M32 33 C34 36 37 37 40 36" />
        <path d="M41 48 L45 46" />

        {/* Middle finger nail & geometric bands */}
        <path d="M33 24 C35 28 39 29 43 28" />
        <path d="M47 30 C48 35 53 38 58 35" />
        <path d="M48 39 L51 37" />
        <path d="M56 44 L59 40" />
        <path d="M62 38 C62 43 65 46 70 47" />

        {/* Tall Ring Finger nail & diamond/chevron motifs */}
        <path d="M62 5 C63 11 66 15 70 16" />
        <path d="M65 24 L68 23" />
        <path d="M72 22 L70 28 L76 32" />
        <path d="M71 33 L76 36 L74 44 L77 52" />
        <path d="M79 42 L77 46 L80 51" />

        {/* Right Finger nail & side geometric patterns */}
        <path d="M99 18 C97 23 97 26 99 28" />
        <path d="M89 34 L92 36" />
        <path d="M77 57 C82 52 86 47 89 41" />
        <path d="M96 38 L92 42 L95 47" />
        <path d="M92 52 C87 54 85 58 86 65" />
        <path d="M90 57 C88 59 88 61 89 63" />

        {/* Wrist Cuff Geometric Arches & Chevrons */}
        <path d="M49 102 C53 105 57 107 62 106" />
        <path d="M51 109 C56 110 59 114 60 119" />
        <path d="M53 113 C56 114 57 116 57 119" />
        <path d="M67 108 L69 119" />
        <path d="M67 108 L75 116" />
        <path d="M73 101 C70 105 71 111 76 115" />
        <path d="M75 105 C73 107 74 110 77 112" />
      </g>

      {/* Solid Accent Fill on Right Palm Edge */}
      <path
        d="M84 68 C79 79 73 91 68 102 L75 99 C79 88 83 78 87 68 Z"
        fill="#eb5e28"
      />
    </svg>
  );
};
