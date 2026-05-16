import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BibSvg } from "../BibSvg";
import { POSITIONS, Position } from "@/data/positions";

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

      <div className="flex-1 p-4 flex flex-col items-center justify-start relative">
        {/* Court Layout */}
        <div className="w-full max-w-[300px] aspect-[1/1.8] bg-card/50 rounded-2xl border border-border p-4 shadow-xl relative grid grid-cols-2 grid-rows-5 gap-y-4 mb-4" onClick={(e) => {
          if (e.target === e.currentTarget) setActivePos(null);
        }}>
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

        {/* Position Details Card */}
        <div className="w-full max-w-sm min-h-[220px]">
          <AnimatePresence mode="wait">
            {activePositionInfo && (
              <motion.div
                key={activePositionInfo.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card p-5 rounded-2xl border border-border shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: activePositionInfo.fireHex }} />
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-12 flex-shrink-0">
                    <BibSvg code={activePositionInfo.code} team="Fire" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl uppercase tracking-tight text-white leading-none">
                      {activePositionInfo.name}
                    </h3>
                    <p className="text-sm font-bold opacity-80" style={{ color: activePositionInfo.fireHex }}>
                      {activePositionInfo.code}
                    </p>
                  </div>
                </div>

                <p className="text-card-foreground text-sm mb-4 leading-relaxed font-medium">
                  {activePositionInfo.matchupDescription}
                </p>

                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-1">Allowed Zones</span>
                  <div className="bg-background/50 rounded-lg p-2 text-xs text-foreground font-medium border border-border/50">
                    {activePositionInfo.zones}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-4 bg-background/50 rounded-lg p-3 border border-border/50">
                    <div className="w-10 h-12 flex-shrink-0">
                      <BibSvg code={activePositionInfo.code} team="Fire" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="font-bold text-muted-foreground italic text-sm block">vs</span>
                      <span className="text-xs uppercase tracking-widest font-black" style={{ color: activePositionInfo.fireHex }}>
                        {activePositionInfo.code === activePositionInfo.matchup
                          ? "Each team has one"
                          : `Plays ${activePositionInfo.matchup}`}
                      </span>
                    </div>
                    <div className="w-10 h-12 flex-shrink-0">
                      <BibSvg code={activePositionInfo.matchup} team="Ice" />
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
