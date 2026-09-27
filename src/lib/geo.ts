export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_METERS = 6371000;

/**
 * Calculates great-circle distance between two GPS coordinates using the Haversine formula.
 */
export function calculateHaversineDistanceMeters(
  coord1: GeoCoordinates,
  coord2: GeoCoordinates
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Checks if two coordinates are within the given geofence radius (default 50 meters).
 */
export function isWithinGeofence(
  coord1: GeoCoordinates,
  coord2: GeoCoordinates,
  thresholdMeters = 50
): { isWithin: boolean; distanceMeters: number } {
  const distanceMeters = calculateHaversineDistanceMeters(coord1, coord2);
  return {
    isWithin: distanceMeters <= thresholdMeters,
    distanceMeters: Math.round(distanceMeters * 10) / 10,
  };
}
