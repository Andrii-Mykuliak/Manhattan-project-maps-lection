import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Backdrop, clamp01 } from "../deck/ui";
import { useAmbient } from "../deck/clock";

/* The practice task keeps running: products pass the hash function and the shelf counters grow. */
const WORDS = ["apple", "pear", "apple", "plum", "kiwi", "pear", "apple", "fig", "lime", "plum", "kiwi", "apple"];
const BIN: Record<string, number> = { apple: 0, kiwi: 1, pear: 2, lime: 3, plum: 4, fig: 5 };
const PERIOD = 1.7;
const CYCLE = WORDS.length * PERIOD + 2.5;
const MX = 960;
const MY = 520;
const BIN_W = 210;
const BIN_Y = 720;
const binX = (b: number) => MX + (b - 2.5) * (BIN_W + 26);

const ease = (v: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(v));

const Shelf: React.FC = () => {
  const now = useAmbient();
  const t = now % CYCLE;
  const fadeOut = clamp01((t - (CYCLE - 1.2)) / 1);
  const counts: Record<string, number> = {};
  const flying: React.ReactNode[] = [];
  WORDS.forEach((w, i) => {
    const local = t - i * PERIOD;
    if (local >= 1.55) {
      counts[w] = (counts[w] ?? 0) + 1;
      return;
    }
    if (local < 0) {
      return;
    }
    const start = { x: 160, y: MY };
    const inX = MX - 230;
    const out = { x: MX, y: MY + 90 };
    const end = { x: binX(BIN[w]), y: BIN_Y + 40 };
    let x: number;
    let y: number;
    let o = 1;
    if (local < 0.6) {
      const q = ease(local / 0.6);
      x = mix(start.x, inX, q);
      y = start.y;
      o = clamp01(local / 0.2);
    } else if (local < 0.9) {
      x = MX;
      y = MY;
      o = 0;
    } else {
      const q = ease((local - 0.9) / 0.65);
      x = mix(out.x, end.x, q);
      y = mix(out.y, end.y, q);
    }
    flying.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x - 70,
          top: y - 22,
          width: 140,
          height: 44,
          border: `2px solid ${C.blue}`,
          background: C.panel2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 26,
          color: C.blue,
          opacity: o * (1 - fadeOut),
        }}
      >
        {w}
      </div>,
    );
  });
  const busy = WORDS.some((_, i) => {
    const local = t - i * PERIOD;
    return local >= 0.55 && local < 0.95;
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: MX - 230,
          top: MY - 70,
          width: 460,
          height: 140,
          background: `linear-gradient(160deg, ${BP.bg2}, ${BP.bg})`,
          boxShadow: busy ? `0 0 0 6px ${C.red}44` : "4px 5px 0 rgba(40,30,15,0.22)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <div style={{ position: "absolute", inset: 8, border: `1.5px solid ${BP.edge}` }} />
        <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: BP.text }}>ХЕШ-ФУНКЦІЯ</div>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: BP.kw }}>stock[name]++</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <line x1={120} y1={MY + 30} x2={MX - 240} y2={MY + 30} stroke={C.line} strokeWidth={2} strokeDasharray="10 10" />
        {Object.entries(BIN).map(([w, b]) => {
          const x = binX(b) - BIN_W / 2;
          return <path key={w} d={`M ${x} ${BIN_Y} L ${x} ${BIN_Y + 150} L ${x + BIN_W} ${BIN_Y + 150} L ${x + BIN_W} ${BIN_Y}`} fill={`${C.panel2}88`} stroke={C.text} strokeWidth={2.5} />;
        })}
      </svg>
      {Object.entries(BIN).map(([w, b]) => (
        <div
          key={w}
          style={{
            position: "absolute",
            left: binX(b) - BIN_W / 2,
            top: BIN_Y + 76,
            width: BIN_W,
            textAlign: "center",
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 28,
            color: counts[w] ? C.text : C.faint,
            opacity: 1 - fadeOut,
          }}
        >
          {w} <span style={{ color: C.red }}>{counts[w] ?? 0}</span>
        </div>
      ))}
      {flying}
    </>
  );
};

const Outro: React.FC = () => {
  const { s } = useSteps();
  const words = ["Дякую", "за", "увагу!"];
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden", userSelect: "none" }}>
      <Backdrop />
      <div style={{ opacity: clamp01(s(0, 24)) }}>
        <Shelf />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: F.head, fontWeight: 700, fontSize: 140, letterSpacing: 3, color: C.text }}>
        {words.map((w, i) => {
          const p = s(0, 6 + i * 6, POP);
          return (
            <span key={w} style={{ display: "inline-block", whiteSpace: "pre", opacity: clamp01(p), transform: `translateY(${(1 - p) * 40}px)` }}>
              {w + (i < words.length - 1 ? " " : "")}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 284, textAlign: "center", fontFamily: F.body, fontStyle: "italic", fontWeight: 400, fontSize: 46, color: C.dim, opacity: clamp01(s(0, 30)) }}>
        Питання?
      </div>
      <div style={{ position: "absolute", right: 96, bottom: 34, fontFamily: F.mono, fontSize: 22, fontWeight: 600, color: C.faint, opacity: clamp01(s(0, 40)) }}>made with Claude Opus 5.5</div>
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [480], C: Outro };
