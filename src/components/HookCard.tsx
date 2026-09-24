import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";
import { enter, sweep } from "./anim";
import { Mark } from "./Mark";

export type HookCardProps = {
  index: number;
  total: number;
  name: string;
  bad: string;
  good: string;
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontWeight: 500,
      fontSize: 30,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      marginBottom: 20,
      opacity: 0.6,
    }}
  >
    {children}
  </div>
);

// Ficha de un tipo de hook: nombre, ejemplo malo tachado y ejemplo bueno.
export const HookCard: React.FC<HookCardProps> = ({
  index,
  total,
  name,
  bad,
  good,
}) => {
  const frame = useCurrentFrame();
  const num = String(index).padStart(2, "0");

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          ...enter(frame, 0),
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.12em",
        }}
      >
        {num}/{total}
      </div>
      <div
        style={{
          ...enter(frame, 3),
          fontFamily: fonts.serif,
          fontWeight: 400,
          fontSize: 124,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          marginTop: 12,
          marginBottom: 90,
        }}
      >
        {name}
      </div>

      <div style={{ ...enter(frame, 22), marginBottom: 72 }}>
        <Label>✗ Así no</Label>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 54,
            lineHeight: 1.3,
            opacity: frame > 70 ? 0.55 : 1,
          }}
        >
          <Mark
            color={colors.orange}
            progress={sweep(frame, 26, 10)}
            strike={sweep(frame, 52, 12)}
          >
            “{bad}”
          </Mark>
        </div>
      </div>

      <div style={enter(frame, 78)}>
        <Label>✓ Así sí</Label>
        <div
          style={{
            fontFamily: fonts.serif,
            fontWeight: 600,
            fontSize: 70,
            lineHeight: 1.22,
            letterSpacing: "-0.01em",
          }}
        >
          <Mark color={colors.teal} progress={sweep(frame, 84, 14)}>
            “{good}”
          </Mark>
        </div>
      </div>
    </div>
  );
};
