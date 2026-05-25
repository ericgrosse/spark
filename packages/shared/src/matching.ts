export type SwipeAction = "like" | "pass";

export interface SwipeRecord {
  fromUserId: string;
  toUserId: string;
  action: SwipeAction;
  createdAt: Date;
}

export interface CandidateProfile {
  id: string;
  interests: string[];
  latitude?: number | null;
  longitude?: number | null;
  lastActiveAt?: Date | null;
}

export function isMutualMatch(currentUserId: string, targetUserId: string, swipes: SwipeRecord[]) {
  const currentLikedTarget = swipes.some(
    (swipe) => swipe.fromUserId === currentUserId && swipe.toUserId === targetUserId && swipe.action === "like"
  );
  const targetLikedCurrent = swipes.some(
    (swipe) => swipe.fromUserId === targetUserId && swipe.toUserId === currentUserId && swipe.action === "like"
  );

  return currentLikedTarget && targetLikedCurrent;
}

export function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

export function scoreCandidate(
  viewer: CandidateProfile,
  candidate: CandidateProfile,
  viewerLocation?: { latitude: number; longitude: number }
) {
  const sharedInterests = candidate.interests.filter((interest) => viewer.interests.includes(interest)).length;
  const distanceScore =
    viewerLocation && candidate.latitude && candidate.longitude
      ? Math.max(0, 100 - distanceKm(viewerLocation, { latitude: candidate.latitude, longitude: candidate.longitude }))
      : 0;
  const activeScore = candidate.lastActiveAt
    ? Math.max(0, 30 - (Date.now() - candidate.lastActiveAt.getTime()) / 86_400_000)
    : 0;

  return sharedInterests * 12 + distanceScore + activeScore;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
