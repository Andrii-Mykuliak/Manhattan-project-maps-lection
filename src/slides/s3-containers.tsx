import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Blueprint, Bullet, clamp01, Lead, M, Panel, Slide } from "../deck/ui";

const Name: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, textTransform: "none", letterSpacing: 0 }}>{children}</span>
);

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.36, color: C.text, marginTop: 6 }}>{children}</div>
);

const RowHead: React.FC<{ y: number; title: string; sub: string; p: number }> = ({ y, title, sub, p }) => (
  <div style={{ position: "absolute", left: 96, top: y, width: 290, height: 270, display: "flex", flexDirection: "column", justifyContent: "center", opacity: clamp01(p) }}>
    <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 32, letterSpacing: 2, color: C.text }}>{title}</div>
    <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 27, color: C.dim, marginTop: 6 }}>{sub}</div>
  </div>
);

const Four: React.FC = () => {
  const { s } = useSteps();
  const hp = s(0, 14);
  const colHead = (x: number, text: string) => (
    <div style={{ position: "absolute", left: x, top: 284, width: 690, textAlign: "center", fontFamily: F.head, fontWeight: 600, fontSize: 28, letterSpacing: 3, color: C.dim, opacity: clamp01(hp), borderBottom: `3px solid ${C.text}`, paddingBottom: 6 }}>
      {text}
    </div>
  );
  return (
    <Slide title="Чотири словники">
      <Lead>Словники стандартної бібліотеки різняться двома ознаками: порядком ключів і повторами.</Lead>
      {colHead(410, "КЛЮЧІ УНІКАЛЬНІ")}
      {colHead(1134, "КЛЮЧ МОЖЕ ПОВТОРЮВАТИСЯ")}
      <RowHead y={350} title="БЕЗ ПОРЯДКУ" sub="хеш-таблиця" p={hp} />
      <RowHead y={640} title="ВІДСОРТОВАНІ" sub="за ключами" p={hp} />
      <Panel x={410} y={350} w={690} h={270} title={<Name>std::unordered_map</Name>} tag="<unordered_map>" color={C.red} p={s(1, 0, POP)}>
        <Body>Ключі унікальні, порядок обходу не гарантовано. Пошук у середньому за O(1).</Body>
      </Panel>
      <Panel x={410} y={640} w={690} h={270} title={<Name>std::map</Name>} tag="<map>" color={C.blue} p={s(2, 0, POP)}>
        <Body>
          Обхід у відсортованому порядку ключів, операції за O(log n). Є межі <M>lower_bound</M> і <M>upper_bound</M>.
        </Body>
      </Panel>
      <Panel x={1134} y={350} w={690} h={270} title={<Name>std::unordered_multimap</Name>} tag="<unordered_map>" color={C.ochre} p={s(3, 0, POP)}>
        <Body>Ключ може повторюватися, глобального сортування немає.</Body>
      </Panel>
      <Panel x={1134} y={640} w={690} h={270} title={<Name>std::multimap</Name>} tag="<map>" color={C.olive} p={s(3, 10, POP)}>
        <Body>Відсортований словник, де один ключ може мати кілька записів.</Body>
      </Panel>
      <At x={96} y={950} w={1728} step={4} size={30}>
        У <A>C++23</A> з’явилися ще <M>std::flat_map</M> і <M>std::flat_multimap</M> з <M>&lt;flat_map&gt;</M>: відсортовані ключі в суцільних масивах.
      </At>
    </Slide>
  );
};

/* Iterator as a bookmark: it walks the records in traversal order up to end(). */
const RECS: [string, number][] = [
  ["Orion", 2],
  ["Vega", 1],
  ["Lyra", 3],
  ["Altair", 5],
];
const RX = 96;
const RW = 270;
const RG = 40;
const RY = 370;
const WALK = 26;

const recX = (i: number) => RX + i * (RW + RG);

