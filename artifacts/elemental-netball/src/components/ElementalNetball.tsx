import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BibSvg } from "./BibSvg";
import { CourtZone } from "./CourtZone";
import { InteractiveCourt } from "./InteractiveCourt";
import { GamesTab } from "./GamesTab";
import { POSITIONS, getPositionByCode } from "@/data/positions";
import type { Team } from "@/data/positions";

type Tab = "positions" | "court" | "games";

export const ElementalNetball: React.FC = () => {
  const [tab, setTab] = useState<Tab>("positions");
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
      className="h-[100dvh] w-full sm:w-1/2 sm:mx-auto bg-background text-foreground font-sans flex flex-col overflow-hidden"
      data-testid="app-container"
    >
      {/* ── Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#111] border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-black uppercase tracking-tight text-white leading-none text-center">
              Elemental <span className="text-primary">Netball</span>
            </h1>
            <p className="text-muted-foreground uppercase tracking-widest mt-0.5 font-semibold text-[12px] text-center">Interactive Game Basics</p>
          </div>

          {/* Fire / Ice toggle — only used by Positions tab */}
          <AnimatePresence>
            {(tab === "positions") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex w-36 rounded-lg overflow-hidden border border-white/15 flex-shrink-0"
              >
                <button
                  onClick={() => { setActiveTeam("Fire"); if (!isFire) setActivePos(pos.matchup); }}
                  className={`flex-1 py-1.5 text-sm font-black uppercase tracking-wider transition-all duration-200 ${
                    isFire
                      ? "bg-primary text-white"
                      : "bg-transparent text-muted-foreground hover:text-white"
                  }`}
                  data-testid="toggle-fire"
                >
                  🔥 Fire
                </button>
                <button
                  onClick={() => { setActiveTeam("Ice"); if (isFire) setActivePos(pos.matchup); }}
                  className={`flex-1 py-1.5 text-sm font-black uppercase tracking-wider transition-all duration-200 ${
                    !isFire
                      ? "bg-primary text-white"
                      : "bg-transparent text-muted-foreground hover:text-white"
                  }`}
                  data-testid="toggle-ice"
                >
                  Ice 🧊
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex border-t border-border">
          {(["positions", "court", "games"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-all relative ${
                tab === t
                  ? "text-white"
                  : "text-muted-foreground hover:text-white/70"
              }`}
            >
              {t === "positions" ? "Positions" : t === "court" ? "Court" : "Games"}
              {tab === t && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </header>
      {/* ── Content ──────────────────────────────────────── */}
      <>
        {tab === "positions" ? (
          <motion.div
            key="positions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="flex-1 overflow-y-auto"
          >
            {/* ── Matchup Band - fixed container, only inner content fades ── */}
            <div className="bg-card border-b border-border px-4 py-2 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${activeHex}, transparent 60%)` }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={`matchup-${activePos}-${activeTeam}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative flex items-center gap-2"
                >
                  {/* Left bib */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-[18%]">
                    <div className="w-full aspect-[9/11]">
                      <BibSvg code={leftCode} team={leftTeam} />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-black" style={{ color: activeHex }}>
                      {leftTeam}
                    </span>
                  </div>

                  {/* Left position info */}
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-[10px] uppercase tracking-widest font-black leading-none mb-0.5" style={{ color: activeHex }}>
                      {pos.code}
                    </p>
                    <p className="text-sm font-black uppercase tracking-tight text-white leading-tight truncate">
                      {pos.name}
                    </p>
                    <p className="text-[10px] italic text-muted-foreground truncate">{pos.tagline}</p>
                  </div>

                  {/* VS divider */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0 px-1">
                    <div className="h-px w-3 opacity-30" style={{ backgroundColor: activeHex }} />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">vs</span>
                    <div className="h-px w-3 opacity-30" style={{ backgroundColor: rightHex }} />
                  </div>

                  {/* Right position info */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[10px] uppercase tracking-widest font-black leading-none mb-0.5" style={{ color: rightHex }}>
                      {opponent.code}
                    </p>
                    <p className="text-sm font-black uppercase tracking-tight text-white leading-tight truncate">
                      {opponent.name}
                    </p>
                    <p className="text-[10px] italic text-muted-foreground truncate">{opponent.tagline}</p>
                  </div>

                  {/* Right bib */}
                  <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-[18%]">
                    <div className="w-full aspect-[9/11] opacity-80">
                      <BibSvg code={rightCode} team={rightTeam} />
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-black" style={{ color: rightHex }}>
                      {rightTeam}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Court + both team bibs ── */}
            {/* Both rows stay in the DOM always. CSS order swaps them; layout animation makes it smooth. */}
            <div className="px-3 pt-2 pb-1 flex flex-col">

              {/* Fire bib row: GK->GS (purple->red). Moves to top when Fire is active. */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                className="flex items-center pb-1"
                style={{ order: isFire ? 1 : 3 }}
              >
                {[...POSITIONS].reverse().map((p) => {
                  const isActive = p.code === activePos && isFire;
                  const hex = p.fireHex;
                  return (
                    <motion.button
                      key={`fire-${p.code}`}
                      onClick={() => { setActivePos(p.code); setActiveTeam("Fire"); }}
                      whileTap={{ scale: 0.88 }}
                      className="flex-1 flex flex-col items-center gap-0.5 focus:outline-none"
                      data-testid={`pos-fire-${p.code}`}
                    >
                      <motion.div
                        animate={{ scale: isActive ? 1.15 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-4/5 mx-auto aspect-[9/11]"
                        style={{ opacity: isActive ? 1 : 0.35, filter: isActive ? `drop-shadow(0 0 6px ${hex})` : "none" }}
                      >
                        <BibSvg code={p.code} team="Fire" />
                      </motion.div>
                      <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: isActive ? hex : "transparent" }}>
                        {p.code}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Court zone - always in the middle */}
              <div style={{ order: 2 }}>
                <CourtZone
                  posCode={activePos}
                  posName={pos.name}
                  zoneCaption={pos.zoneCaption}
                  accentHex={activeHex}
                  team={activeTeam}
                />
              </div>

              {/* Ice bib row: GS->GK (purple->red). Moves to top when Ice is active. */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                className="flex items-center pt-1"
                style={{ order: isFire ? 3 : 1 }}
              >
                {POSITIONS.map((p) => {
                  const isActive = p.code === activePos && !isFire;
                  const hex = p.iceHex;
                  return (
                    <motion.button
                      key={`ice-${p.code}`}
                      onClick={() => { setActivePos(p.code); setActiveTeam("Ice"); }}
                      whileTap={{ scale: 0.88 }}
                      className="flex-1 flex flex-col items-center gap-0.5 focus:outline-none"
                      data-testid={`pos-ice-${p.code}`}
                    >
                      <motion.div
                        animate={{ scale: isActive ? 1.15 : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-4/5 mx-auto aspect-[9/11]"
                        style={{ opacity: isActive ? 1 : 0.35, filter: isActive ? `drop-shadow(0 0 6px ${hex})` : "none" }}
                      >
                        <BibSvg code={p.code} team="Ice" />
                      </motion.div>
                      <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: isActive ? hex : "transparent" }}>
                        {p.code}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>

            </div>

            {/* ── Position Details ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`details-${activePos}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="p-4 space-y-3 pb-8"
              >
                <section className="bg-card rounded-2xl border border-border p-4">
                  <h3 className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-2">Role</h3>
                  <p className="text-base text-foreground leading-relaxed">{pos.role}</p>
                </section>

                <section className="bg-card rounded-2xl border border-border p-4">
                  <h3 className="text-xs uppercase tracking-widest font-black text-muted-foreground mb-2">Note</h3>
                  <p className="text-base text-foreground leading-relaxed">{pos.note}</p>
                </section>

                <section
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: `${activeHex}50`,
                    borderLeftColor: activeHex,
                    borderLeftWidth: "4px",
                    backgroundColor: `${activeHex}12`,
                  }}
                >
                  <h3 className="text-xs uppercase tracking-widest font-black mb-2" style={{ color: activeHex }}>
                    {pos.code === pos.matchup ? "The Centre Battle" : `Matchup · ${pos.code} vs ${pos.matchup}`}
                  </h3>
                  <p className="text-base text-foreground leading-relaxed">{pos.matchupDescription}</p>
                </section>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : tab === "court" ? (
          <motion.div
            key="court"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <InteractiveCourt />
          </motion.div>
        ) : (
          <motion.div
            key="games"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <GamesTab />
          </motion.div>
        )}
      </>
    </div>
  );
};
