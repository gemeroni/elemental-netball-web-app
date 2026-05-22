import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZONE_SVGS, ICE_ZONE_SVGS, courtLinesRaw } from "@/assets/zoneSvgs";
import { SpectrumSlider } from "@/components/SpectrumSlider";

// Strip XML/DOCTYPE from the court lines SVG once at module load
const COURT_LINES = courtLinesRaw
  .replace(/<\?xml[^?]*\?>/g, "")
  .replace(/<!DOCTYPE[^>]*>/gi, "")
  .trim();

// Court SVG native aspect ratio: 356 wide x 709 tall (portrait)

// Landscape geometry (sm breakpoint and above):
// Rotate the portrait SVG 90 degrees inside a landscape clipping wrapper.
// COURT_IN_H becomes the landscape rendered width; COURT_IN_W becomes the height.
const COURT_LS_W  = 310;
const COURT_IN_H  = COURT_LS_W;
const COURT_IN_W  = Math.round(COURT_LS_W * (356 / 709));  // ~155
const COURT_WRAP_W = COURT_IN_H;   // 310 landscape rendered width
const COURT_WRAP_H = COURT_IN_W;   // ~155 landscape rendered height

// Portrait geometry (mobile):
// Show the SVG in its natural orientation, no rotation needed.
const COURT_PT_W = 180;
const COURT_PT_H = Math.round(COURT_PT_W * (709 / 356));   // ~359

// Slider widths per breakpoint
const SLIDER_W_MOBILE  = 300;
const SLIDER_W_DESKTOP = 340;

// Breakpoint hook
function useIsWide(breakpoint = 640): boolean {
  const [wide, setWide] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= breakpoint
  );
  useEffect(() => {
    const handler = () => setWide(window.innerWidth >= breakpoint);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return wide;
}

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
  const isWide  = useIsWide();
  const zoneSvg = (team === "Ice" ? ICE_ZONE_SVGS : ZONE_SVGS)[posCode] ?? "";

  const hex       = accentHex;
  const glow      = `${hex}60`;
  const glowFaint = `${hex}18`;
  const courtShadow = `0 0 0 1px ${hex}20, 0 8px 32px rgba(0,0,0,0.6)`;
  const sliderW   = isWide ? SLIDER_W_DESKTOP : SLIDER_W_MOBILE;

  // Zone fill and court lines layers, shared between portrait and landscape
  const courtLayers = (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`zone-${posCode}-${team}`}
          className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ filter: `drop-shadow(0 0 14px ${glow}) drop-shadow(0 0 30px ${hex}35)` }}
          dangerouslySetInnerHTML={{ __html: zoneSvg }}
        />
      </AnimatePresence>

      <div
        className="absolute inset-0 pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
        style={{ opacity: 0.75, mixBlendMode: "screen" }}
        dangerouslySetInnerHTML={{ __html: COURT_LINES }}
      />
    </>
  );

  return (
    <div className="px-4 pb-2">
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% 0%, ${glowFaint} 0%, #0a0a0f 65%)`,
          border: `1px solid ${hex}35`,
          boxShadow: `0 0 48px ${hex}18, 0 2px 0 ${hex}25 inset`,
        }}
      >
        {/* Label row */}
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

        {/* Court diagram */}
        <div className="flex justify-center py-4">
          {isWide ? (
            // Landscape: portrait SVG rotated 90 degrees inside a clipping wrapper
            <div
              className="relative overflow-hidden flex-shrink-0"
              style={{ width: COURT_WRAP_W, height: COURT_WRAP_H, background: "#0c0c12", boxShadow: courtShadow }}
            >
              <div
                className="absolute"
                style={{
                  width: COURT_IN_W,
                  height: COURT_IN_H,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(90deg)",
                }}
              >
                {courtLayers}
              </div>
            </div>
          ) : (
            // Portrait: natural SVG orientation on mobile
            <div
              className="relative overflow-hidden flex-shrink-0"
              style={{ width: COURT_PT_W, height: COURT_PT_H, background: "#0c0c12", boxShadow: courtShadow }}
            >
              {courtLayers}
            </div>
          )}
        </div>

        {/* Spectrum slider */}
        <div className="flex justify-center px-3 pb-4">
          <SpectrumSlider accentHex={hex} width={sliderW} />
        </div>

        {/* Caption */}
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
