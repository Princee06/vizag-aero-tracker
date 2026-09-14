import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import MapView from './components/MapView.jsx'
import StopList from './components/StopList.jsx'
import StopSearch from './components/StopSearch.jsx'
import { routes, getStopsForDirection } from './data/routes.js'
import { cumulativeDistances, positionAtFraction, etaMinutesToStop } from './utils/geo.js'
import { getUpcomingArrivals } from './utils/schedule.js'

// Playback speed for the simulated live bus — purely for demo watchability.
// It does not affect the "min" ETAs or the scheduled clock times shown,
// which are both derived from real distances/speeds/timetables.
const DEMO_LOOP_SECONDS = 90

export default function App() {
  const [phase, setPhase] = useState('search') // 'search' | 'app'
  const [selectedRouteId, setSelectedRouteId] = useState('asr-1')
  const [direction, setDirection] = useState('cityToAirport')
  const [view, setView] = useState('live')
  const [focusStopId, setFocusStopId] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [now, setNow] = useState(new Date())

  const route = routes[selectedRouteId]
  const stops = useMemo(() => getStopsForDirection(route, direction), [route, direction])
  const cumDistances = useMemo(() => cumulativeDistances(stops), [stops])
  const totalKm = cumDistances[cumDistances.length - 1]
  const departures = route.schedule[direction]

  useEffect(() => {
    const tickMs = 200
    const interval = setInterval(() => setElapsed((prev) => prev + tickMs / 1000), tickMs)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const clockInterval = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(clockInterval)
  }, [])

  const t = (elapsed % DEMO_LOOP_SECONDS) / DEMO_LOOP_SECONDS
  const traveledKm = t * totalKm

  const busPosition = useMemo(() => positionAtFraction(stops, cumDistances, t), [stops, cumDistances, t])
  const activeStopIndex = Math.min(busPosition.segIndex + 1, stops.length - 1)

  const etas = stops.map((_, i) => etaMinutesToStop(cumDistances, traveledKm, i, route.avgSpeedKmh))

  const upcomingByStop = stops.map((_, i) => {
    const travelMinutes = (cumDistances[i] / route.avgSpeedKmh) * 60
    return getUpcomingArrivals(departures, travelMinutes, now, 2)
  })

  const focusStop = stops.find((s) => s.id === focusStopId)

  function handleSelectRoute(id) {
    setSelectedRouteId(id)
    setElapsed(0)
    setFocusStopId(null)
  }

  function handleToggleDirection() {
    setDirection((d) => (d === 'cityToAirport' ? 'airportToCity' : 'cityToAirport'))
    setElapsed(0)
  }

  function handleStopSearchSubmit({ routeId, direction: dir, stopId }) {
    setSelectedRouteId(routeId)
    setDirection(dir)
    setFocusStopId(stopId)
    setElapsed(0)
    setView('live')
    setPhase('app')
  }

  if (phase === 'search') {
    return <StopSearch onSubmit={handleStopSearchSubmit} />
  }

  return (
    <div className="app">
      <Header
        routes={routes}
        selectedRouteId={selectedRouteId}
        onSelectRoute={handleSelectRoute}
        direction={direction}
        onToggleDirection={handleToggleDirection}
        view={view}
        onSelectView={setView}
        focusStopName={focusStop?.name}
        onChangeStop={() => setPhase('search')}
      />

      <main className="main">
        {view === 'live' ? (
          <>
            <StopList
              stops={stops}
              activeStopIndex={activeStopIndex}
              etas={etas}
              upcomingByStop={upcomingByStop}
              focusStopId={focusStopId}
            />
            <MapView
              stops={stops}
              busPosition={busPosition}
              activeStopIndex={activeStopIndex}
              accent={route.accent}
              mode="live"
              focusStopId={focusStopId}
            />
          </>
        ) : (
          <div className="map-full">
            <MapView stops={stops} accent={route.accent} mode="overview" />
          </div>
        )}
      </main>
    </div>
  )
}