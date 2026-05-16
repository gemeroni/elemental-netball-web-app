import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
import { courtLinesRaw } from "@/assets/zoneSvgs";
import { POSITIONS } from "@/data/positions";
import type { Team } from "@/data/positions";
import { BibSvg } from "./BibSvg";
import netballOutlineRaw from "@/assets/svg/Netball_Outline.svg?raw";
import thermRangeRaw from "@/assets/svg/EN_Thermometer_Range.svg?raw";

// ── SVG pre-processing helpers ────────────────────────────────────────────────
function stripSvgMeta(raw: string) {
  return raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .trim();
}

function inlineSvg(raw: string) {
  return stripSvgMeta(raw)
    // Remove <style> block — class rules bleed globally when inlined.
    // Every path already carries its visual properties as inline attributes.
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // Set default SVG fill to white so outline paths (no explicit fill) show
    // on a dark background; gradient/colour fills are specified inline so unaffected.
    .replace(/<svg /, '<svg fill="white" ')
    // Remove remaining class attributes.
    .replace(/\s+class="[^"]*"/g, "");
}

// ── Pre-process SVGs once at module load ─────────────────────────────────────
const COURT_SVG = stripSvgMeta(courtLinesRaw);

const OUTLINE_SVG = stripSvgMeta(netballOutlineRaw)
  .replace(/<style[\s\S]*?<\/style>/gi, "");

// Thermometer range: keep gradient + isolation, remove blend-mode multiply
// (multiply is a print trick for white bg; our bg is dark so we skip it).
const THERM_RANGE_SVG = inlineSvg(thermRangeRaw);

// Geometry of EN_Thermometer_Range.svg fill area (in % of total SVG height).
// Derived from linearGradient y1=621.1 (bottom) y2=87.8 (top) in viewBox 685.26px.
const THERM_TOP_PCT   = (87.8  / 685.26) * 100; // ≈ 12.8 %
const THERM_RANGE_PCT = ((621.1 - 87.8) / 685.26) * 100; // ≈ 77.8 %

// ── Token dimensions (px) ────────────────────────────────────────────────────
// Bibs have a portrait ratio — match the natural bib shape.
const BIB_W = 28;
const BIB_H = 34;
const BALL_SIZE = 26;

// Shooting circle radius as a fraction of court height.
// Derived from zone SVG geometry: ~109.5px radius on a 701.76px court.
const CIRCLE_R_NORM = 0.156;

// Positions barred from both shooting circles.
const CIRCLE_EXCLUDED = new Set(["WA", "WD", "C"]);

// ── Zone rects in normalised [0,1] court space (y=0 = top) ─────────────────
// Fire attacks toward the TOP of the court (y → 0).
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

// Ice attacks toward the BOTTOM — mirror Fire zones vertically.
const ICE_ZONES: Record<string, ZoneRect> = Object.fromEntries(
  Object.entries(FIRE_ZONES).map(([code, z]) => [
    code,
    { x: z.x, y: [1 - z.y[1], 1 - z.y[0]] as [number, number] },
  ])
);

// ── Starting positions [normX, normY] ────────────────────────────────────────
const FIRE_INIT: Record<string, [number, number]> = {
  GS: [0.30, 0.12],
  GA: [0.54, 0.22],
  WA: [0.20, 0.46],
  C:  [0.38, 0.50],
  WD: [0.22, 0.62],
  GD: [0.48, 0.75],
  GK: [0.28, 0.86],
};

const ICE_INIT: Record<string, [number, number]> = {
  GS: [0.72, 0.88],
  GA: [0.46, 0.78],
  WA: [0.80, 0.54],
  C:  [0.62, 0.50],
  WD: [0.78, 0.38],
  GD: [0.52, 0.25],
  GK: [0.72, 0.14],
};

// ── Player token (bib SVG) ────────────────────────────────────────────────────
interface TokenProps {
  code: string;
  team: Team;
  hex: string;
  initNorm: [number, number];
  zone: ZoneRect;
  courtW: number;
  courtH: number;
  resetKey: number;
}

