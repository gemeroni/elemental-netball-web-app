import { getPositionByCode, Team } from "@/data/positions";
import { BIB_SVGS, BIB_SVGS_MONO } from "@/assets/bibSvgs";

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

  const svgContent = monochrome
    ? BIB_SVGS_MONO[`${code}_${team}`]
    : BIB_SVGS[`${code}_${team}`];

  if (svgContent) {
    return (
      <div
        className={`w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:block ${className}`}
        style={style}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        data-testid={monochrome ? `bib-mono-svg-${code}-${team}` : `bib-svg-${code}-${team}`}
      />
    );
  }

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
};
