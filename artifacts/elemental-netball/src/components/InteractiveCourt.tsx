import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { courtLinesRaw } from "@/assets/zoneSvgs";
import { POSITIONS } from "@/data/positions";
import type { Team } from "@/data/positions";
import { BibSvg } from "./BibSvg";
import netballOutlineRaw from "@/assets/svg/Netball_Outline.svg?raw";
import thermRangeRaw from "@/assets/svg/EN_Thermometer_Range.svg?raw";

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

const COURT_SVG      = stripSvgMeta(courtLinesRaw);
const OUTLINE_SVG    = stripSvgMeta(netballOutlineRaw).replace(/<style[\s\S]*?<\/style>/gi, "");
const THERM_RANGE_SVG = inlineSvg(thermRangeRaw);

// Thermometer fill area bounds (% of total SVG height).
// Derived from linearGradient y1=621.1 (bottom/cold) y2=87.8 (top/hot).
const THERM_TOP_PCT   = (87.8  / 685.26) * 100; // ≈ 12.8 %
const THERM_RANGE_PCT = ((621.1 - 87.8) / 685.26) * 100; // ≈ 77.8 %

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
// Fire C has the ball at the centre circle.
// Ice C waits just outside the circle (can't be in it during opponent's pass).
const FIRE_INIT: Record<string, [number, number]> = {
  GS: [0.35, 0.17],
  GA: [0.65, 0.30],
  WA: [0.25, 0.42],
  C:  [0.50, 0.50],
  WD: [0.72, 0.60],
  GD: [0.40, 0.73],
  GK: [0.28, 0.85],
};

const ICE_INIT: Record<string, [number, number]> = {
  GS: [0.65, 0.83],
  GA: [0.42, 0.70],
  WA: [0.75, 0.58],
  C:  [0.60, 0.52],
  WD: [0.32, 0.40],
  GD: [0.58, 0.27],
  GK: [0.72, 0.15],
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

function zoneLabel(normY: number) {
  if (normY < 0.33) return "FIRE ATTACK";
  if (normY > 0.67) return "ICE ATTACK";
  return "CENTRE";
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
      {/* selection ring */}
      {isSelected && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: 8,
            border: "2px solid rgba(255,255,255,0.9)",
            boxShadow: `0 0 12px 3px rgba(255,255,255,0.25), 0 0 0 1px ${hex}`,
            pointerEvents: "none",
          }}
        />
      )}
      <BibSvg code={code} team={team} />
    </motion.div>
  );
};

// ── BallToken ─────────────────────────────────────────────────────────────────
const BallToken: React.FC<{
  courtW: number;
  courtH: number;
  resetKey: number;
  onNormYChange: (normY: number) => void;
}> = ({ courtW, courtH, resetKey, onNormYChange }) => {
  const x = useMotionValue(0.5 * courtW);
  const y = useMotionValue(0.5 * courtH);
  const [color, setColor] = useState(() => heatColor(0.5));

  useEffect(() => {
    x.set(0.5 * courtW);
    y.set(0.5 * courtH);
    setColor(heatColor(0.5));
    onNormYChange(0.5);
  }, [resetKey, courtW, courtH]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return y.on("change", (v) => {
      const normY = courtH > 0 ? v / courtH : 0.5;
      setColor(heatColor(normY));
      onNormYChange(normY);
    });
  }, [y, courtH, onNormYChange]);

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
  const [ballNormY, setBallNormY] = useState(0.5);
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

  const handleBallNormY = useCallback((v: number) => setBallNormY(v), []);

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

  const ballColor    = heatColor(ballNormY);
  const currentZone  = zoneLabel(ballNormY);

  // Thermometer indicator top%
  const indicatorPct = THERM_TOP_PCT + ballNormY * THERM_RANGE_PCT;

  return (
    <div className="flex flex-col h-full select-none">

      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className="text-sm leading-none">🔥</span>
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-wider text-[#E53935] leading-none">Fire</p>
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
            <p className="text-[11px] font-black uppercase tracking-wider text-[#1E88E5] leading-none">Ice</p>
            <p className="text-[9px] text-white/35 leading-none mt-0.5">attacks ↓</p>
          </div>
          <span className="text-sm leading-none">❄️</span>
        </div>
      </div>

      {/* ── Court + Thermometer ── */}
      <div className="flex-1 flex items-center justify-center px-2 overflow-hidden py-1">
        <div className="flex items-stretch gap-2 max-h-full" style={{ height: "100%" }}>

          {/* ── Court ── */}
          <div
            ref={courtRef}
            className="relative overflow-hidden flex-shrink-0"
            style={{
              aspectRatio: "356 / 709",
              height: "100%",
              maxWidth: "calc(100vw - 56px)",
              background: "#0b0b10",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 12px 48px rgba(0,0,0,0.8)",
              borderRadius: 4,
            }}
            onClick={handleCourtClick}
          >
            {/* Fire goal tint */}
            <div
              className="absolute left-0 right-0 top-0 pointer-events-none"
              style={{
                height: "33.5%",
                background: "linear-gradient(to bottom, rgba(229,57,53,0.10) 0%, transparent 100%)",
              }}
            />
            {/* Ice goal tint */}
            <div
              className="absolute left-0 right-0 bottom-0 pointer-events-none"
              style={{
                height: "33.5%",
                background: "linear-gradient(to top, rgba(30,136,229,0.10) 0%, transparent 100%)",
              }}
            />

            {/* Court lines */}
            <div
              className="absolute inset-0 pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
              style={{ opacity: 0.55 }}
              dangerouslySetInnerHTML={{ __html: COURT_SVG }}
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
              onNormYChange={handleBallNormY}
            />
          </div>

          {/* ── Thermometer column ── */}
          <div
            className="flex-shrink-0 flex flex-col items-center gap-1"
            style={{ width: 38 }}
          >
            {/* HOT label + fire emoji */}
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <span className="text-xs leading-none">🔥</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 leading-none">Hot</span>
            </div>

            {/* Thermometer SVG + indicator */}
            <div className="relative flex-1 w-full">
              {/* Gradient fill SVG */}
              <div
                className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                dangerouslySetInnerHTML={{ __html: THERM_RANGE_SVG }}
              />

              {/* Live ball-position indicator */}
              <div
                className="absolute left-1/2 pointer-events-none"
                style={{
                  width: 18,
                  height: 18,
                  top: `${indicatorPct}%`,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background: ballColor,
                  border: "2px solid rgba(255,255,255,0.9)",
                  boxShadow: `0 0 0 2px ${ballColor}50, 0 0 18px 6px ${ballColor}88`,
                  transition: "top 80ms linear, background 80ms linear, box-shadow 80ms linear",
                }}
              />
            </div>

            {/* COLD label + snowflake */}
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 leading-none">Cold</span>
              <span className="text-xs leading-none">❄️</span>
            </div>

            {/* Zone label — shows what zone the ball is in */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentZone}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: 38 }}
              >
                <span
                  className="text-[7px] font-black uppercase tracking-wider text-center leading-tight whitespace-nowrap"
                  style={{
                    color: ballColor,
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {currentZone}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

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
