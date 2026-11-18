import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { BP, C, F } from "./theme";
import { clamp01, mix, POP, SpringCfg, useSteps } from "./steps";
import { useAmbient } from "./clock";

type Dir = "up" | "down" | "left" | "right" | "scale" | "none";

export { clamp01 };

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** Paper fibres: a tiled fractal-noise texture, multiplied over the page. */
const GRAIN = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.36 0 0 0 0 0.29 0 0 0 0 0.18 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
);

/** Uneven ink: a mask with small gaps, used on stamps. */
export const INK_MASK = svgUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4.2 0 0 0 -1.25'/></filter><rect width='100%' height='100%' filter='url(#m)'/></svg>`,
);

export const useAppear = (step = 0, delay = 0, dir: Dir = "up", dist = 36, cfg?: SpringCfg, exit?: number) => {
  const { s } = useSteps();
  const p = s(step, delay, cfg);
  const out = exit === undefined ? 0 : s(exit, 0);
  const off = (1 - p) * dist;
  const transform =
    dir === "up" ? `translateY(${off}px)`
    : dir === "down" ? `translateY(${-off}px)`
    : dir === "left" ? `translateX(${-off}px)`
    : dir === "right" ? `translateX(${off}px)`
    : dir === "scale" ? `scale(${mix(0.8, 1, p)})`
    : undefined;
  return { opacity: Math.min(1, p) * (1 - out), transform, p };
};

export const Appear: React.FC<{
  step?: number;
  delay?: number;
  dir?: Dir;
  dist?: number;
  pop?: boolean;
  exit?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ step = 0, delay = 0, dir = "up", dist, pop, exit, style, children }) => {
  const a = useAppear(step, delay, dir, dist, pop ? POP : undefined, exit);
  return <div style={{ ...style, opacity: a.opacity, transform: a.transform }}>{children}</div>;
};

/** Absolutely positioned, animated block. */
export const At: React.FC<{
  x: number;
  y: number;
  w?: number;
  step?: number;
  delay?: number;
  dir?: Dir;
  dist?: number;
  pop?: boolean;
  exit?: number;
  size?: number;
  weight?: number;
  color?: string;
  font?: string;
  align?: React.CSSProperties["textAlign"];
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ x, y, w, step, delay, dir, dist, pop, exit, size = 34, weight = 700, color = C.text, font = F.body, align, style, children }) => (
  <Appear
    step={step}
    delay={delay}
    dir={dir}
    dist={dist}
    pop={pop}
    exit={exit}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      lineHeight: 1.35,
      textAlign: align,
      ...style,
    }}
  >
    {children}
  </Appear>
);

/** Accent-coloured span. */
export const A: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.red }) => (
  <span style={{ color: c }}>{children}</span>
);

/** Inline typewriter code. */
export const M: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.blue }) => (
  <span style={{ fontFamily: F.mono, color: c, fontWeight: 700, fontSize: "0.92em", fontVariantLigatures: "none", whiteSpace: "nowrap" }}>{children}</span>
);

export const Lead: React.FC<{ children: React.ReactNode; step?: number; delay?: number; y?: number; size?: number; w?: number }> = ({
  children,
  step = 0,
  delay = 10,
  y = 186,
  size = 36,
  w = 1720,
}) => (
  <At x={96} y={y} w={w} step={step} delay={delay} size={size} weight={700}>
    {children}
  </At>
);

/** Deterministic pseudo-random number in [0, 1). */
export const rnd = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** Bohr-style atom: three orbits with slow electrons. */
export const Atom: React.FC<{ x: number; y: number; r: number; color?: string; opacity?: number; speed?: number; width?: number }> = ({
  x,
  y,
  r,
  color = C.text,
  opacity = 1,
  speed = 0.25,
  width = 2,
}) => {
  const t = useAmbient();
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity }}>
      <g transform={`translate(${x} ${y})`}>
        {[0, 60, 120].map((a, i) => {
          const th = t * speed * (1 + i * 0.17) * Math.PI * 2 + i * 2.1;
          const ex = r * Math.cos(th);
          const ey = r * 0.36 * Math.sin(th);
          return (
            <g key={a} transform={`rotate(${a})`}>
              <ellipse cx={0} cy={0} rx={r} ry={r * 0.36} fill="none" stroke={color} strokeWidth={width} />
              <circle cx={ex} cy={ey} r={Math.max(4, r * 0.035)} fill={color} />
            </g>
          );
        })}
        <circle cx={0} cy={0} r={Math.max(7, r * 0.07)} fill={color} />
      </g>
    </svg>
  );
};

