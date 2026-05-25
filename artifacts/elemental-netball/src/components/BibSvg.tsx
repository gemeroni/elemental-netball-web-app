import { getPositionByCode, Team } from "@/data/positions";
import { BIB_SVGS } from "@/assets/bibSvgs";

interface BibSvgProps {
  code: string;
  team: Team;
  monochrome?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BibSvg: React.FC<BibSvgProps> = ({
  code,
  team,
  monochrome = false,
  className = "",
  style = {},
}) => {
  const pos = getPositionByCode(code);

  // Monochrome mode: render a clean black/white bib, no colour SVG
  if (monochrome) {
    const isFire = team === "Fire";
    return (
      <div
        className={`flex items-center justify-center rounded-[20px] font-black text-2xl tracking-tighter ${className}`}
        style={{
          ...style,
          width: "100%",
          height: "100%",
          backgroundColor: isFire ? "#000000" : "#ffffff",
          color: isFire ? "#ffffff" : "#000000",
          border: isFire ? "none" : "4px solid #000000",
        }}
        aria-hidden="true"
        data-testid={`bib-mono-${code}-${team}`}
      >
        {code}
      </div>
    );
  }

  const svgContent = BIB_SVGS[`${code}_${team}`];

  if (!svgContent) {
    if (!pos) return null;
    const hex = team === "Fire" ? pos.fireHex : pos.iceHex;
    const isFire = team === "Fire";
    return (
      <div
        className={`flex items-center justify-center rounded-[20px] font-black text-2xl tracking-tighter ${className}`}
        style={{
          ...style,
          width: "100%",
          height: "100%",
          backgroundColor: isFire ? hex : "#ffffff",
          color: "#1a1a1a",
          border: isFire ? "none" : `4px solid ${hex}`,
          boxShadow: `inset 0 0 10px rgba(0,0,0,${isFire ? 0.3 : 0.1})`,
        }}
        aria-hidden="true"
        data-testid={`bib-fallback-${code}-${team}`}
      >
        {code}
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block ${className}`}
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      data-testid={`bib-svg-${code}-${team}`}
    />
  );
};
