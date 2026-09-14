import { useMemo, useState } from 'react'
import { getAllStopsFlat } from '../data/routes.js'
import { PinIcon, SwapIcon, BusIcon } from './Icons.jsx'

export default function StopSearch({ onSubmit }) {
  const [direction, setDirection] = useState(null)
  const [query, setQuery] = useState('')

  const allStops = useMemo(getAllStopsFlat, [])
  const filtered = useMemo(() => {
    if (!query.trim()) return allStops
    const q = query.trim().toLowerCase()
    return allStops.filter(
      (s) => s.stopName.toLowerCase().includes(q) || s.postalCode?.includes(q),
    )
  }, [allStops, query])

  return (
    <div className="stop-search">
      <div className="stop-search-card">
        <span className="header-eyebrow">Vizag Aero Express</span>
        <h1>Where are you starting from?</h1>

        <div className="stop-search-step">
          <div className="stop-search-step-label">1. Direction</div>
          <div className="direction-options">
            <button
              className={`direction-option ${direction === 'cityToAirport' ? 'direction-option--active' : ''}`}
              onClick={() => setDirection('cityToAirport')}
            >
              <SwapIcon size={16} />
              {'City \u2192 Airport'}
            </button>
            <button
              className={`direction-option ${direction === 'airportToCity' ? 'direction-option--active' : ''}`}
              onClick={() => setDirection('airportToCity')}
            >
              <SwapIcon size={16} />
              {'Airport \u2192 City'}
            </button>
          </div>
        </div>

        {direction && (
          <div className="stop-search-step">
            <div className="stop-search-step-label">2. Your stop</div>
            <div className="stop-search-input">
              <PinIcon size={16} />
              <input
                autoFocus
                type="text"
                placeholder={'Search stop name or PIN code\u2026'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <ul className="stop-search-results">
              {filtered.map((s) => (
                <li key={`${s.routeId}-${s.stopId}`}>
                  <button
                    className="stop-search-result"
                    onClick={() => onSubmit({ routeId: s.routeId, direction, stopId: s.stopId })}
                  >
                    <BusIcon size={15} />
                    <span>{s.stopName}</span>
                    <span className="stop-search-result-meta">
                      <span className="stop-search-result-route">{s.routeName}</span>
                      {s.postalCode && <span className="stop-search-result-pin">{s.postalCode}</span>}
                    </span>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && <li className="stop-search-empty">No matching stop.</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}