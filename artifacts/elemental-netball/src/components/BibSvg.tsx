import React, { useEffect, useState } from "react";
import { getPositionByCode, Team } from "@/data/positions";

interface BibSvgProps {
  code: string;
  team: Team;
  className?: string;
  style?: React.CSSProperties;
}

export const BibSvg: React.FC<BibSvgProps> = ({ code, team, className = "", style = {} }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  
  const pos = getPositionByCode(code);
  const filename = pos ? (team === "Fire" ? `${pos.fireColorName}_${code}_${team}.svg` : `${pos.iceColorName}_${code}_${team}.svg`) : "";
  const src = `/assets/svg/${filename}`;

  useEffect(() => {
    if (!filename) return;
    
    const fetchSvg = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error("Failed to fetch SVG");
        }
        const text = await response.text();
        if (text.includes("<svg")) {
          setSvgContent(text);
        } else {
          throw new Error("Invalid SVG content");
        }
      } catch (err) {
        setError(true);
      }
    };

    fetchSvg();
  }, [src, filename]);

  if (error || !svgContent) {
    // Render fallback bib
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
          aspectRatio: "3/4",
          backgroundColor: isFire ? hex : "#ffffff",
          color: isFire ? "#ffffff" : hex,
          border: isFire ? "2px solid #b3b3b3" : `4px solid ${hex}`,
          boxShadow: `inset 0 0 10px rgba(0,0,0,${isFire ? 0.3 : 0.1})`
        }}
        data-testid={`bib-fallback-${code}-${team}`}
      >
        {code}
      </div>
    );
  }

  return (
    <div 
      className={`[&>svg]:w-full [&>svg]:h-full [&>svg]:block ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      data-testid={`bib-svg-${code}-${team}`}
    />
  );
};
