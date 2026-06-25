function CylinderIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 80 160"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="32" y="6" width="16" height="14" rx="2" fill="currentColor" className="text-ink/70" />
      <path
        d="M20 30C20 22 28 16 40 16C52 16 60 22 60 30V40H20V30Z"
        fill="currentColor"
        className="text-ink/70"
      />
      <rect x="12" y="40" width="56" height="104" rx="10" fill="currentColor" />
      <rect x="12" y="76" width="56" height="10" fill="currentColor" className="text-ink/15" />
      <rect x="20" y="118" width="40" height="14" rx="3" fill="currentColor" className="text-cream/90" />
    </svg>
  );
}

export default CylinderIcon;
