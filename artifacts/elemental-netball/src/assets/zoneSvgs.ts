// Zone court SVGs — imported at build time, processed for dark-mode rendering.
// Each zone SVG has two fill layers:
//   cls-1 = white  (non-zone areas)  → made transparent so dark bg shows through
//   cls-2 = colour (allowed zone)    → kept, drives the glow
// Unstyled paths (black court outline) inherit fill="none" from the SVG root.
// The white Netball_Lines_White.svg is overlaid separately for crisp court lines.

import rawRed    from "./svg/Red_Zone.svg?raw";
import rawOrange from "./svg/Orange_Zone.svg?raw";
import rawYellow from "./svg/Yellow_Zone.svg?raw";
import rawGreen  from "./svg/Green_Zone.svg?raw";
import rawTeal   from "./svg/Teal_Zone.svg?raw";
import rawBlue   from "./svg/Blue_Zone.svg?raw";
import rawPurple from "./svg/Purple_Zone.svg?raw";

export { default as courtLinesRaw } from "./svg/Netball_Lines_White.svg?raw";

function process(raw: string, prefix: string): string {
  let text = raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .trim();

  // ── Scope cls-* class names (prevents collisions across multiple instances) ──
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

  // ── Dark-mode: make white fills transparent ──────────────────────────────
  // 1. In the <style> block, change "fill: #fff" → "fill: none"
  text = text.replace(
    /(<style[^>]*>[\s\S]*?)(fill\s*:\s*#fff(?:fff)?)([\s\S]*?<\/style>)/gi,
    (_, before, _fill, after) => `${before}fill: none${after}`
  );
  // 2. Inline fill="#fff" attributes
  text = text.replace(/\bfill="#fff(?:fff)?"/gi, 'fill="none"');
  text = text.replace(/\bfill="white"/gi, 'fill="none"');

  // ── Set fill="none" on the SVG root so unstyled paths (black outline) are transparent
  text = text.replace(/^(<svg\b[^>]*?)>/m, '$1 fill="none">');

  return text;
}

// Fire team: position code → SVG colour matches fireHex
export const ZONE_SVGS: Record<string, string> = {
  GS: process(rawRed,    "z-gs"),
  GA: process(rawOrange, "z-ga"),
  WA: process(rawYellow, "z-wa"),
  C:  process(rawGreen,  "z-c"),
  WD: process(rawTeal,   "z-wd"),
  GD: process(rawBlue,   "z-gd"),
  GK: process(rawPurple, "z-gk"),
};

// Ice team: position code → SVG colour matches iceHex (reversed palette)
// Ice GS=#663399 purple, GA=#0052b3 blue, WA=#009999 teal,
// C=#009933 green, WD=#ffaa00 yellow, GD=#ef6d22 orange, GK=#cc3333 red
export const ICE_ZONE_SVGS: Record<string, string> = {
  GS: process(rawPurple, "iz-gs"),
  GA: process(rawBlue,   "iz-ga"),
  WA: process(rawTeal,   "iz-wa"),
  C:  process(rawGreen,  "iz-c"),
  WD: process(rawYellow, "iz-wd"),
  GD: process(rawOrange, "iz-gd"),
  GK: process(rawRed,    "iz-gk"),
};
