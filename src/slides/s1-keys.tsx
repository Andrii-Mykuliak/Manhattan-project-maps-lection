import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Blueprint, Bullet, Chip, clamp01, Lead, M, Panel, Slide, Stamp } from "../deck/ui";
import { Tag } from "./kit";

/* Array by index vs dictionary by name. */
const ARR = [12, 7, 9, 15];
const DICT: [string, number][] = [
  ["Orion", 12],
  ["Vega", 7],
  ["Lyra", 9],
  ["Altair", 7],
];

const ArrayVsDict: React.FC = () => {
  const { s } = useSteps();
  const hit2 = s(1, 40);
  const hitO = s(2, 40);
  const same = s(3, 10);
  return (
    <Slide title="Масив і словник">
      <Lead>
        У масиві значення шукаємо за <A>номером</A>, у словнику за <A>назвою</A>.
      </Lead>
      <Panel x={96} y={290} w={760} h={580} title="Масив" color={C.slate} p={s(1, 0)} />
      {ARR.map((v, i) => {
        const p = s(1, 8 + i * 4, POP);
        const on = i === 2 ? hit2 : 0;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 146 + i * 165, top: 400, width: 150, textAlign: "center", fontFamily: F.mono, fontWeight: 600, fontSize: 26, color: on > 0.5 ? C.red : C.dim, opacity: clamp01(p) }}>
              [{i}]
            </div>
            <div
              style={{
                position: "absolute",
                left: 146 + i * 165,
                top: 446,
                width: 150,
                height: 110,
                border: `2.5px solid ${on > 0.5 ? C.red : C.text}`,
                background: on > 0.5 ? `${C.red}14` : C.panel2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 50,
                color: C.text,
                opacity: clamp01(p),
                transform: `scale(${0.7 + 0.3 * clamp01(p)})`,
              }}
            >
              {v}
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 146, top: 690, opacity: clamp01(s(1, 26)) }}>
        <Chip color={C.slate} size={34}>scores[2]</Chip>
      </div>
      <Arrow x1={350} y1={690} x2={545} y2={566} step={1} delay={32} color={C.red} curve={-30} />
      <At x={146} y={780} step={1} delay={46} size={32} color={C.dim}>
        третя клітинка, бо лічимо від нуля
      </At>

      <Panel x={920} y={290} w={904} h={580} title="Словник" color={C.blue} p={s(2, 0)} />
      <div style={{ position: "absolute", left: 980, top: 380, display: "flex", fontFamily: F.head, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: C.dim, opacity: clamp01(s(2, 6)) }}>
        <span style={{ width: 350 }}>КЛЮЧ</span>
        <span>ЗНАЧЕННЯ</span>
      </div>
      {DICT.map(([k, v], i) => {
        const p = s(2, 8 + i * 4, POP);
        const on = i === 0 ? hitO : 0;
        const twin = v === 7 ? same : 0;
        return (
          <div key={k} style={{ position: "absolute", left: 980, top: 420 + i * 78, display: "flex", alignItems: "center", gap: 20, opacity: clamp01(p) }}>
            <Tag w={260} color={C.blue} fill={on > 0.5} glow={on}>
              {`"${k}"`}
            </Tag>
            <span style={{ width: 50, height: 2.5, background: C.text }} />
            <Tag w={110} color={C.text} glow={twin} style={{ borderColor: twin > 0.5 ? C.olive : C.text, color: twin > 0.5 ? C.olive : C.text }}>
              {String(v)}
            </Tag>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1490, top: 540, opacity: clamp01(s(2, 26)) }}>
        <Chip color={C.blue} size={32}>scores["Orion"]</Chip>
      </div>
      <Arrow x1={1600} y1={534} x2={1452} y2={446} step={2} delay={32} color={C.red} curve={-40} />
      <div style={{ position: "absolute", left: 1530, top: 680, opacity: clamp01(s(3, 20)) }}>
        <Tag w={210} color={C.red} style={{ borderStyle: "dashed", textDecoration: "line-through" }}>
          "Orion"
        </Tag>
      </div>
      <div style={{ position: "absolute", left: 1500, top: 770 }}>
        <Stamp p={s(3, 34, { damping: 14, stiffness: 260 })} size={30} rotate={-7} double={false}>
          Ключ уже є
        </Stamp>
      </div>
      <At x={96} y={910} w={1728} step={3} delay={44} size={32}>
        Ключ у словнику <A>унікальний</A>, а значення можуть повторюватися: Vega і Altair обидва мають <A c={C.olive}>7</A>.
      </At>
    </Slide>
  );
};

/* First dictionary: each line adds a point to a team; the table on the right follows. */

type Tick = { at: number; d: number; v: number };

const Cell: React.FC<{ k: string; ticks: Tick[]; y: number }> = ({ k, ticks, y }) => {
  const { s, t } = useSteps();
  const first = ticks[0];
  if (t(first.at, first.d) < 0) {
    return null;
  }
  const p = s(first.at, first.d, POP);
  let v = first.v;
  let since = 999;
  for (const q of ticks.slice(1)) {
    const tt = t(q.at, q.d);
    if (tt >= 0) {
      v = q.v;
      since = tt;
    }
  }
  const flash = since < 16 ? 1 - since / 16 : 0;
  return (
    <div style={{ position: "absolute", left: 1210, top: y, display: "flex", alignItems: "center", gap: 20, opacity: clamp01(p) }}>
      <Tag w={240} color={C.blue}>{`"${k}"`}</Tag>
      <span style={{ width: 40, height: 2.5, background: C.text }} />
      <Tag w={110} color={flash > 0.1 ? C.red : C.text} glow={flash}>
        {String(v)}
      </Tag>
    </div>
  );
};

const FirstDict: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Перший словник">
      <Lead>Кожна перемога додає команді одне очко. Рахуємо очки за назвою команди.</Lead>
      <Blueprint x={96} y={280} w={1050} h={320} title="Креслення" tag="C++11" p={s(0, 14)}>
        <Code
          x={0}
          y={0}
          size={29}
          step={0}
          delay={24}
          stagger={6}
          style={{ position: "relative" }}
          code={`
            std::unordered_map<std::string, int> scores;
            [[1~50|++scores["Orion"];]]
            [[2~50|++scores["Vega"];]]
            [[3~50|++scores["Orion"];]]
            // Orion → 2, Vega → 1
          `}
        />
      </Blueprint>
      <Panel x={1180} y={280} w={644} h={320} title={<span style={{ fontFamily: F.mono, textTransform: "none" }}>scores</span>} color={C.blue} p={s(0, 20)} />
      <Cell k="Orion" ticks={[{ at: 1, d: 8, v: 0 }, { at: 1, d: 34, v: 1 }, { at: 3, d: 18, v: 2 }]} y={400} />
      <Cell k="Vega" ticks={[{ at: 2, d: 8, v: 0 }, { at: 2, d: 34, v: 1 }]} y={490} />
      <Bullet x={96} y={660} w={1728} step={4} delay={0}>
        Вираз <M>scores["Orion"]</M> створює запис із нулем, якщо такого ключа ще немає. Потім <M>++</M> додає одиницю.
      </Bullet>
      <Bullet x={96} y={760} w={1728} step={4} delay={12}>
        Щоб перевірити ключ без створення запису, використовуйте <M>find</M>, <M>count</M> або <M>contains</M>.
      </Bullet>
    </Slide>
  );
};

