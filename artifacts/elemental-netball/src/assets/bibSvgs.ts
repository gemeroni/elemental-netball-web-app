// All bib SVGs imported at build time via Vite ?raw — zero fetch latency.
// Each is sanitised once at module load with a stable per-file prefix so
// multiple instances on the same page never share CSS class names.

import rawBlueGAIce      from "./svg/Blue_GA_Ice.svg?raw";
import rawBlueGDFire     from "./svg/Blue_GD_Fire.svg?raw";
import rawGreenCFire     from "./svg/Green_C_Fire.svg?raw";
import rawGreenCIce      from "./svg/Green_C_Ice.svg?raw";
import rawOrangeGAFire   from "./svg/Orange_GA_Fire.svg?raw";
import rawOrangeGDIce    from "./svg/Orange_GD_Ice.svg?raw";
import rawPurpleGKFire   from "./svg/Purple_GK_Fire.svg?raw";
import rawPurpleGSIce    from "./svg/Purple_GS_Ice.svg?raw";
import rawRedGKIce       from "./svg/Red_GK_Ice.svg?raw";
import rawRedGSFire      from "./svg/Red_GS_Fire.svg?raw";
import rawTealWAIce      from "./svg/Teal_WA_Ice.svg?raw";
import rawTealWDFire     from "./svg/Teal_WD_Fire.svg?raw";
import rawYellowWAFire   from "./svg/Yellow_WA_Fire.svg?raw";
import rawYellowWDIce    from "./svg/Yellow_WD_Ice.svg?raw";

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

  // Pass 1 — scope CSS selectors
  text = text.replace(
    /\.(cls-[\w]+)(?=[\s{,])/g,
    (_, c: string) => `.${c}-${prefix}`
  );

  // Pass 2 — scope class attribute tokens
  text = text.replace(/\bclass="([^"]*)"/g, (_, val: string) => {
    const scoped = val
      .split(/\s+/)
      .map((t) => (classes.has(t) ? `${t}-${prefix}` : t))
      .join(" ");
    return `class="${scoped}"`;
  });

  return text;
}

// Lookup key: `${CODE}_${Team}`  e.g. "GS_Fire", "GA_Ice"
const RAW: Record<string, string> = {
  GA_Ice:   rawBlueGAIce,
  GD_Fire:  rawBlueGDFire,
  C_Fire:   rawGreenCFire,
  C_Ice:    rawGreenCIce,
  GA_Fire:  rawOrangeGAFire,
  GD_Ice:   rawOrangeGDIce,
  GK_Fire:  rawPurpleGKFire,
  GS_Ice:   rawPurpleGSIce,
  GK_Ice:   rawRedGKIce,
  GS_Fire:  rawRedGSFire,
  WA_Ice:   rawTealWAIce,
  WD_Fire:  rawTealWDFire,
  WA_Fire:  rawYellowWAFire,
  WD_Ice:   rawYellowWDIce,
};

export const BIB_SVGS: Record<string, string> = Object.fromEntries(
  Object.entries(RAW).map(([key, raw]) => [key, sanitise(raw, key)])
);
