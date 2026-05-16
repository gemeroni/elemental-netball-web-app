import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZONE_SVGS } from "@/assets/zoneSvgs";

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
  const svg = ZONE_SVGS[posCode];

  return (
    <div className="px-4 pb-1">
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Label row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h3 className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
            Zone
          </h3>
          <span
            className="text-[10px] uppercase tracking-widest font-black"
            style={{ color: accentHex }}
          >
            {posCode} · {posName}
          </span>
        </div>

        {/* Court diagram */}
        <AnimatePresence mode="wait">
          <motion.div
            key={posCode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mx-auto px-6 pb-3"
            style={{ maxWidth: 220 }}
          >
            {svg ? (
              <div
                className="w-full [&>svg]:w-full [&>svg]:h-auto [&>svg]:block drop-shadow-sm"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ) : (
              <div className="aspect-[356/709] bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-xs">No diagram</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {zoneCaption}
          </p>
        </div>
      </div>
    </div>
  );
};