/** Aged report paper: warm gradient, fibres, darker edges, a faint atom watermark. */
export const Backdrop: React.FC<{ atom?: boolean }> = ({ atom = true }) => (
  <>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 46% 40%, ${C.panel2} 0%, ${C.bg} 52%, ${C.bg2} 100%)` }} />
    <AbsoluteFill style={{ backgroundImage: GRAIN, backgroundSize: "360px 360px", opacity: 0.55, mixBlendMode: "multiply" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(92,64,24,0.20) 100%)" }} />
    {atom && <Atom x={1700} y={900} r={230} color={C.text} opacity={0.045} speed={0.05} width={3} />}
  </>
);

/** Document chrome: punched holes, project mark top right, distribution note bottom left, a double rule under the title. */
export const Frame: React.FC<{ rule?: boolean }> = ({ rule = true }) => {
  const { s } = useSteps();
  const p = clamp01(s(0, 0));
  return (
    <>
      {[330, 750].map((y) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: 30,
            top: y,
            width: 26,
            height: 26,
            borderRadius: 13,
            background: C.bg2,
            boxShadow: "inset 2px 3px 5px rgba(60,40,10,0.45), 0 1px 0 rgba(255,255,255,0.5)",
          }}
        />
      ))}
      {rule && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <line x1={96} y1={150} x2={96 + 1728 * p} y2={150} stroke={C.text} strokeWidth={3.5} />
          <line x1={96} y1={158} x2={96 + 1728 * p} y2={158} stroke={C.text} strokeWidth={1.2} />
        </svg>
      )}
      <div
        style={{
          position: "absolute",
          right: 96,
          top: 48,
          padding: "3px 14px 4px",
          border: `2.5px solid ${C.red}`,
          fontFamily: F.head,
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: 4,
          color: C.red,
          transform: "rotate(-1.2deg)",
          maskImage: INK_MASK,
          WebkitMaskImage: INK_MASK,
        }}
      >
        ПРОЄКТ МАНХЕТТЕН
      </div>
      <div style={{ position: "absolute", left: 96, bottom: 26, fontFamily: F.mono, fontWeight: 600, fontSize: 18, letterSpacing: 3, color: C.faint }}>
        ДЛЯ НАВЧАЛЬНОГО КОРИСТУВАННЯ
      </div>
    </>
  );
};

export const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { s } = useSteps();
  const p = s(0, 2);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 52,
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: F.head,
        fontSize: 64,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color: C.text,
        whiteSpace: "nowrap",
        clipPath: `inset(-10px ${(1 - p) * 100}% -10px -10px)`,
      }}
    >
      <span style={{ width: 16, height: 16, background: C.red, flexShrink: 0 }} />
      {children}
    </div>
  );
};

export const Slide: React.FC<{ title?: React.ReactNode; children?: React.ReactNode; frame?: boolean; atom?: boolean }> = ({
  title,
  children,
  frame = true,
  atom = true,
}) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: F.body, color: C.text, overflow: "hidden", userSelect: "none" }}>
    <Backdrop atom={atom} />
    {frame && <Frame rule={!!title} />}
    {title ? <Title>{title}</Title> : null}
    {children}
  </AbsoluteFill>
);

/** Dossier card: a paper sheet with a coloured top edge and an uppercase heading. */
export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  title?: React.ReactNode;
  color?: string;
  tag?: React.ReactNode;
  p?: number;
  glow?: number;
  dim?: number;
  pad?: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, title, color = C.red, tag, p = 1, glow = 0, dim = 0, pad = "14px 28px 20px", children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: `linear-gradient(180deg, ${C.panel2} 0%, ${C.panel} 100%)`,
      border: `1.5px solid ${glow > 0.3 ? color : C.line}`,
      outline: glow > 0.3 ? `2px solid ${color}` : undefined,
      boxShadow: "3px 4px 0 rgba(70,50,20,0.13)",
      boxSizing: "border-box",
      opacity: clamp01(p) * (1 - 0.6 * clamp01(dim)),
      transform: `translateY(${(1 - p) * 26}px)`,
      overflow: "hidden",
    }}
  >
    <div style={{ height: 6, background: color }} />
    {title !== undefined && (
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "12px 28px 0" }}>
        <div style={{ fontFamily: F.head, fontSize: 32, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color, whiteSpace: "nowrap" }}>{title}</div>
        {tag && <div style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 21, fontWeight: 600, color: C.faint, whiteSpace: "nowrap" }}>{tag}</div>}
      </div>
    )}
    <div style={{ padding: pad }}>{children}</div>
  </div>
);

/** Blueprint sheet for code: navy paper, faint grid, an inner drawing frame. */
export const Blueprint: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title?: React.ReactNode;
  tag?: React.ReactNode;
  p?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, title, tag, p = 1, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: `linear-gradient(160deg, ${BP.bg2} 0%, ${BP.bg} 100%)`,
      boxShadow: "4px 5px 0 rgba(40,30,15,0.22)",
      opacity: clamp01(p),
      transform: `translateY(${(1 - p) * 26}px)`,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(${BP.grid} 1px, transparent 1px), linear-gradient(90deg, ${BP.grid} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    />
    <div style={{ position: "absolute", inset: 10, border: `1.5px solid ${BP.edge}` }} />
    {title !== undefined && (
      <div style={{ position: "absolute", left: 30, right: 30, top: 20, display: "flex", alignItems: "baseline", gap: 14 }}>
        <div style={{ fontFamily: F.head, fontSize: 26, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: BP.dim }}>{title}</div>
        {tag && <div style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 20, fontWeight: 600, color: BP.dim }}>{tag}</div>}
      </div>
    )}
    <div style={{ position: "absolute", left: 30, right: 30, top: title !== undefined ? 70 : 30, bottom: 24 }}>{children}</div>
  </div>
);

/** Typewritten label in a thin box. */
export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.blue, size = 30, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${size * 0.16}px ${size * 0.42}px`,
      borderRadius: 3,
      background: `${color}14`,
      border: `2px solid ${color}`,
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: size,
      color,
      whiteSpace: "pre",
      lineHeight: 1.2,
      fontVariantLigatures: "none",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rubber stamp that lands with a thump: big and faint, then pressed onto the page. */
