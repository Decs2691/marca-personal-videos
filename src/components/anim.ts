import { interpolate, spring } from "remotion";
import { FPS } from "../theme";

// Entrada seca: sube 40px y aparece en ~8 frames, sin rebote.
export const enter = (frame: number, delay = 0) => {
  const p = spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping: 200, mass: 0.5 },
  });
  return {
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
  };
};

// Progreso lineal 0→1 entre dos frames, útil para barridos.
export const sweep = (frame: number, from: number, duration: number) =>
  interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
