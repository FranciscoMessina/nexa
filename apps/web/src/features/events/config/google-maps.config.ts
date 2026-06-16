/** Google Cloud Console → APIs & Services → Maps JavaScript API */
export const googleMapsApiKey =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? ""

/**
 * Map ID en Google Cloud (Map Management). Para probar alcanza DEMO_MAP_ID.
 * @see https://developers.google.com/maps/documentation/javascript/get-api-key
 */
export const googleMapsMapId =
  import.meta.env.VITE_GOOGLE_MAPS_MAP_ID?.trim() || "DEMO_MAP_ID"

export function isGoogleMapsEnabled(): boolean {
  return googleMapsApiKey.length > 0
}
