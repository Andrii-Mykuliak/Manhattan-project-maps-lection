import React from "react";
import { ACCENTS, C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Blueprint, Bullet, clamp01, Lead, M, Num, Panel, Slide, Stamp } from "../deck/ui";
import { Tag } from "./kit";

const Text: React.FC<{ children: React.ReactNode; mt?: number; size?: number; color?: string }> = ({ children, mt = 0, size = 30, color = C.text }) => (
  <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: size, lineHeight: 1.38, color, marginTop: mt }}>{children}</div>
);

/* The task. */
const Task: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Що є на складі?">
      <Lead>
        Легкий рівень, 12 хвилин. Достатньо <M>unordered_map</M>, двох циклів і <M>find</M>.
      </Lead>
      <Panel x={96} y={270} w={1100} h={690} title="Умова" color={C.red} p={s(1, 0)}>
        <Text mt={6}>
          Дано n назв товарів, по одній на кожну одиницю товару. Назви можуть повторюватися. Потім дано q запитів.
        </Text>
        <Text mt={14}>
          Для кожної назви із запиту виведіть кількість одиниць цього товару або 0, якщо його немає. <A>Запити не змінюють запаси.</A>
        </Text>
        <div style={{ height: 2, background: C.line, margin: "22px 0 16px" }} />
        <Text size={28} color={C.dim}>
          Вхід: n, далі n назв, потім q і q назв. Вихід: q чисел, кожне з нового рядка.
        </Text>
        <Text size={28} color={C.dim} mt={10}>
          1 ≤ n, q ≤ 100 000; назва має від 1 до 20 малих латинських літер.
        </Text>
      </Panel>
      <Panel x={1236} y={270} w={588} h={690} title="Приклад" color={C.slate} p={s(2, 0)}>
        <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: C.dim, marginTop: 6 }}>ВХІД</div>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 28, lineHeight: 1.45, color: C.text, whiteSpace: "pre", marginTop: 4 }}>
          {"5\napple pear apple plum pear\n3\npear banana apple"}
        </div>
        <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: C.dim, marginTop: 26 }}>ВИХІД</div>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 28, lineHeight: 1.45, color: C.red, whiteSpace: "pre", marginTop: 4 }}>{"2\n0\n2"}</div>
      </Panel>
      <div style={{ position: "absolute", left: 1500, top: 800 }}>
        <Stamp p={s(2, 30, { damping: 14, stiffness: 260 })} size={34} rotate={-8}>
          Легкий рівень
        </Stamp>
      </div>
    </Slide>
  );
};

/* Hint: build the stock with stock[name]++, answer queries with find; the trap of stock["banana"]. */
const INPUT = ["apple", "pear", "apple", "plum", "pear"];
const ROWS = ["apple", "pear", "plum"];
const QUERIES: [string, number][] = [
  ["pear", 2],
  ["banana", 0],
  ["apple", 2],
];

