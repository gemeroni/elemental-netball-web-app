import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZONE_SVGS, ICE_ZONE_SVGS, courtLinesRaw } from "@/assets/zoneSvgs";
import { SpectrumSlider } from "@/components/SpectrumSlider";

// Strip XML/DOCTYPE from the court lines SVG once at module load
const COURT_LINES = courtLinesRaw
  .replace(/<\?xml[^?]*\?>/g, "")
  .replace(/<!DOCTYPE[^>]*>/gi, "")
  .trim();

// Court SVG native aspect ratio: 356 wide x 709 tall (portrait)
// Displayed rotated 90deg so landscape aspect = 709:356

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
  // Measure the card width so the court fills it exactly
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(300);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCardW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const zoneSvg = (team === "Ice" ? ICE_ZONE_SVGS : ZONE_SVGS)[posCode] ?? "";

  const hex       = accentHex;
  const glow      = `${hex}60`;
  const glowFaint = `${hex}18`;
  const courtShadow = `0 0 0 1px ${hex}20, 0 8px 32px rgba(0,0,0,0.6)`;

  // Court dimensions derived from card width
  // Small inset (12px each side) keeps the court from bleeding to the card edge
  const INSET   = 12;
  const courtW  = Math.max(10, cardW - INSET * 2);
  const courtH  = Math.round(courtW * (356 / 709)); // landscape ratio
  // Inner portrait div dimensions: width/height swap after the 90deg rotation
  const innerW  = courtH;   // portrait width  = rendered landscape height
  const innerH  = courtW;   // portrait height = rendered landscape width

  const sliderW = Math.max(160, cardW - 48);

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
    // Card is the outermost element; ref measures its rendered width
    <div
      ref={cardRef}
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
            {posCode} - {posName}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Court diagram - landscape, fluid width */}
      <div
        className="flex justify-center py-3"
        style={{ paddingLeft: INSET, paddingRight: INSET }}
      >
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{
            width: courtW,
            height: courtH,
            background: "#0c0c12",
            boxShadow: courtShadow,
          }}
        >
          <div
            className="absolute"
            style={{
              width: innerW,
              height: innerH,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(90deg)",
            }}
          >
            {courtLayers}
          </div>
        </div>
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
  );
};
