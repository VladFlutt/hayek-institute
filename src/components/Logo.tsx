/** Emblem: an ionic column inside a laurel-like arc. */
export const Logo = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M5 26 C5 14, 10 7, 16 5 C22 7, 27 14, 27 26" strokeLinecap="round" />
    <path d="M10 11h12M11 13.5h10" />
    <path d="M12.5 13.5v10M16 13.5v10M19.5 13.5v10" />
    <path d="M10 24h12M9 26.5h14" />
    <circle cx="10.5" cy="11" r="1.2" />
    <circle cx="21.5" cy="11" r="1.2" />
  </svg>
)

export const LockIcon = ({ open = false }: { open?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    {open ? <path d="M8 11V8a4 4 0 0 1 7.5-2" /> : <path d="M8 11V8a4 4 0 0 1 8 0v3" />}
  </svg>
)
