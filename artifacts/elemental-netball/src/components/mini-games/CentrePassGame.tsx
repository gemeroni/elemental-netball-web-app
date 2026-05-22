import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BibSvg } from "@/components/BibSvg";
import {
  CENTRE_PASS_STEPS,
  getStepHex,
  getStepPrompt,
  getStepValidY,
  getStepHighlightY,
  getStepSnap,
  type GameTeam,
} from "@/data/centre-pass";

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "intro" | "placing" | "complete";

interface PlacedBib {
  code: string;
  normX: number;
  normY: number;
  hex: string;
}

// ── Umpire whistle SVG ────────────────────────────────────────────────────────

const WhistleSvg: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = "currentColor",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 12a7 7 0 1 0 14 0A7 7 0 0 0 5 12z"
      stroke={color}
      strokeWidth="1.8"
      fill="none"
    />
    <path
      d="M12 9v3l2 2"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 5h3M19 7h2"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M17.5 6.5L19 5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ── Main component ────────────────────────────────────────────────────────────

interface CentrePassGameProps {
  onBack: () => void;
}

export const CentrePassGame: React.FC<CentrePassGameProps> = ({ onBack }) => {
  const courtRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("intro");
  const [team, setTeam] = useState<GameTeam>("Fire");
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState<PlacedBib[]>([]);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentStep = CENTRE_PASS_STEPS[step];

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerEnabled && phase === "placing") {
      timerRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 500);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [timerEnabled, phase]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    setPhase("placing");
    setStep(0);
    setPlaced([]);
    setElapsed(0);
    startTimeRef.current = timerEnabled ? Date.now() : null;
  }, [timerEnabled]);

  const handleRetry = useCallback(() => {
    stopTimer();
    setPhase("intro");
    setStep(0);
    setPlaced([]);
    setElapsed(0);
    startTimeRef.current = null;
  }, [stopTimer]);

  // ── Tap handler ────────────────────────────────────────────────────────────

  const handleCourtTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (phase !== "placing" || !courtRef.current || !currentStep) return;

      const rect = courtRef.current.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = (e.clientY - rect.top) / rect.height;

      const [yMin, yMax] = getStepValidY(currentStep, team);

      if (normY >= yMin && normY <= yMax && normX >= 0.04 && normX <= 0.96) {
        // Valid — snap bib to the predefined suggested position
        const [snapX, snapY] = getStepSnap(currentStep, team);
        const hex = getStepHex(currentStep, team);

        const newPlaced: PlacedBib = { code: currentStep.code, normX: snapX, normY: snapY, hex };

        if (step + 1 >= CENTRE_PASS_STEPS.length) {
          stopTimer();
          setPlaced((prev) => [...prev, newPlaced]);
          setPhase("complete");
        } else {
          setPlaced((prev) => [...prev, newPlaced]);
          setStep((prev) => prev + 1);
        }
      } else {
        // Wrong zone
        if (wrongFlash) return;
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 700);
      }
    },
    [phase, currentStep, team, step, wrongFlash, stopTimer]
  );

  // ── Zone overlay helpers ───────────────────────────────────────────────────

  const highlightY = currentStep ? getStepHighlightY(currentStep, team) : null;
  const accentHex  = currentStep ? getStepHex(currentStep, team) : "#00C853";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full select-none overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0 border-b border-border">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-white transition-colors text-sm font-black uppercase tracking-wider"
        >
          ← Games
        </button>
        <div className="flex-1 text-center">
          <p className="text-[11px] font-black uppercase tracking-widest text-primary">
            Centre Pass
          </p>
        </div>
        {/* Timer toggle */}
        <button
          onClick={() => setTimerEnabled((t) => !t)}
          title={timerEnabled ? "Turn timer off" : "Turn timer on"}
          className={`text-sm transition-all px-2 py-1 rounded font-black ${
            timerEnabled
              ? "text-primary bg-primary/15"
              : "text-muted-foreground hover:text-white/60"
          }`}
        >
          ⏱
        </button>
        {timerEnabled && phase === "placing" && (
          <span className="text-xs font-mono text-white/60 min-w-[28px] text-right">
            {elapsed}s
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <>

        {/* ─── INTRO ─────────────────────────────────────────────────────────── */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col items-center justify-center p-6 gap-6 overflow-y-auto"
          >
            <div className="text-center max-w-xs">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <WhistleSvg size={32} color="#00C853" />
                </div>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                Centre Pass
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                It&apos;s the start of a new quarter. Place each player in their correct position
                before the umpire&apos;s whistle.
              </p>
              <p className="text-xs text-muted-foreground/50 mt-2">
                Tap the highlighted zone on the court for each position.
              </p>
            </div>

            {/* Team selector */}
            <div className="w-full max-w-xs">
              <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground text-center mb-2">
                Which team takes the pass?
              </p>
              <div className="flex rounded-xl overflow-hidden border border-white/15">
                <button
                  onClick={() => setTeam("Fire")}
                  className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider transition-all ${
                    team === "Fire"
                      ? "bg-[#E53935] text-white"
                      : "bg-transparent text-muted-foreground hover:text-white"
                  }`}
                >
                  🔥 Fire
                </button>
                <button
                  onClick={() => setTeam("Ice")}
                  className={`flex-1 py-2.5 text-sm font-black uppercase tracking-wider transition-all ${
                    team === "Ice"
                      ? "bg-[#1E88E5] text-white"
                      : "bg-transparent text-muted-foreground hover:text-white"
                  }`}
                >
                  Ice 🧊
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
                {team === "Fire"
                  ? "Fire attack toward the top of the court."
                  : "Ice attack toward the bottom of the court."}
              </p>
            </div>

            {timerEnabled && (
              <p className="text-xs text-primary font-black uppercase tracking-wider">
                Timer is on
              </p>
            )}

            <button
              onClick={handleStart}
              className="bg-primary hover:bg-primary/90 active:scale-95 text-white font-black uppercase tracking-wider px-10 py-3 rounded-xl text-sm transition-all"
            >
              Start
            </button>
          </motion.div>
        )}

        {/* ─── PLACING ───────────────────────────────────────────────────────── */}
        {phase === "placing" && (
          <motion.div
            key="placing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Progress dots */}
            <div className="px-4 pt-2 pb-1 flex-shrink-0">
              <div className="flex gap-1.5 items-center">
                {CENTRE_PASS_STEPS.map((s, i) => {
                  const isDone   = i < placed.length;
                  const isCurrent = i === step;
                  const hex = getStepHex(s, team);
                  return (
                    <div
                      key={s.code}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        background: isDone
                          ? hex
                          : isCurrent
                          ? `${hex}66`
                          : "rgba(255,255,255,0.10)",
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground/50 text-right mt-0.5">
                {placed.length} / {CENTRE_PASS_STEPS.length}
              </p>
            </div>

            {/* Instruction card */}
            <AnimatePresence>
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                className="px-4 py-2 flex-shrink-0 flex items-center gap-3 border-b border-border/50"
              >
                <div className="w-9 h-11 flex-shrink-0">
                  <BibSvg code={currentStep.code} team={team} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[11px] font-black uppercase tracking-widest leading-none"
                    style={{ color: accentHex }}
                  >
                    {currentStep.code} · {currentStep.name}
                  </p>
                  <p className="text-xs text-white/70 leading-snug mt-1">
                    {getStepPrompt(currentStep, team)}
                  </p>
                  <p className="text-[10px] text-white/35 uppercase tracking-wider mt-1">
                    Tap the highlighted zone ↓
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Court */}
            <div className="flex-1 flex items-center justify-center px-1 py-1 overflow-hidden">
              <div
                ref={courtRef}
                onClick={handleCourtTap}
                className="relative flex-shrink-0 overflow-hidden cursor-pointer"
                style={{
                  aspectRatio: "1356 / 2600",
                  width: "min(400px, calc(100vw - 8px))",
                  maxHeight: "calc(100dvh - 248px)",
                  background: "#0b0b10",
                  borderRadius: 4,
                  boxShadow: wrongFlash
                    ? "0 0 0 2px #F42040aa, 0 0 24px #F4204055"
                    : "0 0 0 1px rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.7)",
                  transition: "box-shadow 0.15s ease",
                }}
              >
                {/* Court backgrounds */}
                <img
                  src="/assets/svg/Spectrum_Court.svg"
                  aria-hidden
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  style={{ opacity: 0.28, objectFit: "fill" }}
                />
                <img
                  src="/assets/svg/White_Court.svg"
                  aria-hidden
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  style={{ opacity: 0.32, objectFit: "fill" }}
                />

                {/* Zone overlays — darken non-target areas, highlight target */}
                {highlightY && (
                  <>
                    {highlightY[0] > 0.01 && (
                      <div
                        aria-hidden
                        className="absolute left-0 right-0 pointer-events-none"
                        style={{
                          top: 0,
                          height: `${highlightY[0] * 100}%`,
                          background: "rgba(0,0,0,0.60)",
                        }}
                      />
                    )}
                    {highlightY[1] < 0.99 && (
                      <div
                        aria-hidden
                        className="absolute left-0 right-0 pointer-events-none"
                        style={{
                          top: `${highlightY[1] * 100}%`,
                          bottom: 0,
                          background: "rgba(0,0,0,0.60)",
                        }}
                      />
                    )}
                    {/* Coloured highlight band */}
                    <div
                      aria-hidden
                      className="absolute left-0 right-0 pointer-events-none"
                      style={{
                        top: `${highlightY[0] * 100}%`,
                        height: `${(highlightY[1] - highlightY[0]) * 100}%`,
                        background: `${accentHex}1a`,
                        borderTop: `1.5px solid ${accentHex}55`,
                        borderBottom: `1.5px solid ${accentHex}55`,
                      }}
                    />
                    {/* "Tap here" label centred in zone */}
                    <div
                      aria-hidden
                      className="absolute left-0 right-0 flex items-center justify-center pointer-events-none"
                      style={{
                        top: `${highlightY[0] * 100}%`,
                        height: `${(highlightY[1] - highlightY[0]) * 100}%`,
                      }}
                    >
                      <p
                        className="text-[10px] font-black uppercase tracking-widest opacity-60"
                        style={{ color: accentHex }}
                      >
                        tap here
                      </p>
                    </div>
                  </>
                )}

                {/* Wrong-zone flash */}
                <AnimatePresence>
                  {wrongFlash && (
                    <motion.div
                      key="wrong"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "rgba(204,51,51,0.12)" }}
                    />
                  )}
                </AnimatePresence>

                {/* "Not here" toast inside court */}
                <AnimatePresence>
                  {wrongFlash && (
                    <motion.div
                      key="wrong-toast"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-x-0 bottom-3 flex justify-center pointer-events-none"
                    >
                      <div className="bg-black/75 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                        <p className="text-[11px] font-bold text-white/80">
                          Not here — try the highlighted zone
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Already-placed bibs */}
                {placed.map((p) => (
                  <motion.div
                    key={p.code}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${p.normX * 100}%`,
                      top: `${p.normY * 100}%`,
                      width: 30,
                      height: 38,
                      transform: "translate(-50%, -50%)",
                      filter: `drop-shadow(0 0 5px ${p.hex}99)`,
                    }}
                  >
                    <BibSvg code={p.code} team={team} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── COMPLETE ──────────────────────────────────────────────────────── */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col items-center justify-start pt-6 pb-8 px-6 gap-5 overflow-y-auto"
          >
            {/* Result header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
                  className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center"
                >
                  <WhistleSvg size={30} color="#00C853" />
                </motion.div>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Play On!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                All {CENTRE_PASS_STEPS.length} players correctly placed.
              </p>
              {timerEnabled && elapsed > 0 && (
                <p className="text-primary font-black text-xl mt-2">
                  {formatTime(elapsed)}
                </p>
              )}
            </motion.div>

            {/* Mini court showing final formation */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden flex-shrink-0 rounded"
              style={{
                aspectRatio: "1356 / 2600",
                width: "min(220px, calc(100vw - 80px))",
                background: "#0b0b10",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.6)",
              }}
            >
              <img
                src="/assets/svg/Spectrum_Court.svg"
                aria-hidden
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ opacity: 0.45, objectFit: "fill" }}
              />
              <img
                src="/assets/svg/White_Court.svg"
                aria-hidden
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ opacity: 0.38, objectFit: "fill" }}
              />
              {placed.map((p, i) => (
                <motion.div
                  key={p.code}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.05, type: "spring", stiffness: 400, damping: 22 }}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${p.normX * 100}%`,
                    top: `${p.normY * 100}%`,
                    width: 24,
                    height: 30,
                    transform: "translate(-50%, -50%)",
                    filter: `drop-shadow(0 0 4px ${p.hex}88)`,
                  }}
                >
                  <BibSvg code={p.code} team={team} />
                </motion.div>
              ))}
            </motion.div>

            {/* Position recap list */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="w-full max-w-xs space-y-1"
            >
              {placed.map((p) => {
                const stepData = CENTRE_PASS_STEPS.find((s) => s.code === p.code)!;
                return (
                  <div key={p.code} className="flex items-center gap-2">
                    <div className="w-6 h-7 flex-shrink-0">
                      <BibSvg code={p.code} team={team} />
                    </div>
                    <p className="text-xs text-white/60 leading-snug">
                      <span className="font-black" style={{ color: p.hex }}>
                        {p.code}
                      </span>{" "}
                      {getStepPrompt(stepData, team).replace(/^[A-Z]{1,2} /, "")}
                    </p>
                  </div>
                );
              })}
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="border border-border hover:border-white/30 text-white font-black uppercase tracking-wider px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-wider px-6 py-2.5 rounded-xl text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}

      </>
    </div>
  );
};
