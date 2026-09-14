# Vizag Aero Express — Live Tracker (Prototype)

A prototype for live, real-time bus tracking on APSRTC's **Vizag Aero
Express** service, connecting Visakhapatnam to the new **Alluri Sitarama
Raju International Airport** (Bhogapuram). Riders today only get static
timetables — no live bus position, no live ETA. This is a first step
toward fixing that, in the spirit of apps like Moovit.

This is still a **prototype**: the live bus position is simulated along
the real route corridor, not read from an actual bus's GPS.

## What's in this version

- **Both routes**, each with real, geocoded stops:
  - **ASR-1** — Gajuwaka → NAD Junction → Gurudwara → Zoo Park →
    Madhurawada/Kommadi → Marikavalasa → Anandapuram → Tagarapuvalasa →
    Airport Junction → Bhogapuram Airport
  - **ASR-2 (Beach Road)** — Gajuwaka → Scindia → Vizag City Railway
    Station → RTC Complex (Dwaraka Bus Station) → Siripuram → VMRDA Park →
    Rushikonda → ISKCON Temple/IT Hills → Marikavalasa → Anandapuram →
    Tagarapuvalasa → Airport Junction → Bhogapuram Airport
- **Both directions** — City → Airport and Airport → City, toggled from
  the header. Each direction has its own departure schedule.
- **Two views per route**: **Live tracking** (map + simulated moving bus +
  per-stop ETA) and **Route map** (a plain static overview of every stop
  on the route, no live bus).
- **Per-stop upcoming times**: since each route only has two buses
  cycling back and forth, each stop shows the next couple of scheduled
  real clock-time arrivals, not just a single ETA.
- **"Arriving" state**: when the live simulated bus is at or very near a
  stop, the stop's status blinks green and reads "Arriving" instead of a
  minute count.
- **No emoji** — all icons are hand-built inline SVGs
  (`src/components/Icons.jsx`).
- Login/signup buttons are visual placeholders for now — see "What's
  next" below.

## Stack

- React + Vite
- Leaflet / react-leaflet for the map (OpenStreetMap tiles)
- No backend yet — routes, schedules, and the live feed are all
  client-side.

## Running it locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  data/routes.js         # Both routes: stops (real coordinates) + schedules
  utils/geo.js            # Distance, interpolation, live ETA math
  utils/schedule.js        # Timetable generation + upcoming-arrivals math
  components/
    Header.jsx              # Route tabs, direction toggle, view toggle
    Icons.jsx                # SVG icon set (no emoji)
    MapView.jsx               # Live map or static route-overview map
    StopList.jsx               # Departure-board style stop list
  App.jsx                       # Wires state, simulation loop, schedule together
```

## How the simulation works

- `src/data/routes.js` holds real stop coordinates for both routes, plus a
  generated departure schedule per direction (`generateDailySchedule` in
  `utils/schedule.js`).
- The **live tracking** view animates a virtual bus along the selected
  route/direction on a fast repeating loop (`DEMO_LOOP_SECONDS` in
  `App.jsx`), purely so it's watchable in a demo. It does not represent a
  real bus's position yet.
- The **minute-based ETA** shown per stop in that view is computed from
  the bus's real simulated distance and the route's `avgSpeedKmh` —
  independent of how fast the demo loop plays, so it stays believable.
- The **upcoming times list** under each stop is separate: it's computed
  from the actual daily schedule plus the real device clock
  (`getUpcomingArrivals` in `utils/schedule.js`), so it reflects genuine
  timetable behavior even though there's no live bus feed yet.

## Known limitations / what's next

- Two stops per route ("Airport Junction" and a few others) use an
  approximate coordinate — see the comments in `routes.js` for exactly
  which ones, and swap in the precise location once available.
- No real GPS feed yet. Natural next step: a lightweight driver-side page
  pushing `{ lat, lng, timestamp }` every few seconds to a small backend
  (e.g. Node/Express + WebSockets), which this frontend would read
  instead of the simulation.
- No login/accounts yet — the header buttons are placeholders. Real
  accounts (e.g. to save a "home stop" and get notified when a bus is
  close) need a backend + auth, which is a bigger step than anything
  built so far and should be sequenced after the GPS feed.
- No seat booking, intentionally — this stays a pure tracking tool.
- Departure times in `routes.js` are illustrative placeholders — replace
  with APSRTC's actual published schedule once confirmed.

## Why this matters

Bhogapuram airport is ~45km from Visakhapatnam, and the bus is currently
the only affordable way to get there. Live tracking would meaningfully
improve that trip for a lot of travelers.
