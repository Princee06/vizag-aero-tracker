import { generateDailySchedule } from "../utils/schedule.js";

// All coordinates and postal (PIN) codes below are real. A few (marked
// "approximate") don't have one exact official bus-stop coordinate/PIN
// publicly available yet, so the nearest known locality's is used as a
// placeholder — swap in the precise value once you have it; nothing else
// needs to change.

// ASR-1: inland route via the zoo and Madhurawada/Kommadi corridor.
const asr1Stops = [
  {
    id: "gajuwaka",
    name: "Gajuwaka",
    lat: 17.6853,
    lng: 83.2037,
    postalCode: "530026",
  },
  {
    id: "nad-junction",
    name: "NAD Junction",
    lat: 17.7447,
    lng: 83.2319,
    postalCode: "530009",
  },
  {
    id: "gurudwara",
    name: "Gurudwara",
    lat: 17.737,
    lng: 83.3065,
    postalCode: "530016",
  },
  {
    id: "zoo-park",
    name: "Zoo Park",
    lat: 17.7657,
    lng: 83.3488,
    postalCode: "530040",
  },
  {
    id: "madhurawada-kommadi",
    name: "Madhurawada / Kommadi",
    lat: 17.845,
    lng: 83.3201,
    postalCode: "530048",
  },
  {
    id: "marikavalasa",
    name: "Marikavalasa",
    lat: 17.8286,
    lng: 83.3703,
    postalCode: "530048",
  },
  {
    id: "anandapuram",
    name: "Anandapuram",
    lat: 17.9041,
    lng: 83.3693,
    postalCode: "530052",
  },
  {
    id: "tagarapuvalasa",
    name: "Tagarapuvalasa",
    lat: 17.9325,
    lng: 83.4268,
    postalCode: "531162",
  },
  // approximate — NH16 junction near the airport, no dedicated PIN yet
  {
    id: "airport-junction",
    name: "Airport Junction",
    lat: 17.9645,
    lng: 83.487,
    postalCode: "531162",
  },
  {
    id: "airport",
    name: "Bhogapuram Airport",
    lat: 17.9752,
    lng: 83.5071,
    postalCode: "535216",
  },
];

// ASR-2: Beach Road route via Rushikonda and the IT corridor.
const asr2Stops = [
  {
    id: "gajuwaka",
    name: "Gajuwaka",
    lat: 17.6853,
    lng: 83.2037,
    postalCode: "530026",
  },
  {
    id: "scindia",
    name: "Scindia",
    lat: 17.6875,
    lng: 83.2641,
    postalCode: "530014",
  },
  {
    id: "railway-station",
    name: "Vizag City Railway Station",
    lat: 17.7214,
    lng: 83.2905,
    postalCode: "530004",
  },
  {
    id: "rtc-complex",
    name: "RTC Complex (Dwaraka Bus Station)",
    lat: 17.7237,
    lng: 83.3068,
    postalCode: "530020",
  },
  {
    id: "siripuram",
    name: "Siripuram",
    lat: 17.7204,
    lng: 83.3168,
    postalCode: "530003",
  },
  {
    id: "vmrda-park",
    name: "VMRDA Park",
    lat: 17.7241,
    lng: 83.3395,
    postalCode: "530017",
  },
  {
    id: "rushikonda",
    name: "Rushikonda",
    lat: 17.7825,
    lng: 83.3851,
    postalCode: "530045",
  },
  {
    id: "iskcon-it-hills",
    name: "ISKCON Temple / IT Hills",
    lat: 17.7678,
    lng: 83.3667,
    postalCode: "530045",
  },
  {
    id: "marikavalasa",
    name: "Marikavalasa",
    lat: 17.8286,
    lng: 83.3703,
    postalCode: "530048",
  },
  {
    id: "anandapuram",
    name: "Anandapuram",
    lat: 17.9041,
    lng: 83.3693,
    postalCode: "530052",
  },
  {
    id: "tagarapuvalasa",
    name: "Tagarapuvalasa",
    lat: 17.9325,
    lng: 83.4268,
    postalCode: "531162",
  },
  {
    id: "airport-junction",
    name: "Airport Junction",
    lat: 17.9645,
    lng: 83.487,
    postalCode: "531162",
  }, // approximate
  {
    id: "airport",
    name: "Bhogapuram Airport",
    lat: 17.9752,
    lng: 83.5071,
    postalCode: "535216",
  },
];

// With just two buses per route, "the schedule" is one repeating interval
// per direction. These start times/intervals are illustrative placeholders
// — swap in APSRTC's actual published times once confirmed.
export const routes = {
  "asr-1": {
    id: "asr-1",
    name: "ASR-1",
    label: "Zoo Park \u2192 Madhurawada route",
    accent: "#f5a623",
    avgSpeedKmh: 30,
    stopsCityToAirport: asr1Stops,
    schedule: {
      cityToAirport: generateDailySchedule({
        startHour: 4,
        startMinute: 30,
        endHour: 22,
        endMinute: 0,
        intervalMinutes: 75,
      }),
      airportToCity: generateDailySchedule({
        startHour: 5,
        startMinute: 15,
        endHour: 22,
        endMinute: 45,
        intervalMinutes: 75,
      }),
    },
  },
  "asr-2": {
    id: "asr-2",
    name: "ASR-2",
    label: "Beach Road route",
    accent: "#34d399",
    avgSpeedKmh: 28,
    stopsCityToAirport: asr2Stops,
    schedule: {
      cityToAirport: generateDailySchedule({
        startHour: 4,
        startMinute: 45,
        endHour: 22,
        endMinute: 15,
        intervalMinutes: 90,
      }),
      airportToCity: generateDailySchedule({
        startHour: 5,
        startMinute: 30,
        endHour: 23,
        endMinute: 0,
        intervalMinutes: 90,
      }),
    },
  },
};

export function getStopsForDirection(route, direction) {
  return direction === "cityToAirport"
    ? route.stopsCityToAirport
    : [...route.stopsCityToAirport].reverse();
}

// Flat list of every stop across every route, for the landing search screen.
// The airport itself is intentionally excluded — once a direction is picked,
// the airport is already the implied origin/destination, so listing it as a
// pickable stop is redundant (and would otherwise show up once per route).
// A stop name that exists on more than one route (e.g. Marikavalasa) appears
// once per route here, so the picker can disambiguate which route is meant.
export function getAllStopsFlat() {
  const list = [];
  for (const route of Object.values(routes)) {
    route.stopsCityToAirport
      .filter((s) => s.id !== "airport")
      .forEach((s) => {
        list.push({
          routeId: route.id,
          routeName: route.name,
          stopId: s.id,
          stopName: s.name,
          postalCode: s.postalCode,
        });
      });
  }
  return list;
}