const Hint: React.FC = () => {
  const { s, t } = useSteps();
  const read = t(1, 0);
  const done = (i: number) => read >= 14 + i * 18;
  const count = (w: string) => INPUT.filter((x, i) => x === w && done(i)).length;
  const firstAt = (w: string) => INPUT.indexOf(w);
  const ghost = s(4, 10);
  return (
    <Slide title="Підказка">
      <Lead>
        Під час читання товарів рахуйте <M>stock[name]++</M>, а запити перевіряйте через <M>find</M>.
      </Lead>
      {INPUT.map((w, i) => {
        const tt = read - 4 - i * 18;
        const p = s(0, 20 + i * 4, POP);
        const used = tt >= 10;
        return (
          <div key={i} style={{ position: "absolute", left: 96 + i * 158, top: 270, opacity: clamp01(p) * (used ? 0.35 : 1) }}>
            <Tag w={146} size={26} color={used ? C.faint : C.slate}>
              {w}
            </Tag>
          </div>
        );
      })}
      <Panel x={96} y={370} w={800} h={430} title={<span style={{ fontFamily: F.mono, textTransform: "none" }}>stock</span>} color={C.blue} p={s(1, 0)} />
      {ROWS.map((w, j) => {
        const c = count(w);
        if (!done(firstAt(w))) {
          return null;
        }
        return (
          <div key={w} style={{ position: "absolute", left: 140, top: 460 + j * 80, display: "flex", alignItems: "center", gap: 20 }}>
            <Tag w={240} color={C.blue}>{`"${w}"`}</Tag>
            <span style={{ width: 40, height: 2.5, background: C.text }} />
            <Tag w={100} color={C.text}>
              {String(c)}
            </Tag>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 140, top: 700, display: "flex", alignItems: "center", gap: 20, opacity: clamp01(ghost) }}>
        <Tag w={240} color={C.red} style={{ borderStyle: "dashed" }}>
          "banana"
        </Tag>
        <span style={{ width: 40, height: 2.5, background: C.red }} />
        <Tag w={100} color={C.red} style={{ borderStyle: "dashed" }}>
          0
        </Tag>
      </div>
      <div style={{ position: "absolute", left: 560, top: 690 }}>
        <Stamp p={s(4, 30, { damping: 14, stiffness: 260 })} size={30} rotate={-6} double={false}>
          Зайвий запис
        </Stamp>
      </div>

      <Panel x={950} y={270} w={874} h={360} title="Запити" color={C.olive} p={s(2, 0)} />
      {QUERIES.map(([q, v], i) => {
        const p = s(2, 10 + i * 20, POP);
        const miss = v === 0;
        return (
          <div key={q} style={{ position: "absolute", left: 990, top: 350 + i * 82, display: "flex", alignItems: "center", gap: 18, opacity: clamp01(p) }}>
            <span style={{ width: 310, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.blue }}>find("{q}")</span>
            <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.dim, width: 120 }}>{miss ? "end()" : "→"}</span>
            <Tag w={90} color={miss ? C.red : C.olive} fill={miss}>
              {String(v)}
            </Tag>
          </div>
        );
      })}
      <Panel x={950} y={660} w={874} h={300} title="Питання" color={C.red} p={s(3, 0)}>
        <Text mt={4}>
          Чому <M>stock["banana"]</M> теж поверне 0, але змінить словник?
        </Text>
        <div style={{ opacity: clamp01(s(4, 30)) }}>
          <Text mt={14} size={28} color={C.dim}>
            Оператор <M>[]</M> додасть <M>"banana"</M> зі значенням 0, хоча запити не мали змінювати запаси.
          </Text>
        </div>
      </Panel>
      <Arrow x1={950} y1={850} x2={760} y2={760} step={4} delay={20} color={C.red} curve={30} />
    </Slide>
  );
};

/* Reference solution, part 1: reading the stock. */
const SolutionRead: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Розв’язок: читаємо склад">
      <Blueprint x={96} y={186} w={1040} h={790} title="Аркуш 1" p={s(0, 10)}>
        <Code
          x={0}
          y={0}
          size={29}
          step={0}
          delay={16}
          stagger={3}
          style={{ position: "relative" }}
          code={`
            #include <iostream>
            #include <string>
            #include <unordered_map>

            int main() {
                std::ios::sync_with_stdio(false);
                std::cin.tie(nullptr);
                int n, q;
                std::string name;
                std::unordered_map<std::string, int> stock;

                std::cin >> n;
                for (int i = 0; i < n; i++) {
                    std::cin >> name;
                    [[1|stock[name]]]++;
                }
          `}
        />
      </Blueprint>
      <Bullet x={1176} y={240} w={648} step={1} delay={10} size={30}>
        Для кожної одиниці товару збільшуємо лічильник у словнику.
      </Bullet>
      <Bullet x={1176} y={420} w={648} step={1} delay={22} size={30}>
        Нової назви ще немає, тож <M>stock[name]</M> створює її з нулем, а <M>++</M> робить 1.
      </Bullet>
      <Bullet x={1176} y={650} w={648} step={2} size={30}>
        Перші два рядки <M>main</M> лише пришвидшують введення й виведення.
      </Bullet>
    </Slide>
  );
};

