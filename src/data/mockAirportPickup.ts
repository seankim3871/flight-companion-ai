/**
 * Mock airport-specific pickup guidance (curbside, terminal, parking).
 */

export interface AirportPickupGuide {
  airportCode: string;
  terminal: string;
  curbsideZone: string;
  cellPhoneLot: string;
  parkingTip: string;
  bestPractice: string;
  avoidTip: string;
}

const PICKUP_GUIDES: Record<string, AirportPickupGuide> = {
  LAX: {
    airportCode: "LAX",
    terminal: "Terminal 2 / Terminal B (Delta)",
    curbsideZone: "Upper departures level — Arrivals pickup on lower level",
    cellPhoneLot: "LAX Cell Phone Waiting Lot — 96th St, free for 2 hours",
    parkingTip: "Short-term parking in Structure 2A if passenger has heavy bags",
    bestPractice: "Coordinate by text when passenger exits baggage claim — LAX curbside is strictly timed.",
    avoidTip: "Do not stop on inner lane; airport police actively ticket idle vehicles.",
  },
  ATL: {
    airportCode: "ATL",
    terminal: "Domestic — North or South terminal based on airline",
    curbsideZone: "Ground transportation / passenger pickup on outer curb",
    cellPhoneLot: "ATL Park-Ride lots or West Economy lot for waiting",
    parkingTip: "Hourly parking closest to terminal if meeting inside",
    bestPractice: "Use ATL's rideshare zones as reference — stay in marked pickup lanes only.",
    avoidTip: "Peak bank (5–8 PM) adds 15+ min to terminal loop time.",
  },
  SFO: {
    airportCode: "SFO",
    terminal: "Terminal 1 (Intl A) or Terminal 2 (Intl G) for Korean Air",
    curbsideZone: "Departures level curbside on assigned terminal",
    cellPhoneLot: "SFO Long Term Parking cell phone area or nearby Millbrae",
    parkingTip: "Domestic garage if fog causes repeated curbside loops",
    bestPractice: "In fog, passenger should text when at curb — visibility slows driver approach.",
    avoidTip: "Do not wait on highway 101 shoulder — use official lots.",
  },
  ORD: {
    airportCode: "ORD",
    terminal: "Terminal 3 (American) or Terminal 1 (United partners)",
    curbsideZone: "Lower level arrivals outer curb by door number",
    cellPhoneLot: "ORD Cell Phone Lot on Bessie Coleman Drive",
    parkingTip: "Economy Lot F with free shuttle if curbside is full",
    bestPractice: "Share terminal and door number — ORD is large and easy to miss passengers.",
    avoidTip: "I-190 construction zones can add 10 min — monitor drive time closely.",
  },
  DFW: {
    airportCode: "DFW",
    terminal: "Terminal A (American Airlines hub)",
    curbsideZone: "Arrivals curbside — upper or lower depending on terminal",
    cellPhoneLot: "DFW Express South or North cell phone lots (free)",
    parkingTip: "Terminal garage for quick meet-and-greet inside",
    bestPractice: "DFW terminals are far apart — confirm terminal letter before leaving home.",
    avoidTip: "Do not pick up at departures during peak — use arrivals level.",
  },
  ICN: {
    airportCode: "ICN",
    terminal: "Terminal 1 — Korean Air arrivals",
    curbsideZone: "Passenger pickup zone 1F curbside (short-term stop)",
    cellPhoneLot: "Incheon short-term parking P1/P2 for waiting",
    parkingTip: "Use parking garage if passenger needs help with luggage",
    bestPractice: "International arrivals add 30–45 min for customs — buffer accordingly.",
    avoidTip: "Curbside stops limited to 3 minutes — have passenger ready before you arrive.",
  },
  EWR: {
    airportCode: "EWR",
    terminal: "Terminal C (United) or B (partners)",
    curbsideZone: "Arrivals level outer curb",
    cellPhoneLot: "EWR Cell Phone Lot on Brewster Road",
    parkingTip: "Daily parking garage connected to terminal",
    bestPractice: "Heavy rain — use cell phone lot until passenger confirms they are outside.",
    avoidTip: "Newark Turnpike delays are common — recheck drive time 30 min before leaving.",
  },
  MIA: {
    airportCode: "MIA",
    terminal: "North Terminal (Concourse D) or Central/South",
    curbsideZone: "Arrivals curbside — follow terminal signage",
    cellPhoneLot: "MIA Cell Phone Lot on NW 31st St",
    parkingTip: "Flamingo Garage for covered pickup in storms",
    bestPractice: "Thunderstorms may pause ground traffic — stay in cell lot until cleared.",
    avoidTip: "LeJeune Road backup during peak international arrivals (2–6 PM).",
  },
  BOS: {
    airportCode: "BOS",
    terminal: "Terminal C (JetBlue) or E (international)",
    curbsideZone: "Arrivals curb by terminal letter",
    cellPhoneLot: "BOS Central Parking cell phone waiting area",
    parkingTip: "Economy E parking with shuttle for longer waits",
    bestPractice: "Sumner Tunnel traffic spikes at rush hour — leave early on weekdays.",
    avoidTip: "Do not block active taxi lanes on arrivals curb.",
  },
  FLL: {
    airportCode: "FLL",
    terminal: "Terminal 3 (JetBlue) or Terminal 4",
    curbsideZone: "Arrivals outer curb — color-coded by terminal",
    cellPhoneLot: "FLL Cell Phone Lot on Perimeter Road",
    parkingTip: "Hourly garage at terminal for easy meetup",
    bestPractice: "FLL curbside moves quickly — passenger should be outside before you enter loop.",
    avoidTip: "Weekend leisure traffic adds 10–15 min to terminal access.",
  },
};

const DEFAULT_GUIDE: AirportPickupGuide = {
  airportCode: "—",
  terminal: "Check airline app for terminal assignment",
  curbsideZone: "Arrivals level outer curb",
  cellPhoneLot: "Use airport cell phone waiting lot if available",
  parkingTip: "Short-term parking if curbside timing is tight",
  bestPractice: "Text passenger when you arrive — confirm exact door or pillar number.",
  avoidTip: "Avoid stopping in active traffic lanes.",
};

/**
 * Returns mock pickup guidance for an arrival airport.
 */
export function getAirportPickupGuide(airportCode: string): AirportPickupGuide {
  const code = airportCode.trim().toUpperCase();
  return PICKUP_GUIDES[code] ?? { ...DEFAULT_GUIDE, airportCode: code };
}
