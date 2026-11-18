import React from "react";
import { interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Blueprint, Bullet, clamp01, M, Panel, Slide, Stamp, Std } from "../deck/ui";
import { Ledger, Legend, Source } from "./kit";

const Op: React.FC<{ children: React.ReactNode; v?: string }> = ({ children, v }) => (
  <span>
    <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: "0.93em", color: C.blue, whiteSpace: "pre-wrap" }}>{children}</span>
    {v && <Std v={v} color={C.red} />}
  </span>
);

const Bad: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.red }}>{children}</span>;
const Ok: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.olive }}>{children}</span>;

/* Access and lookup. */
const Access: React.FC = () => {
  const { t } = useSteps();
  return (
    <Slide title="Доступ і пошук">
      <Legend />
      <Ledger
        x={96}
        y={250}
        step={1}
        perRow={false}
        hl={t(2, 0) >= 0 ? [0] : []}
        cols={[
          { w: 470, head: "Операція" },
          { w: 560, head: "Повертає" },
          { w: 698, head: "Якщо ключа немає" },
        ]}
        rows={[
          [<Op>m[k]</Op>, "посилання на значення", <Bad>додає запис, для int це 0</Bad>],
          [<Op>m.at(k)</Op>, "посилання на значення", <Bad>кидає std::out_of_range</Bad>],
          [<Op>m.find(k)</Op>, "ітератор на запис", <Ok>повертає m.end()</Ok>],
          [<Op>m.count(k)</Op>, "0 або 1", <Ok>повертає 0</Ok>],
          [<Op v="C++20">m.contains(k)</Op>, "true або false", <Ok>повертає false</Ok>],
          [<Op>m.equal_range(k)</Op>, "пару ітераторів [first, second)", <Ok>порожній діапазон</Ok>],
        ]}
      />
      <At x={96} y={850} w={1728} step={2} delay={10} size={32}>
        Лише <M>m[k]</M> змінює словник. Він зручний для <M>++m[k]</M> і <M>m[k] = v</M>, але не для перевірки.
      </At>
      <Source />
    </Slide>
  );
};

/* Lookup without side effects. */
const Find: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Пошук без побічних ефектів">
      <Legend />
      <Blueprint x={96} y={250} w={1728} h={370} title="Креслення" p={s(1, 0)}>
        <Code
          x={0}
          y={0}
          size={30}
          step={1}
          delay={10}
          stagger={6}
          style={{ position: "relative" }}
          code={`
            std::unordered_map<std::string, int>::iterator it = m.find(k);
            if (it != m.end()) {
                std::cout << [[2|it->second]];
            } else {
                std::cout << 0;
            }
          `}
        />
      </Blueprint>
      <At x={96} y={640} w={1728} step={2} delay={10} size={31}>
        Якщо ключ є, друкуємо значення з запису; якщо немає, друкуємо 0 і словник не змінюється.
      </At>
      <Bullet x={96} y={750} w={1728} step={3}>
        Варіант <M>std::cout &lt;&lt; m[k];</M> теж надрукує 0, але непомітно <A>додасть k у словник</A>.
      </Bullet>
      <Bullet x={96} y={850} w={1728} step={3} delay={14}>
        Для перевірки наявності досить <M>m.contains(k)</M> (C++20) або <M>m.count(k)</M>.
      </Bullet>
      <Source />
    </Slide>
  );
};

/* Insert and update when the key already exists. */
const Insert: React.FC = () => {
  const { t } = useSteps();
  return (
    <Slide title="Вставка й оновлення">
      <At x={96} y={186} step={0} delay={8} size={27} weight={600} font={F.mono} color={C.dim}>
        перед кожним викликом: m["Orion"] == 2, k = "Orion", v = 7
      </At>
      <Ledger
        x={96}
        y={250}
        step={1}
        hl={t(4, 0) >= 0 ? [3] : []}
        rowH={88}
        cols={[
          { w: 700, head: "Операція" },
          { w: 700, head: "Якщо ключ уже є" },
          { w: 328, head: <span style={{ fontFamily: F.mono, textTransform: "none", letterSpacing: 0 }}>m["Orion"]</span>, align: "center" },
        ]}
        rows={[
          [<Op>{"m.insert({k, v})"}</Op>, "не переписує значення", <span style={{ fontFamily: F.mono }}>2</span>],
          [<Op>{"m.emplace(k, v)\nm.emplace_hint(pos, k, v)"}</Op>, "дубль не вставляється", <span style={{ fontFamily: F.mono }}>2</span>],
          [<Op v="C++17">m.try_emplace(k, v)</Op>, "значення навіть не створюється", <span style={{ fontFamily: F.mono }}>2</span>],
          [<Op v="C++17">m.insert_or_assign(k, v)</Op>, <Bad>замінює значення</Bad>, <span style={{ fontFamily: F.mono, color: C.red }}>7</span>],
          [<Op v="C++23">m.insert_range(r)</Op>, "не переписує наявні ключі", <span style={{ fontFamily: F.mono }}>2</span>],
        ]}
      />
      <At x={96} y={860} w={1728} step={6} size={30}>
        Одиночні <M>insert</M>, <M>emplace</M>, <M>try_emplace</M> і <M>insert_or_assign</M> повертають пару: ітератор на запис і <M>bool</M>, чи створено новий запис.
      </At>
      <Source />
    </Slide>
  );
};

