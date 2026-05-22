// Zone court SVGs — imported at build time, processed for dark-mode rendering.
// Each zone SVG has two fill layers:
//   white fill (non-zone areas) - made transparent so dark bg shows through
//   colour fill (allowed zone)  - replaced with electric palette colour
// Unstyled paths (black court outline) inherit fill="none" from the SVG root.
// The white Netball_Lines_White.svg is overlaid separately for crisp court lines.

import rawRed    from "./svg/Red_Zone.svg?raw";
import rawOrange from "./svg/Orange_Zone.svg?raw";
import rawYellow from "./svg/Yellow_Zone.svg?raw";
import rawGreen  from "./svg/Green_Zone.svg?raw";
import rawAqua   from "./svg/Aqua_Zone.svg?raw";
import rawBlue   from "./svg/Blue_Zone.svg?raw";
import rawPurple from "./svg/Purple_Zone.svg?raw";

export { default as courtLinesRaw } from "./svg/Netball_Lines_White.svg?raw";

// Electric palette - matches SpectrumSlider and bib colours exactly
const ELECTRIC: Record<string, string> = {
  red:    "#f42040",
  orange: "#ff6600",
  yellow: "#ffd800",
  green:  "#00c853",
  aqua:   "#00c8dc",
  blue:   "#2060ff",
  purple: "#8833ee",
};

// Old colours baked into the designer SVG files
const OLD_COLOURS: Record<string, string> = {
  red:    "#c33",
  orange: "#ef6d22",
  yellow: "#fa0",
  green:  "#093",
  aqua:   "#099",
  blue:   "#0052b3",
  purple: "#639",
};

function process(raw: string, prefix: string, colourKey: string): string {
  let text = raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .trim();

  // Replace old zone colour with electric palette colour (style blocks + inline attrs)
  const oldCol = OLD_COLOURS[colourKey];
  const newCol = ELECTRIC[colourKey];
  if (oldCol && newCol) {
    // Case-insensitive global replace of every occurrence
    const escaped = oldCol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(escaped, "gi"), newCol);
  }

  // Scope cls-* class names (prevents collisions across multiple instances)
  const classes = new Set<string>();
  text.replace(/\.(cls-[\w]+)[\s{,]/g, (_, c: string) => {
    classes.add(c);
    return _;
  });
  if (classes.size > 0) {
    text = text.replace(
      /\.(cls-[\w]+)(?=[\s{,])/g,
      (_, c: string) => `.${c}-${prefix}`
    );
    text = text.replace(/\bclass="([^"]*)"/g, (_, val: string) => {
      const scoped = val
        .split(/\s+/)
        .map((t) => (classes.has(t) ? `${t}-${prefix}` : t))
        .join(" ");
      return `class="${scoped}"`;
    });
  }

  // Dark-mode: make white fills transparent
  // 1. In the <style> block
  text = text.replace(
    /(<style[^>]*>[\s\S]*?)(fill\s*:\s*#fff(?:fff)?)([\s\S]*?<\/style>)/gi,
    (_, before, _fill, after) => `${before}fill: none${after}`
  );
  // 2. Inline fill="#fff" attributes
  text = text.replace(/\bfill="#fff(?:fff)?"/gi, 'fill="none"');
  text = text.replace(/\bfill="white"/gi, 'fill="none"');

  // Set fill="none" on the SVG root so unstyled paths (black outline) are transparent
  text = text.replace(/^(<svg\b[^>]*?)>/m, '$1 fill="none">');

  return text;
}

// Fire team: position code -> SVG colour matches fireHex (electric palette)
export const ZONE_SVGS: Record<string, string> = {
  GS: process(rawRed,    "z-gs",  "red"),
  GA: process(rawOrange, "z-ga",  "orange"),
  WA: process(rawYellow, "z-wa",  "yellow"),
  C:  process(rawGreen,  "z-c",   "green"),
  WD: process(rawAqua,   "z-wd",  "aqua"),
  GD: process(rawBlue,   "z-gd",  "blue"),
  GK: process(rawPurple, "z-gk",  "purple"),
};

// Ice team: reversed palette - Ice GS=purple, GA=blue, WA=aqua,
// C=green, WD=yellow, GD=orange, GK=red
export const ICE_ZONE_SVGS: Record<string, string> = {
  GS: process(rawPurple, "iz-gs", "purple"),
  GA: process(rawBlue,   "iz-ga", "blue"),
  WA: process(rawAqua,   "iz-wa", "aqua"),
  C:  process(rawGreen,  "iz-c",  "green"),
  WD: process(rawYellow, "iz-wd", "yellow"),
  GD: process(rawOrange, "iz-gd", "orange"),
  GK: process(rawRed,    "iz-gk", "red"),
};
