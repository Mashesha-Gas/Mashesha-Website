/**
 * Stylized Mashesha flame mark: twin flame tongues cradling a skyline silhouette,
 * with Zulu-pattern accent strokes echoing the brand kit. Pure SVG, currentColor based.
 */
function FlameLogo({ className = "", title = "Mashesha flame mark" }) {
  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* outer flame tongue */}
      <path
        d="M62 4C70 30 84 38 84 64C84 84 70 96 70 116C70 140 84 156 70 196C66 178 56 168 56 150C56 134 66 124 62 104C58 86 46 80 46 60C46 38 58 24 62 4Z"
        fill="currentColor"
      />
      {/* inner flame tongue */}
      <path
        d="M40 56C46 70 54 76 52 92C50 106 38 112 40 130C42 146 54 152 46 174C40 162 30 156 30 142C30 130 38 122 36 108C34 96 24 92 26 76C28 64 36 64 40 56Z"
        fill="currentColor"
        opacity="0.92"
      />
      {/* zulu accent strokes, left + right */}
      <rect
        x="6"
        y="76"
        width="14"
        height="48"
        rx="3"
        transform="rotate(-18 13 100)"
        fill="currentColor"
        opacity="0.85"
      />
      <rect
        x="100"
        y="76"
        width="14"
        height="48"
        rx="3"
        transform="rotate(18 107 100)"
        fill="currentColor"
        opacity="0.85"
      />
      {/* skyline silhouette nested in the flame */}
      <g fill="var(--logo-skyline, #18251a)">
        <rect x="46" y="118" width="6" height="26" />
        <rect x="53" y="106" width="7" height="38" />
        <rect x="61" y="96" width="6" height="48" />
        <rect x="68" y="112" width="6" height="32" />
        <rect x="58" y="84" width="2" height="14" />
        <circle cx="59" cy="82" r="2.4" />
      </g>
    </svg>
  );
}

export default FlameLogo;
