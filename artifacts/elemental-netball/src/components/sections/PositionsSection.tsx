import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BibSvg } from "../BibSvg";
import { POSITIONS } from "@/data/positions";

interface PositionsSectionProps {
  onBack: () => void;
}

export const PositionsSection: React.FC<PositionsSectionProps> = ({ onBack }) => {
  const [activePos, setActivePos] = useState<string | null>(null);

  const activePositionInfo = POSITIONS.find(p => p.code === activePos);

  const layoutClasses: Record<string, string> = {
    "GS": "col-start-1 col-end-2 row-start-1 row-end-2 justify-self-center",
    "GA": "col-start-2 col-end-3 row-start-1 row-end-2 justify-self-center",
    "WA": "col-start-1 col-end-3 row-start-2 row-end-3 justify-self-start ml-[10%]",
    "C":  "col-start-1 col-end-3 row-start-3 row-end-4 justify-self-center",
    "WD": "col-start-1 col-end-3 row-start-4 row-end-5 justify-self-end mr-[10%]",
    "GD": "col-start-1 col-end-2 row-start-5 row-end-6 justify-self-center",
    "GK": "col-start-2 col-end-3 row-start-5 row-end-6 justify-self-center",
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto" data-testid="section-positions">
      <div className="flex items-center p-4 border-b border-border sticky top-0 bg-background z-20">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="btn-back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold ml-2 uppercase tracking-tight text-white">Positions</h2>
      </div>

      <div className="flex-1 p-4 flex flex-col items-center justify-start">
        {/* Court Layout */}
        <div
          className="w-full max-w-[300px] aspect-[1/1.8] bg-card/50 rounded-2xl border border-border p-4 shadow-xl relative grid grid-cols-2 grid-rows-5 gap-y-4 mb-4"
          onClick={(e) => { if (e.target === e.currentTarget) setActivePos(null); }}
        >
          {POSITIONS.map(pos => (
            <motion.div
              key={pos.code}
              className={`${layoutClasses[pos.code]} w-16 h-20 cursor-pointer z-10 relative`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActivePos(pos.code === activePos ? null : pos.code)}
              data-testid={`pos-bib-${pos.code}`}
            >
              <BibSvg code={pos.code} team="Fire" className="drop-shadow-lg" />
              {activePos === pos.code && (
                <div
                  className="absolute inset-0 -z-10 rounded-[20px]"
                  style={{ boxShadow: `0 0 20px 5px ${pos.fireHex}` }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Tap prompt when nothing selected */}
        <AnimatePresence>
          {!activePositionInfo && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-4"
            >
              Tap a bib to learn more
            </motion.p>
          )}
        </AnimatePresence>

        {/* Position Details Card */}
        <div className="w-full max-w-sm">
          <AnimatePresence>
            {activePositionInfo && (
              <motion.div
                key={activePositionInfo.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card rounded-2xl border border-border shadow-2xl relative overflow-hidden"
              >
                {/* Colour glow */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 blur-3xl opacity-20 pointer-events-none"
                  style={{ backgroundColor: activePositionInfo.fireHex }}
                />

                {/* Header */}
                <div className="p-5 pb-4 flex items-center gap-3">
                  <div className="w-12 h-14 flex-shrink-0">
                    <BibSvg code={activePositionInfo.code} team="Fire" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-tight text-white leading-none">
                      {activePositionInfo.name}
                    </h3>
                    <p className="text-xs font-bold mt-0.5" style={{ color: activePositionInfo.fireHex }}>
                      {activePositionInfo.code} · {activePositionInfo.tagline}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 space-y-4">
                  {/* Role */}
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-1">Role</span>
                    <p className="text-sm text-foreground leading-relaxed">
                      {activePositionInfo.role}
                    </p>
                  </div>

                  {/* Zones */}
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-1">Allowed Zones</span>
                    <div className="bg-background/60 rounded-lg px-3 py-2 text-xs text-foreground border border-border/50 leading-relaxed">
                      {activePositionInfo.zoneCaption}
                    </div>
                  </div>

                  {/* Matchup */}
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-2">Matchup</span>
                    <div className="bg-background/60 rounded-xl border border-border/50 overflow-hidden">
                      {/* Bib row */}
                      <div className="flex items-center gap-3 px-3 pt-3 pb-2">
                        <div className="w-10 h-12 flex-shrink-0">
                          <BibSvg code={activePositionInfo.code} team="Fire" />
                        </div>
                        <div className="flex-1 text-center">
                          <span className="font-black italic text-muted-foreground text-sm block">vs</span>
                          <span
                            className="text-[10px] uppercase tracking-widest font-black"
                            style={{ color: activePositionInfo.fireHex }}
                          >
                            {activePositionInfo.code === activePositionInfo.matchup
                              ? "Each team has one"
                              : `Plays ${activePositionInfo.matchup}`}
                          </span>
                        </div>
                        <div className="w-10 h-12 flex-shrink-0">
                          <BibSvg code={activePositionInfo.matchup} team="Ice" />
                        </div>
                      </div>
                      {/* Description */}
                      <div className="px-3 pb-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {activePositionInfo.matchupDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
