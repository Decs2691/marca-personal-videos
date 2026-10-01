import subs from "../reel03v3-subs.json";
import tl from "../reel03v3-timeline.json";
import { makeTiming } from "../../lib/subs";
import { FPS } from "../../theme";

export const { lines, at } = makeTiming(subs);
const fr = (s: number) => Math.round(s * FPS);
// Tramos (frames): A video, B voz en off, C video, D CTA en voz en off.
export const SEG = {
  A: [0, fr(tl.A[1])],
  B: [fr(tl.B[0]), fr(tl.B[1])],
  C: [fr(tl.C[0]), fr(tl.C[1])],
  D: [fr(tl.D[0]), fr(tl.D[1])],
  cStartInEdit: fr(tl.cStartInEdit),
  duration: fr(tl.duration),
};
