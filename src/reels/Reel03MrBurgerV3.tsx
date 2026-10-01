import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { SmartSubs } from "../components/SmartSubs";
import { colors } from "../theme";
import { FoodHook, SplitVideo } from "./Reel03MrBurger";
import { Panel } from "./reel03/Panel";
import { HOOK_END } from "./reel03/timing";
import { Cta, RememberPanel, VoBody } from "./reel03v3/VoScenes";
import { SEG, lines } from "./reel03v3/timing";

// v3: datos corregidos por Mr Burger. El tramo A (gancho + lo que hacen bien)
// es idéntico a la v2; las recomendaciones van en voz en off a pantalla completa.
export const REEL03V3_DURATION = SEG.duration;

const KEYWORDS = [
  "instagram", "burger", "seguidores", "ventas", "aumenten", "bien", "primero", "segundo", "tercero",
  "foto", "clara", "bio", "completa", "identidad", "consistente", "grid", "alineación", "coherencia",
  "pantalla", "personalmente", "deliciosa", "embargo", "nivel", "semana", "tres", "alcance",
  "destacadas", "menú", "clientes", "pedir", "horas", "historias", "días", "aprovéchenlas",
  "encuestas", "ustedes", "mal", "mejorar", "favorito", "comentarios",
];

export const Reel03MrBurgerV3: React.FC = () => {
  const f = useCurrentFrame();
  const inA = f < SEG.A[1];
  const inC = f >= SEG.C[0] && f < SEG.C[1];
  const split = inA || inC;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {/* Tramo A: igual que la v2 */}
      <Sequence durationInFrames={SEG.A[1]} layout="none">
        <SplitVideo muted />
        {f < HOOK_END ? <FoodHook /> : <Panel />}
      </Sequence>
      {/* Tramo B: voz en off a pantalla completa */}
      <Sequence from={0} durationInFrames={SEG.B[1]} layout="none">
        {f >= SEG.B[0] && <VoBody />}
      </Sequence>
      {/* Tramo C: "Así que recuerden…" (Dani a cámara) */}
      <Sequence from={SEG.C[0]} durationInFrames={SEG.C[1] - SEG.C[0]} layout="none">
        <SplitVideo startFrom={SEG.cStartInEdit} muted />
      </Sequence>
      {inC && <RememberPanel />}
      {/* Tramo D: CTA */}
      {f >= SEG.D[0] && <Cta />}
      <Audio src={staticFile("reel03/v3-voice.wav")} />
      <Audio src={staticFile("reel03/sfx-v3.wav")} />
      <SmartSubs lines={lines} keywords={KEYWORDS} mode="split" splitTop={split ? 960 : 1330} />
    </AbsoluteFill>
  );
};
