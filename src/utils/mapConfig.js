import { isGoogleMapsConfigured } from "./integrations";

export const MAP_CONFIG = {
  id: "google-map-script",
  googleMapsApiKey: isGoogleMapsConfigured()
    ? process.env.NEXT_PUBLIC_MAP_API
    : "",
  libraries: ["places"],
};

export const mapsEnabled = isGoogleMapsConfigured();
