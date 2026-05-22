// SpectrumSlider: rainbow gradient pill with a netball rolling inside it.
// The pill is the track. The ball is clipped by the pill's overflow:hidden,
// so it rolls flush within the coloured bar, matching the designer asset.
// Rotation is derived from the ball x position at every frame - no keyframes.

import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";

// Gradient stops match the designer SVG exactly
const GRADIENT =
  "linear-gradient(to right, " +
  "#8833ee 10%, " +
  "#2060ff 22%, " +
  "#00c8dc 35%, " +
  "#00c853 50%, " +
  "#ffd800 65%, " +
  "#ff6600 80%, " +
  "#f42040 95%" +
  ")";

// Position index (0=purple, 6=red) keyed by accentHex
const HEX_TO_INDEX: Record<string, number> = {
  "#8833ee": 0,
  "#2060ff": 1,
  "#00c8dc": 2,
  "#00c853": 3,
  "#ffd800": 4,
  "#ff6600": 5,
  "#f42040": 6,
};

interface SpectrumSliderProps {
  accentHex: string;
  /** Total render width of the slider in px. Default 280. */
  width?: number;
}

export const SpectrumSlider: React.FC<SpectrumSliderProps> = ({
  accentHex,
  width = 280,
}) => {
  // Pill height and ball diameter are equal - ball fills the pill exactly
  const PILL_H  = 28;
  const BALL_D  = PILL_H;
  const BALL_R  = BALL_D / 2;
  const TRAVEL  = width - BALL_D - 2;  // left-edge travel range (2px inset keeps ball inside pill caps)
  const STEP    = TRAVEL / 6;      // px between each of 7 stops

  // x = ball left-edge position (0 to TRAVEL)
  const x = useMotionValue(0);

  // Rotation derived from x at every frame: angle = (x / radius) * (180 / pi)
  const rotation = useTransform(
    x,
    (v) => (v / BALL_R) * (180 / Math.PI)
  );

  const prevHex = useRef(accentHex);
  useEffect(() => {
    const idx    = HEX_TO_INDEX[accentHex.toLowerCase()] ?? 3;
    const target = idx * STEP;
    animate(x, target, {
      type: "spring",
      stiffness: 320,
      damping: 28,
    });
    prevHex.current = accentHex;
  }, [accentHex, STEP, x]);

  return (
    // The pill IS the container. overflow:hidden clips the ball to the pill shape.
    <div
      style={{
        width,
        height: PILL_H,
        borderRadius: BALL_R,
        background: GRADIENT,
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 0 14px rgba(10, 10, 10, 0.65)",
        flexShrink: 0,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: BALL_D,
          height: BALL_D,
          borderRadius: BALL_R,
          x,
          rotate: rotation,
          willChange: "transform",
        }}
      >
        <img
          src="/assets/Slider_Ball_Alt.png"
          alt=""
          aria-hidden
          draggable={false}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </motion.div>
    </div>
  );
};
