import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { Mark } from "../../components/Mark";
import { enter, sweep } from "../../components/anim";
import { FPS, colors, fonts } from "../../theme";
import { at } from "./timing";

// Mitad superior (1080×960): un perfil de Instagram ficticio que se arregla
// punto por punto al ritmo de lo que dices. La franja superior (0–220 px) y la
// derecha (140 px) quedan libres por la UI de IG/TikTok.
const PANEL_H = 960;
const SAFE_TOP = 230;
const LEFT = 88;
const RIGHT_EDGE = 940;

// Momentos clave (frames), sacados del guion alineado.
const T = {
  contenido: at("contenido"),
  estetica: at("estética"),
  tres: at("3"),
  bonusIntro: at("bonus"),
  card: at("aprovecha") - 12,
  primero: at("primero"),
  random: at("random"),
  segundo: at("segundo"),
  cara: at("cara"),
  logo: at("logo"),
  tercero: at("tercero"),
  haces: at("haces"),
  resultados: at("resultados"),
  ahora: at("ahora"),
  bonus: at("bonus", 29),
  quien: at("quién"),
  hago: at("hago", 31),
  testimonios: at("testimonios"),
  contactarte: at("contactarte"),
  dm: at("dm"),
  whatsapp: at("whatsapp"),
  web: at("web"),
  cuando: at("cuando"),
  segundos: at("segundos"),
  despues: at("después"),
  noTeDigo: at("no", 45),
  teDigo: at("te", 46.4),
  cambiar: at("cambiar"),
  sigueme: at("sígueme"),
  perder: at("perder"),
};

type Focus = "username" | "avatar" | "bio" | "highlights" | null;

const focusAt = (f: number): Focus => {
  if (f >= T.cuando) return null;
  if (f >= T.bonus) return "highlights";
  if (f >= T.tercero) return "bio";
  if (f >= T.segundo) return "avatar";
  if (f >= T.primero) return "username";
  return null;
};

const chipAt = (f: number): string | null => {
  if (f >= T.cuando) return null;
  if (f >= T.bonus) return "+1 · BONUS";
  if (f >= T.tercero) return "03 · BIO";
  if (f >= T.segundo) return "02 · FOTO";
  if (f >= T.primero) return "01 · USUARIO";
  return null;
};

// Resalta la sección activa y apaga el resto.
const Focusable: React.FC<{
  id: Focus;
  current: Focus;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ id, current, style, children }) => {
  const active = current === id;
  const dim = current !== null && !active;
  return (
    <div
      style={{
        position: "relative",
        opacity: dim ? 0.22 : 1,
        borderRadius: 22,
        outline: active ? `5px solid ${colors.teal}` : "5px solid transparent",
        outlineOffset: 10,
        transition: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Badge: React.FC<{ ok: boolean; size?: number; style?: React.CSSProperties }> = ({
  ok,
  size = 44,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: ok ? colors.teal : colors.orange,
      color: colors.ink,
      display: "grid",
      placeItems: "center",
      fontFamily: fonts.sans,
      fontWeight: 700,
      fontSize: size * 0.55,
      border: `3px solid ${colors.ink}`,
      ...style,
    }}
  >
    {ok ? "✓" : "✗"}
  </div>
);

const GenericLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="#D9D6CF" />
    <polygon points="50,24 72,37 72,63 50,76 28,63 28,37" fill="#A9A59C" />
  </svg>
);

const Face: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill={colors.teal} />
    <path d="M18 100c2-20 16-30 32-30s30 10 32 30z" fill={colors.ink} />
    <circle cx="50" cy="44" r="19" fill="#E9C4A2" />
    <path d="M30 42c0-15 9-22 20-22s21 7 20 22c-4-7-10-10-20-10s-16 3-20 10z" fill="#2B1D16" />
    <circle cx="43" cy="46" r="2.2" fill={colors.ink} />
    <circle cx="57" cy="46" r="2.2" fill={colors.ink} />
    <path d="M43 54q7 5 14 0" stroke={colors.ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
  </svg>
);

const Highlight: React.FC<{ label: string; icon: React.ReactNode; show: number; accent?: boolean; pulse?: number }> = ({
  label,
  icon,
  show,
  accent,
  pulse = 0,
}) => {
  const frame = useCurrentFrame();
  const p = spring({ frame: frame - show, fps: FPS, config: { damping: 14, mass: 0.6 } });
  const visible = frame >= show;
  return (
    <div style={{ width: 150, textAlign: "center" }}>
      <div
        style={{
          width: 84,
          height: 84,
          margin: "0 auto",
          borderRadius: 84,
          border: `4px solid ${visible ? (accent ? colors.teal : colors.ink) : "#D9D6CF"}`,
          background: visible ? (accent ? colors.teal : colors.cream) : "#EFECE6",
          transform: `scale(${visible ? 0.6 + 0.4 * p + pulse * 0.08 : 1})`,
          display: "grid",
          placeItems: "center",
          fontFamily: fonts.serif,
          fontWeight: 600,
          fontSize: 30,
        }}
      >
        {visible ? icon : null}
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: fonts.sans,
          fontWeight: accent ? 700 : 500,
          fontSize: 22,
          color: visible ? colors.ink : "#B8B4AC",
        }}
      >
        {visible ? label : "Nuevo"}
      </div>
    </div>
  );
};

