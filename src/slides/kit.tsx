import React from "react";
import { C, F } from "../deck/theme";
import { mix, useSteps } from "../deck/steps";
import { clamp01 } from "../deck/ui";

/** Text typed character by character with a blinking caret while typing. */
export const Typed: React.FC<{ text: string; step?: number; delay?: number; cps?: number; caret?: boolean }> = ({
  text,
  step = 0,
  delay = 0,
  cps = 40,
  caret = true,
}) => {
  const { t, fps } = useSteps();
  const tt = t(step, delay);
  const n = tt < 0 ? 0 : Math.min(text.length, Math.floor((tt / fps) * cps));
  const typing = tt >= 0 && n < text.length;
  return (
    <span style={{ whiteSpace: "pre" }}>
      {text.slice(0, n)}
      {caret && typing && <span style={{ opacity: Math.floor(tt / 6) % 2 ? 1 : 0.2 }}>▌</span>}
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </span>
  );
};

/** Key or value tag, as on a filing-cabinet card. */
export const Tag: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  w?: number;
  fill?: boolean;
  p?: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.blue, size = 28, w, fill, p = 1, glow = 0, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      width: w,
      height: size * 1.7,
      padding: `0 ${size * 0.45}px`,
      border: `2px solid ${color}`,
      background: fill ? color : C.panel2,
      color: fill ? C.panel2 : color,
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: size,
      whiteSpace: "pre",
      boxShadow: glow > 0.02 ? `0 0 0 ${6 * glow}px ${color}44` : "2px 2px 0 rgba(70,50,20,0.15)",
      opacity: clamp01(p),
      transform: `scale(${mix(0.6, 1, clamp01(p))})`,
      fontVariantLigatures: "none",
      ...style,
    }}
  >
    {children}
  </div>
);

export type Col = { w: number; head: React.ReactNode; align?: React.CSSProperties["textAlign"] };

/** Ledger table: typed header, ruled rows that appear one per step (or all at `step`). */
export const Ledger: React.FC<{
  x: number;
  y: number;
  cols: Col[];
  rows: React.ReactNode[][];
  rowH?: number;
  step?: number;
  perRow?: boolean;
  size?: number;
  hl?: number[];
}> = ({ x, y, cols, rows, rowH = 82, step = 1, perRow = true, size = 29, hl = [] }) => {
  const { s } = useSteps();
  const total = cols.reduce((a, c) => a + c.w, 0);
  const hp = clamp01(s(0, 12));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: total }}>
      <div style={{ display: "flex", borderBottom: `3px solid ${C.text}`, opacity: hp, paddingBottom: 8 }}>
        {cols.map((c, i) => (
          <div
            key={i}
            style={{
              width: c.w,
              paddingRight: 20,
              boxSizing: "border-box",
              fontFamily: F.head,
              fontWeight: 600,
              fontSize: 26,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: C.dim,
              textAlign: c.align,
            }}
          >
            {c.head}
          </div>
        ))}
      </div>
      {rows.map((r, ri) => {
        const p = perRow ? s(step + ri, 0) : s(step, ri * 6);
        const on = hl.includes(ri);
        return (
          <div
            key={ri}
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: rowH,
              borderBottom: `1.5px solid ${C.line}`,
              background: on ? `${C.red}10` : undefined,
              opacity: clamp01(p),
              transform: `translateY(${(1 - p) * 16}px)`,
            }}
          >
            {r.map((cell, ci) => (
              <div
                key={ci}
                style={{
                  width: cols[ci].w,
                  paddingRight: 20,
                  boxSizing: "border-box",
                  fontFamily: F.body,
                  fontWeight: 700,
                  fontSize: size,
                  lineHeight: 1.3,
                  color: C.text,
                  textAlign: cols[ci].align,
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** One-line legend for the reference slides. */
export const Legend: React.FC<{ y?: number }> = ({ y = 186 }) => {
  const { s } = useSteps();
  return (
    <div style={{ position: "absolute", left: 96, top: y, fontFamily: F.mono, fontWeight: 600, fontSize: 25, color: C.dim, opacity: clamp01(s(0, 8)) }}>
      m: std::unordered_map&lt;std::string, int&gt;    k: ключ    v: значення
    </div>
  );
};

/** Source note in the bottom-right corner. */
export const Source: React.FC = () => {
  const { s } = useSteps();
  return (
    <div style={{ position: "absolute", right: 96, bottom: 26, fontFamily: F.mono, fontWeight: 600, fontSize: 18, letterSpacing: 1, color: C.faint, opacity: clamp01(s(0, 20)) }}>
      джерело: en.cppreference.com/w/cpp/container/unordered_map
    </div>
  );
};
