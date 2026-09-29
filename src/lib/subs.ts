import { FPS } from "../theme";

// Tiempos de un reel a partir de su *-subs.json (tools/build_subs_*.py).
export type SubWord = { w: string; t: number };
export type SubLine = { text: string; start: number; end: number; words: SubWord[] };
type SubsJson = { lines: { text: string; start: number; end: number }[]; words: SubWord[] };

const clean = (w: string) => w.replace(/[.,:;—…?!¿¡]/g, "").toLowerCase();

export const makeTiming = (subs: SubsJson) => {
  let k = 0;
  const lines: SubLine[] = subs.lines.map((l) => {
    const n = l.text.split(" ").length;
    const words = subs.words.slice(k, k + n);
    k += n;
    return { ...l, words };
  });
  // Frame en que se dice `word`, buscando desde `after` segundos.
  const at = (word: string, after = 0): number => {
    const hit = subs.words.find((w) => w.t >= after - 0.01 && clean(w.w) === word.toLowerCase());
    if (!hit) throw new Error(`Palabra no encontrada: ${word} (desde ${after}s)`);
    return Math.round(hit.t * FPS);
  };
  return { lines, at };
};