// Íconos de las destacadas (trazo negro, 24×24).
const ICONS = {
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8c0-3.9 3.1-6 7-6s7 2.1 7 6",
  work: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  chat: "M4 5h16v11H9l-5 4z",
};

const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
    <path d={d} />
  </svg>
);

// Pulso 0→1→0 alrededor de un frame, para "señalar" algo mientras se nombra.
const pulseAround = (frame: number, center: number, width = 18) =>
  Math.max(0, 1 - Math.abs(frame - center) / width);

const typed = (text: string, frame: number, start: number, fpc = 1.2) =>
  frame < start ? "" : text.slice(0, Math.floor((frame - start) / fpc) + 1);

const ProfileCard: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = focusAt(frame);
  const cardIn = spring({ frame: frame - T.card, fps: FPS, config: { damping: 200 } });

  const goodUser = frame >= T.random + 16;
  const username = goodUser ? typed("@lucia.fitcoach", frame, T.random + 16) : "@lm_str.0fficial_24";
  const faceOn = frame >= T.cara;
  const whatsappOn = frame >= T.whatsapp;
  const webOn = frame >= T.web;
  const final = frame >= T.cuando;
  
  const button = (label: string, primary: boolean, pulse: number, show = true): React.ReactNode =>
    show ? (
      <div
        style={{
          flex: 1,
          height: 54,
          borderRadius: 14,
          display: "grid",
          placeItems: "center",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 26,
          background: primary ? colors.teal : "#ECE8E1",
          color: colors.ink,
          transform: `scale(${1 + pulse * 0.07})`,
          boxShadow: pulse > 0 ? `0 0 0 ${6 * pulse}px rgba(46,196,182,0.35)` : "none",
        }}
      >
        {label}
      </div>
    ) : null;

  const bioLine = (text: string, tag: string, start: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 36 }}>
      <span style={{ fontFamily: fonts.sans, fontSize: 26, whiteSpace: "nowrap" }}>
        {typed(text, frame, start, 0.9)}
      </span>
      {frame >= start + 10 && (
        <span
          style={{
            ...enter(frame, start + 10),
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: colors.orange,
            padding: "4px 10px",
            borderRadius: 8,
            whiteSpace: "nowrap",
          }}
        >
          {tag}
        </span>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: LEFT,
        width: RIGHT_EDGE - LEFT,
        top: 312,
        height: 572,
        background: "#FFFFFF",
        borderRadius: 36,
        border: `3px solid ${colors.ink}`,
        boxShadow: "12px 12px 0 0 #000",
        padding: 26,
        boxSizing: "border-box",
        opacity: cardIn,
        transform: `translateY(${(1 - cardIn) * 60}px))`,
        transformOrigin: "50% 40%",
        color: colors.ink,
      }}
    >
      {/* Cabecera: foto + usuario + stats */}
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <Focusable id="avatar" current={focus} style={{ borderRadius: 140 }}>
          <div style={{ position: "relative", width: 116, height: 116 }}>
            {faceOn ? <Face size={116} /> : <GenericLogo size={116} />}
            {faceOn && <Badge ok style={{ position: "absolute", right: -6, bottom: -6 }} />}
            {frame >= T.logo && frame < T.tercero && (
              <div style={{ position: "absolute", left: 136, top: 22, ...enter(frame, T.logo) }}>
                <div style={{ position: "relative" }}>
                  <GenericLogo size={74} />
                  <Badge ok={false} size={34} style={{ position: "absolute", right: -8, bottom: -8 }} />
                </div>
              </div>
            )}
          </div>
        </Focusable>
        <div style={{ flex: 1, opacity: frame >= T.logo && frame < T.tercero ? 0 : 1 }}>
          <Focusable id="username" current={focus} style={{ display: "inline-block", padding: "2px 8px", margin: "-2px -8px" }}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 38,
                whiteSpace: "nowrap",
                textDecoration: !goodUser && frame >= T.random ? "line-through" : "none",
                textDecorationThickness: 5,
                color: !goodUser && frame >= T.random ? "#9A958C" : colors.ink,
              }}
            >
              {username}
              {goodUser && frame >= T.random + 34 && (
                <Badge ok size={36} style={{ display: "inline-grid", marginLeft: 14, verticalAlign: "middle" }} />
              )}
            </div>
          </Focusable>
          <div style={{ display: "flex", gap: 28, marginTop: 14, fontFamily: fonts.sans, fontSize: 22, opacity: focus !== null ? 0.22 : 1 }}>
            {[
              ["128", "posts"],
              ["2.340", "seguidores"],
              ["310", "seguidos"],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontWeight: 700, fontSize: 28 }}>{n}</div>
                <div style={{ opacity: 0.6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nombre + bio */}
      <Focusable id="bio" current={focus} style={{ padding: "4px 8px", margin: "14px -8px 0" }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 27, height: 36 }}>
          Lucía Ruiz{webOn && (
            <span style={{ fontWeight: 500, color: colors.ink, marginLeft: 16, fontSize: 24, ...enter(frame, T.web) }}>
              <Mark color={colors.teal} progress={sweep(frame, T.web, 8)}>lucia.fit/plan</Mark>
            </span>
          )}
        </div>
        {frame < T.haces ? (
          <div style={{ fontFamily: fonts.sans, fontSize: 26, height: 108, color: "#8E897F" }}>
            Bienvenidos a mi página.
          </div>
        ) : (
          <div style={{ height: 108 }}>
            {bioLine("Coach fitness para mamás ocupadas", "Qué haces", T.haces)}
            {bioLine("+300 alumnas con resultados", "Resultados", T.resultados)}
            {bioLine("Escríbeme PLAN por DM ↓", "Qué hago ahora", T.ahora)}
          </div>
        )}
      </Focusable>

      {/* Botones */}
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 12,
          opacity: focus !== null ? 0.22 : 1,
        }}
      >
        {button(frame >= T.perder ? "Siguiendo" : "Seguir", false, 0)}
        {button("Mensaje", frame >= T.dm, pulseAround(frame, T.dm) + pulseAround(frame, T.despues, 24))}
        {button("WhatsApp", true, pulseAround(frame, T.whatsapp), whatsappOn)}
      </div>

      {/* Destacadas */}
      <Focusable id="highlights" current={focus} style={{ marginTop: 18, padding: "6px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 6px" }}>
          <Highlight label="Quién soy" icon={<Icon d={ICONS.person} />} show={T.quien} />
          <Highlight label="Qué hago" icon={<Icon d={ICONS.work} />} show={T.hago} />
          <Highlight label="Testimonios" icon={<Icon d={ICONS.star} />} show={T.testimonios} />
          <Highlight label="Contacto" icon={<Icon d={ICONS.chat} />} show={T.contactarte} accent pulse={pulseAround(frame, T.contactarte + 10, 14)} />
        </div>
      </Focusable>

      {/* Cronómetro: "entiende en segundos" */}
      {frame >= T.segundos && (
        <div
          style={{
            position: "absolute",
            right: 24,
            top: -30,
            ...enter(frame, T.segundos),
            background: colors.ink,
            color: colors.cream,
            borderRadius: 60,
            padding: "12px 24px",
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 30,
          }}
        >
          ⏱ 3 s
        </div>
      )}
    </div>
  );
};