const PlayerToken: React.FC<TokenProps> = ({
  code, team, hex, initNorm, zone, courtW, courtH, resetKey,
}) => {
  const x = useMotionValue(initNorm[0] * courtW);
  const y = useMotionValue(initNorm[1] * courtH);

  useEffect(() => {
    x.set(initNorm[0] * courtW);
    y.set(initNorm[1] * courtH);
  }, [resetKey, courtW, courtH]); // eslint-disable-line react-hooks/exhaustive-deps

  const clamp = useCallback(() => {
    const rx = BIB_W / 2;
    const ry = BIB_H / 2;
    let px = x.get();
    let py = y.get();

    // ── 1. Rectangular zone clamping FIRST ──────────────────────────────
    // Do this before the circle check so the rect boundary can never
    // push a token back inside a shooting circle afterwards.
    px = Math.max(zone.x[0] * courtW + rx, Math.min(zone.x[1] * courtW - rx, px));
    py = Math.max(zone.y[0] * courtH + ry, Math.min(zone.y[1] * courtH - ry, py));

    // ── 2. Shooting circle exclusion (WA, WD, C only) ───────────────────
    // Expand the effective radius by ry so the token's visual top/bottom edge
    // stays clearly outside the circle line even after the rect clamp above.
    if (CIRCLE_EXCLUDED.has(code)) {
      const circleR = CIRCLE_R_NORM * courtH + ry;
      for (const [cx, cy] of [
        [0.5 * courtW, 0],       // top goal line
        [0.5 * courtW, courtH],  // bottom goal line
      ] as [number, number][]) {
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < circleR) {
          if (dist > 0.001) {
            const scale = circleR / dist;
            px = cx + dx * scale;
            py = cy + dy * scale;
          } else {
            // Exactly at the centre — nudge inward toward mid-court.
            py = cy < courtH / 2 ? cy + circleR : cy - circleR;
          }
        }
      }
      // Final safety re-clamp: circle push can slightly exceed the x bounds
      // when the token is near the court edge.
      px = Math.max(zone.x[0] * courtW + rx, Math.min(zone.x[1] * courtW - rx, px));
      py = Math.max(zone.y[0] * courtH + ry, Math.min(zone.y[1] * courtH - ry, py));
    }

    x.set(px);
    y.set(py);
  }, [code, zone, courtW, courtH]); // eslint-disable-line react-hooks/exhaustive-deps

  if (courtW === 0) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDrag={clamp}
      whileDrag={{ scale: 1.2, zIndex: 50 }}
      style={{
        x,
        y,
        position: "absolute",
        top: -(BIB_H / 2),
        left: -(BIB_W / 2),
        width: BIB_W,
        height: BIB_H,
        touchAction: "none",
        zIndex: 10,
        filter: `drop-shadow(0 2px 5px ${hex}99)`,
        cursor: "grab",
      }}
    >
      <BibSvg code={code} team={team} />
    </motion.div>
  );
};

// ── Heatmap colour interpolation ─────────────────────────────────────────────
// Stops mirror Zone_Heatmap.svg linearGradient (offset=0 → court bottom,
// offset=1 → court top).  normY runs 0 (top) → 1 (bottom), so we invert.
const HEAT_STOPS: { t: number; r: number; g: number; b: number }[] = [
  { t: 0.05, r: 102, g:  51, b: 153 }, // #663399 purple  — bottom
  { t: 0.20, r:   0, g:  82, b: 179 }, // #0052b3 blue
  { t: 0.35, r:   0, g: 153, b: 153 }, // #009999 teal
  { t: 0.50, r:   0, g: 153, b:  51 }, // #009933 green
  { t: 0.65, r: 255, g: 170, b:   0 }, // #ffaa00 amber
  { t: 0.80, r: 239, g: 109, b:  34 }, // #ef6d22 orange
  { t: 0.95, r: 204, g:  51, b:  51 }, // #cc3333 red    — top
];

function heatColor(normY: number): string {
  // normY 0=top(red) → 1=bottom(purple); gradient offset = 1 − normY
  const t = Math.max(HEAT_STOPS[0].t, Math.min(HEAT_STOPS[HEAT_STOPS.length - 1].t, 1 - normY));
  let lo = HEAT_STOPS[0];
  let hi = HEAT_STOPS[HEAT_STOPS.length - 1];
  for (let i = 0; i < HEAT_STOPS.length - 1; i++) {
    if (t >= HEAT_STOPS[i].t && t <= HEAT_STOPS[i + 1].t) {
      lo = HEAT_STOPS[i]; hi = HEAT_STOPS[i + 1]; break;
    }
  }
  const f = (t - lo.t) / (hi.t - lo.t);
  return `rgb(${Math.round(lo.r + (hi.r - lo.r) * f)},${Math.round(lo.g + (hi.g - lo.g) * f)},${Math.round(lo.b + (hi.b - lo.b) * f)})`;
}

