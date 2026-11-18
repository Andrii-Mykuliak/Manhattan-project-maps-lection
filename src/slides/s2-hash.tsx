import React from "react";
import { interpolate } from "remotion";
import { BP, C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, Bullet, clamp01, Lead, M, Panel, Slide, Stamp } from "../deck/ui";
import { Tag } from "./kit";

/* Keys go through the hash function into buckets; hash values are illustrative. */
const KEYS: { k: string; b: number }[] = [
  { k: "Orion", b: 3 },
  { k: "Vega", b: 5 },
  { k: "Lyra", b: 1 },
  { k: "Altair", b: 2 },
  { k: "Deneb", b: 1 },
];
const NB = 6;
const BX = 880;
const BW = 140;
const BG = 157;
const FLOOR = 750;
const MX0 = 440;
const MX1 = 800;
const MY = 530;
const FLY = 44;
const GAP = 22;

const listPos = (i: number) => ({ x: 96, y: 310 + i * 92 });
const slotOf = (i: number) => KEYS.slice(0, i).filter((q) => q.b === KEYS[i].b).length;
const slotPos = (i: number) => ({ x: BX + KEYS[i].b * BG + 6, y: FLOOR - 52 - slotOf(i) * 54 });

const ease = (v: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp01(v));

const Buckets: React.FC<{ p: number }> = ({ p }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) }}>
    {Array.from({ length: NB }, (_, b) => {
      const x = BX + b * BG;
      return (
        <g key={b}>
          <path d={`M ${x} 330 L ${x} ${FLOOR} L ${x + BW} ${FLOOR} L ${x + BW} 330`} fill={`${C.panel2}88`} stroke={C.text} strokeWidth={2.5} />
          <text x={x + BW / 2} y={FLOOR + 40} textAnchor="middle" fontFamily={F.mono} fontWeight={700} fontSize={26} fill={C.dim}>
            [{b}]
          </text>
        </g>
      );
    })}
  </svg>
);

const Machine: React.FC<{ p: number; busy: number }> = ({ p, busy }) => (
  <div
    style={{
      position: "absolute",
      left: MX0,
      top: MY - 95,
      width: MX1 - MX0,
      height: 190,
      background: `linear-gradient(160deg, ${BP.bg2}, ${BP.bg})`,
      boxShadow: busy > 0.05 ? `0 0 0 ${8 * busy}px ${C.red}55` : "4px 5px 0 rgba(40,30,15,0.22)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      opacity: clamp01(p),
      transform: `scale(${mix(0.85, 1, clamp01(p))})`,
    }}
  >
    <div style={{ position: "absolute", inset: 8, border: `1.5px solid ${BP.edge}` }} />
    <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: BP.text }}>ХЕШ-ФУНКЦІЯ</div>
    <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: BP.kw }}>h(k) % 6</div>
  </div>
);

