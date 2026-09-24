import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";

// Número que baja 3→0 dentro de la frase del hook. Cada tick "golpea"
// con una escala breve para marcar el ritmo sin usar zoom de cámara.
export const Countdown: React.FC<{ from: number; ticks: number }> = ({
  from,
  ticks,
}) => {
  const frame = useCurrentFrame();
  const index = Math.min(from, Math.floor(frame / ticks));
  const local = frame - index * ticks;
  const scale = interpolate(local, [0, 5], [1.18, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: fonts.serif,
        fontWeight: 600,
        color: index === from ? colors.orange : colors.teal,
        transform: `scale(${scale})`,
        transformOrigin: "50% 60%",
        minWidth: "0.7em",
        textAlign: "center",
      }}
    >
      {from - index}
    </span>
  );
};
