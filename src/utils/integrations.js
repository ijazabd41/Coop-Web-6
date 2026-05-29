/** True when Firebase env vars are real (not template placeholders). */
export function isFirebaseConfigured() {
  const key = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
  if (!key || !apiKey) return false;
  const placeholders = [
    "FIREBASE",
    "YOUR_",
    "HERE",
    "PLACEHOLDER",
  ];
  const combined = `${key}${apiKey}`.toUpperCase();
  if (placeholders.some((p) => combined.includes(p))) return false;
  // VAPID keys are URL-safe base64, typically 80+ chars
  return key.length >= 40 && !/\s/.test(key);
}

/** True when Google Maps API key is configured. */
export function isGoogleMapsConfigured() {
  const key = process.env.NEXT_PUBLIC_MAP_API || "";
  if (!key || key.length < 20) return false;
  const invalid = ["YOUR_MAP", "KEY_HERE", "PLACEHOLDER", "xxx"];
  const upper = key.toUpperCase();
  return !invalid.some((p) => upper.includes(p));
}
