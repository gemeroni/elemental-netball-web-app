import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZONE_SVGS, courtLinesRaw } from "@/assets/zoneSvgs";

import redThermRaw    from "@/assets/svg/Red_Thermometer.svg?raw";
import orangeThermRaw from "@/assets/svg/Orange_Thermometer.svg?raw";
import yellowThermRaw from "@/assets/svg/Yellow_Thermometer.svg?raw";
import greenThermRaw  from "@/assets/svg/Green_Thermometer.svg?raw";
import tealThermRaw   from "@/assets/svg/Teal_Thermometer.svg?raw";
import blueThermRaw   from "@/assets/svg/Blue_Thermometer.svg?raw";
import purpleThermRaw from "@/assets/svg/Purple_Thermometer.svg?raw";

// Inline-safe SVG: strip style block, make outline paths white on dark bg.
function processThermSvg(raw: string) {
  return raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg /, '<svg fill="white" ')
    .replace(/\s+class="[^"]*"/g, "")
    .trim();
}

// Map each position accentHex → pre-processed thermometer SVG.
// The hex values match fireHex/iceHex in positions.ts exactly.
const HEX_TO_THERM: Record<string, string> = {
  "#cc3333": processThermSvg(redThermRaw),
  "#ef6d22": processThermSvg(orangeThermRaw),
  "#ffaa00": processThermSvg(yellowThermRaw),
  "#009933": processThermSvg(greenThermRaw),
  "#009999": processThermSvg(tealThermRaw),
  "#0052b3": processThermSvg(blueThermRaw),
  "#663399": processThermSvg(purpleThermRaw),
};

// Strip XML/DOCTYPE from the court lines SVG once at module load
const COURT_LINES = courtLinesRaw
  .replace(/<\?xml[^?]*\?>/g, "")
  .replace(/<!DOCTYPE[^>]*>/gi, "")
  .trim();

interface CourtZoneProps {
  posCode: string;
  posName: string;
  zoneCaption: string;
  accentHex: string;
  team: "Fire" | "Ice";
}

export const CourtZone: React.FC<CourtZoneProps> = ({
  posCode,
  posName,
  zoneCaption,
  accentHex,
  team,
}) => {
  const zoneSvg = ZONE_SVGS[posCode] ?? "";

  // Hex → rgba helper for inline styles
  const hex = accentHex;
  const glow = `${hex}60`;
  const glowFaint = `${hex}18`;

  // Pick the thermometer matching this position's elemental temperature
  const thermSvg = HEX_TO_THERM[hex.toLowerCase()] ?? HEX_TO_THERM["#009933"];

  return (
    <div className="px-4 pb-2">
      {/* ── Outer frame ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${glowFaint} 0%, #0a0a0f 65%)`,
          border: `1px solid ${hex}35`,
          boxShadow: `0 0 48px ${hex}18, 0 2px 0 ${hex}25 inset`,
        }}
      >
        {/* ── Label row ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 pt-3 pb-0">
          <span className="text-[13px] uppercase tracking-widest font-black text-white/40">
            Zone
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={posCode}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="text-[13px] uppercase tracking-wider font-black"
              style={{ color: hex }}
            >
              {posCode} · {posName}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Court diagram + Thermometer ────────────────────────── */}
        <div className="flex justify-center items-center px-6 py-4 gap-3">
          {/* Fixed aspect-ratio court frame */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{
              aspectRatio: "356 / 709",
              width: 120,
              background: "#0c0c12",
              boxShadow: `0 0 0 1px ${hex}20, 0 8px 32px rgba(0,0,0,0.6)`,
            }}
          >
            {/* ── Layer 1: Zone colour fill + bloom glow ──────────── */}
            {/* Ice zones are the vertical mirror of Fire zones — scaleY(-1) flips  */}
            {/* the fill to the correct end without needing separate Ice SVG assets. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`zone-${posCode}-${team}`}
                className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  filter: `drop-shadow(0 0 14px ${glow}) drop-shadow(0 0 30px ${hex}35)`,
                  transform: team === "Ice" ? "scaleY(-1)" : undefined,
                }}
                dangerouslySetInnerHTML={{ __html: zoneSvg }}
              />
            </AnimatePresence>

            {/* ── Layer 2: White court lines overlay ──────────────── */}
            <div
              className="absolute inset-0 pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
              style={{ opacity: 0.75, mixBlendMode: "screen" }}
              dangerouslySetInnerHTML={{ __html: COURT_LINES }}
            />
          </div>

          {/* ── Elemental temperature thermometer ───────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`therm-${posCode}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center flex-shrink-0"
            >
              <div
                className="[&>svg]:block"
                style={{
                  width: 28,
                  height: 87,
                  filter: [
                    `drop-shadow(0 0 8px ${hex})`,
                    `drop-shadow(0 0 16px ${hex}bb)`,
                    `drop-shadow(0 0 3px ${hex})`,
                  ].join(" "),
                }}
                dangerouslySetInnerHTML={{ __html: thermSvg }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Caption ───────────────────────────────────────────── */}
        <div className="px-5 pb-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={`cap-${posCode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="text-[13px] text-center leading-relaxed font-medium"
              style={{ color: `${hex}cc` }}
            >
              {zoneCaption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
