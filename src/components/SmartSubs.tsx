import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FPS, fonts } from "../theme";
import type { SubLine } from "../lib/subs";

// Combinación tipográfica: la frase en serif clásica (Cormorant Garamond) y la
// palabra clave en mayúsculas espaciadas (Marvin), que se
// enciende justo cuando la dices. Blanco + amarillo sobrio, borde suave y sombra difusa.
const SOFT_YELLOW = "#F3E2A0";
const clean = (w: string) => w.replace(/[.,:;—…?!¿¡]/g, "").toLowerCase();

// Reutilizable en todos los reels: `keywords` en orden de prioridad (una por
// línea), `hookTop`/`splitTop` = centro vertical de los subtítulos en cada modo.
export const SmartSubs: React.FC<{
  lines: SubLine[];
  keywords: string[];
  mode: "hook" | "split";
  hookTop?: number;
  splitTop?: number;
}> = ({ lines, keywords: KEYWORDS, mode, hookTop = 330, splitTop = 960 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const line = lines.find((l) => t >= l.start && t < l.end);
  if (!line) return null;

  const hook = mode === "hook";
  const serifSize = hook ? 96 : 76;
  const local = frame - Math.round(line.start * FPS);
  const lineIn = interpolate(local, [0, 4], [0, 1], { extrapolateRight: "clamp" });

  const keys = line.words.map((w) => clean(w.w));
  const keyIndex = KEYWORDS.map((k) => keys.indexOf(k)).find((i) => i >= 0) ?? -1;

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        top: hook ? hookTop : splitTop,
        transform: `translateY(-50%) translateY(${(1 - lineIn) * 10}px)`,
        opacity: lineIn,
        textAlign: "center",
        // Los espacios entre palabras usan esta fuente/tamaño.
        fontFamily: fonts.classic,
        fontWeight: 700,
        fontSize: serifSize,
        wordSpacing: "0.04em",
        lineHeight: 1.05,
        color: "#FFFFFF",
        paintOrder: "stroke fill",
        // Borde fino y suave + sombra difusa: se lee sin verse "recortado".
        textShadow: "0 2px 6px rgba(0,0,0,0.45), 0 0 22px rgba(0,0,0,0.35)",
      }}
    >
      {line.words.map((w, i) => {
        const isKey = i === keyIndex;
        if (!isKey) {
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  fontFamily: fonts.classic,
                  fontWeight: 700,
                  fontSize: serifSize,
                  WebkitTextStroke: `${hook ? 5 : 4}px rgba(0,0,0,0.55)`,
                }}
              >
                {w.w}
              </span>{" "}
            </React.Fragment>
          );
        }
        // La clave está desde el inicio de la línea y se "enciende" (amarillo +
        // golpe) en el instante en que la pronuncias; así no quedan huecos.
        const k = frame - Math.round(w.t * FPS);
        const lit = k >= -1;
        const lift = interpolate(k, [-1, 2, 6], [0, -8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const trailing = w.w.match(/[.,:;—…?!]+$/)?.[0] ?? "";
        const leading = w.w.match(/^[¿¡]+/)?.[0] ?? "";
        const word = w.w.slice(leading.length, w.w.length - trailing.length);
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: "inline-block",
                fontFamily: fonts.display,
                fontWeight: 400,
                fontSize: serifSize * 0.74,
                letterSpacing: "0.16em",
                marginRight: "-0.16em",
                textTransform: "uppercase",
                color: lit ? SOFT_YELLOW : "#FFFFFF",
                WebkitTextStroke: `${hook ? 5 : 4}px rgba(0,0,0,0.55)`,
                transform: `translateY(${lift}px)`, // salto vertical: no invade los espacios
                verticalAlign: "0.06em",
              }}
            >
              {leading && (
                <span style={{ fontFamily: fonts.classic, fontWeight: 700, fontSize: serifSize / (serifSize * 0.74) + "em", letterSpacing: 0, color: "#FFFFFF" }}>
                  {leading}
                </span>
              )}
              {word}
              {trailing && (
                <span style={{ fontFamily: fonts.classic, fontWeight: 700, fontSize: serifSize / (serifSize * 0.74) + "em", letterSpacing: 0, color: "#FFFFFF" }}>
                  {trailing}
                </span>
              )}
            </span>{" "}
          </React.Fragment>
        );
      })}
    </div>
  );
};
