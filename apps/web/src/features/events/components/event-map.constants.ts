/** Estilo Carto Voyager: más limpio que el tile estándar de OSM; sigue siendo gratis. */
export const EVENT_MAP_TILE = {
  url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 20,
} as const

export const EVENT_MAP_CENTER: [number, number] = [-34.6037, -58.3816]

export const EVENT_MAP_MARKER_COLORS = {
  verified: "#10b981",
  community: "#ff6b3d",
} as const