// 3.3 s → "tarjeta": no es el contenido, no es la estética; 3 cosas + 1 bonus.
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const tag = (label: string, start: number, strike: number) => (
    <div style={{ ...enter(frame, start), fontFamily: fonts.serif, fontSize: 92, lineHeight: 1.15 }}>
      <Mark color={colors.orange} progress={sweep(frame, start + 2, 8)} strike={sweep(frame, strike, 8)} strikeColor={colors.ink}>
        {label}
      </Mark>
    </div>
  );
  if (frame >= T.card) return null;
  const counter = frame >= T.tres;
  return (
    <div style={{ position: "absolute", left: LEFT, right: 1080 - RIGHT_EDGE, top: SAFE_TOP + 40 }}>
      {!counter ? (
        <>
          {tag("Contenido", T.contenido - 8, T.contenido + 14)}
          {frame >= T.estetica - 8 && tag("Estética", T.estetica - 8, T.estetica + 12)}
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28 }}>
          <div style={{ ...enter(frame, T.tres), fontFamily: fonts.serif, fontWeight: 600, fontSize: 300, lineHeight: 0.8 }}>
            3
          </div>
          <div style={{ paddingBottom: 26 }}>
            <div style={{ ...enter(frame, T.tres + 4), fontFamily: fonts.sans, fontWeight: 700, fontSize: 44 }}>
              cosas que casi
              <br />
              nadie revisa
            </div>
            {frame >= T.bonusIntro && (
              <div style={{ ...enter(frame, T.bonusIntro), marginTop: 20, fontFamily: fonts.serif, fontWeight: 600, fontSize: 64 }}>
                <Mark color={colors.teal} progress={sweep(frame, T.bonusIntro + 2, 8)}>+1 bonus</Mark>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Chip: React.FC = () => {
  const frame = useCurrentFrame();
  const label = chipAt(frame);
  if (!label) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: LEFT,
        top: SAFE_TOP + 6,
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: "0.14em",
        background: colors.ink,
        color: colors.cream,
        padding: "10px 20px",
        borderRadius: 10,
      }}
    >
      {label}
    </div>
  );
};

