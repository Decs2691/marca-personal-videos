import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { SafeZoneOverlay } from "./components/SafeZoneOverlay";
import { REEL01_DURATION, Reel01Hooks } from "./reels/Reel01Hooks";
import { REEL02_DURATION, Reel02Bio } from "./reels/Reel02Bio";
import { FPS, HEIGHT, WIDTH } from "./theme";

const withSafeZones = (Reel: React.FC): React.FC => {
  const Wrapped: React.FC = () => (
    <AbsoluteFill>
      <Reel />
      <SafeZoneOverlay />
    </AbsoluteFill>
  );
  return Wrapped;
};

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
      component={withSafeZones(Reel01Hooks)}
      durationInFrames={REEL01_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="Reel02Bio"
      component={Reel02Bio}
      durationInFrames={REEL02_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="Reel02Bio-ZonasUI"
      component={withSafeZones(Reel02Bio)}
      durationInFrames={REEL02_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
