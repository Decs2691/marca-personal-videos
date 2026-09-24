import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { SafeZoneOverlay } from "./components/SafeZoneOverlay";
import { REEL01_DURATION, Reel01Hooks } from "./reels/Reel01Hooks";
import { FPS, HEIGHT, WIDTH } from "./theme";

const WithSafeZones: React.FC = () => (
  <AbsoluteFill>
    <Reel01Hooks />
    <SafeZoneOverlay />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition
      id="Reel01Hooks"
      component={Reel01Hooks}
      durationInFrames={REEL01_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Vista de control: el reel con las zonas de UI de IG/TikTok en rojo. */}
    <Composition
      id="Reel01Hooks-ZonasUI"
      component={WithSafeZones}
      durationInFrames={REEL01_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
