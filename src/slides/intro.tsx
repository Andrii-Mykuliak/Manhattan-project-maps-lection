import React from "react";
import { ACCENTS, C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { At, Atom, clamp01, Num, Slide, Stamp } from "../deck/ui";
import { Typed } from "./kit";

/* Title: a declassified report cover. */
const TitleSlide: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide atom={false}>
      <div style={{ position: "absolute", left: 96, top: 96, fontFamily: F.mono, fontWeight: 600, fontSize: 28, lineHeight: 1.6, color: C.dim }}>
        <div>
          <Typed text="ДОСЬЄ № C++/STD-01" step={0} delay={4} cps={34} />
        </div>
        <div>
          <Typed text="ТЕМА: КЛЮЧ → ЗНАЧЕННЯ" step={0} delay={24} cps={34} />
        </div>
      </div>
      <At x={90} y={250} step={0} delay={34} size={210} weight={700} font={F.head} style={{ lineHeight: 1.0, letterSpacing: 2 }}>
        СЛОВНИКИ
      </At>
      <At x={94} y={470} step={0} delay={40} size={150} weight={700} font={F.head} style={{ lineHeight: 1.0, letterSpacing: 2 }}>
        В <span style={{ color: C.red }}>C++</span>
      </At>
      <At x={98} y={680} w={1000} step={0} delay={50} size={38} weight={700} color={C.text}>
        <span style={{ fontFamily: F.mono, color: C.blue, fontSize: 36 }}>std::unordered_map</span> та інші асоціативні контейнери стандартної бібліотеки
      </At>
      <div style={{ position: "absolute", left: 98, top: 846, width: 900, height: 2, background: C.text, opacity: clamp01(s(0, 56)) }} />
      <At x={98} y={866} step={0} delay={58} size={28} weight={600} font={F.mono} color={C.dim}>
        мініурок для 1 курсу, 25 хвилин
      </At>
      <div style={{ opacity: clamp01(s(0, 30)) }}>
        <Atom x={1430} y={470} r={330} color={C.text} opacity={0.75} speed={0.06} width={3} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={1430} cy={470} r={30} fill={C.red} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 1210, top: 760 }}>
        <Stamp p={s(0, 76, { damping: 14, stiffness: 260 })} size={64} rotate={-9}>
          Розсекречено
        </Stamp>
      </div>
    </Slide>
  );
};

const AGENDA = ["Ключ → значення", "Чому саме unordered?", "Словники стандартної бібліотеки", "Довідник операцій", "Практика «Що є на складі?»"];

const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  return (
    <Slide title="Зміст">
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 5, POP) : 1;
        const on = !full && i === active ? s(0, 10) : 0;
        const dim = full || i === active ? 1 : 0.3;
        const color = ACCENTS[i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 96,
              top: 222 + i * 150,
              width: 1500,
              height: 118,
              display: "flex",
              alignItems: "center",
              gap: 36,
              padding: "0 30px",
              boxSizing: "border-box",
              borderLeft: `8px solid ${on > 0.5 ? color : "transparent"}`,
              background: on > 0.5 ? `${color}14` : undefined,
              opacity: clamp01(p) * dim,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            <Num n={i + 1} color={color} />
            <div style={{ fontFamily: F.body, fontSize: 46, fontWeight: 700, color: C.text, whiteSpace: "nowrap" }}>{item}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [130], C: TitleSlide },
  { id: "agenda", title: "Зміст", steps: [70], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `Зміст ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
