// SpectrumSlider: slim rainbow track with a small rolling ball indicator.
// Rotation is derived from the ball x position at every frame, giving
// physically correct rolling with no discrete keyframes.

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
  const BAR_H  = 16;           // slim pill track height
  const BALL_D = 24;           // ball diameter, slightly larger than track
  const BALL_R = BALL_D / 2;
  const TRAVEL = width - BALL_D;  // left-edge travel range (0 to TRAVEL)
  const STEP   = TRAVEL / 6;      // px between each of the 7 stops

  // x = ball left-edge position (0 to TRAVEL)
  const x = useMotionValue(0);

  // Rotation from x at every frame: angle = (x / radius) * (180 / pi)
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
    // Wrapper height matches the ball so the thumb has room to overflow the track
    <div
      style={{
        width,
        height: BALL_D,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Slim gradient track, vertically centred */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: BAR_H,
          transform: "translateY(-50%)",
          borderRadius: BAR_H / 2,
          background: GRADIENT,
          boxShadow: "inset 0 0 10px rgba(10, 10, 10, 0.7)",
        }}
      />

      {/* Rolling ball indicator */}
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
          src="/assets/Slider_Ball.png"
          alt=""
          aria-hidden
          draggable={false}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </motion.div>
    </div>
  );
};
