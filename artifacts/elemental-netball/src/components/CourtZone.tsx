import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZONE_SVGS, courtLinesRaw } from "@/assets/zoneSvgs";

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
}

export const CourtZone: React.FC<CourtZoneProps> = ({
  posCode,
  posName,
  zoneCaption,
  accentHex,
}) => {
  const zoneSvg = ZONE_SVGS[posCode] ?? "";

  // Hex → rgba helper for inline styles
  const hex = accentHex;
  const glow = `${hex}60`;
  const glowFaint = `${hex}18`;

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
          <span className="text-[10px] uppercase tracking-widest font-black text-white/30">
            Zone
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={posCode}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="text-[10px] uppercase tracking-widest font-black"
              style={{ color: hex }}
            >
              {posCode} · {posName}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Court diagram ──────────────────────────────────────── */}
        <div className="flex justify-center px-10 py-4">
          {/* Fixed aspect-ratio court frame */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "356 / 709",
              maxWidth: 180,
              background: "#0c0c12",
              boxShadow: `0 0 0 1px ${hex}20, 0 8px 32px rgba(0,0,0,0.6)`,
            }}
          >
            {/* ── Layer 1: Zone colour fill + bloom glow ──────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`zone-${posCode}`}
                className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  filter: `drop-shadow(0 0 14px ${glow}) drop-shadow(0 0 30px ${hex}35)`,
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
        </div>

        {/* ── Caption ───────────────────────────────────────────── */}
        <div className="px-5 pb-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={`cap-${posCode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="text-[11px] text-center leading-relaxed"
              style={{ color: `${hex}bb` }}
            >
              {zoneCaption}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
