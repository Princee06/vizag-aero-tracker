import { ActivityIcon, MapIcon, PinIcon, SwapIcon } from './Icons.jsx'

export default function Header({
  routes,
  selectedRouteId,
  onSelectRoute,
  direction,
  onToggleDirection,
  view,
  onSelectView,
  focusStopName,
  onChangeStop,
}) {
  const directionLabel = direction === 'cityToAirport' ? 'City \u2192 Airport' : 'Airport \u2192 City'

  return (
    <header className="header">
      <div className="header-top">
        <div className="header-title">
          <span className="header-eyebrow">Vizag Aero Express</span>
          <h1>Live Tracker</h1>
        </div>

        <div className="header-account">
          <button className="account-btn account-btn--ghost">Log in</button>
          <button className="account-btn account-btn--solid">Sign up</button>
        </div>
      </div>

      <div className="header-controls">
        <div className="route-tabs">
          {Object.values(routes).map((r) => (
            <button
              key={r.id}
              className={`route-tab ${selectedRouteId === r.id ? 'route-tab--active' : ''}`}
              style={selectedRouteId === r.id ? { borderColor: r.accent, color: r.accent } : undefined}
              onClick={() => onSelectRoute(r.id)}
            >
              {r.name}
            </button>
          ))}
        </div>

        <button className="direction-toggle" onClick={onToggleDirection}>
          <SwapIcon size={16} />
          {directionLabel}
        </button>

        {focusStopName && (
          <button className="change-stop-btn" onClick={onChangeStop}>
            <PinIcon size={14} />
            {focusStopName}
            <span className="change-stop-btn-label">Change</span>
          </button>
        )}

        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${view === 'live' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => onSelectView('live')}
          >
            <ActivityIcon size={15} />
            Live tracking
          </button>
          <button
            className={`view-toggle-btn ${view === 'map' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => onSelectView('map')}
          >
            <MapIcon size={15} />
            Route map
          </button>
        </div>
      </div>
    </header>
  )
}
