import type { SlideDef } from "../deck/steps";
import { agendaSlide, introSlides } from "./intro";
import { s1Slides } from "./s1-keys";
import { s2Slides } from "./s2-hash";
import { s3Slides } from "./s3-containers";
import { s4Slides } from "./s4-reference";
import { s5Slides, summarySlide } from "./s5-practice";
import { outroSlide } from "./outro";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  agendaSlide(0),
  ...s1Slides,
  agendaSlide(1),
  ...s2Slides,
  agendaSlide(2),
  ...s3Slides,
  agendaSlide(3),
  ...s4Slides,
  agendaSlide(4),
  ...s5Slides,
  summarySlide,
  outroSlide,
];
