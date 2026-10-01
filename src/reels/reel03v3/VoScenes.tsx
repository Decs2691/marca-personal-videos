import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Mark } from "../../components/Mark";
import { enter, sweep } from "../../components/anim";
import { FPS, colors, fonts } from "../../theme";
import { at } from "./timing";

// Voz en off a pantalla completa (1080×1920). Contenido entre y 230 y ~1180;
// los subtítulos van más abajo (centro y ≈ 1330), fuera de la UI de IG/TikTok.
const LEFT = 88;
const W = 852;
const SHOT = staticFile("reel03/mrburger-perfil.png"); // 1320×2868

export const V = {
  sin: at("sin", 22.5),
  primero: at("primero", 25),
  una: at("una", 26),
  bien: at("bien", 27.5),
  dos: at("dos", 28),
  alcance: at("alcance"),
  segundo: at("segundo", 31),
  menu: at("menú"),
  clientes: at("clientes", 33.5),
  pedir: at("pedir"),
  h24: at("24"),
  tercero: at("tercero", 37),
  dias: at("días", 38.5),
  preguntas: at("preguntas"),
  encuestas: at("encuestas"),
  hablar: at("hablar"),
  noLes: at("no", 43.3),
  mejorar: at("mejorar"),
  tu: at("tú", 45),
  comentarios: at("comentarios"),
};
const LEAD = 4;

const Chip: React.FC<{ label: string; start: number }> = ({ label, start }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: LEFT,
        top: 250,
        ...enter(f, start),
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: "0.14em",
        background: colors.ink,
        color: colors.cream,
        padding: "12px 22px",
        borderRadius: 10,
      }}
    >
      {label}
    </div>
  );
};

const Badge: React.FC<{ ok?: boolean; label: string; start: number; style?: React.CSSProperties }> = ({
  ok = true,
  label,
  start,
  style,
}) => {
  const f = useCurrentFrame();
  if (f < start) return null;
  return (
    <div
      style={{
        position: "absolute",
        ...enter(f, start),
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: ok ? colors.teal : colors.orange,
        color: colors.ink,
        border: `3px solid ${colors.ink}`,
        borderRadius: 14,
        padding: "12px 20px",
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: 34,
        boxShadow: "6px 6px 0 #000",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ fontSize: 38 }}>✓</span>
      {label}
    </div>
  );
};

const Cream: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.cream,
      backgroundImage: "radial-gradient(rgba(46,196,182,0.28) 2.5px, transparent 2.5px)",
      backgroundSize: "44px 44px",
      backgroundPosition: "22px 22px",
    }}
  >
    {children}
  </AbsoluteFill>
);