/* Every name of the same idea. */
type Term = { ua: string; en: string; where: string; c: string };
const TERMS: Term[] = [
  { ua: "Словник", en: "dictionary", where: "Python, C#, Swift, Smalltalk", c: C.red },
  { ua: "Асоціативний масив", en: "associative array", where: "PHP, AWK, Bash, D", c: C.blue },
  { ua: "Відображення", en: "map", where: "C++, Java, Go, Haskell; розмовне «мапа»", c: C.olive },
  { ua: "Асоціативний контейнер", en: "associative container", where: "так його називає стандарт C++", c: C.ochre },
  { ua: "Хеш-таблиця", en: "hash table, hash map", where: "назва за способом реалізації", c: C.slate },
  { ua: "Хеш", en: "hash", where: "Perl, Ruby", c: C.rust },
  { ua: "Таблиця символів", en: "symbol table", where: "компілятори, підручники з алгоритмів", c: C.teal },
  { ua: "Сховище ключ-значення", en: "key-value store", where: "Redis, DynamoDB, etcd", c: C.violet },
];

const Names: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Один задум, багато назв">
      <Lead>Пари «ключ → значення» трапляються під різними іменами. Усі вони означають словник.</Lead>
      {TERMS.map((tm, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const p = s(1 + row, col * 7, POP);
        return (
          <div
            key={tm.ua}
            style={{
              position: "absolute",
              left: 96 + col * 439,
              top: 290 + row * 320,
              width: 410,
              height: 290,
              boxSizing: "border-box",
              background: `linear-gradient(180deg, ${C.panel2}, ${C.panel})`,
              border: `1.5px solid ${C.line}`,
              borderTop: `6px solid ${tm.c}`,
              boxShadow: "3px 4px 0 rgba(70,50,20,0.13)",
              padding: "20px 24px",
              opacity: clamp01(p),
              transform: `translateY(${(1 - p) * 24}px)`,
            }}
          >
            <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 30, letterSpacing: 1, textTransform: "uppercase", color: tm.c, lineHeight: 1.15 }}>{tm.ua}</div>
            <div style={{ marginTop: 12, fontFamily: F.mono, fontWeight: 600, fontSize: 27, color: C.text }}>{tm.en}</div>
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 20, fontFamily: F.body, fontWeight: 700, fontSize: 28, lineHeight: 1.28, color: C.dim }}>{tm.where}</div>
          </div>
        );
      })}
    </Slide>
  );
};

