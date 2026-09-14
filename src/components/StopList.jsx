import { useEffect, useRef } from 'react'
import { ClockIcon, PinIcon } from './Icons.jsx'

export default function StopList({ stops, activeStopIndex, etas, upcomingByStop, focusStopId }) {
  const focusRef = useRef(null)

  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [focusStopId])

  return (
    <div className="stop-list">
      <div className="stop-list-heading">Stops</div>
      <ul>
        {stops.map((stop, i) => {
          const status = i < activeStopIndex ? 'passed' : i === activeStopIndex ? 'current' : 'upcoming'
          const isArriving = status === 'current' || (status === 'upcoming' && etas[i] <= 1)
          const isFocused = stop.id === focusStopId

          return (
            <li
              key={stop.id}
              ref={isFocused ? focusRef : null}
              className={`stop-row stop-row--${status} ${isFocused ? 'stop-row--focused' : ''}`}
            >
              <div className="stop-row-main">
                <span className="stop-dot" />
                <span className="stop-name">
                  {stop.name}
                  {isFocused && (
                    <span className="stop-focused-badge">
                      <PinIcon size={11} />
                      Your stop
                    </span>
                  )}
                </span>
                <span className={isArriving ? 'stop-eta stop-eta--arriving' : 'stop-eta'}>
                  {status === 'passed' ? 'Departed' : isArriving ? 'Arriving' : `${etas[i]} min`}
                </span>
              </div>

              {upcomingByStop?.[i]?.length > 0 && (
                <div className="stop-upcoming">
                  <ClockIcon size={13} className="stop-upcoming-icon" />
                  {upcomingByStop[i].map((u, idx) => (
                    <span key={idx} className="stop-upcoming-time">
                      {u.label}
                      {u.nextDay ? ' (next day)' : ''}
                      {idx < upcomingByStop[i].length - 1 ? ' \u00b7 ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