const Iterators: React.FC = () => {
  const { s, t } = useSteps();
  const walk = t(2, 10);
  const pos = walk < 0 ? 0 : Math.min(RECS.length, walk / WALK);
  const at = Math.round(pos);
  const atEnd = walk >= 0 && pos >= RECS.length - 0.01;
  const px = mix(recX(Math.floor(pos)), recX(Math.min(RECS.length, Math.floor(pos) + 1)), pos - Math.floor(pos)) + RW / 2;
  const shown = s(1, 10);
  const cur = RECS[Math.min(at, RECS.length - 1)];
  return (
    <Slide title="Ітератори: навіщо вони">
      <Lead>Ітератор схожий на закладку: вказує на один запис і вміє переходити до наступного.</Lead>
      {RECS.map(([k, v], i) => {
        const p = s(1, i * 5, POP);
        const on = Math.abs(pos - i) < 0.5 && shown > 0.5 && !atEnd;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: recX(i),
              top: RY,
              width: RW,
              height: 140,
              boxSizing: "border-box",
              border: `2.5px solid ${on ? C.red : C.text}`,
              background: on ? `${C.red}12` : C.panel2,
              boxShadow: "3px 4px 0 rgba(70,50,20,0.13)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 22px",
              gap: 8,
              fontFamily: F.mono,
              fontWeight: 700,
              opacity: clamp01(p),
              transform: `translateY(${(1 - p) * 20}px)`,
            }}
          >
            <span style={{ fontSize: 22, color: C.dim }}>first</span>
            <span style={{ fontSize: 30, color: C.blue, marginTop: -8 }}>"{k}"</span>
            <span style={{ fontSize: 22, color: C.dim }}>
              second <span style={{ fontSize: 30, color: C.text }}>{v}</span>
            </span>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: recX(4),
          top: RY,
          width: RW,
          height: 140,
          boxSizing: "border-box",
          border: `2.5px dashed ${atEnd ? C.red : C.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: F.body,
          fontWeight: 700,
          fontSize: 26,
          lineHeight: 1.25,
          color: atEnd ? C.red : C.faint,
          opacity: clamp01(s(1, 26)),
        }}
      >
        після останнього запису
      </div>
      <div style={{ position: "absolute", left: recX(0), top: RY + 152, width: RW, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.dim, opacity: clamp01(s(1, 20)) }}>
        m.begin()
      </div>
      <div style={{ position: "absolute", left: recX(4), top: RY + 152, width: RW, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.dim, opacity: clamp01(s(1, 26)) }}>
        m.end()
      </div>
      <div style={{ position: "absolute", left: px - 60, top: RY - 92, width: 120, textAlign: "center", opacity: clamp01(shown) }}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 32, color: C.red }}>it</div>
        <svg width={120} height={40} style={{ display: "block" }}>
          <line x1={60} y1={0} x2={60} y2={28} stroke={C.red} strokeWidth={4} />
          <polygon points="48,24 72,24 60,38" fill={C.red} />
        </svg>
      </div>
      {walk >= 0 && walk < WALK * RECS.length && (
        <div style={{ position: "absolute", left: px + 50, top: RY - 80, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.red }}>it++</div>
      )}
      <div style={{ position: "absolute", left: 96, top: 590, fontFamily: F.mono, fontWeight: 700, fontSize: 30, lineHeight: 1.5, opacity: clamp01(shown) }}>
        {atEnd ? (
          <span style={{ color: C.red }}>it == m.end(): запис уже не читаємо, обхід завершено</span>
        ) : (
          <>
            <div>
              it-&gt;first <span style={{ color: C.dim }}>→</span> <span style={{ color: C.blue }}>"{cur[0]}"</span>
              <span style={{ display: "inline-block", width: 70 }} />
              it-&gt;second <span style={{ color: C.dim }}>→</span> <span style={{ color: C.text }}>{cur[1]}</span>
            </div>
          </>
        )}
      </div>
      <Bullet x={96} y={665} w={1728} step={3} size={31}>
        Один спосіб обходу для будь-якого контейнера: <M>vector</M>, <M>map</M> чи <M>unordered_map</M> обходять від <M>begin()</M> до <M>end()</M>.
      </Bullet>
      <Bullet x={96} y={765} w={1728} step={3} delay={12} size={31}>
        <M>find</M> повертає ітератор, тому знайдений запис можна прочитати, змінити чи видалити <A>без повторного пошуку</A>.
      </Bullet>
      <Bullet x={96} y={895} w={1728} step={3} delay={24} size={31}>
        Ітератори приймають <M>erase</M>, <M>extract</M>, <M>emplace_hint</M> і всі алгоритми стандартної бібліотеки.
      </Bullet>
    </Slide>
  );
};

const Text: React.FC<{ children: React.ReactNode; mt?: number; size?: number }> = ({ children, mt = 0, size = 30 }) => (
  <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: size, lineHeight: 1.36, color: C.text, marginTop: mt }}>{children}</div>
);

const Mono: React.FC<{ children: React.ReactNode; c?: string; size?: number }> = ({ children, c = C.blue, size = 30 }) => (
  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: size, color: c, whiteSpace: "pre" }}>{children}</span>
);

/* A whole dictionary in one short program: create, add, iterate, print. */
const Example: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Словник від початку до кінця">
      <Blueprint x={96} y={186} w={1270} h={540} title="Приклад" p={s(0, 10)}>
        <Code
          x={0}
          y={0}
          size={28}
          step={1}
          delay={6}
          stagger={8}
          style={{ position: "relative" }}
          code={`
            @1 // створення
            @1 std::unordered_map<std::string, int> stock;
            @2 // додавання
            @2 stock["apple"] = 3;
            @2 stock.insert({"pear", 5});
            @3 // ітерування
            @3 for (std::unordered_map<std::string, int>::iterator it = stock.begin();
            @3      it != stock.end(); it++) {
            @4     // виведення
            @4     std::cout << [[4@20|it->first]] << ": " << [[4@20|it->second]] << '\\n';
            @3 }
          `}
        />
      </Blueprint>
      <Panel x={1400} y={186} w={424} h={300} title="Консоль" color={C.slate} p={s(4, 30)}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, lineHeight: 1.5, marginTop: 10 }}>
          <div style={{ opacity: clamp01(s(4, 44)) }}>pear: 5</div>
          <div style={{ opacity: clamp01(s(4, 54)) }}>apple: 3</div>
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 24, color: C.dim, marginTop: 10, opacity: clamp01(s(4, 64)) }}>порядок рядків може бути іншим</div>
      </Panel>
      <Bullet x={96} y={760} w={1728} step={3} delay={30} size={30}>
        Тип <M>std::unordered_map&lt;std::string, int&gt;::iterator</M> читається як «ітератор саме цього словника».
      </Bullet>
      <Bullet x={96} y={850} w={1728} step={3} delay={42} size={30}>
        <M>it</M> пробігає записи від <M>stock.begin()</M> до <M>stock.end()</M>, а <M>it++</M> переходить до наступного.
      </Bullet>
      <Bullet x={96} y={940} w={1728} step={4} delay={70} size={30}>
        Що таке ітератор і чому тут стрілка <M>-&gt;</M>, розберемо далі.
      </Bullet>
    </Slide>
  );
};

/* The dot and the arrow. */
const DotArrow: React.FC = () => {
  const { s } = useSteps();
  const rec = s(2, 30, POP);
  return (
    <Slide title="Крапка і стрілка">
      <Lead>У коді з ітераторами трапляються і крапка, і стрілка. Різниця в тому, що стоїть ліворуч.</Lead>
      <Panel x={96} y={290} w={820} h={520} title="Крапка ." color={C.olive} p={s(1, 0)}>
        <Text mt={4} size={30}>Ліворуч сам об’єкт: словник stock, який ми створили.</Text>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            ["stock.size()", "кількість записів"],
            ["stock.begin()", "ітератор на перший запис"],
            ['stock.find("pear")', "ітератор на запис pear"],
          ].map(([code, note], i) => (
            <div key={code} style={{ opacity: clamp01(s(1, 14 + i * 8)) }}>
              <Mono>{code}</Mono>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 27, color: C.dim }}>{note}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel x={956} y={290} w={868} h={520} title="Стрілка ->" color={C.red} p={s(2, 0)}>
        <Text mt={4} size={30}>Ліворуч ітератор: він не є записом, а лише вказує на нього.</Text>
        <div style={{ marginTop: 26 }}>
          <Mono c={C.red}>it-&gt;second</Mono>
          <Mono c={C.dim}>{"  це скорочення  "}</Mono>
          <Mono c={C.text}>(*it).second</Mono>
        </div>
        <Text mt={130} size={28}>
          <span style={{ color: C.dim }}>Спершу *it дає сам запис, потім .second бере з нього значення.</span>
        </Text>
      </Panel>
      <div style={{ position: "absolute", left: 990, top: 560, display: "flex", alignItems: "center", gap: 18, opacity: clamp01(rec) }}>
        <div style={{ padding: "6px 18px", border: `2.5px solid ${C.red}`, fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.red }}>it</div>
        <svg width={70} height={20}>
          <line x1={0} y1={10} x2={56} y2={10} stroke={C.red} strokeWidth={3.5} />
          <polygon points="52,2 68,10 52,18" fill={C.red} />
        </svg>
        <div style={{ display: "flex", border: `2.5px solid ${C.text}`, background: C.panel2, fontFamily: F.mono, fontWeight: 700, fontSize: 28 }}>
          <span style={{ padding: "6px 16px", borderRight: `2px solid ${C.line}` }}>
            <span style={{ color: C.dim }}>first </span>
            <span style={{ color: C.blue }}>"pear"</span>
          </span>
          <span style={{ padding: "6px 16px" }}>
            <span style={{ color: C.dim }}>second </span>
            <span style={{ color: C.text }}>5</span>
          </span>
        </div>
        <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.dim }}>*it</span>
      </div>
      <At x={96} y={860} w={1728} step={3} size={31}>
        Правило просте: після об’єкта ставимо <A c={C.olive}>крапку</A>, після ітератора <A>стрілку</A>.
      </At>
    </Slide>
  );
};

/* Find and change a value through the iterator. */
const FindChange: React.FC = () => {
  const { s, t } = useSteps();
  const bumped = t(1, 70) >= 0;
  return (
    <Slide title="Ітератори: знайти й змінити">
      <Blueprint x={96} y={186} w={1728} h={260} title="Приклад" p={s(1, 0)}>
        <Code
          x={0}
          y={0}
          size={29}
          step={1}
          delay={10}
          stagger={8}
          style={{ position: "relative" }}
          code={`
            std::unordered_map<std::string, int>::iterator it = [[1@40|stock.find("pear")]];
            if (it != stock.end()) {
                [[1@60|it->second]] += 10;
            }
          `}
        />
      </Blueprint>
      <Panel x={1300} y={490} w={524} h={300} title={<span style={{ fontFamily: F.mono, textTransform: "none" }}>stock</span>} color={C.blue} p={s(1, 20)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 14 }}>
          {[
            ["apple", 3],
            ["pear", bumped ? 15 : 5],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: F.mono, fontWeight: 700, fontSize: 30 }}>
              <span style={{ width: 200, padding: "4px 14px", border: `2px solid ${C.blue}`, color: C.blue, textAlign: "center" }}>"{k}"</span>
              <span style={{ width: 30, height: 2.5, background: C.text }} />
              <span style={{ width: 90, padding: "4px 0", border: `2px solid ${k === "pear" && bumped ? C.red : C.text}`, color: k === "pear" && bumped ? C.red : C.text, textAlign: "center" }}>{v}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Bullet x={96} y={500} w={1150} step={2} size={31}>
        <M>find</M> повертає ітератор на запис або <M>stock.end()</M>, якщо ключа немає.
      </Bullet>
      <Bullet x={96} y={630} w={1150} step={2} delay={12} size={31}>
        Значення змінюємо через <M>it-&gt;second</M>, а ключ <M>it-&gt;first</M> лише для читання.
      </Bullet>
      <Bullet x={96} y={760} w={1150} step={2} delay={24} size={31}>
        Перед <M>it-&gt;first</M> чи <M>it-&gt;second</M> завжди перевіряйте <M>it != stock.end()</M>.
      </Bullet>
    </Slide>
  );
};

/* Erase while traversing. */
const EraseLoop: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Ітератори: видалити під час обходу">
      <Blueprint x={96} y={186} w={1728} h={420} title="Прибрати нульові залишки" p={s(1, 0)}>
        <Code
          x={0}
          y={0}
          size={29}
          step={1}
          delay={10}
          stagger={6}
          style={{ position: "relative" }}
          code={`
            std::unordered_map<std::string, int>::iterator it = stock.begin();
            while (it != stock.end()) {
                if (it->second == 0) {
                    it = [[2|stock.erase(it)]];
                } else {
                    [[2@20|it++]];
                }
            }
          `}
        />
      </Blueprint>
      <Bullet x={96} y={650} w={1728} step={2} delay={30} size={31}>
        <M>erase(it)</M> робить <M>it</M> недійсним, тому продовжуємо з ітератора, який повертає <M>erase</M>.
      </Bullet>
      <Bullet x={96} y={750} w={1728} step={2} delay={42} size={31}>
        Тому <M>it++</M> робимо лише тоді, коли запис залишився у словнику.
      </Bullet>
      <Bullet x={96} y={850} w={1728} step={3} size={31}>
        Перебудова таблиці (rehash) робить недійсними <A>всі</A> ітератори, а вставка може її спричинити.
      </Bullet>
    </Slide>
  );
};

export const s3Slides: SlideDef[] = [
  { id: "four", title: "Чотири словники", steps: [40, 50, 50, 60, 50], C: Four },
  { id: "example", title: "Словник від початку до кінця", steps: [30, 40, 50, 70, 100], C: Example },
  { id: "iterators", title: "Ітератори: навіщо", steps: [50, 50, 150, 60], C: Iterators },
  { id: "dot-arrow", title: "Крапка і стрілка", steps: [40, 50, 70, 40], C: DotArrow },
  { id: "find-change", title: "Ітератори: знайти й змінити", steps: [30, 100, 60], C: FindChange },
  { id: "erase-loop", title: "Ітератори: видалити під час обходу", steps: [30, 70, 70, 40], C: EraseLoop },
];
