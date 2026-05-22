import React, { useState } from "react";
import { motion } from "framer-motion";
import { CentrePassGame } from "@/components/mini-games/CentrePassGame";

type ActiveGame = "centre-pass" | null;

interface ComingSoonGame {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
}

const COMING_SOON: ComingSoonGame[] = [
  {
    icon: "📣",
    title: "Umpire's Call",
    desc: "A player is somewhere on the court. Legal or offside — you decide.",
    tags: ["Single position", "Quick rounds"],
  },
  {
    icon: "🔍",
    title: "Set the Whistle",
    desc: "Find the player breaking the rules before the umpire blows.",
    tags: ["Full team", "Spot the violation"],
  },
  {
    icon: "🔗",
    title: "Find Your Rival",
    desc: "Match every position to its direct opponent across the court.",
    tags: ["Matchups", "Pairs"],
  },
  {
    icon: "🗺️",
    title: "Shadow Your Position",
    desc: "Tap every zone on the court that your position is allowed to enter.",
    tags: ["Zone knowledge", "Guided"],
  },
];

export const GamesTab: React.FC = () => {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  return (
    <>
      {activeGame === "centre-pass" ? (
        <motion.div
          key="centre-pass"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <CentrePassGame onBack={() => setActiveGame(null)} />
        </motion.div>
      ) : (
        <motion.div
          key="hub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="px-4 pt-4 pb-8 space-y-3">
            <p className="text-[11px] uppercase tracking-widest font-black text-muted-foreground text-center mb-5">
              Mini-Games
            </p>

            {/* ── Centre Pass (active) ── */}
            <motion.button
              onClick={() => setActiveGame("centre-pass")}
              whileTap={{ scale: 0.97 }}
              className="w-full text-left bg-card border border-border rounded-2xl p-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0 text-2xl">
                  📋
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-base uppercase tracking-tight leading-none">
                    Centre Pass
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
                    Place your team in the correct positions before the umpire&apos;s whistle.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["All 7 positions", "Guided", "Optional timer"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <svg
                  className="text-muted-foreground flex-shrink-0 mt-1"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </motion.button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-border" />
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/50">
                Coming soon
              </p>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* ── Coming soon cards ── */}
            {COMING_SOON.map((game) => (
              <div
                key={game.title}
                className="w-full bg-card/40 border border-border/40 rounded-2xl p-4 opacity-45"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/08 flex items-center justify-center flex-shrink-0 text-2xl">
                    {game.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-base uppercase tracking-tight leading-none">
                      {game.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
                      {game.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-muted border border-white/05 px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};
