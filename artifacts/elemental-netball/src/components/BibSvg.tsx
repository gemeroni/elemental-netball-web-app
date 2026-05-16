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
  let text = raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .trim();

  const classNames = new Set<string>();
  const classRe = /\.(cls-[\w-]+)\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = classRe.exec(text)) !== null) classNames.add(m[1]);

  classNames.forEach((cls) => {
    const scoped = `${cls}-${uid}`;
    text = text.replace(new RegExp(`\\.${cls}(?=[\\s{,])`, "g"), `.${scoped}`);
    text = text.replace(new RegExp(`class="${cls}"`, "g"), `class="${scoped}"`);
    text = text.replace(
      new RegExp(`class="([^"]*?)\\b${cls}\\b([^"]*?)"`, "g"),
      `class="$1${scoped}$2"`
    );
  });

  return text;
}

export const BibSvg: React.FC<BibSvgProps> = ({ code, team, className = "", style = {} }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [uid] = useState(() => `bib${++bibCounter}`);

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

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!text.includes("<svg")) throw new Error("Not an SVG");
        setSvgContent(sanitiseSvg(text, uid));
      })
      .catch(() => setError(true));
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
          aspectRatio: "3/4",
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
      className={`[&>svg]:w-full [&>svg]:h-full [&>svg]:block ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      data-testid={`bib-svg-${code}-${team}`}
    />
  );
};
