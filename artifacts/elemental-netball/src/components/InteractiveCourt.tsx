import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { POSITIONS } from "@/data/positions";
import type { Team } from "@/data/positions";
import { BibSvg } from "./BibSvg";
import netballOutlineRaw from "@/assets/svg/Netball_Outline.svg?raw";

// ── SVG helpers ───────────────────────────────────────────────────────────────
function stripSvgMeta(raw: string) {
  return raw.replace(/<\?xml[^?]*\?>/g, "").replace(/<!DOCTYPE[^>]*>/gi, "").trim();
}

function inlineSvg(raw: string) {
  return stripSvgMeta(raw)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg /, '<svg fill="white" ')
    .replace(/\s+class="[^"]*"/g, "");
}

const OUTLINE_SVG = stripSvgMeta(netballOutlineRaw).replace(/<style[\s\S]*?<\/style>/gi, "");

// ── Token dimensions ──────────────────────────────────────────────────────────
const BIB_W    = 28;
const BIB_H    = 34;
const BALL_SZ  = 26;

// Shooting circle radius as fraction of court height (derived from SVG geometry).
const CIRCLE_R_NORM = 0.156;

// Positions that cannot enter either shooting circle.
const CIRCLE_EXCLUDED = new Set(["WA", "WD", "C"]);

// ── Zone rects in normalised [0,1] court space (y=0 = top = Fire attack) ─────
type ZoneRect = { x: [number, number]; y: [number, number] };

const FIRE_ZONES: Record<string, ZoneRect> = {
  GS: { x: [0, 1], y: [0.000, 0.335] },
  GA: { x: [0, 1], y: [0.000, 0.668] },
  WA: { x: [0, 1], y: [0.000, 0.668] },
  C:  { x: [0, 1], y: [0.000, 1.000] },
  WD: { x: [0, 1], y: [0.332, 1.000] },
  GD: { x: [0, 1], y: [0.332, 1.000] },
  GK: { x: [0, 1], y: [0.665, 1.000] },
};

const ICE_ZONES: Record<string, ZoneRect> = Object.fromEntries(
  Object.entries(FIRE_ZONES).map(([code, z]) => [
    code,
    { x: z.x, y: [1 - z.y[1], 1 - z.y[0]] as [number, number] },
  ])
);

// ── Centre-pass starting positions ───────────────────────────────────────────
// Fire C has the ball at the centre circle; pairs show attacker + marker side by side.
const FIRE_INIT: Record<string, [number, number]> = {
  GS: [0.38, 0.17],  // Fire goal third — left
  GA: [0.20, 0.37],  // left at upper transverse line
  WA: [0.72, 0.34],  // right at upper transverse line
  C:  [0.42, 0.50],  // center circle, taking the pass
  WD: [0.28, 0.62],  // left at lower transverse line
  GD: [0.62, 0.64],  // right at lower transverse line
  GK: [0.38, 0.83],  // Ice goal third — left
};

const ICE_INIT: Record<string, [number, number]> = {
  GS: [0.57, 0.83],  // Ice goal third — right
  GA: [0.76, 0.64],  // right at lower transverse (opposing GD)
  WA: [0.18, 0.62],  // left at lower transverse (opposing WD)
  C:  [0.60, 0.52],  // just outside center (waiting during Fire's pass)
  WD: [0.62, 0.34],  // right at upper transverse (opposing WA)
  GD: [0.30, 0.37],  // left at upper transverse (opposing GA)
  GK: [0.53, 0.17],  // Fire goal third — right (marking GS)
};

// ── Heatmap colour stops ──────────────────────────────────────────────────────
// Mirrors EN_Thermometer_Range gradient: offset=0 → bottom (cold/purple),
// offset=1 → top (hot/red).  normY 0=top → 1=bottom, so we invert (t = 1−normY).
const HEAT_STOPS: { t: number; r: number; g: number; b: number }[] = [
  { t: 0.05, r: 102, g:  51, b: 153 }, // purple — cold
  { t: 0.20, r:   0, g:  82, b: 179 }, // blue
  { t: 0.35, r:   0, g: 153, b: 153 }, // teal
  { t: 0.50, r:   0, g: 153, b:  51 }, // green
  { t: 0.65, r: 255, g: 170, b:   0 }, // amber
  { t: 0.80, r: 239, g: 109, b:  34 }, // orange
  { t: 0.95, r: 204, g:  51, b:  51 }, // red — hot
];

function heatColor(normY: number): string {
  const t = Math.max(HEAT_STOPS[0].t, Math.min(HEAT_STOPS[HEAT_STOPS.length - 1].t, 1 - normY));
  let lo = HEAT_STOPS[0], hi = HEAT_STOPS[HEAT_STOPS.length - 1];
  for (let i = 0; i < HEAT_STOPS.length - 1; i++) {
    if (t >= HEAT_STOPS[i].t && t <= HEAT_STOPS[i + 1].t) {
      lo = HEAT_STOPS[i]; hi = HEAT_STOPS[i + 1]; break;
    }
  }
  const f = (t - lo.t) / (hi.t - lo.t);
  return `rgb(${Math.round(lo.r + (hi.r - lo.r) * f)},${Math.round(lo.g + (hi.g - lo.g) * f)},${Math.round(lo.b + (hi.b - lo.b) * f)})`;
}

