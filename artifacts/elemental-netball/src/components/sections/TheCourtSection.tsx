import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AssetImage } from "../AssetImage";
import { Button } from "@/components/ui/button";

interface ZoneInfo {
  id: string;
  name: string;
  desc: string;
  style: React.CSSProperties;
}

const ZONES: ZoneInfo[] = [
  {
    id: "goal-third-top",
    name: "Goal Third",
    desc: "Goal Third — attackers aim to get into this zone to set up shots at goal.",
    style: { top: 0, left: 0, right: 0, height: "33%" }
  },
  {
    id: "shooting-circle-top",
    name: "Shooting Circle",
    desc: "Shooting Circle — only the Goal Shooter and Goal Attack can score from inside here.",
    style: { top: 0, left: "25%", right: "25%", height: "16%", borderRadius: "0 0 50% 50%" }
  },
  {
    id: "centre-third",
    name: "Centre Third",
    desc: "Centre Third — all 7 players can enter this zone to move the ball up the court.",
    style: { top: "33%", left: 0, right: 0, height: "34%" }
  },
  {
    id: "goal-third-bottom",
    name: "Goal Third",
    desc: "Goal Third — the defending team works to keep the ball out of their goal third.",
    style: { bottom: 0, left: 0, right: 0, height: "33%" }
  },
  {
    id: "shooting-circle-bottom",
    name: "Shooting Circle",
    desc: "Shooting Circle — the Goal Keeper and Goal Defence protect this area from shooters.",
    style: { bottom: 0, left: "25%", right: "25%", height: "16%", borderRadius: "50% 50% 0 0" }
  }
];

interface TheCourtSectionProps {
  onBack: () => void;
}

export const TheCourtSection: React.FC<TheCourtSectionProps> = ({ onBack }) => {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const activeZoneInfo = ZONES.find(z => z.id === activeZone);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto" data-testid="section-court">
      <div className="flex items-center p-4 border-b border-border sticky top-0 bg-background z-10">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="btn-back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold ml-2 uppercase tracking-tight text-white">The Court</h2>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center">
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Tap a zone to learn who can enter and what happens there.
        </p>

        <div className="relative w-full max-w-sm aspect-[1/2] mb-8 bg-card rounded-lg overflow-hidden border border-border p-4 shadow-xl">
          <AssetImage 
            src="/assets/svg/Spectrum_Court.svg" 
            alt="Netball Court" 
            className="w-full h-full object-contain pointer-events-none"
            fallbackText="Court Diagram"
          />
          
          <div className="absolute inset-4">
            {ZONES.map(zone => (
              <button
                key={zone.id}
                className="absolute z-10 transition-all duration-300"
                style={{
                  ...zone.style,
                  backgroundColor: activeZone === zone.id ? "rgba(255, 255, 255, 0.2)" : "transparent",
                  border: activeZone === zone.id ? "2px solid var(--primary)" : "1px dashed rgba(255,255,255,0.2)",
                  boxShadow: activeZone === zone.id ? "0 0 15px var(--primary)" : "none"
                }}
                onClick={() => setActiveZone(zone.id)}
                data-testid={`zone-${zone.id}`}
                aria-label={zone.name}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-sm min-h-[100px]">
          <AnimatePresence mode="wait">
            {activeZoneInfo ? (
              <motion.div
                key={activeZoneInfo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-card p-4 rounded-xl border border-border text-center shadow-lg"
              >
                <h3 className="font-bold text-lg text-primary mb-2">{activeZoneInfo.name}</h3>
                <p className="text-sm text-card-foreground leading-relaxed">{activeZoneInfo.desc}</p>
              </motion.div>
            ) : (
              <div className="bg-transparent border border-dashed border-border/50 p-4 rounded-xl text-center text-muted-foreground text-sm flex items-center justify-center h-full">
                Waiting for selection...
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