const HashSlide: React.FC = () => {
  const { s, t } = useSteps();
  const look = t(3, 0);
  let busy = 0;
  let shown = -1;
  KEYS.forEach((_, i) => {
    const tt = t(2, i * GAP);
    if (tt >= 12 && tt < 24) {
      busy = 1;
    }
    if (tt >= 14) {
      shown = i;
    }
  });
  if (look >= 18 && look < 30) {
    busy = 1;
  }
  const findP = look < 0 ? 0 : clamp01(look / 16);
  const cmp1 = s(3, 40);
  const cmp2 = s(3, 58);
  return (
    <Slide title="Невпорядкований, але не випадковий">
      <Lead>Хеш-функція визначає групу (bucket), у яку кладуть ключ і де потім його шукають.</Lead>
      <div style={{ position: "absolute", left: 96, top: 266, fontFamily: F.head, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: C.dim, opacity: clamp01(s(1, 0)) }}>
        ПОРЯДОК ВСТАВКИ
      </div>
      <Machine p={s(1, 10, POP)} busy={busy} />
      <Buckets p={s(1, 16)} />
      {shown >= 0 && look < 0 && (
        <div style={{ position: "absolute", left: MX0, top: MY + 112, width: MX1 - MX0, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 27, color: C.text }}>
          h("{KEYS[shown].k}") % 6 = <span style={{ color: C.red }}>{KEYS[shown].b}</span>
        </div>
      )}
      {look >= 0 && (
        <div style={{ position: "absolute", left: MX0, top: MY + 112, width: MX1 - MX0, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 27, color: C.text, opacity: findP }}>
          h("Deneb") % 6 = <span style={{ color: C.red }}>1</span>
        </div>
      )}
      <div style={{ position: "absolute", left: MX0 + 40, top: MY - 170, opacity: findP }}>
        <Tag color={C.red} size={28}>
          find("Deneb")
        </Tag>
      </div>
      <At x={MX0} y={MY + 160} w={MX1 - MX0} step={1} delay={24} size={22} weight={600} font={F.mono} color={C.faint} align="center">
        числа умовні
      </At>
      {KEYS.map((q, i) => {
        const p0 = s(1, 4 + i * 4, POP);
        const tt = t(2, i * GAP);
        const a = listPos(i);
        const b = slotPos(i);
        const toIn = ease(interpolate(tt, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        const toOut = ease(interpolate(tt, [24, FLY], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        const inside = tt >= 12 && tt < 24;
        const x = tt < 12 ? mix(a.x, MX0 - 60, toIn) : mix(MX1 - 60, b.x, toOut);
        const y = tt < 12 ? mix(a.y, MY - 22, toIn) : mix(MY - 22, b.y, toOut);
        const isDeneb = q.k === "Deneb";
        const isLyra = q.k === "Lyra";
        const glow = isDeneb ? cmp2 : 0;
        const bad = isLyra ? cmp1 * (1 - clamp01(s(3, 80))) : 0;
        return (
          <React.Fragment key={q.k}>
            <div style={{ position: "absolute", left: a.x, top: a.y, opacity: tt >= 0 ? 0.35 * clamp01(p0) : 0 }}>
              <Tag w={96} size={21} color={C.faint} style={{ borderStyle: "dashed" }}>
                {q.k}
              </Tag>
            </div>
            <div style={{ position: "absolute", left: tt < 0 ? a.x : x, top: tt < 0 ? a.y : y, opacity: inside ? 0 : clamp01(p0) }}>
              <Tag w={96} size={21} color={bad > 0.3 ? C.red : C.blue} fill={glow > 0.5} glow={Math.max(glow, bad)}>
                {q.k}
              </Tag>
            </div>
            {isLyra && cmp1 > 0.05 && (
              <div style={{ position: "absolute", left: b.x + 99, top: b.y + 4, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.red, opacity: clamp01(cmp1) }}>≠</div>
            )}
            {isDeneb && cmp2 > 0.05 && (
              <div style={{ position: "absolute", left: b.x + 99, top: b.y + 4, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.olive, opacity: clamp01(cmp2) }}>==</div>
            )}
          </React.Fragment>
        );
      })}
      <At x={880} y={830} w={944} step={3} delay={64} size={30}>
        Кілька ключів в одній групі контейнер розрізняє <A>перевіркою на рівність</A>.
      </At>
      <At x={96} y={930} w={1728} step={4} delay={0} size={32}>
        Обхід тут дасть <M>Lyra Deneb Altair Orion Vega</M>: не за алфавітом і не в порядку вставки.
      </At>
    </Slide>
  );
};

/* Average vs worst case: spread buckets vs one long chain. */
const Mini: React.FC<{ x: number; spread: boolean; step: number }> = ({ x, spread, step }) => {
  const { s, t } = useSteps();
  const layout = spread ? [0, 1, 1, 2, 3, 4, 5, 5] : [2, 2, 2, 2, 2, 2, 2, 2];
  const target = spread ? 6 : 7;
  const counts: number[] = [];
  const pos = layout.map((b) => {
    counts[b] = (counts[b] ?? 0) + 1;
    return { b, j: counts[b] - 1 };
  });
  const scan = t(step, 30);
  const cursor = scan < 0 ? -1 : Math.floor(scan / 12);
  const chain = pos.map((q, i) => ({ ...q, i })).filter((q) => q.b === layout[target]);
  const targetK = chain.findIndex((c) => c.i === target);
  const reached = Math.min(cursor, targetK);
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(s(step, 0)) }}>
        {Array.from({ length: 6 }, (_, b) => {
          const bx = x + b * 122;
          return <path key={b} d={`M ${bx} 380 L ${bx} 720 L ${bx + 104} 720 L ${bx + 104} 380`} fill="none" stroke={C.text} strokeWidth={2} />;
        })}
      </svg>
      {pos.map((q, i) => {
        const p = s(step, 6 + i * 3, POP);
        const k = chain.findIndex((c) => c.i === i);
        const visited = k >= 0 && k <= reached;
        const hit = i === target && k <= reached && reached >= 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + q.b * 122 + 12,
              top: 720 - 44 - q.j * 40,
              width: 80,
              height: 32,
              background: hit ? C.red : visited ? `${C.red}33` : C.slate,
              opacity: clamp01(p),
              transform: `scale(${mix(0.5, 1, clamp01(p))})`,
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: x, top: 740, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.text, opacity: clamp01(s(step, 30)) }}>
        порівнянь: <span style={{ color: C.red }}>{reached < 0 ? 0 : reached + 1}</span>
      </div>
    </>
  );
};

const Speed: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Швидкість">
      <Lead>Для підрахунку частот порядок ключів не потрібен, а от швидкість важлива.</Lead>
      <Panel x={96} y={280} w={850} h={530} title="У середньому" color={C.olive} p={s(1, 0)} />
      <Mini x={150} spread step={1} />
      <div style={{ position: "absolute", left: 700, top: 290 }}>
        <Stamp p={s(1, 60, { damping: 14, stiffness: 260 })} size={52} color={C.olive} rotate={-6} double={false} upper={false}>
          O(1)
        </Stamp>
      </div>
      <Panel x={974} y={280} w={850} h={530} title="У гіршому випадку" color={C.red} p={s(2, 0)} />
      <Mini x={1028} spread={false} step={2} />
      <div style={{ position: "absolute", left: 1580, top: 290 }}>
        <Stamp p={s(2, 130, { damping: 14, stiffness: 260 })} size={52} rotate={-6} double={false} upper={false}>
          O(n)
        </Stamp>
      </div>
      <Bullet x={96} y={850} w={1728} step={3} size={31}>
        Пошук, вставка й видалення одного ключа займають у середньому <A c={C.olive}>O(1)</A>, у гіршому випадку <A>O(n)</A>, де n означає кількість записів.
      </Bullet>
      <Bullet x={96} y={950} w={1728} step={3} delay={12} size={31}>
        Для рядків окремо враховуйте час на хешування й порівняння символів.
      </Bullet>
    </Slide>
  );
};

export const s2Slides: SlideDef[] = [
  { id: "hash", title: "Хеш-функція і групи", steps: [40, 50, 140, 110, 50], C: HashSlide },
  { id: "speed", title: "Швидкість", steps: [40, 90, 160, 50], C: Speed },
];