// ── Ball token — spectral heatmap colour + Netball_Outline seam overlay ──────
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
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.25, zIndex: 60 }}
      style={{
        x,
        y,
        position: "absolute",
        top: -(BALL_SIZE / 2),
        left: -(BALL_SIZE / 2),
        width: BALL_SIZE,
        height: BALL_SIZE,
        touchAction: "none",
        zIndex: 20,
        cursor: "grab",
        filter: `drop-shadow(0 2px 8px ${color}cc)`,
      }}
    >
      {/* Layer 1 — spectral fill circle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          transition: "background 80ms linear",
        }}
      />
      {/* Layer 2 — Netball_Outline seam lines (fill:none, dark strokes) */}
      <div
        style={{ position: "absolute", inset: 0 }}
        className="[&>svg]:w-full [&>svg]:h-full [&>svg]:block [&>svg]:overflow-visible"
        dangerouslySetInnerHTML={{ __html: OUTLINE_SVG }}
      />
    </motion.div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export const InteractiveCourt: React.FC = () => {
  const courtRef = useRef<HTMLDivElement>(null);
  const [courtSize, setCourtSize] = useState({ w: 0, h: 0 });
  const [resetKey, setResetKey] = useState(0);
  const [ballNormY, setBallNormY] = useState(0.5);

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

  return (
    <div className="flex flex-col h-full select-none">
      {/* ── Direction legend ── */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#E53935" }} />
          <span className="text-[11px] font-bold text-white/60">
            Fire <span className="text-white/90">↑</span>
          </span>
        </div>

        <button
          onClick={() => setResetKey((k) => k + 1)}
          className="text-[11px] font-black uppercase tracking-wider bg-white/10 hover:bg-white/20 active:bg-white/30 px-4 py-1.5 rounded-full transition-colors"
        >
          Reset
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-white/60">
            <span className="text-white/90">↓</span> Ice
          </span>
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#1E88E5" }} />
        </div>
      </div>

      {/* ── Court + Thermometer ── */}
      <div className="flex-1 flex items-center justify-center px-3">
        <div className="flex items-stretch gap-2.5">

        {/* Court */}
        <div
          ref={courtRef}
          className="relative overflow-hidden"
          style={{
            aspectRatio: "356 / 709",
            width: "min(250px, calc(100vw - 76px))",
            maxHeight: "calc(100dvh - 220px)",
            background: "#0b0b10",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 12px 48px rgba(0,0,0,0.8)",
          }}
        >
          {/* Fire goal zone tint (top third) */}
          <div
            className="absolute left-0 right-0 top-0 pointer-events-none"
            style={{
              height: "33.5%",
              background: "linear-gradient(to bottom, rgba(229,57,53,0.10) 0%, transparent 100%)",
            }}
          />
          {/* Ice goal zone tint (bottom third) */}
          <div
            className="absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{
              height: "33.5%",
              background: "linear-gradient(to top, rgba(30,136,229,0.10) 0%, transparent 100%)",
            }}
          />

          {/* White court lines */}
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
            />
          ))}

          {/* Ball */}
          <BallToken
            courtW={courtSize.w}
            courtH={courtSize.h}
            resetKey={resetKey}
            onNormYChange={handleBallNormY}
          />

        </div>{/* /court */}

        {/* ── Elemental Thermometer Range ── */}
        <div className="relative self-stretch flex-shrink-0" style={{ width: 30 }}>
          {/* Gradient thermometer SVG — fills full height of the column */}
          <div
            className="absolute inset-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
            dangerouslySetInnerHTML={{ __html: THERM_RANGE_SVG }}
          />

          {/* Labels */}
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none"
            style={{ top: `${THERM_TOP_PCT - 8}%` }}>
            <span className="text-[7px] font-black text-white/40 leading-none">🔥</span>
          </div>
          <div className="absolute inset-x-0 flex justify-center pointer-events-none"
            style={{ top: `${THERM_TOP_PCT + THERM_RANGE_PCT + 2}%` }}>
            <span className="text-[7px] font-black text-white/40 leading-none">❄</span>
          </div>

          {/* Live ball-position indicator */}
          <div
            className="absolute left-1/2 w-3 h-3 rounded-full border border-white/50 pointer-events-none"
            style={{
              top: `${THERM_TOP_PCT + ballNormY * THERM_RANGE_PCT}%`,
              transform: "translate(-50%, -50%)",
              background: heatColor(ballNormY),
              boxShadow: `0 0 10px 4px ${heatColor(ballNormY)}99, 0 0 0 1px ${heatColor(ballNormY)}`,
              transition: "top 80ms linear, background 80ms linear, box-shadow 80ms linear",
            }}
          />
        </div>

        </div>{/* /flex row */}
      </div>{/* /flex-1 */}

      {/* ── Hint ── */}
      <p className="text-center text-[11px] font-semibold text-white/30 pb-4 pt-2 px-4">
        Drag players · they stay in their zone · drag the ball anywhere
      </p>
    </div>
  );
};
