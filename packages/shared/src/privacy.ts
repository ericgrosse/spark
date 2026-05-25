import type { ProfileInput } from "./schemas";

export function publicProfile(profile: ProfileInput) {
  return {
    displayName: profile.displayName,
    bio: profile.bio,
    interests: profile.interests,
    photos: profile.photos,
    distanceVisible: profile.privacy.showDistance,
    onlineStatusVisible: profile.privacy.showOnlineStatus
  };
}

export function canAppearInDiscovery(profile: ProfileInput) {
  return profile.privacy.discoveryEnabled && profile.photos.length > 0 && profile.displayName.length > 1;
}
