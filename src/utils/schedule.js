// Timetable helpers. Since each route currently has just two buses cycling
// back and forth, "the schedule" is really just a repeating departure
// interval from the first stop in a given direction — this generates that,
// and works out real clock-time arrivals at any stop along the way.

function pad(n) {
  return String(n).padStart(2, '0')
}

// Generates an array of { hour, minute } departure times from the first
// stop of a route/direction, spaced `intervalMinutes` apart.
export function generateDailySchedule({ startHour, startMinute, endHour, endMinute, intervalMinutes }) {
  const departures = []
  let totalMinutes = startHour * 60 + startMinute
  const endTotalMinutes = endHour * 60 + endMinute

  while (totalMinutes <= endTotalMinutes) {
    departures.push({ hour: Math.floor(totalMinutes / 60), minute: totalMinutes % 60 })
    totalMinutes += intervalMinutes
  }

  return departures
}

// "9:05 AM" style formatting without pulling in a date library.
export function formatClock(hour, minute) {
  const period = hour >= 12 ? 'PM' : 'AM'
  let h = hour % 12
  if (h === 0) h = 12
  return `${h}:${pad(minute)} ${period}`
}

// Given a route's departure list and the travel time (minutes) from the
// first stop to a particular stop, return the next `count` real-world
// arrival times at that stop, relative to `now`.
export function getUpcomingArrivals(departures, travelMinutes, now = new Date(), count = 2) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const arrivals = departures.map((d) => {
    let arrivalMinutes = d.hour * 60 + d.minute + Math.round(travelMinutes)
    let nextDay = false
    if (arrivalMinutes >= 1440) {
      arrivalMinutes -= 1440
      nextDay = true
    }
    return { arrivalMinutes, nextDay }
  })

  const upcoming = arrivals
    .map((a) => ({
      ...a,
      sortKey: a.nextDay ? a.arrivalMinutes + 1440 : a.arrivalMinutes,
    }))
    .filter((a) => a.sortKey >= nowMinutes)
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(0, count)

  // If nothing is left running today, wrap around to tomorrow's first buses.
  if (upcoming.length < count) {
    const wrapped = arrivals
      .slice(0, count - upcoming.length)
      .map((a) => ({ ...a, nextDay: true }))
    upcoming.push(...wrapped)
  }

  return upcoming.map((a) => ({
    label: formatClock(Math.floor(a.arrivalMinutes / 60), a.arrivalMinutes % 60),
    nextDay: a.nextDay,
  }))
}

// Minutes-until display helper: given "now" and the very next arrival,
// how many minutes away is it (used to decide when to show "Arriving").
export function minutesUntil(hour, minute, now = new Date()) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  let target = hour * 60 + minute
  if (target < nowMinutes) target += 1440
  return target - nowMinutes
}
