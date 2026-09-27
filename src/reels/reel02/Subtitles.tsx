import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FPS, fonts } from "../../theme";
import { lines } from "./timing";

// Blanco con palabras clave en amarillo sobrio; contorno negro fino para que
// se lea igual sobre la pared clara, tu camiseta o la animación.
const SOFT_YELLOW = "#F3E2A0";
const KEYWORDS = new Set([
  "instagram", "clientes", "3", "bonus", "usuario", "claro", "foto", "cara",
  "marca", "bio", "preguntas", "destacadas", "contactarte", "dm", "whatsapp",
  "web", "segundos", "cambiar", "sígueme", "primero", "segundo", "tercero",
]);

export const Subtitles: React.FC<{ mode: "hook" | "split" }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const line = lines.find((l) => t >= l.start && t < l.end);
  if (!line) return null;

  const local = frame - Math.round(line.start * FPS);
  const pop = interpolate(local, [0, 4], [0.92, 1], {
    extrapolateRight: "clamp",
  });
  const hook = mode === "hook";

  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        right: 140,
        // Gancho: tercio superior del área segura, sobre tu cabeza.
        // Pantalla dividida: centrado justo en la línea de división (y = 960).
        top: hook ? 330 : 960,
        transform: `translateY(-50%) scale(${pop})`,
        textAlign: "center",
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: hook ? 86 : 64,
        lineHeight: 1.08,
        letterSpacing: "-0.01em",
        color: "#FFFFFF",
        WebkitTextStroke: `${hook ? 12 : 10}px #000`,
        paintOrder: "stroke fill",
        textShadow: "0 6px 18px rgba(0,0,0,0.35)",
      }}
    >
      {line.text.split(" ").map((w, i) => {
        const key = w.replace(/[.,:;—…?!]/g, "").toLowerCase();
        return (
          <React.Fragment key={i}>
            <span style={{ color: KEYWORDS.has(key) ? SOFT_YELLOW : undefined }}>
              {w}
            </span>{" "}
          </React.Fragment>
        );
      })}
    </div>
  );
};
