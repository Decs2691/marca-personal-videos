import subs from "../reel02-subs.json";
import { FPS } from "../../theme";

export type SubWord = { w: string; t: number };
export type SubLine = { text: string; start: number; end: number; words: SubWord[] };

// Cada línea con los tiempos de sus palabras (las palabras van en orden).
export const lines: SubLine[] = (() => {
  let k = 0;
  return subs.lines.map((l) => {
    const n = l.text.split(" ").length;
    const words = subs.words.slice(k, k + n);
    k += n;
    return { ...l, words };
  });
})();

// Momento (en frames) en que se dice `word`, buscando desde `after` segundos.
// Los tiempos vienen de tools/align.py; si una animación va desfasada,
// se corrige en reel02-subs.json y todo se mueve con ella.
export const at = (word: string, after = 0): number => {
  const hit = subs.words.find(
    (w) =>
      w.t >= after - 0.01 &&
      w.w.replace(/[.,:;—…?!¿¡]/g, "").toLowerCase() === word.toLowerCase(),
  );
  if (!hit) throw new Error(`Palabra no encontrada en el guion: ${word}`);
  return Math.round(hit.t * FPS);
};

export const DURATION_S = 50.92;
export const HOOK_END = Math.round(3.3 * FPS); // corte de vertical a horizontal