// 45 s → cierre sobre negro.
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.noTeDigo) return null;
  const follow = frame >= T.sigueme;
  return (
    <AbsoluteFill style={{ background: colors.ink, color: colors.cream }}>
      <div style={{ position: "absolute", left: LEFT, right: 1080 - RIGHT_EDGE, top: SAFE_TOP + 70 }}>
        {!follow ? (
          <>
            <div style={{ ...enter(frame, T.noTeDigo), fontFamily: fonts.serif, fontSize: 74, lineHeight: 1.08, opacity: frame >= T.teDigo ? 0.45 : 1 }}>
              No te digo qué está mal.
            </div>
            {frame >= T.teDigo && (
              <div style={{ ...enter(frame, T.teDigo), fontFamily: fonts.serif, fontSize: 74, lineHeight: 1.08, marginTop: 24, color: colors.teal }}>
                Te digo qué cambiar.
              </div>
            )}
          </>
        ) : (
          <div style={enter(frame, T.sigueme)}>
            <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 52 }}>@soydandandan</div>
            <div
              style={{
                marginTop: 34,
                width: 420,
                height: 96,
                borderRadius: 20,
                display: "grid",
                placeItems: "center",
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 40,
                background: frame >= T.perder ? "transparent" : colors.teal,
                border: `4px solid ${colors.teal}`,
                color: frame >= T.perder ? colors.teal : colors.ink,
                transform: `scale(${1 - pulseAround(frame, T.perder, 6) * 0.06})`,
              }}
            >
              {frame >= T.perder ? "Siguiendo ✓" : "Seguir"}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const ProfilePanel: React.FC = () => (
  <AbsoluteFill
    style={{
      height: PANEL_H,
      overflow: "hidden",
      backgroundColor: colors.cream,
      backgroundImage: "radial-gradient(rgba(46,196,182,0.28) 2.5px, transparent 2.5px)",
      backgroundSize: "44px 44px",
      backgroundPosition: "22px 22px",
    }}
  >
    <Intro />
    <Chip />
    <ProfileCard />
    <Outro />
  </AbsoluteFill>
);
