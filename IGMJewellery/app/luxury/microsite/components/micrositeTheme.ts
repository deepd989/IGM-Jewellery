/**
 * The paint a microsite is drawn with. Every brand hands over its own two
 * colours, so the sections take them as props and reach for these only as a
 * fallback and for the neutrals the brand does not choose.
 */

/** Stand-ins for a brand that has not set its palette. */
export const MICROSITE_PRIMARY = "#8B1D1D";
export const MICROSITE_SECONDARY = "#C9BDBD";

/** Type on the page's white ground. */
export const MICROSITE_TEXT = "#1A1A1A";
export const MICROSITE_MUTED = "#7A7A7A";
export const MICROSITE_CARD_BORDER = "#EFE7E7";

/**
 * The brand's colour at a fraction of its strength — for the tinted panels and
 * bands the page is built from, which would be unreadable at full opacity.
 */
export const withAlpha = (color: string, alpha: number) => {
  const hex = color.trim().replace("#", "");

  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => char + char)
          .join("")
      : hex;

  if (full.length !== 6 || Number.isNaN(Number.parseInt(full, 16))) {
    // Not a hex the caller can tint — better their colour than a wrong one.
    return color;
  }

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** "150000" → "150K+", "15000000" → "15M+" — the tiles have no room for zeros. */
export const compactCount = (value: number) => {
  if (!Number.isFinite(value)) return "";
  if (value >= 10_000_000) return `${Math.floor(value / 10_000_000)}Cr+`;
  if (value >= 1_000_000) return `${Math.floor(value / 1_000_000)}M+`;
  if (value >= 1_000) return `${Math.floor(value / 1_000)}K+`;
  return `${value}`;
};