/* Size and traversal. */
const SizeIter: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Розмір і обхід">
      <Legend />
      <Ledger
        x={96}
        y={250}
        step={1}
        perRow={false}
        size={28}
        cols={[
          { w: 430, head: "Операція" },
          { w: 590, head: "Що дає" },
        ]}
        rows={[
          [<Op>m.size()</Op>, "кількість записів"],
          [<Op>m.empty()</Op>, "чи словник порожній"],
          [<Op>m.max_size()</Op>, "теоретична межа, а не гарантія пам’яті"],
          [<Op>{"m.begin()\nm.end()"}</Op>, "початок обходу й позиція після останнього"],
          [<Op>{"m.cbegin()\nm.cend()"}</Op>, "ті самі межі, але лише для читання"],
        ]}
      />
      <At x={1170} y={270} w={654} step={1} delay={30} size={29}>
        Порядок обходу не гарантовано, тому не покладайтеся на нього у виведенні.
      </At>
      <At x={1170} y={430} w={654} step={3} size={29}>
        <M>end()</M> не розіменовують: це позиція <A>після</A> останнього елемента, а не сам елемент.
      </At>
      <Blueprint x={96} y={740} w={1728} h={240} title="Обхід" p={s(2, 0)}>
        <Code
          x={0}
          y={0}
          size={27}
          step={2}
          delay={10}
          stagger={6}
          style={{ position: "relative" }}
          code={`
            for (std::unordered_map<std::string, int>::iterator it = m.begin(); it != m.end(); ++it) {
                std::cout << it->first << ": " << it->second << '\\n';
            }
          `}
        />
      </Blueprint>
      <Source />
    </Slide>
  );
};

/* Erase, move nodes, swap. */
const Erase: React.FC = () => (
  <Slide title="Видалення, перенесення й обмін">
    <Legend />
    <Ledger
      x={96}
      y={250}
      step={1}
      perRow={false}
      size={28}
      rowH={86}
      cols={[
        { w: 640, head: "Операція" },
        { w: 1088, head: "Що робить" },
      ]}
      rows={[
        [<Op>m.erase(k)</Op>, "видаляє запис за ключем і повертає 0 або 1"],
        [<Op>{"m.erase(it)\nm.erase(first, last)"}</Op>, "видаляє елемент або діапазон і повертає наступний ітератор"],
        [<Op>{"m.clear()\nm.swap(other)"}</Op>, "видаляє всі записи; обмінює вміст двох сумісних контейнерів одного типу"],
        [<Op v="C++17">{"m.extract(k)\nm.extract(it)"}</Op>, "виймає запис як вузол; якщо ключа немає, повертає порожній вузол"],
        [<Op v="C++17">m.merge(other)</Op>, "переносить вузли з іншого словника; вузли з ключами, які вже є в m, лишаються в other"],
      ]}
    />
    <Source />
  </Slide>
);

/* Buckets, load factor and rehash, with a dial. */
const PLACE4 = [0, 1, 1, 3, 2];
const PLACE8 = [0, 5, 1, 3, 6];

