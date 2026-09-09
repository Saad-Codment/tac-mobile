// Weigh-station "Location Status" via Google Places API (New) — the same
// Google Maps/Places key TAC already uses, through the consolidated
// PlacesDetailsService. This is deliberately NOT presented as an
// authoritative live-scale-status feed: Google's `businessStatus` /
// `currentOpeningHours` describe the LOCATION (is this business listing
// open), not whether the scale itself is actively weighing trucks right
// now. TAC doesn't have a DOT/state live-scale feed for this build, so
// this is the accepted, honestly-labeled weigh-station status experience
// — never call this "Live Scale Status: Open".
import {fetchPlaceDetails} from './Places/PlacesDetailsService';

export const isWeighStationStatusConfigured = () => true; // same Google key as Places search — always available once that key works

export const getWeighStationStatus = async place => {
  const result = await fetchPlaceDetails(place?.id, 'weigh');
  if (result.unavailable) return result;

  const businessStatus = result.raw?.businessStatus ?? null;
  const openNow = result.raw?.currentOpeningHours?.openNow ?? null;

  let statusLabel = null;
  if (businessStatus === 'CLOSED_TEMPORARILY') {
    statusLabel = 'Temporarily closed';
  } else if (businessStatus === 'CLOSED_PERMANENTLY') {
    statusLabel = 'Permanently closed';
  } else if (openNow === true) {
    statusLabel = 'Open now';
  } else if (openNow === false) {
    statusLabel = 'Closed now';
  } else if (businessStatus === 'OPERATIONAL') {
    statusLabel = 'Operational';
  }

  if (!statusLabel) return {unavailable: true, reason: 'no_data'};

  return {
    unavailable: false,
    statusLabel,
    note: 'Scale operations can vary — please follow posted signs.',
  };
};

export const describeWeighStationStatusUnavailable = reason => {
  switch (reason) {
    case 'network':
      return 'Could not check location status — check your connection and try again.';
    default:
      return 'Current hours aren’t listed for this location.';
  }
};
