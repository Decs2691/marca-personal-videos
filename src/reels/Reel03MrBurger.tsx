import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SmartSubs } from "../components/SmartSubs";
import { enter } from "../components/anim";
import { FPS, colors, fonts } from "../theme";
import { Panel } from "./reel03/Panel";
import { DURATION_S, HOOK_END, at, lines } from "./reel03/timing";

export const REEL03_DURATION = Math.round(DURATION_S * FPS);

// Video ya acortado (tools/edit_cuts.py): sin pausas, sin el tramo repetido, 1.12×.
const SRC = staticFile("reel03/mrburger-edit.mp4");
const SHOT = staticFile("reel03/mrburger-perfil.png");
const SRC_W = 2560;
const SRC_H = 1440;
const FACE_X = 0.516; // centro de la cara en la toma horizontal

const KEYWORDS = [
  "instagram", "burger", "seguidores", "ventas", "aumenten", "bien", "primero", "segundo", "foto",
  "clara", "bio", "completa", "identidad", "consistente", "grid", "alineación", "coherencia",
  "pantalla", "personalmente", "deliciosa", "embargo", "frentes", "postean", "consistencia", "link",
  "domicilio", "blanco", "precio", "plato", "protagonismo", "simple", "tres", "semana", "posteando",
  "web", "protagonista", "hambre", "comer", "aburro", "costoso", "grande", "pequeño", "mal",
  "mejorar", "follow", "semanas", "nada", "comentarios", "saber",
];

// Punch-in (acercamiento seco) en momentos clave.
const punches = [
  { from: at("encontré"), to: HOOK_END, scale: 1.12 },
  { from: at("sin", 22), to: at("primero", 26) - 2, scale: 1.12 },
  { from: at("grande") - 6, to: at("así", 60.5) - 2, scale: 1.12 },
];
const zoomAt = (frame: number) => {
  for (const p of punches) {
    if (frame >= p.from - 1 && frame < p.to) {
      return interpolate(frame, [p.from - 1, p.from + 3], [1, p.scale], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
    }
  }
  return 1;
};

// `startFrom` en frames del video editado (lo usa la v3 para el tramo "Así que recuerden…").
export const SplitVideo: React.FC<{ startFrom?: number; muted?: boolean }> = ({ startFrom = 0, muted = false }) => {
  const frame = useCurrentFrame();
  const s = 960 / SRC_H;
  const w = SRC_W * s;
  return (
    <div style={{ position: "absolute", left: 0, top: 960, width: 1080, height: 960, overflow: "hidden" }}>
      <OffthreadVideo
        src={SRC}
        startFrom={startFrom}
        muted={muted}
        style={{
          position: "absolute",
          width: w,
          height: 960,
          left: 540 - w * FACE_X,
          transform: `scale(${zoomAt(frame)})`,
          transformOrigin: `${w * FACE_X}px 38%`,
        }}
      />
    </div>
  );
};

// Gancho (mitad de arriba): clips de su comida, recortados de una grabación de
// pantalla de sus reels, sin la interfaz de Instagram ni su audio.
export const FoodHook: React.FC = () => (
  <AbsoluteFill style={{ height: 960, overflow: "hidden" }}>
    <OffthreadVideo src={staticFile("reel03/food-hook.mp4")} muted style={{ width: 1080, height: 960 }} />
    <HookTags />
  </AbsoluteFill>
);

// Quién es Mr Burger y sus seguidores, abajo a la izquierda del panel.
const HookTags: React.FC = () => {
  const frame = useCurrentFrame();
  const mr = at("mr");
  const seg = at("7000");
  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 16,
    background: "rgba(0,0,0,0.78)",
    color: colors.cream,
    borderRadius: 60,
    padding: "12px 28px 12px 12px",
    fontFamily: fonts.sans,
    fontWeight: 700,
    fontSize: 36,
    marginTop: 16,
  };
  return (
    <div style={{ position: "absolute", left: 88, bottom: 110 }}>
      {frame >= mr && (
        <div style={{ ...pill, ...enter(frame, mr) }}>
          <div style={{ width: 72, height: 72, borderRadius: 72, overflow: "hidden", position: "relative" }}>
            <Img src={SHOT} style={{ position: "absolute", width: 1320 * (72 / 290), left: -30 * (72 / 290), top: -352 * (72 / 290) }} />
          </div>
          @mrburgerfl
        </div>
      )}
      <br />
      {frame >= seg && (
        <div style={{ ...pill, ...enter(frame, seg), paddingLeft: 28 }}>
          <span style={{ color: colors.teal }}>7,036</span> seguidores
        </div>
      )}
    </div>
  );
};

export const Reel03MrBurger: React.FC = () => {
  const frame = useCurrentFrame();
  const hook = frame < HOOK_END;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <SplitVideo />
      <Audio src={staticFile("reel03/sfx.wav")} />
      {hook ? <FoodHook /> : <Panel />}
      <SmartSubs lines={lines} keywords={KEYWORDS} mode="split" />
    </AbsoluteFill>
  );
};