export const Stamp: React.FC<{
  children: React.ReactNode;
  p: number;
  color?: string;
  size?: number;
  rotate?: number;
  double?: boolean;
  upper?: boolean;
  style?: React.CSSProperties;
}> = ({ children, p, color = C.red, size = 40, rotate = -6, double = true, upper = true, style }) => {
  const q = clamp01(p);
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${size * 0.12}px ${size * 0.4}px ${size * 0.16}px`,
        border: `${Math.max(3, size * 0.09)}px ${double ? "double" : "solid"} ${color}`,
        borderWidth: double ? Math.max(6, size * 0.16) : Math.max(3, size * 0.08),
        fontFamily: F.head,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.08,
        textTransform: upper ? "uppercase" : "none",
        color,
        whiteSpace: "nowrap",
        lineHeight: 1.1,
        opacity: interpolate(q, [0, 0.35], [0, 0.92], { extrapolateRight: "clamp" }),
        transform: `rotate(${rotate}deg) scale(${mix(1.9, 1, q)})`,
        maskImage: INK_MASK,
        WebkitMaskImage: INK_MASK,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Small standard-version mark, e.g. C++17. */
export const Std: React.FC<{ v: string; color?: string; size?: number }> = ({ v, color = C.blue, size = 20 }) => (
  <span
    style={{
      display: "inline-block",
      marginLeft: 10,
      padding: "1px 7px",
      border: `2px solid ${color}`,
      fontFamily: F.head,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: 1,
      color,
      verticalAlign: "middle",
      transform: "rotate(-3deg)",
      lineHeight: 1.2,
    }}
  >
    {v}
  </span>
);

/** Square bullet line. */
export const Bullet: React.FC<{ x: number; y: number; w: number; step: number; delay?: number; color?: string; size?: number; children: React.ReactNode }> = ({
  x,
  y,
  w,
  step,
  delay = 0,
  color = C.red,
  size = 32,
  children,
}) => {
  const { s } = useSteps();
  const p = s(step, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        display: "flex",
        gap: 22,
        alignItems: "flex-start",
        fontFamily: F.body,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.36,
        color: C.text,
        opacity: clamp01(p),
        transform: `translateX(${(1 - p) * -24}px)`,
      }}
    >
      <span style={{ marginTop: size * 0.5, width: 13, height: 13, background: color, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
};

/** Two-digit file number in a box, as in the agenda. */
export const Num: React.FC<{ n: number; color?: string; size?: number }> = ({ n, color = C.red, size = 66 }) => (
  <div
    style={{
      width: size,
      height: size,
      border: `3px solid ${color}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.head,
      fontWeight: 600,
      fontSize: size * 0.5,
      color,
      flexShrink: 0,
    }}
  >
    {String(n).padStart(2, "0")}
  </div>
);

/** SVG arrow that draws itself. */
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  step: number;
  delay?: number;
  dur?: number;
  color?: string;
  width?: number;
  curve?: number;
  dash?: string;
}> = ({ x1, y1, x2, y2, step, delay = 0, dur = 18, color = C.dim, width = 3.5, curve = 0, dash }) => {
  const { lin } = useSteps();
  const p = lin(step, delay, dur);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * curve;
  const cy = my + (dx / len) * curve;
  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  const L = len * (1 + Math.abs(curve) / len);
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const head = 15;
  const pts = [
    [x2, y2],
    [x2 - head * Math.cos(ang - 0.45), y2 - head * Math.sin(ang - 0.45)],
    [x2 - head * Math.cos(ang + 0.45), y2 - head * Math.sin(ang + 0.45)],
  ]
    .map((q) => q.join(","))
    .join(" ");
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
      {dash ? (
        <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={dash} opacity={p} />
      ) : (
        <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
      )}
      <polygon points={pts} fill={color} opacity={interpolate(p, [0.85, 1], [0, 1], { extrapolateLeft: "clamp" })} />
    </svg>
  );
};

/** Triangular glow that peaks `peak` frames after `tt` reaches 0; zero before that. */
export const pulse = (tt: number, peak: number, width: number) => (tt < 0 ? 0 : Math.max(0, 1 - Math.abs(tt - peak) / width));
