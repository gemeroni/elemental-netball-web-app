import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BibSvg } from "../BibSvg";
import { POSITIONS, Team } from "@/data/positions";

interface PickYourSideSectionProps {
  onBack: () => void;
}

export const PickYourSideSection: React.FC<PickYourSideSectionProps> = ({ onBack }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // Step 2 state
  const [placedBibs, setPlacedBibs] = useState<Record<string, string>>({}); // slotCode -> positionCode
  const [activeBibTray, setActiveBibTray] = useState<string | null>(null); // currently selected bib from tray
  const [shake, setShake] = useState(false);

  const availableTrayBibs = POSITIONS.filter(p => !Object.values(placedBibs).includes(p.code));
  const isComplete = Object.keys(placedBibs).length === 7;

  const handleSlotTap = (slotCode: string) => {
    if (!activeBibTray) return;
    
    // Check if correct
    if (activeBibTray === slotCode) {
      setPlacedBibs(prev => ({ ...prev, [slotCode]: activeBibTray }));
      setActiveBibTray(null);
    } else {
      // Wrong placement
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setActiveBibTray(null);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedTeam(null);
    setPlacedBibs({});
    setActiveBibTray(null);
  };

  const slotLayoutClasses: Record<string, string> = {
    "GS": "col-start-1 col-end-2 row-start-1 row-end-2 justify-self-center",
    "GA": "col-start-2 col-end-3 row-start-1 row-end-2 justify-self-center",
    "WA": "col-start-1 col-end-3 row-start-2 row-end-3 justify-self-center mt-2",
    "C":  "col-start-1 col-end-3 row-start-3 row-end-4 justify-self-center",
    "WD": "col-start-1 col-end-3 row-start-4 row-end-5 justify-self-center mb-2",
    "GD": "col-start-1 col-end-2 row-start-5 row-end-6 justify-self-center",
    "GK": "col-start-2 col-end-3 row-start-5 row-end-6 justify-self-center",
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden" data-testid="section-pick">
      <div className="flex items-center p-4 border-b border-border bg-background z-20 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="btn-back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold ml-2 uppercase tracking-tight text-white">
          {step === 1 ? "Pick Your Side" : "Lineup"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-8 flex flex-col items-center">
        {step === 1 ? (
          <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-center text-muted-foreground mb-6 font-medium">
              Choose a team to play for. Fire plays attacking with solid bibs. Ice plays defending with outlined bibs.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Fire Team */}
              <button
                onClick={() => setSelectedTeam("Fire")}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                  selectedTeam === "Fire" ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
                }`}
                data-testid="team-fire"
              >
                <h3 className="text-2xl font-black text-[#FF6600] uppercase">Fire Team</h3>
                <div className="grid grid-cols-3 gap-2 opacity-80">
                  {POSITIONS.slice(0, 6).map(p => (
                    <div key={p.code} className="w-8 h-10"><BibSvg code={p.code} team="Fire" /></div>
                  ))}
                </div>
              </button>

              {/* Ice Team */}
              <button
                onClick={() => setSelectedTeam("Ice")}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                  selectedTeam === "Ice" ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
                }`}
                data-testid="team-ice"
              >
                <h3 className="text-2xl font-black text-[#2060FF] uppercase">Ice Team</h3>
                <div className="grid grid-cols-3 gap-2 opacity-80">
                  {POSITIONS.slice(0, 6).map(p => (
                    <div key={p.code} className="w-8 h-10"><BibSvg code={p.code} team="Ice" /></div>
                  ))}
                </div>
              </button>
            </div>

            {selectedTeam && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                <Button size="lg" className="w-full font-bold uppercase tracking-widest text-lg h-14" onClick={() => setStep(2)}>
                  Let's Go
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <p className="text-muted-foreground font-medium text-sm">
                Tap a bib below, then tap its position on court.
              </p>
              <Button variant="outline" size="sm" onClick={reset}>Start Again</Button>
            </div>

            {/* Court Area */}
            <div className="relative w-full aspect-[1/1.6] bg-card rounded-2xl border-2 border-border p-4 shadow-inner mb-6 shrink-0 grid grid-cols-2 grid-rows-5 gap-2">
              <div className="absolute inset-0 border-[4px] border-border/30 rounded-2xl m-2 pointer-events-none" />
              <div className="absolute top-[33%] left-2 right-2 border-t-[4px] border-border/30 pointer-events-none" />
              <div className="absolute bottom-[33%] left-2 right-2 border-t-[4px] border-border/30 pointer-events-none" />

              {POSITIONS.map(pos => {
                const isFilled = !!placedBibs[pos.code];
                return (
                  <button
                    key={`slot-${pos.code}`}
                    className={`${slotLayoutClasses[pos.code]} w-14 h-[4.5rem] relative flex items-center justify-center`}
                    onClick={() => handleSlotTap(pos.code)}
                    disabled={isFilled}
                    data-testid={`slot-${pos.code}`}
                  >
                    {isFilled ? (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [1.2, 1], opacity: 1 }}
                        className="w-full h-full"
                      >
                        <BibSvg code={pos.code} team={selectedTeam!} className={isComplete ? "shadow-[0_0_15px_var(--primary)] rounded-[15px]" : ""} />
                      </motion.div>
                    ) : (
                      <div className={`w-full h-full rounded-[15px] border-2 border-dashed flex items-center justify-center text-xs font-bold transition-colors ${activeBibTray ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground'}`}>
                        {pos.code}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tray Area */}
            {!isComplete ? (
              <motion.div 
                className="bg-card p-4 rounded-2xl border border-border mt-auto shrink-0"
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-wrap justify-center gap-3">
                  {availableTrayBibs.map(pos => (
                    <button
                      key={`tray-${pos.code}`}
                      className={`w-12 h-16 transition-transform ${activeBibTray === pos.code ? 'scale-110 shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-card rounded-[15px]' : 'hover:scale-105'}`}
                      onClick={() => setActiveBibTray(activeBibTray === pos.code ? null : pos.code)}
                      data-testid={`tray-bib-${pos.code}`}
                    >
                      <BibSvg code={pos.code} team={selectedTeam!} />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/20 border-2 border-primary text-primary font-black text-xl text-center p-4 rounded-2xl mt-auto uppercase tracking-wider"
              >
                Full Squad Out!
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
