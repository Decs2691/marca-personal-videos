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
      // Cuadrícula de puntos del hero de colventures (.cv-hero), escalada a 1080px.
      backgroundImage: `radial-gradient(rgba(46,196,182,${
        bg === "ink" ? 0.3 : 0.28
      }) 2.5px, transparent 2.5px)`,
      backgroundSize: "44px 44px",
      backgroundPosition: "22px 22px",
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
