// Integration point for authoritative weigh-station open/closed status —
// kept out of the POI UI so a real provider can be wired in here later.
// No provider is selected yet (this needs a state DOT feed, PrePass, or
// similar authoritative source, evaluated and chosen by the team), so
// this always resolves to an honest "not configured" state. Google
// Places' generic `opening_hours.open_now` (used elsewhere in this file
// for other categories) is deliberately NOT reused here as a stand-in —
// a business's Places hours are not the same thing as a scale being
// open for weigh-in, and presenting one as the other would be exactly
// the kind of fabricated-status claim this project is trying to avoid.
export const isWeighStationStatusConfigured = () => false;

// `place` is the POI object (has `.id`/lat/lon) — kept as the input
// shape a real provider integration would also need.
export const getWeighStationStatus = async place => {
  if (!isWeighStationStatusConfigured()) {
    return {unavailable: true, reason: 'not_configured'};
  }
  // Real implementation goes here once a provider is selected — call
  // it, normalize {isOpen, updatedAt, source}, return.
  return {unavailable: true, reason: 'not_configured'};
};

export const describeWeighStationStatusUnavailable = reason => {
  switch (reason) {
    case 'not_configured':
      return 'Open/closed status isn’t available — this needs a DOT/state data feed this project doesn’t currently have.';
    default:
      return 'Weigh station status is temporarily unavailable.';
  }
};