/* What a dictionary is called in sixteen languages. */
const LANGS: [string, string][] = [
  ["C++", "map\nunordered_map"],
  ["Python", "dict"],
  ["Java", "Map, HashMap\nTreeMap"],
  ["C#", "Dictionary<K, V>"],
  ["JavaScript", "Map, Object"],
  ["TypeScript", "Record<K, V>\nMap"],
  ["Go", "map[K]V"],
  ["Rust", "HashMap\nBTreeMap"],
  ["Swift", "Dictionary"],
  ["Kotlin", "Map\nMutableMap"],
  ["Ruby", "Hash"],
  ["Perl", "%hash"],
  ["PHP", "array"],
  ["Lua", "table"],
  ["Haskell", "Data.Map"],
  ["Delphi", "TDictionary"],
];

const Languages: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Словник у різних мовах">
      <Lead>Кожна мова називає словник по-своєму, але задум скрізь той самий.</Lead>
      {LANGS.map(([lang, ty], i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const p = s(1, i * 4, POP);
        const cpp = i === 0;
        return (
          <div
            key={lang}
            style={{
              position: "absolute",
              left: 96 + col * 439,
              top: 280 + row * 160,
              width: 410,
              height: 140,
              boxSizing: "border-box",
              padding: "12px 22px",
              borderLeft: `6px solid ${cpp ? C.red : C.line}`,
              background: cpp ? `${C.red}10` : `${C.panel2}aa`,
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * -18}px)`,
            }}
          >
            <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 28, letterSpacing: 2, textTransform: "uppercase", color: cpp ? C.red : C.dim }}>{lang}</div>
            <div style={{ marginTop: 4, fontFamily: F.mono, fontWeight: 700, fontSize: 28, lineHeight: 1.25, color: C.blue, whiteSpace: "pre" }}>{ty}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const s1Slides: SlideDef[] = [
  { id: "array-vs-dict", title: "Масив і словник", steps: [40, 70, 70, 70], C: ArrayVsDict },
  { id: "first-dict", title: "Перший словник", steps: [60, 60, 60, 60, 40], C: FirstDict },
  { id: "names", title: "Назви словника", steps: [40, 50, 50], C: Names },
  { id: "languages", title: "Словник у мовах", steps: [40, 90], C: Languages },
];
