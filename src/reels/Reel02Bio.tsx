import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, colors } from "../theme";
import { ProfilePanel } from "./reel02/ProfilePanel";
import { Subtitles } from "./reel02/Subtitles";
import { DURATION_S, HOOK_END } from "./reel02/timing";

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

export const Reel02Bio: React.FC = () => {
  const frame = useCurrentFrame();
  const hook = frame < HOOK_END;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence durationInFrames={HOOK_END} layout="none">
        <OffthreadVideo src={SRC} style={{ width: 1080, height: 1920 }} />
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
