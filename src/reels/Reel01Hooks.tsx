import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Countdown } from "../components/Countdown";
import { HookCard, HookCardProps } from "../components/HookCard";
import { Mark } from "../components/Mark";
import { Scene } from "../components/Scene";
import { enter, sweep } from "../components/anim";
import { colors, fonts } from "../theme";

const TOTAL_TYPES = 20;

const cards: Omit<HookCardProps, "total">[] = [
  {
    index: 1,
    name: "Negativo",
    bad: "Hoy te hablo de perros",
    good: "Estás bañando mal a tu perro.",
  },
  {
    index: 2,
    name: "Pregunta no obvia",
    bad: "¿Sabías que los carros se devalúan?",
    good: "¿Por qué algunos carros mantienen su valor y otros no?",
  },
  {
    index: 3,
    name: "Curiosidad",
    bad: "Tips de decoración",
    good: "Hay un detalle en las casas modernas que casi nadie nota.",
  },
];

// Duraciones en frames (30 fps).
const HOOK = 90;
const DEFINITION = 150;
const CARD = 190;
const CLOSE = 210;
export const REEL01_DURATION =
  HOOK + DEFINITION + CARD * cards.length + CLOSE;

const headline: React.CSSProperties = {
  fontFamily: fonts.serif,
  fontWeight: 400,
  fontSize: 120,
  lineHeight: 1.04,
  letterSpacing: "-0.025em",
};

const body: React.CSSProperties = {
  fontFamily: fonts.sans,
  fontWeight: 400,
  fontSize: 52,
  lineHeight: 1.3,
};

// El hook se ve completo desde el frame 0: sirve de portada y no pierde
// al espectador esperando una animación de entrada.
const HookScene: React.FC = () => (
  <Scene bg="ink">
    <div style={headline}>
      Tu video muere en los primeros <Countdown from={3} ticks={22} />{" "}
      segundos.
    </div>
  </Scene>
);

const DefinitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene bg="cream">
      <div
        style={{
          ...enter(frame, 0),
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.12em",
          marginBottom: 28,
        }}
      >
        HOOK (n.)
      </div>
      <div style={{ ...headline, fontSize: 96, ...enter(frame, 4) }}>
        La primera frase de tu video. La que{" "}
        <Mark color={colors.teal} progress={sweep(frame, 30, 14)}>
          decide
        </Mark>{" "}
        si alguien se queda o se va.
      </div>
      <div style={{ ...body, ...enter(frame, 62), marginTop: 56 }}>
        Tienes unos 3 segundos. Aquí van 3 tipos que funcionan.
      </div>
    </Scene>
  );
};

const CommentBubble: React.FC = () => (
  <svg width="150" height="140" viewBox="0 0 60 56">
    <path
      d="M6 4h48a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H24L12 52V40H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"
      fill={colors.teal}
    />
    <text
      x="30"
      y="31"
      textAnchor="middle"
      fontFamily={fonts.serif}
      fontWeight={600}
      fontSize="26"
      fill={colors.ink}
    >
      2
    </text>
  </svg>
);

const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene bg="ink">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 120px)",
          gap: 20,
          marginBottom: 80,
        }}
      >
        {Array.from({ length: TOTAL_TYPES }, (_, i) => {
          const done = i < cards.length;
          const appear = sweep(frame, i * 1.5, 6);
          return (
            <div
              key={i}
              style={{
                height: 120,
                opacity: appear,
                backgroundColor: done ? colors.teal : "transparent",
                border: `3px solid ${done ? colors.teal : "rgba(245,243,239,0.25)"}`,
                display: "flex",
                alignItems: "flex-end",
                padding: 12,
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 26,
                color: done ? colors.ink : "rgba(245,243,239,0.4)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
          );
        })}
      </div>
      <div style={{ ...headline, ...enter(frame, 36) }}>
        Existen 20 tipos.
      </div>
      <div
        style={{
          ...enter(frame, 70),
          display: "flex",
          alignItems: "center",
          gap: 40,
          marginTop: 64,
        }}
      >
        <CommentBubble />
        <div>
          <div style={{ ...headline, fontSize: 96, color: colors.teal }}>
            Comenta “2”
          </div>
          <div style={{ ...body, marginTop: 8 }}>y hago la parte 2.</div>
        </div>
      </div>
    </Scene>
  );
};

export const Reel01Hooks: React.FC = () => {
  let from = 0;
  const next = (duration: number) => {
    const start = from;
    from += duration;
    return { from: start, durationInFrames: duration };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <Sequence {...next(HOOK)}>
        <HookScene />
      </Sequence>
      <Sequence {...next(DEFINITION)}>
        <DefinitionScene />
      </Sequence>
      {cards.map((card) => (
        <Sequence key={card.index} {...next(CARD)}>
          <Scene bg="cream">
            <HookCard {...card} total={TOTAL_TYPES} />
          </Scene>
        </Sequence>
      ))}
      <Sequence {...next(CLOSE)}>
        <CloseScene />
      </Sequence>
    </AbsoluteFill>
  );
};
