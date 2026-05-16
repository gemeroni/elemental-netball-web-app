import { getPositionByCode, Team } from "@/data/positions";
import { BIB_SVGS } from "@/assets/bibSvgs";

interface BibSvgProps {
  code: string;
  team: Team;
  className?: string;
  style?: React.CSSProperties;
}

export const BibSvg: React.FC<BibSvgProps> = ({
  code,
  team,
  className = "",
  style = {},
}) => {
  const pos = getPositionByCode(code);
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
          color: isFire ? "#ffffff" : hex,
          border: isFire ? "2px solid #b3b3b3" : `4px solid ${hex}`,
          boxShadow: `inset 0 0 10px rgba(0,0,0,${isFire ? 0.3 : 0.1})`,
        }}
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
      dangerouslySetInnerHTML={{ __html: svgContent }}
      data-testid={`bib-svg-${code}-${team}`}
    />
  );
};
