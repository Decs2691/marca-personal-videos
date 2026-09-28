import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, colors } from "../theme";
import { ProfilePanel } from "./reel02/ProfilePanel";
import { Subtitles } from "./reel02/Subtitles";
import { DURATION_S, HOOK_END, at } from "./reel02/timing";

export const REEL02_DURATION = Math.round(DURATION_S * FPS);

const SRC = staticFile("reel02/bio-original.mp4");

// La toma horizontal viene dentro de un cuadro vertical 1440×2560, en la
// franja y = 875…1684 (16:9). Se escala para llenar la mitad inferior
// (1080×960) y se recorta a los lados, centrada en la persona.
const BAND_TOP = 875 / 2560;
const BAND_H = 810 / 2560;
const SPLIT_Y = 960;
const scale = 960 / (1920 * BAND_H);
const videoW = 1080 * scale;
const videoH = 1920 * scale;

const SplitVideo: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: SPLIT_Y, width: 1080, height: 960, overflow: "hidden" }}>
    <OffthreadVideo
      src={SRC}
      startFrom={HOOK_END}
      style={{
        position: "absolute",
        width: videoW,
        height: videoH,
        left: (1080 - videoW) / 2,
        top: -videoH * BAND_TOP,
      }}
    />
  </div>
);

// Punch-in en el giro del gancho ("y no es por lo que crees"): acercamiento
// rápido y seco centrado en la cara. La toma es 1440×2560, así que hasta ~1.33×
// no pierde nitidez.
const PUNCH_AT = at("y", 2.2);
const PUNCH_SCALE = 1.18;
const FACE_ORIGIN = "50% 46%";

const HookVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [PUNCH_AT - 1, PUNCH_AT + 3], [1, PUNCH_SCALE], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={SRC}
        style={{ width: 1080, height: 1920, transform: `scale(${zoom})`, transformOrigin: FACE_ORIGIN }}
      />
    </AbsoluteFill>
  );
};

export const Reel02Bio: React.FC = () => {
  const frame = useCurrentFrame();
  const hook = frame < HOOK_END;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence durationInFrames={HOOK_END} layout="none">
        <HookVideo />
      </Sequence>
      <Sequence from={HOOK_END} layout="none">
        <SplitVideo />
      </Sequence>
      {/* El panel y los subtítulos usan el frame global (tiempos del guion). */}
      {!hook && <ProfilePanel />}
      <Subtitles mode={hook ? "hook" : "split"} />
    </AbsoluteFill>
  );
};
