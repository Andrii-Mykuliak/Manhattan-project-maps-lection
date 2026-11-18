import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadSerif } from "@remotion/google-fonts/PTSerif";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";

const oswald = loadOswald("normal", { weights: ["500", "600", "700"], subsets: ["latin", "cyrillic"] });
const serif = loadSerif("normal", { weights: ["400", "700"], subsets: ["latin", "cyrillic"] });
loadSerif("italic", { weights: ["400", "700"], subsets: ["latin", "cyrillic"] });
const mono = loadMono("normal", { weights: ["500", "600", "700"], subsets: ["latin", "cyrillic"] });

/* Manhattan Project theme: aged report paper, typewriter labels, red classification stamps, blueprint sheets for code. */
export const F = {
  head: `${oswald.fontFamily}, Impact, sans-serif`,
  title: `${oswald.fontFamily}, Impact, sans-serif`,
  body: `${serif.fontFamily}, Georgia, serif`,
  mono: `${mono.fontFamily}, "Courier New", monospace`,
};

// IBM Plex Mono advance width is exactly 0.6em, used to place annotations under code columns.
export const CH = 0.6;

export const C = {
  bg: "#ebe2cb",
  bg2: "#e2d6b8",
  panel: "#f4eedd",
  panel2: "#f9f5ea",
  line: "#b4a585",
  grid: "#d3c5a2",
  text: "#1f1c17",
  dim: "#5b5245",
  faint: "#8e846f",
  accent: "#b0281f",
  accentHi: "#b0281f",
  red: "#b0281f",
  blue: "#1f4f7a",
  olive: "#56652a",
  ochre: "#9c6a12",
  slate: "#40596b",
  rust: "#8f4519",
  teal: "#1f6b66",
  violet: "#5b4a86",
  mint: "#56652a",
  amber: "#9c6a12",
  coral: "#b0281f",
};

/** Blueprint sheets: the code panels. */
export const BP = {
  bg: "#163a5f",
  bg2: "#1b4673",
  grid: "rgba(214,232,255,0.09)",
  edge: "rgba(226,238,255,0.55)",
  text: "#eef3fa",
  dim: "#a9c1dc",
  kw: "#ffd27a",
  type: "#94d7ff",
  str: "#ffb48c",
  num: "#a8e6c4",
  comment: "#8eaecd",
  op: "#b7cbe2",
  mark: "rgba(255,210,122,0.30)",
};

/** Section accents, in agenda order. */
export const ACCENTS = [C.red, C.blue, C.olive, C.ochre, C.slate];

export const FPS = 30;
export const W = 1920;
export const H = 1080;
