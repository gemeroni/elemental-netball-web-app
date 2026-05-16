import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TheCourtSection } from "./sections/TheCourtSection";
import { PositionsSection } from "./sections/PositionsSection";
import { TheRulesSection } from "./sections/TheRulesSection";
import { PickYourSideSection } from "./sections/PickYourSideSection";

type SectionType = "hub" | "court" | "positions" | "rules" | "pick";

export const ElementalNetball: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("hub");

  const renderSection = () => {
    switch (activeSection) {
      case "court":
        return <TheCourtSection onBack={() => setActiveSection("hub")} />;
      case "positions":
        return <PositionsSection onBack={() => setActiveSection("hub")} />;
      case "rules":
        return <TheRulesSection onBack={() => setActiveSection("hub")} />;
      case "pick":
        return <PickYourSideSection onBack={() => setActiveSection("hub")} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground overflow-hidden font-sans relative" data-testid="app-container">
      <AnimatePresence mode="wait">
        {activeSection === "hub" ? (
          <motion.div 
            key="hub"
            className="w-full min-h-[100dvh] flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-md w-full mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md">
                  Elemental<br/>
                  <span className="text-primary">Netball</span>
                </h1>
                <p className="text-muted-foreground font-medium">Learn the game. Choose your side.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <HubTile 
                  title="The Court" 
                  color="var(--chart-3)" 
                  onClick={() => setActiveSection("court")} 
                  testId="tile-court"
                />
                <HubTile 
                  title="Positions" 
                  color="var(--chart-4)" 
                  onClick={() => setActiveSection("positions")} 
                  testId="tile-positions"
                />
                <HubTile 
                  title="The Rules" 
                  color="var(--destructive)" 
                  onClick={() => setActiveSection("rules")} 
                  testId="tile-rules"
                />
                <HubTile 
                  title="Pick Your Side" 
                  color="var(--chart-5)" 
                  onClick={() => setActiveSection("pick")} 
                  testId="tile-pick"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="section"
            className="w-full min-h-[100dvh] flex flex-col absolute inset-0 bg-background"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface HubTileProps {
  title: string;
  color: string;
  onClick: () => void;
  testId: string;
}

const HubTile: React.FC<HubTileProps> = ({ title, color, onClick, testId }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl aspect-square flex items-end p-4 border border-white/10 shadow-lg text-left transition-colors hover:border-white/30"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.5) 100%), ${color}20`
      }}
      data-testid={testId}
    >
      <div 
        className="absolute inset-0 opacity-20"
        style={{ backgroundColor: color }}
      />
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"
        style={{ backgroundColor: color, opacity: 0.4 }}
      />
      <h2 className="relative z-10 text-xl font-bold text-white shadow-black drop-shadow-sm uppercase leading-tight tracking-tight">
        {title}
      </h2>
    </motion.button>
  );
};
