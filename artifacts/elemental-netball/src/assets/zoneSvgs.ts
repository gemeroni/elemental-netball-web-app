// Zone court SVGs imported at build time — each is a complete court diagram
// with the position's allowed zones highlighted in its team colour.
// Zone shape mapping (attacking end always at top):
//   GS → Red   (attacking goal third + circle)
//   GA → Orange (attacking goal third + centre + circle)
//   WA → Yellow (attacking goal third + centre, no circle)
//   C  → Green  (all thirds, no circles)
//   WD → Teal   (centre + defensive goal third, no circle)
//   GD → Blue   (centre + defensive goal third + circle)
//   GK → Purple (defensive goal third + circle)

import rawRed    from "./svg/Red_Zone.svg?raw";
import rawOrange from "./svg/Orange_Zone.svg?raw";
import rawYellow from "./svg/Yellow_Zone.svg?raw";
import rawGreen  from "./svg/Green_Zone.svg?raw";
import rawTeal   from "./svg/Teal_Zone.svg?raw";
import rawBlue   from "./svg/Blue_Zone.svg?raw";
import rawPurple from "./svg/Purple_Zone.svg?raw";

function sanitise(raw: string, prefix: string): string {
  let text = raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .trim();

  const classes = new Set<string>();
  text.replace(/\.(cls-[\w]+)[\s{,]/g, (_, c: string) => {
    classes.add(c);
    return _;
  });
  if (classes.size === 0) return text;

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
  return text;
}

// Key: position code
export const ZONE_SVGS: Record<string, string> = {
  GS: sanitise(rawRed,    "z-gs"),
  GA: sanitise(rawOrange, "z-ga"),
  WA: sanitise(rawYellow, "z-wa"),
  C:  sanitise(rawGreen,  "z-c"),
  WD: sanitise(rawTeal,   "z-wd"),
  GD: sanitise(rawBlue,   "z-gd"),
  GK: sanitise(rawPurple, "z-gk"),
};
