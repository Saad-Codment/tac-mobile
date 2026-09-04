// Integration point for live fuel pricing — kept out of the POI UI so a
// real provider can be wired in here later without touching
// LegNavigationScreen. No provider is selected yet (this needs something
// like GasBuddy's or OPIS's fuel-price API/key, evaluated and chosen by
// the team), so this always resolves to an honest "not configured" state.
// It NEVER returns a fabricated price — a fuel stop with no real price
// data shows as unavailable, not as a guessed number.
export const isFuelPriceConfigured = () => false;

// `place` is the POI object (has `.id`, the Google Place ID) — kept as
// the input shape a real provider integration would also need (most
// fuel-price providers match stations by location/brand, not Place ID
// directly, so a real implementation will likely also want lat/lon and
// the station name; both are already on the POI object callers have).
export const getFuelPrice = async place => {
  if (!isFuelPriceConfigured()) {
    return {unavailable: true, reason: 'not_configured'};
  }
  // Real implementation goes here once a provider is selected — call
  // it, normalize {price, currency, unit, fuelType, updatedAt}, return.
  return {unavailable: true, reason: 'not_configured'};
};

export const describeFuelPriceUnavailable = reason => {
  switch (reason) {
    case 'not_configured':
      return 'Live fuel prices aren’t available — this needs a fuel-pricing provider this project doesn’t currently have.';
    default:
      return 'Fuel price is temporarily unavailable.';
  }
};
