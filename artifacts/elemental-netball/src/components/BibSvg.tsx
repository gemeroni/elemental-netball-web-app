import { useEffect, useState } from "react";
import { getPositionByCode, Team } from "@/data/positions";

interface BibSvgProps {
  code: string;
  team: Team;
  className?: string;
  style?: React.CSSProperties;
}

let bibCounter = 0;

function sanitiseSvg(raw: string, uid: string): string {
  // 1. Strip XML / DOCTYPE declarations
  let text = raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .trim();

  // 2. Collect all cls-* names that appear in the <style> block
  const classes = new Set<string>();
  text.replace(/\.(cls-[\w]+)[\s{,]/g, (_, c: string) => {
    classes.add(c);
    return _;
  });

  if (classes.size === 0) return text;

  // 3. Scope CSS selectors — single pass, won't touch class="" attributes
  //    Matches .cls-N followed by whitespace, { or ,
  text = text.replace(/\.(cls-[\w]+)(?=[\s{,])/g, (_, c: string) =>
    `.${c}-${uid}`
  );

  // 4. Scope class attribute values — split each token, only remap known cls-* names
  //    This runs AFTER step 3 so the two passes can't interfere
  text = text.replace(/\bclass="([^"]*)"/g, (_, val: string) => {
    const scoped = val
      .split(/\s+/)
      .map((t) => (classes.has(t) ? `${t}-${uid}` : t))
      .join(" ");
    return `class="${scoped}"`;
  });

  return text;
}

export const BibSvg: React.FC<BibSvgProps> = ({
  code,
  team,
  className = "",
  style = {},
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [uid] = useState(() => `b${++bibCounter}`);

  const pos = getPositionByCode(code);
  const filename = pos
    ? team === "Fire"
      ? `${pos.fireColorName}_${code}_${team}.svg`
      : `${pos.iceColorName}_${code}_${team}.svg`
    : "";
  const src = `/assets/svg/${filename}`;

  useEffect(() => {
    if (!filename) return;
    setSvgContent(null);
    setError(false);

    let cancelled = false;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        if (!text.includes("<svg")) throw new Error("Not an SVG");
        setSvgContent(sanitiseSvg(text, uid));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [src, filename, uid]);

  if (error || !svgContent) {
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