const Dial: React.FC<{ v: number; p: number }> = ({ v, p }) => {
  const cx = 1630;
  const cy = 500;
  const r = 165;
  const ang = (x: number) => Math.PI - (Math.min(x, 1.5) / 1.5) * Math.PI;
  const pt = (x: number, rr: number) => [cx + rr * Math.cos(ang(x)), cy - rr * Math.sin(ang(x))];
  const [nx, ny] = pt(v, r - 26);
  const [t0x, t0y] = pt(1, r + 6);
  const [t1x, t1y] = pt(1.5, r + 6);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: clamp01(p) }}>
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill={C.panel2} stroke={C.text} strokeWidth={3} />
      <path d={`M ${t0x} ${t0y} A ${r + 6} ${r + 6} 0 0 1 ${t1x} ${t1y}`} fill="none" stroke={C.red} strokeWidth={10} />
      {[0, 0.25, 0.5, 0.75, 1, 1.25, 1.5].map((x) => {
        const [ax, ay] = pt(x, r - 4);
        const [bx, by] = pt(x, r - (x % 0.5 === 0 ? 30 : 18));
        const [lx, ly] = pt(x, r - 56);
        return (
          <g key={x}>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke={C.text} strokeWidth={x % 0.5 === 0 ? 3 : 1.5} />
            {x % 0.5 === 0 && (
              <text x={lx} y={ly + 8} textAnchor="middle" fontFamily={F.mono} fontWeight={700} fontSize={24} fill={x === 1 ? C.red : C.dim}>
                {x.toFixed(1)}
              </text>
            )}
          </g>
        );
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={12} fill={C.red} />
    </svg>
  );
};

const Buckets: React.FC = () => {
  const { s, t } = useSteps();
  const tt = t(2, 0);
  const n = tt < 0 ? 0 : Math.min(5, Math.floor((tt - 6) / 18) + 1);
  const re = tt >= 104 ? clamp01(s(2, 104)) : 0;
  const nb = re > 0.5 ? 8 : 4;
  const target = n / nb;
  const prev = n > 0 ? (n - 1) / 4 : 0;
  const v = re > 0 ? mix(5 / 4, 5 / 8, re) : mix(prev, target, clamp01(interpolate(tt - 6 - (n - 1) * 18, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const cellW = 50;
  const rowX = 1630 - (nb * cellW) / 2;
  return (
    <Slide title="Групи хеш-таблиці">
      <Legend />
      <Ledger
        x={96}
        y={250}
        step={1}
        perRow={false}
        size={27}
        rowH={68}
        cols={[
          { w: 600, head: "Операція" },
          { w: 720, head: "Що дає" },
        ]}
        rows={[
          [<Op>{"bucket_count()\nmax_bucket_count()"}</Op>, "поточна й максимальна кількість груп"],
          [<Op>{"bucket(k)\nbucket_size(i)"}</Op>, "номер групи для k; кількість записів у групі i"],
          [<Op>begin(i), end(i), cbegin(i), cend(i)</Op>, "обхід лише групи i"],
          [<Op>load_factor()</Op>, "середня кількість записів на групу"],
          [<Op>{"max_load_factor()\nmax_load_factor(x)"}</Op>, "прочитати або задати поріг завантаження"],
          [<Op>rehash(b), reserve(n)</Op>, "перебудувати на ≥ b груп; підготувати місце для n записів"],
          [<Op>hash_function(), key_eq()</Op>, "об’єкт хешування й предикат рівності ключів"],
        ]}
      />
      <Dial v={v} p={s(2, 0)} />
      <div style={{ position: "absolute", left: 1430, top: 530, width: 400, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 25, color: C.text, opacity: clamp01(s(2, 0)) }}>
        load_factor = {n} / {nb} = <span style={{ color: v > 1 ? C.red : C.text }}>{(n / nb).toFixed(2).replace(/0$/, "")}</span>
      </div>
      {Array.from({ length: nb }, (_, b) => {
        const keys = PLACE4.slice(0, n).map((q, i) => (nb === 8 ? PLACE8[i] : q)).filter((q) => q === b).length;
        return (
          <div
            key={`${nb}-${b}`}
            style={{
              position: "absolute",
              left: rowX + b * cellW,
              top: 600,
              width: cellW - 8,
              height: 60,
              border: `2.5px solid ${C.text}`,
              background: C.panel2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              opacity: clamp01(s(2, 0)),
            }}
          >
            {Array.from({ length: keys }, (_, k) => (
              <span key={k} style={{ width: 12, height: 12, borderRadius: 6, background: C.blue }} />
            ))}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1460, top: 700 }}>
        <Stamp p={s(2, 92, { damping: 14, stiffness: 260 })} size={34} rotate={-5} upper={false} double={false}>
          rehash: 4 → 8 груп
        </Stamp>
      </div>
      <Bullet x={96} y={880} w={1728} step={3} size={30}>
        Після перебудови старі ітератори <A>недійсні</A>, а вставка може її спричинити. Для старту досить <M>reserve(n)</M>, якщо ключів буде багато.
      </Bullet>
      <Source />
    </Slide>
  );
};

export const s4Slides: SlideDef[] = [
  { id: "access", title: "Доступ і пошук", steps: [40, 70, 50], C: Access },
  { id: "find", title: "Пошук без побічних ефектів", steps: [40, 60, 60, 50], C: Find },
  { id: "insert", title: "Вставка й оновлення", steps: [40, 30, 30, 30, 40, 30, 40], C: Insert },
  { id: "size", title: "Розмір і обхід", steps: [40, 60, 70, 40], C: SizeIter },
  { id: "erase", title: "Видалення", steps: [40, 70], C: Erase },
  { id: "buckets", title: "Групи хеш-таблиці", steps: [40, 70, 150, 50], C: Buckets },
];
