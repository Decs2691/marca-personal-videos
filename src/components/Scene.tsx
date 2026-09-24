import React from "react";
import { AbsoluteFill } from "remotion";
import { colors, safe } from "../theme";

export const Scene: React.FC<{
  bg: "ink" | "cream";
  justify?: "center" | "flex-start";
  children: React.ReactNode;
}> = ({ bg, justify = "center", children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors[bg],
      color: bg === "ink" ? colors.cream : colors.ink,
      paddingTop: safe.top,
      paddingLeft: safe.left,
      paddingRight: safe.right,
      paddingBottom: safe.bottom,
      justifyContent: justify,
    }}
  >
    {children}
  </AbsoluteFill>
);
