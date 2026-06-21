"use client";

export function CeloIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#FBCC5C"/>
      <circle cx="12" cy="12" r="7" fill="none" stroke="#000" strokeWidth="2"/>
      <circle cx="12" cy="6.5" r="2.5" fill="#000"/>
    </svg>
  );
}

export function CUSDIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#35D07F"/>
      <text x="12" y="16.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000" fontFamily="Arial">$</text>
    </svg>
  );
}