/* Reference solution, part 2: answering the queries. */
const SolutionQuery: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Розв’язок: відповідаємо на запити">
      <Blueprint x={96} y={186} w={1728} h={560} title="Аркуш 2" p={s(0, 10)}>
        <Code
          x={0}
          y={0}
          size={29}
          step={0}
          delay={16}
          stagger={4}
          style={{ position: "relative" }}
          code={`
                std::cin >> q;
                for (int i = 0; i < q; i++) {
                    std::cin >> name;
                    std::unordered_map<std::string, int>::iterator it = [[1|stock.find(name)]];
                    if (it == stock.end()) {
                        std::cout << 0 << '\\n';
                    } else {
                        std::cout << it->second << '\\n';
                    }
                }
            }
          `}
        />
      </Blueprint>
      <At x={96} y={770} w={1728} step={1} delay={20} size={30}>
        <M>find</M> не змінює словник, тому запити не додають до складу зайвих товарів.
      </At>
      <div style={{ position: "absolute", left: 110, top: 862 }}>
        <Stamp p={s(2, 0, { damping: 14, stiffness: 260 })} size={40} rotate={-4} upper={false} double={false}>
          O(n + q)
        </Stamp>
      </div>
      <At x={390} y={866} w={1434} step={2} delay={14} size={30}>
        часу в середньому, якщо назви мають обмежену довжину
      </At>
      <At x={96} y={960} w={1728} step={2} delay={24} size={30}>
        Пам’ять <M>O(u)</M>, де u означає кількість різних товарів.
      </At>
    </Slide>
  );
};

const SUMMARY: React.ReactNode[] = [
  <>Словник зберігає пари «ключ → значення» і шукає значення за ключем, а не за номером.</>,
  <>
    <M>std::unordered_map</M> знаходить, додає й видаляє ключ у середньому за O(1), але не гарантує порядку обходу.
  </>,
  <>
    Ітератор із <M>find</M> вказує на запис, тому його можна прочитати, змінити чи видалити без повторного пошуку.
  </>,
  <>
    <M>m[k]</M> створює запис, якщо ключа немає, тому для перевірки без змін використовуйте <M>find</M>, <M>count</M> або <M>contains</M>.
  </>,
  <>
    Якщо очікуєте багато різних ключів, викличте <M>reserve(n)</M> і не тримайте старі ітератори після перебудови.
  </>,
];

const Summary: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Підсумки">
      {SUMMARY.map((line, i) => {
        const p = s(i + 1, 0, POP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 96,
              top: 210 + i * 154,
              width: 1728,
              display: "flex",
              alignItems: "center",
              gap: 34,
              opacity: clamp01(p),
              transform: `translateX(${(1 - p) * -30}px)`,
            }}
          >
            <Num n={i + 1} color={ACCENTS[i]} size={62} />
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 33, lineHeight: 1.35, color: C.text }}>{line}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const s5Slides: SlideDef[] = [
  { id: "task", title: "Умова", steps: [40, 50, 60], C: Task },
  { id: "hint", title: "Підказка", steps: [50, 110, 90, 40, 70], C: Hint },
  { id: "solution-read", title: "Розв’язок: склад", steps: [90, 60, 40], C: SolutionRead },
  { id: "solution-query", title: "Розв’язок: запити", steps: [80, 60, 60], C: SolutionQuery },
];

export const summarySlide: SlideDef = { id: "summary", title: "Підсумки", steps: [30, 40, 40, 40, 40, 40], C: Summary };
