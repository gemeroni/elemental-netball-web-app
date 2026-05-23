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
  const [activePos, setActivePos] = useState<string | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team>("Fire");

  const isFire = activeTeam === "Fire";
  const pos      = activePos ? (getPositionByCode(activePos) ?? null) : null;
  const activeHex = pos ? (isFire ? pos.fireHex : pos.iceHex) : "#666666";

  return (
    <div
      className="h-[100dvh] w-full sm:w-1/2 sm:mx-auto bg-background text-foreground font-sans flex flex-col overflow-hidden"
      data-testid="app-container"
      role="application"
      aria-label="Elemental Netball interactive game guide"
    >
      {/* ── Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#111] border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex-shrink-0">
            <h1 className="text-[clamp(12px,4.5vw,17px)] font-black uppercase tracking-tight text-white leading-none text-center whitespace-nowrap">
              Elemental <span className="text-primary">Netball</span>
            </h1>
            <p className="text-muted-foreground uppercase tracking-widest mt-0.5 font-semibold text-[10px] text-center">Interactive Game Basics</p>
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
                  onClick={() => { setActiveTeam("Fire"); if (!isFire && pos) setActivePos(pos.matchup); }}
                  className={`flex-1 py-1.5 text-sm font-black uppercase tracking-wider transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
                    isFire
                      ? "bg-primary text-white"
                      : "bg-transparent text-muted-foreground hover:text-white"
                  }`}
                  data-testid="toggle-fire"
                  aria-pressed={isFire}
                  aria-label="Switch to Fire team"
                >
                  🔥 Fire
                </button>
                <button
                  onClick={() => { setActiveTeam("Ice"); if (isFire && pos) setActivePos(pos.matchup); }}
                  className={`flex-1 py-1.5 text-sm font-black uppercase tracking-wider transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
                    !isFire
                      ? "bg-primary text-white"
                      : "bg-transparent text-muted-foreground hover:text-white"
                  }`}
                  data-testid="toggle-ice"
                  aria-pressed={!isFire}
                  aria-label="Switch to Ice team"
                >
                  Ice 🧊
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex border-t border-border" role="tablist">
          {(["positions", "court", "games"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-all relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                tab === t
                  ? "text-white"
                  : "text-muted-foreground hover:text-white/70"
              }`}
              role="tab"
              aria-selected={tab === t}
              id={`tab-${t}`}
              aria-controls={`panel-${t}`}
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
            role="tabpanel"
            id="panel-positions"
            aria-labelledby="tab-positions"
            tabIndex={0}
          >
            {/* ── Matchup Band ── */}
            <div className="bg-card border-b border-border px-4 py-2 relative overflow-hidden">
              {/* Team atmosphere gradient - fire rises from below, ice descends from above */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500"
                style={{
                  background: !pos ? "none" : isFire
                    ? `linear-gradient(to top, ${activeHex}35 0%, ${activeHex}12 55%, transparent 85%)`
                    : `linear-gradient(to bottom, ${activeHex}30 0%, ${activeHex}10 55%, transparent 85%)`,
                }}
              />
              {/* Glowing accent line - fire at bottom, ice at top */}
              {pos && (
                <div
                  className="absolute left-0 right-0 h-[2px] pointer-events-none transition-all duration-300"
                  style={{
                    ...(isFire ? { bottom: 0 } : { top: 0 }),
                    background: `linear-gradient(to right, transparent 0%, ${activeHex}cc 30%, ${activeHex}cc 70%, transparent 100%)`,
                    boxShadow: `0 0 8px 1px ${activeHex}60`,
                  }}
                />
              )}
              {/* No-selection prompt - CSS fade, always in DOM */}
              <div
                className="flex items-center justify-center py-3 transition-opacity duration-150"
                style={{ opacity: pos ? 0 : 1, pointerEvents: pos ? "none" : "auto", display: pos ? "none" : "flex" }}
                aria-hidden={!!pos}
              >
                <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">
                  Pick your player
                </p>
              </div>

              {pos && (
                  /* ── Selection active: single position featured ── */
                  <div className="relative flex items-center gap-3 py-1">
                    {/* Featured bib - glowing */}
                    <div className="flex-shrink-0 w-[15%] flex flex-col items-center gap-0.5">
                      <div
                        className="w-full aspect-[9/11]"
                        style={{ filter: `drop-shadow(0 0 10px ${activeHex}cc) drop-shadow(0 0 24px ${activeHex}44)` }}
                      >
                        <BibSvg code={activePos!} team={activeTeam} />
                      </div>
                      <span className="text-[9px] uppercase tracking-widest font-black" style={{ color: activeHex }}>
                        {activeTeam}
                      </span>
                    </div>

                    {/* Position info - full focus */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[17px] font-black uppercase tracking-tight text-white leading-tight">
                        {pos.name}
                      </p>
                      <p className="text-[12px] italic text-muted-foreground mt-1">{pos.tagline}</p>
                      {/* Subtle matchup hint */}
                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 mt-2">
                        vs {pos.matchup}
                      </p>
                    </div>
                  </div>
                )}
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
                      onClick={() => { if (isActive) setActivePos(null); else { setActivePos(p.code); setActiveTeam("Fire"); } }}
                      whileTap={{ scale: 0.88 }}
                      className="flex-1 flex flex-col items-center focus:outline-none"
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
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Court zone - only shown when a position is selected */}
              <div style={{ order: 2 }}>
                {pos ? (
                  <CourtZone
                    posCode={activePos!}
                    posName={pos.name}
                    zoneCaption={pos.zoneCaption}
                    accentHex={activeHex}
                    team={activeTeam}
                  />
                ) : (
                  <div className="flex items-center justify-center py-6">
                    <p className="text-white/15 text-[11px] font-semibold uppercase tracking-widest">
                      Zone map appears here
                    </p>
                  </div>
                )}
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
                      onClick={() => { if (isActive) setActivePos(null); else { setActivePos(p.code); setActiveTeam("Ice"); } }}
                      whileTap={{ scale: 0.88 }}
                      className="flex-1 flex flex-col items-center focus:outline-none"
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
                    </motion.button>
                  );
                })}
              </motion.div>

            </div>

            {/* ── Position Details ── */}
            <div aria-live="polite">
              <AnimatePresence>
                {pos && (
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
                        {pos.code === pos.matchup ? "The Centre Battle" : `Matchup - ${pos.code} vs ${pos.matchup}`}
                      </h3>
                      <p className="text-base text-foreground leading-relaxed">{pos.matchupDescription}</p>
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : tab === "court" ? (
          <motion.div
            key="court"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col overflow-hidden"
            role="tabpanel"
            id="panel-court"
            aria-labelledby="tab-court"
            tabIndex={0}
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
            role="tabpanel"
            id="panel-games"
            aria-labelledby="tab-games"
            tabIndex={0}
          >
            <GamesTab />
          </motion.div>
        )}
      </>
    </div>
  );
};
