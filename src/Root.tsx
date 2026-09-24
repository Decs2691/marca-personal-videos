import React from "react";
import { Composition } from "remotion";
import { REEL01_DURATION, Reel01Hooks } from "./reels/Reel01Hooks";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const Root: React.FC = () => (
  <Composition
    id="Reel01Hooks"
    component={Reel01Hooks}
    durationInFrames={REEL01_DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
