import React from "react";
import { AbsoluteFill } from "remotion";

// Solo para revisión: marca en rojo dónde la UI de IG Reels / TikTok tapa
// el video (unión conservadora de ambas apps, texto largo en el caption).
// No se incluye en el render final.
export const uiZones = {
  top: 220, // pestañas "Siguiendo / Para ti", título "Reels"
  bottom: 480, // usuario, caption, audio
  right: 140, // botones like / comentar / compartir
};

export const SafeZoneOverlay: React.FC = () => {
  const zone: React.CSSProperties = {
    position: "absolute",
    backgroundColor: "rgba(255,0,0,0.28)",
    outline: "2px dashed red",
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...zone, top: 0, left: 0, right: 0, height: uiZones.top }} />
      <div
        style={{ ...zone, bottom: 0, left: 0, right: 0, height: uiZones.bottom }}
      />
      <div
        style={{
          ...zone,
          top: uiZones.top,
          bottom: uiZones.bottom,
          right: 0,
          width: uiZones.right,
        }}
      />
    </AbsoluteFill>
  );
};
