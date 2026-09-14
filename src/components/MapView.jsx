import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { BusIcon, PinIcon } from './Icons.jsx'

function makeBusIcon(color) {
  const html = renderToStaticMarkup(
    <div className="bus-icon-inner" style={{ color }}>
      <BusIcon size={18} />
    </div>,
  )
  return L.divIcon({ className: 'bus-icon', html, iconSize: [30, 30], iconAnchor: [15, 15] })
}

function makeFocusIcon() {
  const html = renderToStaticMarkup(
    <div className="focus-pin-inner">
      <PinIcon size={26} />
    </div>,
  )
  return L.divIcon({ className: 'focus-pin', html, iconSize: [26, 26], iconAnchor: [13, 26] })
}

// Recenters the map on the focused stop whenever it changes, without
// resetting the user's zoom/pan on every re-render.
function FlyToStop({ stop }) {
  const map = useMap()
  useEffect(() => {
    if (stop) {
      map.flyTo([stop.lat, stop.lng], 13, { duration: 0.8 })
    }
  }, [stop, map])
  return null
}

export default function MapView({ stops, busPosition, activeStopIndex, accent, mode = 'live', focusStopId }) {
  const positions = stops.map((s) => [s.lat, s.lng])
  const center = positions[Math.floor(positions.length / 2)]
  const busIcon = useMemo(() => makeBusIcon(accent), [accent])
  const focusIcon = useMemo(() => makeFocusIcon(), [])
  const focusStop = stops.find((s) => s.id === focusStopId)

  return (
    <MapContainer center={center} zoom={11} scrollWheelZoom={true} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polyline positions={positions} pathOptions={{ color: accent, weight: 4, opacity: 0.85 }} />

      {stops.map((stop, i) => (
        <CircleMarker
          key={stop.id}
          center={[stop.lat, stop.lng]}
          radius={mode === 'live' && i === activeStopIndex ? 8 : 6}
          pathOptions={{
            color: mode === 'live' && i <= activeStopIndex ? '#34d399' : '#8592ab',
            fillColor: mode === 'live' && i <= activeStopIndex ? '#34d399' : '#182238',
            fillOpacity: 1,
            weight: 2,
          }}
        >
          <Tooltip direction="top" offset={[0, -6]}>
            {i + 1}. {stop.name}
          </Tooltip>
        </CircleMarker>
      ))}

      {focusStop && (
        <Marker position={[focusStop.lat, focusStop.lng]} icon={focusIcon}>
          <Tooltip direction="top" offset={[0, -26]} permanent>
            Your stop
          </Tooltip>
        </Marker>
      )}

      {mode === 'live' && busPosition && (
        <Marker position={[busPosition.lat, busPosition.lng]} icon={busIcon}>
          <Tooltip direction="top" offset={[0, -18]} permanent>
            Bus
          </Tooltip>
        </Marker>
      )}

      <FlyToStop stop={focusStop} />
    </MapContainer>
  )
}