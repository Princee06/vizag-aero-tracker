// Small hand-drawn line-icon set, so the UI never relies on emoji.
// All icons: 24x24 viewBox, stroke = currentColor, inherit size via props.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function BusIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3" y="5" width="18" height="12" rx="2.5" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <line x1="8" y1="5" x2="8" y2="11" />
      <line x1="16" y1="5" x2="16" y2="11" />
      <circle cx="7.5" cy="19" r="1.6" />
      <circle cx="16.5" cy="19" r="1.6" />
    </svg>
  )
}

export function PinIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 21s-6.5-6.1-6.5-11.2A6.5 6.5 0 0 1 12 3a6.5 6.5 0 0 1 6.5 6.8C18.5 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.7" r="2.3" />
    </svg>
  )
}

export function ClockIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function MapIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z" />
      <line x1="9" y1="4" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="20" />
    </svg>
  )
}

export function ActivityIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  )
}

export function SwapIcon({ size = 20, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M7 4v13" />
      <path d="M3.5 13.5 7 17l3.5-3.5" />
      <path d="M17 20V7" />
      <path d="M20.5 10.5 17 7l-3.5 3.5" />
    </svg>
  )
}

export function ChevronDownIcon({ size = 16, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 8.5 12 15l7-6.5" />
    </svg>
  )
}
