import React from "react";
import { useCurrentFrame } from "remotion";

// Escribe el texto letra a letra. Lo que falta por escribir se reserva con
// visibility: hidden para que el bloque no cambie de tamaño mientras se escribe.
export const Typewriter: React.FC<{
  text: string;
  start: number;
  framesPerChar?: number;
  cursorColor: string;
  // El cursor solo se muestra en la línea activa y, si keepCursor, al terminar.
  keepCursor?: boolean;
}> = ({ text, start, framesPerChar = 2, cursorColor, keepCursor = false }) => {
  const frame = useCurrentFrame();
  const chars = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - start) / framesPerChar)),
  );
  const typing = frame >= start && chars < text.length;
  const done = chars === text.length;
  const blinkOn = Math.floor(frame / 15) % 2 === 0;
  const showCursor = typing || (done && keepCursor && blinkOn);

  return (
    <span>
      {text.slice(0, chars)}
      <span
        style={{
          display: "inline-block",
          width: "0.08em",
          height: "0.9em",
          marginLeft: "0.04em",
          marginRight: "-0.12em",
          verticalAlign: "-0.08em",
          backgroundColor: cursorColor,
          opacity: showCursor ? 1 : 0,
        }}
      />
      <span style={{ visibility: "hidden" }}>{text.slice(chars)}</span>
    </span>
  );
};
