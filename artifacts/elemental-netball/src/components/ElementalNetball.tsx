import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BibSvg } from "./BibSvg";
import { CourtZone } from "./CourtZone";
import { POSITIONS, getPositionByCode } from "@/data/positions";
import type { Team } from "@/data/positions";

export const ElementalNetball: React.FC = () => {
  const [activePos, setActivePos] = useState("GS");
  const [activeTeam, setActiveTeam] = useState<Team>("Fire");

  const pos = getPositionByCode(activePos)!;
  const opponent = getPositionByCode(pos.matchup)!;

  const isFire = activeTeam === "Fire";
  const activeHex = isFire ? pos.fireHex : pos.iceHex;

  const leftCode = activePos;
  const leftTeam = activeTeam;
  const rightCode = pos.matchup;
  const rightTeam: Team = isFire ? "Ice" : "Fire";
  const rightHex = isFire ? opponent.iceHex : opponent.fireHex;

  return (
    <div
      className="min-h-[100dvh] w-full bg-background text-foreground font-sans flex flex-col"
      data-testid="app-container"
    >
      {/* ── Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#111] border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-black uppercase tracking-tight text-white leading-none">
              Elemental <span className="text-primary">Netball</span>
            </h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
              Position Logic
            </p>
          </div>

          {/* Fire / Ice toggle */}
          <div className="flex rounded-lg overflow-hidden border border-white/15 flex-shrink-0">
            <button
              onClick={() => setActiveTeam("Fire")}
              className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                isFire
                  ? "bg-[#E53935] text-white"
                  : "bg-transparent text-muted-foreground hover:text-white"
              }`}
              data-testid="toggle-fire"
            >
              🔥 Fire
            </button>
            <button
              onClick={() => setActiveTeam("Ice")}
              className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                !isFire
                  ? "bg-[#1E88E5] text-white"
                  : "bg-transparent text-muted-foreground hover:text-white"
              }`}
              data-testid="toggle-ice"
            >
              Ice 🧊
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* ── Matchup Band ─────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`matchup-${activePos}-${activeTeam}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card border-b border-border px-4 py-4 relative overflow-hidden"
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ background: `linear-gradient(135deg, ${activeHex}, transparent 60%)` }}
            />

            <div className="relative flex items-center gap-3">
              {/* Left bib — active team's position */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-14 h-[68px]">
                  <BibSvg code={leftCode} team={leftTeam} />
                </div>
                <span
                  className="text-[11px] uppercase tracking-widest font-black"
                  style={{ color: activeHex }}
                >
                  {leftTeam}
                </span>
              </div>

              {/* Centre: position name + tagline + vs */}
              <div className="flex-1 text-center min-w-0">
                <p
                  className="text-xs uppercase tracking-widest font-black mb-0.5"
                  style={{ color: activeHex }}
                >
                  {pos.code}
                </p>
                <h2 className="font-black text-lg uppercase tracking-tight text-white leading-tight">
                  {pos.name}
                </h2>
                <p className="text-xs italic text-muted-foreground mb-2">
                  {pos.tagline}
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div
                    className="h-px flex-1 opacity-30"
                    style={{ backgroundColor: activeHex }}
                  />
                  <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                    vs
                  </span>
                  <div
                    className="h-px flex-1 opacity-30"
                    style={{ backgroundColor: rightHex }}
                  />
                </div>
                <p className="text-sm font-bold text-muted-foreground">
                  {opponent.name}
                </p>
                <p className="text-xs italic text-muted-foreground/70">
                  {opponent.tagline}
                </p>
              </div>

              {/* Right bib — opponent's position */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-14 h-[68px] opacity-80">
                  <BibSvg code={rightCode} team={rightTeam} />
                </div>
                <span
                  className="text-[11px] uppercase tracking-widest font-black"
                  style={{ color: rightHex }}
                >
                  {rightTeam}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Bib Selector ─────────────────────────────────── */}
        <div className="bg-background border-b border-border px-3 py-3">
          <p className="text-[11px] uppercase tracking-widest font-black text-muted-foreground text-center mb-2">
            {activeTeam} Team — tap a position
          </p>
          <div className="flex justify-around items-end">
            {POSITIONS.map((p) => {
              const isActive = p.code === activePos;
              const hex = isFire ? p.fireHex : p.iceHex;
              return (
                <motion.button
                  key={p.code}
                  onClick={() => setActivePos(p.code)}
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center gap-1 focus:outline-none"
                  data-testid={`pos-tab-${p.code}`}
                >
                  <motion.div
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-10 h-12 transition-opacity"
                    style={{
                      opacity: isActive ? 1 : 0.4,
                      filter: isActive
                        ? `drop-shadow(0 0 6px ${hex})`
                        : "none",
                    }}
                  >
                    <BibSvg code={p.code} team={activeTeam} />
                  </motion.div>
                  <span
                    className="text-[11px] font-black uppercase tracking-wide transition-all"
                    style={{ color: isActive ? hex : "transparent" }}
                  >
                    {p.code}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Court Zone Diagram ───────────────────────────────── */}
        <CourtZone
          posCode={activePos}
          posName={pos.name}
          zoneCaption={pos.zoneCaption}
          accentHex={activeHex}
        />

        {/* ── Position Details ──────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`details-${activePos}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="p-4 space-y-3 pb-8"
          >
            {/* Role */}
            <section className="bg-card rounded-2xl border border-border p-4">
              <h3 className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-2">
                Role
              </h3>
              <p className="text-base text-foreground leading-relaxed">
                {pos.role}
              </p>
            </section>

            {/* Note */}
            <section className="bg-card rounded-2xl border border-border p-4">
              <h3 className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-2">
                Note
              </h3>
              <p className="text-base text-foreground leading-relaxed">
                {pos.note}
              </p>
            </section>

            {/* Matchup */}
            <section
              className="rounded-2xl border p-4"
              style={{
                borderColor: `${activeHex}50`,
                borderLeftColor: activeHex,
                borderLeftWidth: "4px",
                backgroundColor: `${activeHex}12`,
              }}
            >
              <h3
                className="text-xs uppercase tracking-widest font-black mb-2"
                style={{ color: activeHex }}
              >
                {pos.code === pos.matchup
                  ? "The Centre Battle"
                  : `Matchup · ${pos.code} vs ${pos.matchup}`}
              </h3>
              <p className="text-base text-foreground leading-relaxed">
                {pos.matchupDescription}
              </p>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
