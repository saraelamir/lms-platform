/** Compact flat illustration — laptop / learning vibe */
export default function CourseIllustration() {
  return (
    <svg viewBox="0 0 120 100" className="w-100" style={{ maxWidth: 140 }} aria-hidden>
      <defs>
        <linearGradient id="chBlob" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bee3f8" />
          <stop offset="100%" stopColor="#e6fffa" />
        </linearGradient>
      </defs>
      <ellipse cx="88" cy="28" rx="22" ry="16" fill="url(#chBlob)" opacity="0.9" />
      <circle cx="24" cy="72" r="14" fill="#cbd5e0" opacity="0.45" />
      <rect x="38" y="42" width="56" height="36" rx="6" fill="#4a90e2" opacity="0.15" />
      <rect x="42" y="46" width="48" height="24" rx="3" fill="#fff" stroke="#4a90e2" strokeWidth="1.2" />
      <path d="M48 58h36M48 52h22" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="58" cy="78" r="10" fill="#fbd38d" />
      <path
        d="M54 74c2-4 8-4 10 0M52 82h12"
        stroke="#2d3748"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="34" y="80" width="64" height="6" rx="2" fill="#4a90e2" opacity="0.35" />
    </svg>
  );
}