// ── PlayerToken ───────────────────────────────────────────────────────────────
interface TokenProps {
  code: string;
  team: Team;
  hex: string;
  initNorm: [number, number];
  zone: ZoneRect;
  courtW: number;
  courtH: number;
  resetKey: number;
  isSelected: boolean;
  onSelect: () => void;
}

const PlayerToken: React.FC<TokenProps> = ({
  code, team, hex, initNorm, zone, courtW, courtH, resetKey, isSelected, onSelect,
}) => {
  const x = useMotionValue(initNorm[0] * courtW);
  const y = useMotionValue(initNorm[1] * courtH);

  useEffect(() => {
    x.set(initNorm[0] * courtW);
    y.set(initNorm[1] * courtH);
  }, [resetKey, courtW, courtH]); // eslint-disable-line react-hooks/exhaustive-deps

  const clamp = useCallback(() => {
    const rx = BIB_W / 2, ry = BIB_H / 2;
    let px = x.get(), py = y.get();

    // 1 — rectangular zone clamp first
    px = Math.max(zone.x[0] * courtW + rx, Math.min(zone.x[1] * courtW - rx, px));
    py = Math.max(zone.y[0] * courtH + ry, Math.min(zone.y[1] * courtH - ry, py));

    // 2 — shooting circle exclusion for WA / WD / C
    if (CIRCLE_EXCLUDED.has(code)) {
      const circleR = CIRCLE_R_NORM * courtH + ry;
      for (const [cx, cy] of [[0.5 * courtW, 0], [0.5 * courtW, courtH]] as [number, number][]) {
        const dx = px - cx, dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < circleR) {
          if (dist > 0.001) { const s = circleR / dist; px = cx + dx * s; py = cy + dy * s; }
          else { py = cy < courtH / 2 ? cy + circleR : cy - circleR; }
        }
      }
      // re-clamp after circle push
      px = Math.max(zone.x[0] * courtW + rx, Math.min(zone.x[1] * courtW - rx, px));
      py = Math.max(zone.y[0] * courtH + ry, Math.min(zone.y[1] * courtH - ry, py));
    }

    x.set(px); y.set(py);
  }, [code, zone, courtW, courtH]); // eslint-disable-line react-hooks/exhaustive-deps

  if (courtW === 0) return null;

  return (
    <motion.div
      data-bib="true"
      drag
      dragMomentum={false}
      onDrag={clamp}
      onTap={() => onSelect()}
      whileDrag={{ scale: 1.2, zIndex: 50 }}
      animate={{ scale: isSelected ? 1.18 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        x,
        y,
        position: "absolute",
        top: -(BIB_H / 2),
        left: -(BIB_W / 2),
        width: BIB_W,
        height: BIB_H,
        touchAction: "none",
        zIndex: isSelected ? 30 : 10,
        cursor: "grab",
        filter: isSelected
          ? `drop-shadow(0 0 5px white) drop-shadow(0 0 10px ${hex}) drop-shadow(0 0 20px ${hex}99)`
          : `drop-shadow(0 2px 5px ${hex}99)`,
      }}
    >
      <BibSvg code={code} team={team} />
    </motion.div>
  );
};

