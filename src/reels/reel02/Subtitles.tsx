import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FPS, fonts } from "../../theme";
import { lines } from "./timing";

// Combinación tipográfica: la frase en serif clásica (Cormorant Garamond) y la
// palabra clave en mayúsculas geométricas espaciadas (Montserrat), que entra
// justo cuando la dices. Blanco + amarillo sobrio, borde suave y sombra difusa.
const SOFT_YELLOW = "#F3E2A0";
// Orden = prioridad cuando una línea tiene varias candidatas.
const KEYWORDS = [
  "primero", "segundo", "tercero", "instagram", "clientes", "contenido", "estética",
  "usuario", "random", "foto", "clara", "logo", "empresa", "cara", "bio", "preguntas",
  "haces", "resultados", "ahora", "contratarte", "adivinarlo", "dm", "whatsapp", "web",
  "bonus", "destacadas", "testimonios", "claro", "perfil", "sirves", "después", "mal",
  "mejorar", "sígueme", "revisa", "aprovecha", "puntuales", "crees",
];
const clean = (w: string) => w.replace(/[.,:;—…?!¿¡]/g, "").toLowerCase();

export const Subtitles: React.FC<{ mode: "hook" | "split" }> = ({ mode }) => {
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
        // Gancho: tercio superior del área segura, sobre tu cabeza.
        // Pantalla dividida: centrado justo en la línea de división (y = 960).
        top: hook ? 330 : 960,
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
        // La clave aparece en el instante en que la pronuncias.
        const k = frame - Math.round(w.t * FPS);
        const p = interpolate(k, [-2, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const trailing = w.w.match(/[.,:;—…?!]+$/)?.[0] ?? "";
        const leading = w.w.match(/^[¿¡]+/)?.[0] ?? "";
        const word = w.w.slice(leading.length, w.w.length - trailing.length);
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: "inline-block",
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: serifSize * 0.74,
                letterSpacing: "0.16em",
                marginRight: "-0.16em",
                textTransform: "uppercase",
                color: SOFT_YELLOW,
                WebkitTextStroke: `${hook ? 5 : 4}px rgba(0,0,0,0.55)`,
                opacity: p,
                transform: `scale(${1.18 - 0.18 * p})`,
                verticalAlign: "0.06em",
              }}
            >
              {leading}
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
