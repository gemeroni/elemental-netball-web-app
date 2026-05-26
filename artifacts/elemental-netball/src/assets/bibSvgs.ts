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
import rawAquaWAIce      from "./svg/Aqua_WA_Ice.svg?raw";
import rawAquaWDFire     from "./svg/Aqua_WD_Fire.svg?raw";
import rawYellowWAFire   from "./svg/Yellow_WA_Fire.svg?raw";
import rawYellowWDIce    from "./svg/Yellow_WD_Ice.svg?raw";

// Monochrome variants — same bib shape, black/white fills
import rawMonoAquaWAIce  from "./Aqua_WA_Ice_Mono.svg?raw";
import rawMonoAquaWDFire from "./Aqua_WD_Fire_Mono.svg?raw";
import rawMonoBlueGAIce  from "./Blue_GA_Ice_Mono.svg?raw";
import rawMonoBlueGDFire from "./Blue_GD_Fire_Mono.svg?raw";
import rawMonoGreenCFire from "./Green_C_Fire_Mono.svg?raw";
import rawMonoGreenCIce  from "./Green_C_Ice_Mono.svg?raw";
import rawMonoOrangeGAFire   from "./Orange_GA_Fire_Mono.svg?raw";
import rawMonoOrangeGDIce    from "./Orange_GD_Ice_Mono.svg?raw";
import rawMonoPurpleGKFire   from "./Purple_GK_Fire_Mono.svg?raw";
import rawMonoPurpleGSIce    from "./Purple_GS_Ice_Mono.svg?raw";
import rawMonoRedGKIce       from "./Red_GK_Ice_Mono.svg?raw";
import rawMonoRedGSFire      from "./Red_GS_Fire_Mono.svg?raw";
import rawMonoYellowWAFire   from "./Yellow_WA_Fire_Mono.svg?raw";
import rawMonoYellowWDIce    from "./Yellow_WD_Ice_Mono.svg?raw";

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
  WA_Ice:   rawAquaWAIce,
  WD_Fire:  rawAquaWDFire,
  WA_Fire:  rawYellowWAFire,
  WD_Ice:   rawYellowWDIce,
};

// Mono key: `${CODE}_${Team}_Mono`
const RAW_MONO: Record<string, string> = {
  WA_Ice:   rawMonoAquaWAIce,
  WD_Fire:  rawMonoAquaWDFire,
  GA_Ice:   rawMonoBlueGAIce,
  GD_Fire:  rawMonoBlueGDFire,
  C_Fire:   rawMonoGreenCFire,
  C_Ice:    rawMonoGreenCIce,
  GA_Fire:  rawMonoOrangeGAFire,
  GD_Ice:   rawMonoOrangeGDIce,
  GK_Fire:  rawMonoPurpleGKFire,
  GS_Ice:   rawMonoPurpleGSIce,
  GK_Ice:   rawMonoRedGKIce,
  GS_Fire:  rawMonoRedGSFire,
  WA_Fire:  rawMonoYellowWAFire,
  WD_Ice:   rawMonoYellowWDIce,
};

export const BIB_SVGS: Record<string, string> = Object.fromEntries(
  Object.entries(RAW).map(([key, raw]) => [key, sanitise(raw, key)])
);

export const BIB_SVGS_MONO: Record<string, string> = Object.fromEntries(
  Object.entries(RAW_MONO).map(([key, raw]) => [key, sanitise(raw, `mono-${key}`)])
);