// ── BallToken ─────────────────────────────────────────────────────────────────
const BallToken: React.FC<{
  courtW: number;
  courtH: number;
  resetKey: number;
}> = ({ courtW, courtH, resetKey }) => {
  const x = useMotionValue(0.5 * courtW);
  const y = useMotionValue(0.5 * courtH);
  const [color, setColor] = useState(() => heatColor(0.5));

  useEffect(() => {
    x.set(0.5 * courtW);
    y.set(0.5 * courtH);
    setColor(heatColor(0.5));
  }, [resetKey, courtW, courtH]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return y.on("change", (v) => {
      const normY = courtH > 0 ? v / courtH : 0.5;
      setColor(heatColor(normY));
    });
  }, [y, courtH]);

  if (courtW === 0) return null;

  return (
    <motion.div
      data-bib="true"
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.25, zIndex: 60 }}
      style={{
        x,
        y,
        position: "absolute",
        top: -(BALL_SZ / 2),
        left: -(BALL_SZ / 2),
        width: BALL_SZ,
        height: BALL_SZ,
        touchAction: "none",
        zIndex: 20,
        cursor: "grab",
        filter: `drop-shadow(0 2px 8px ${color}cc)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          transition: "background 80ms linear",
        }}
      />
      <div
        style={{ position: "absolute", inset: 0 }}
        className="[&>svg]:w-full [&>svg]:h-full [&>svg]:block [&>svg]:overflow-visible"
        dangerouslySetInnerHTML={{ __html: OUTLINE_SVG }}
      />
    </motion.div>
  );
};

// ── Selected state ────────────────────────────────────────────────────────────
interface Selected { code: string; team: Team }

// ── Main component ────────────────────────────────────────────────────────────
export const InteractiveCourt: React.FC = () => {
  const courtRef = useRef<HTMLDivElement>(null);
  const [courtSize, setCourtSize] = useState({ w: 0, h: 0 });
  const [resetKey, setResetKey] = useState(0);
  const [selected, setSelected] = useState<Selected | null>(null);

  useEffect(() => {
    const el = courtRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setCourtSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleSelect = useCallback((code: string, team: Team) => {
    setSelected(prev =>
      prev?.code === code && prev?.team === team ? null : { code, team }
    );
  }, []);

  const handleDeselect = useCallback(() => setSelected(null), []);

  const handleReset = useCallback(() => {
    setResetKey(k => k + 1);
    setSelected(null);
  }, []);

  const handleCourtClick = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest("[data-bib]")) handleDeselect();
  }, [handleDeselect]);

  const selectedPos  = selected ? POSITIONS.find(p => p.code === selected.code) : null;
  const selectedHex  = selectedPos && selected
    ? (selected.team === "Fire" ? selectedPos.fireHex : selectedPos.iceHex)
    : null;

  return (
    <div className="flex flex-col h-full select-none">
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-[20px]">🔥</span>
          <div className="text-left">
            <p className="font-black uppercase tracking-wider text-[#E53935] text-[14px]">Fire</p>
            <p className="text-[9px] text-white/35 leading-none mt-0.5">attacks ↑</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-[11px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 active:bg-white/30 px-4 py-1.5 rounded-full transition-colors"
        >
          Reset
        </button>

        <div className="flex items-center gap-1">
          <div className="text-right">
            <p className="font-black uppercase tracking-wider text-[#1E88E5] text-[14px]">Ice</p>
            <p className="text-[9px] text-white/35 leading-none mt-0.5">attacks ↓</p>
          </div>
          <span className="text-[20px]">🧊</span>
        </div>
      </div>
      {/* ── Court ── */}
      {/* Width-driven: fixed width, height via aspect-ratio, capped by maxHeight */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden py-1">
          <div
            ref={courtRef}
            className="relative overflow-hidden flex-shrink-0"
            style={{
              aspectRatio: "1356 / 2600",
              width: "min(320px, calc(100vw - 32px))",
              maxHeight: "calc(100dvh - 196px)",
              background: "#0b0b10",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 12px 48px rgba(0,0,0,0.8)",
              borderRadius: 4,
            }}
            onClick={handleCourtClick}
          >
            {/* ── Spectrum court background ── */}
            {/* Zone areas filled with elemental gradient; court line gaps show #0b0b10 */}
            <img
              src="/assets/svg/Spectrum_Court.svg"
              aria-hidden
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{ opacity: 0.55, objectFit: "fill" }}
            />

            {/* ── White court lines (aligned 1:1 with Spectrum_Court.svg) ── */}
            <img
              src="/assets/svg/White_Court.svg"
              aria-hidden
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              style={{ opacity: 0.45, objectFit: "fill" }}
            />

            {/* Fire players */}
            {POSITIONS.map((pos) => (
              <PlayerToken
                key={`fire-${pos.code}`}
                code={pos.code}
                team="Fire"
                hex={pos.fireHex}
                initNorm={FIRE_INIT[pos.code]}
                zone={FIRE_ZONES[pos.code]}
                courtW={courtSize.w}
                courtH={courtSize.h}
                resetKey={resetKey}
                isSelected={selected?.code === pos.code && selected?.team === "Fire"}
                onSelect={() => handleSelect(pos.code, "Fire")}
              />
            ))}

            {/* Ice players */}
            {POSITIONS.map((pos) => (
              <PlayerToken
                key={`ice-${pos.code}`}
                code={pos.code}
                team="Ice"
                hex={pos.iceHex}
                initNorm={ICE_INIT[pos.code]}
                zone={ICE_ZONES[pos.code]}
                courtW={courtSize.w}
                courtH={courtSize.h}
                resetKey={resetKey}
                isSelected={selected?.code === pos.code && selected?.team === "Ice"}
                onSelect={() => handleSelect(pos.code, "Ice")}
              />
            ))}

            {/* Ball */}
            <BallToken
              courtW={courtSize.w}
              courtH={courtSize.h}
              resetKey={resetKey}
            />
          </div>
      </div>
      {/* ── Info bar ── */}
      <div
        className="flex-shrink-0 px-4 py-2 min-h-[54px] flex items-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <AnimatePresence mode="wait">
          {selectedPos && selectedHex ? (
            <motion.div
              key={`sel-${selected!.code}-${selected!.team}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 w-full"
            >
              <div className="flex-shrink-0 w-7 h-9">
                <BibSvg code={selectedPos.code} team={selected!.team} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[12px] font-black leading-tight truncate"
                  style={{ color: selectedHex }}
                >
                  {selected!.team} · {selectedPos.name}
                </p>
                <p className="text-[10px] text-white/45 leading-snug mt-0.5 line-clamp-2">
                  {selectedPos.zoneCaption}
                </p>
              </div>
              <button
                onClick={handleDeselect}
                className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/50 text-[11px] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-semibold text-white/30 text-center w-full leading-snug"
            >
              Tap a player to learn their zone · drag to move
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
