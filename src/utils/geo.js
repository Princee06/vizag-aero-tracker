// Small geo helpers. No external geo library needed at this scale/precision.

const EARTH_RADIUS_KM = 6371

function toRad(deg) {
  return (deg * Math.PI) / 180
}

// Great-circle distance between two lat/lng points, in km.
export function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

// Cumulative distance (km) at each stop, starting at 0 for the first stop.
export function cumulativeDistances(stops) {
  const cumulative = [0]
  for (let i = 1; i < stops.length; i++) {
    cumulative.push(cumulative[i - 1] + haversineKm(stops[i - 1], stops[i]))
  }
  return cumulative
}

// Given a fraction `t` (0..1) of the total route distance travelled,
// return the interpolated { lat, lng } position of the bus.
export function positionAtFraction(stops, cumDistances, t) {
  const totalKm = cumDistances[cumDistances.length - 1]
  const targetKm = t * totalKm

  let segIndex = 0
  while (
    segIndex < cumDistances.length - 2 &&
    cumDistances[segIndex + 1] < targetKm
  ) {
    segIndex++
  }

  const segStart = stops[segIndex]
  const segEnd = stops[segIndex + 1]
  const segStartKm = cumDistances[segIndex]
  const segEndKm = cumDistances[segIndex + 1]
  const segFraction =
    segEndKm === segStartKm ? 0 : (targetKm - segStartKm) / (segEndKm - segStartKm)

  return {
    lat: segStart.lat + (segEnd.lat - segStart.lat) * segFraction,
    lng: segStart.lng + (segEnd.lng - segStart.lng) * segFraction,
    segIndex,
  }
}

// Minutes until the bus reaches a given stop index, based on distance
// remaining and an assumed average speed.
export function etaMinutesToStop(cumDistances, traveledKm, stopIndex, avgSpeedKmh) {
  const remainingKm = cumDistances[stopIndex] - traveledKm
  if (remainingKm <= 0) return 0
  return Math.round((remainingKm / avgSpeedKmh) * 60)
}
