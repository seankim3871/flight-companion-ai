import L from "leaflet";

interface MapIconOptions {
  color: string;
  label: string;
  /** Inner glyph: plane, pin, or flag */
  variant: "departure" | "arrival" | "aircraft";
}

const GLYPHS: Record<MapIconOptions["variant"], string> = {
  departure: "↑",
  arrival: "★",
  aircraft: "✈",
};

/**
 * Creates a styled DivIcon matching the app design system.
 */
export function createMapIcon({ color, label, variant }: MapIconOptions): L.DivIcon {
  const glyph = GLYPHS[variant];

  return L.divIcon({
    className: "flight-map-marker",
    html: `
      <div class="flight-map-marker__wrap" style="--marker-color: ${color}" title="${label}">
        <span class="flight-map-marker__pin">
          <span class="flight-map-marker__glyph">${glyph}</span>
        </span>
        <span class="flight-map-marker__label">${label}</span>
      </div>
    `,
    iconSize: [36, 48],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}