// ---- 0. "Sin embargo, hay tres cosas…" ----
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <AbsoluteFill style={{ opacity: 0.32 }}>
        <OffthreadVideo src={staticFile("reel03/food-hook.mp4")} muted style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: LEFT, top: 520, display: "flex", alignItems: "flex-end", gap: 34, color: colors.cream }}>
        <div style={{ ...enter(f, V.sin + 8), fontFamily: fonts.serif, fontWeight: 600, fontSize: 380, lineHeight: 0.8, color: colors.teal }}>3</div>
        <div style={{ ...enter(f, V.sin + 14), fontFamily: fonts.sans, fontWeight: 700, fontSize: 62, lineHeight: 1.1, paddingBottom: 30 }}>
          cosas para
          <br />
          subir de nivel
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- 1. Calendario: 1 → 2–3 publicaciones por semana ----
const Calendar: React.FC = () => {
  const f = useCurrentFrame();
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  const cell = 104;
  const base = 3; // jueves: la publicación semanal que ya hacen
  const extra = [0, 5]; // lunes y sábado: las que se suman
  const meter = interpolate(f, [V.dos, V.alcance + 12], [0.3, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Cream>
      <Chip label="01 · MÁS PUBLICACIONES" start={V.primero - LEAD} />
      <div style={{ position: "absolute", left: LEFT + 6, top: 360 }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
          {days.map((d) => (
            <div key={d} style={{ width: cell, textAlign: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, opacity: 0.55 }}>
              {d}
            </div>
          ))}
        </div>
        {[0, 1, 2, 3].map((w) => (
          <div key={w} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            {days.map((_, d) => {
              const isBase = d === base && f >= V.una + w * 3;
              const isExtra = extra.includes(d) && f >= V.dos + w * 4 + extra.indexOf(d) * 2;
              const p = isExtra ? spring({ frame: f - (V.dos + w * 4 + extra.indexOf(d) * 2), fps: FPS, config: { damping: 12 } }) : 1;
              return (
                <div
                  key={d}
                  style={{
                    width: cell,
                    height: 96,
                    borderRadius: 16,
                    border: `3px solid ${colors.ink}`,
                    background: isBase ? colors.teal : isExtra ? colors.orange : "#FFFFFF",
                    transform: `scale(${isExtra ? 0.7 + 0.3 * p : 1})`,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: 30,
                  }}
                >
                  {isBase || isExtra ? "●" : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Badge label="Ya lo hacen: 1 por semana" start={V.bien - 4} style={{ left: LEFT, top: 860 }} />
      {f >= V.dos - 2 && (
        <div style={{ position: "absolute", left: LEFT, top: 960, width: W, ...enter(f, V.dos - 2) }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, marginBottom: 12 }}>
            <Mark color={colors.orange} progress={sweep(f, V.dos, 8)}>+ 2 por semana</Mark>
            <span style={{ marginLeft: 18, opacity: 0.7 }}>→ alcance</span>
          </div>
          <div style={{ height: 34, borderRadius: 20, border: `3px solid ${colors.ink}`, background: "#FFFFFF", overflow: "hidden" }}>
            <div style={{ width: `${meter * 100}%`, height: "100%", background: colors.teal }} />
          </div>
        </div>
      )}
    </Cream>
  );
};

// ---- 2. Historias destacadas sobre su perfil real ----
const icons: Record<string, string> = {
  Menú: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5",
  Clientes: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  "Cómo pedir": "M3 6h2l2 10h11l2-7H7M9 20a1 1 0 1 0 0-.1M17 20a1 1 0 1 0 0-.1",
};
const Highlights: React.FC = () => {
  const f = useCurrentFrame();
  const items: [string, number][] = [
    ["Menú", V.menu],
    ["Clientes", V.clientes],
    ["Cómo pedir", V.pedir],
  ];
  const saved = f >= V.h24 + 30;
  const clock = interpolate(f, [V.h24 - 4, V.h24 + 26], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crop = { y: 250, h: 800 }; // cabecera + bio de la captura
  const s = W / 1320;
  return (
    <Cream>
      <Chip label="02 · HISTORIAS DESTACADAS" start={V.segundo - LEAD} />
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 340,
          width: W,
          height: crop.h * s + 230,
          borderRadius: 30,
          overflow: "hidden",
          border: `3px solid ${colors.ink}`,
          boxShadow: "12px 12px 0 #000",
          background: "#000",
        }}
      >
        <div style={{ height: crop.h * s, overflow: "hidden", position: "relative" }}>
          <Img src={SHOT} style={{ position: "absolute", width: W, top: -crop.y * s }} />
        </div>
        {/* Fila de destacadas que hoy no tienen */}
        <div style={{ display: "flex", justifyContent: "space-evenly", paddingTop: 22 }}>
          {items.map(([label, t]) => {
            const on = f >= t - 2;
            const p = spring({ frame: f - (t - 2), fps: FPS, config: { damping: 12 } });
            return (
              <div key={label} style={{ textAlign: "center", width: 200, opacity: on ? 1 : 0.18 }}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    margin: "0 auto",
                    borderRadius: 120,
                    border: `4px solid ${saved ? colors.teal : "#8a8a8a"}`,
                    background: "#1b1b1b",
                    display: "grid",
                    placeItems: "center",
                    transform: `scale(${on ? 0.6 + 0.4 * p : 1})`,
                  }}
                >
                  <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d={icons[label]} />
                  </svg>
                </div>
                <div style={{ marginTop: 10, fontFamily: fonts.sans, fontSize: 28, color: colors.cream }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* "No desaparece en 24 horas": reloj que se vacía y se guarda */}
      {f >= V.h24 - 6 && (
        <div style={{ position: "absolute", right: 1080 - 940, top: 250, ...enter(f, V.h24 - 6), display: "flex", alignItems: "center", gap: 14 }}>
          <svg width={70} height={70} viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="#FFFFFF" stroke={colors.ink} strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="9"
              fill="none"
              stroke={saved ? colors.teal : colors.orange}
              strokeWidth="18"
              strokeDasharray={`${(saved ? 1 : clock) * 56.5} 56.5`}
              transform="rotate(-90 18 18)"
            />
          </svg>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 30 }}>{saved ? "Guardadas" : "24 h"}</div>
        </div>
      )}
      {saved && <Badge label="Siempre visibles en el perfil" start={V.h24 + 30} style={{ left: LEFT, top: 1110 }} />}
    </Cream>
  );
};

// ---- 3. Historias con preguntas y encuestas ----
const Stories: React.FC = () => {
  const f = useCurrentFrame();
  const phone = { left: 240, top: 330, w: 600, h: 900 };
  const crop = { x: 882, y: 1455, w: 438, h: 580 }; // su publicación fijada (hamburguesa), sin el resto del grid
  const sc = Math.max(phone.w / crop.w, phone.h / crop.h);
  const poll = interpolate(f, [V.encuestas + 6, V.hablar], [0.5, 0.78], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bubbles = ["¡La Dipped!", "¿Tienen domicilio?", "¡Voy este sábado!"];
  return (
    <Cream>
      <Chip label="03 · PREGUNTAS Y ENCUESTAS" start={V.tercero - LEAD} />
      <div
        style={{
          position: "absolute",
          ...phone,
          width: phone.w,
          height: phone.h,
          borderRadius: 54,
          border: `10px solid ${colors.ink}`,
          overflow: "hidden",
          boxShadow: "14px 14px 0 #000",
          background: "#000",
        }}
      >
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <Img src={SHOT} style={{ position: "absolute", width: 1320 * sc, left: -crop.x * sc + (phone.w - crop.w * sc) / 2, top: -crop.y * sc + (phone.h - crop.h * sc) / 2, filter: "brightness(0.85)" }} />
        </div>
        {/* barra de progreso de la historia */}
        <div style={{ position: "absolute", left: 20, right: 20, top: 18, height: 6, borderRadius: 4, background: "rgba(255,255,255,0.35)" }}>
          <div style={{ width: `${Math.min(100, ((f - V.tercero) / 120) * 100)}%`, height: "100%", background: "#fff", borderRadius: 4 }} />
        </div>
        <div style={{ position: "absolute", left: 22, top: 40, display: "flex", alignItems: "center", gap: 12, color: "#fff", fontFamily: fonts.sans, fontWeight: 700, fontSize: 24 }}>
          mrburgerfl <span style={{ opacity: 0.7, fontWeight: 400 }}>· hoy</span>
        </div>
        {/* sticker de pregunta */}
        {f >= V.preguntas - 2 && (
          <div style={{ position: "absolute", left: 60, right: 60, top: 150, ...enter(f, V.preguntas - 2), background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
            <div style={{ background: colors.orange, padding: "16px 20px", fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, textAlign: "center" }}>
              ¿Qué quieres probar?
            </div>
            <div style={{ padding: "18px 20px", fontFamily: fonts.sans, fontSize: 24, color: "#888", textAlign: "center" }}>Escribe tu respuesta…</div>
          </div>
        )}
        {/* sticker de encuesta */}
        {f >= V.encuestas - 2 && (
          <div style={{ position: "absolute", left: 60, right: 60, top: 400, ...enter(f, V.encuestas - 2), background: "#fff", borderRadius: 24, padding: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.35)", fontFamily: fonts.sans }}>
            <div style={{ fontWeight: 700, fontSize: 28, textAlign: "center", marginBottom: 14 }}>¿Vienes este fin de semana?</div>
            {[
              ["Sí", poll],
              ["Claro que sí", 1 - poll],
            ].map(([label, v]) => (
              <div key={label as string} style={{ position: "relative", height: 54, borderRadius: 14, border: "2px solid #ddd", marginTop: 10, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${(v as number) * 100}%`, background: label === "Sí" ? colors.teal : "#E9E5DD" }} />
                <div style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "12px 16px", fontWeight: 700, fontSize: 24 }}>
                  <span>{label as string}</span>
                  <span>{Math.round((v as number) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* respuestas de clientes */}
      {bubbles.map((b, i) => {
        const t = V.hablar - 4 + i * 6;
        if (f < t) return null;
        return (
          <div
            key={b}
            style={{
              position: "absolute",
              left: i % 2 ? 560 : LEFT,
              top: 760 + i * 120,
              ...enter(f, t),
              background: colors.teal,
              border: `3px solid ${colors.ink}`,
              borderRadius: 26,
              padding: "14px 22px",
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 30,
              boxShadow: "6px 6px 0 #000",
            }}
          >
            {b}
          </div>
        );
      })}
    </Cream>
  );
};

export const VoBody: React.FC = () => {
  const f = useCurrentFrame();
  if (f < V.primero - LEAD) return <Intro />;
  if (f < V.segundo - LEAD) return <Calendar />;
  if (f < V.tercero - LEAD) return <Highlights />;
  return <Stories />;
};

// Tramo C (Dani a cámara): mitad de arriba en negro con su frase.
export const RememberPanel: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ height: 960, background: colors.ink, color: colors.cream }}>
      <div style={{ position: "absolute", left: LEFT, right: 1080 - 940, top: 330 }}>
        <div style={{ ...enter(f, V.noLes - 6), fontFamily: fonts.serif, fontSize: 74, lineHeight: 1.08, opacity: f >= V.mejorar - 18 ? 0.45 : 1 }}>
          No les digo qué está mal.
        </div>
        {f >= V.mejorar - 18 && (
          <div style={{ ...enter(f, V.mejorar - 18), fontFamily: fonts.serif, fontSize: 74, lineHeight: 1.08, marginTop: 24, color: colors.teal }}>
            Les digo qué mejorar.
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Tramo D: CTA a pantalla completa.
export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: colors.ink, color: colors.cream }}>
      <div style={{ position: "absolute", left: LEFT, right: 1080 - 940, top: 440 }}>
        <div style={{ ...enter(f, V.tu - 4), fontFamily: fonts.serif, fontSize: 84, lineHeight: 1.1 }}>
          ¿Tú qué le preguntarías a tu <span style={{ color: colors.orange }}>restaurante favorito?</span>
        </div>
        {f >= V.comentarios - 8 && (
          <div
            style={{
              ...enter(f, V.comentarios - 8),
              marginTop: 60,
              display: "inline-flex",
              alignItems: "center",
              gap: 18,
              background: colors.teal,
              color: colors.ink,
              borderRadius: 26,
              padding: "20px 34px",
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 42,
            }}
          >
            Respóndeme en comentarios
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
