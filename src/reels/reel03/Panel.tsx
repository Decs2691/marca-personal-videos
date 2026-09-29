import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Mark } from "../../components/Mark";
import { enter, sweep } from "../../components/anim";
import { FPS, colors, fonts } from "../../theme";
import { at } from "./timing";

// Mitad superior (1080×960). Contenido dentro de x 88…940, y 236…900.
const LEFT = 88;
const W = 852;
const SHOT = staticFile("reel03/mrburger-perfil.png"); // 1320×2868, captura de Dani
const IMG_W = 1320;
const LEAD = 4;

// Momentos (frames) sacados de lo que Dani dice en el video editado.
export const T = {
  pero: at("pero", 7),
  primero: at("primero", 10),
  segundo: at("segundo", 11),
  identidad: at("identidad"),
  alineacion: at("alineación"),
  personalmente: at("personalmente"),
  deliciosa: at("deliciosa"),
  sin: at("sin", 22),
  frentes: at("frentes"),
  primero2: at("primero", 26),
  postean: at("postean"),
  otro: at("otro", 27.5),
  semanaSi: at("semana", 28.5),
  semanaNo: at("semana", 29.3),
  consistencia: at("consistencia"),
  dos: at("dos", 31),
  espacios: at("espacios"),
  precio: at("precio", 37),
  plato: at("plato", 37.8),
  protagonismo: at("protagonismo"),
  solucion: at("solución"),
  tres: at("tres", 41.5),
  menos: at("menos", 44),
  web: at("web", 48),
  hambre: at("hambre", 51),
  veo: at("veo", 54),
  aburro: at("aburro"),
  saben: at("saben", 59),
  grande: at("grande"),
  pequeno: at("pequeño"),
  noLes: at("no", 61.3),
  mejorar: at("mejorar"),
  tu: at("tú", 63.5),
  semanas: at("semanas", 66),
  comentarios: at("comentarios"),
};

// ---------- utilidades ----------
const ease = Easing.inOut(Easing.cubic);
const Chip: React.FC<{ label: string; start: number }> = ({ label, start }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: LEFT,
        top: 236,
        ...enter(frame, start),
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: 28,
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

const Badge: React.FC<{ ok: boolean; label: string; start: number; style?: React.CSSProperties }> = ({
  ok,
  label,
  start,
  style,
}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <div
      style={{
        position: "absolute",
        ...enter(frame, start),
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: ok ? colors.teal : colors.orange,
        color: colors.ink,
        border: `3px solid ${colors.ink}`,
        borderRadius: 14,
        padding: "10px 18px",
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: 30,
        boxShadow: "6px 6px 0 #000",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span style={{ fontSize: 34 }}>{ok ? "✓" : "✗"}</span>
      {label}
    </div>
  );
};

// ---------- A. Lo que hacen bien: cámara sobre la captura ----------
type Rect = { x: number; y: number; w: number; label?: string };
const VIEW_H = 600; // alto visible del marco
const views: { at: number; view: Rect; box?: [number, number, number, number]; badge?: string }[] = [
  { at: T.pero, view: { x: 0, y: 250, w: IMG_W } },
  { at: T.primero, view: { x: 0, y: 290, w: 560 }, box: [25, 345, 305, 305], badge: "Foto de perfil clara" },
  { at: T.segundo, view: { x: 0, y: 520, w: IMG_W }, box: [40, 660, 1250, 300], badge: "Bio completa" },
  { at: T.identidad, view: { x: 0, y: 1440, w: IMG_W }, box: [0, 1455, 1320, 1413], badge: "Identidad visual consistente" },
  { at: T.personalmente, view: { x: 880, y: 1690, w: 440 }, badge: "Probado en persona" },
];

const ProfileShot: React.FC = () => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i + 1 < views.length && frame >= views[i + 1].at - LEAD) i++;
  const cur = views[i];
  const prev = views[Math.max(0, i - 1)];
  const p = interpolate(frame, [cur.at - LEAD, cur.at - LEAD + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const lerp = (a: number, b: number) => a + (b - a) * (i === 0 ? 1 : p);
  const v = { x: lerp(prev.view.x, cur.view.x), y: lerp(prev.view.y, cur.view.y), w: lerp(prev.view.w, cur.view.w) };
  const scale = W / v.w;
  const box = cur.box && p > 0.9 ? cur.box : null;
  const gridLines = frame >= T.alineacion && frame < T.personalmente;

  return (
    <div
      style={{
        position: "absolute",
        left: LEFT,
        top: 300,
        width: W,
        height: VIEW_H,
        borderRadius: 30,
        overflow: "hidden",
        border: `3px solid ${colors.ink}`,
        boxShadow: "12px 12px 0 #000",
        background: "#000",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: IMG_W,
          transform: `scale(${scale}) translate(${-v.x}px, ${-v.y}px)`,
          transformOrigin: "0 0",
        }}
      >
        <Img src={SHOT} style={{ width: IMG_W, display: "block" }} />
        {box && (
          <div
            style={{
              position: "absolute",
              left: box[0],
              top: box[1],
              width: box[2],
              height: box[3],
              border: `${6 / scale}px solid ${colors.teal}`,
              borderRadius: 24 / scale,
              boxShadow: `0 0 0 ${2000 / scale}px rgba(0,0,0,0.35)`,
            }}
          />
        )}
        {gridLines &&
          [1, 2].map((k) => (
            <React.Fragment key={k}>
              <div style={{ position: "absolute", left: (IMG_W / 3) * k - 3, top: 1455, width: 6, height: 1413, background: colors.teal, opacity: sweep(frame, T.alineacion, 8) }} />
              <div style={{ position: "absolute", left: 0, top: 1455 + 583 * k - 3, width: IMG_W * sweep(frame, T.alineacion + 4, 10), height: 6, background: colors.teal }} />
            </React.Fragment>
          ))}
      </div>
      {cur.badge && frame >= cur.at && (
        <Badge ok label={cur.badge} start={cur.at} style={{ left: 22, bottom: 22 }} />
      )}
      {frame >= T.deliciosa && <Badge ok label="Comida deliciosa" start={T.deliciosa} style={{ left: 22, bottom: 96 }} />}
    </div>
  );
};

// ---------- B1. Consistencia: calendario ----------
const Calendar: React.FC<{ mode: "irregular" | "fixed" }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const days = ["L", "M", "X", "J", "V", "S", "D"];
  // Semana 1 y 3: "un día sí, otro no"; semanas 2 y 4 vacías ("una semana sí, una no").
  const irregular = [
    [1, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  const fixed = [0, 1, 2, 3].map(() => [1, 0, 0, 1, 0, 1, 0]); // 3 por semana
  const grid = mode === "irregular" ? irregular : fixed;
  const reveal = (w: number) =>
    mode === "irregular"
      ? w === 0
        ? T.postean
        : w === 1
          ? T.otro + 6
          : w === 2
            ? T.semanaSi
            : T.semanaNo
      : T.tres - 6 + w * 5;
  const cell = 100;
  return (
    <div style={{ position: "absolute", left: LEFT + 40, top: 330 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
        {days.map((d) => (
          <div key={d} style={{ width: cell, textAlign: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, opacity: 0.55 }}>
            {d}
          </div>
        ))}
      </div>
      {grid.map((week, w) => (
        <div key={w} style={{ display: "flex", gap: 12, marginBottom: 12, opacity: frame >= reveal(w) ? 1 : 0.25 }}>
          {week.map((on, d) => {
            const shown = frame >= reveal(w) + d;
            const posted = on && shown;
            return (
              <div
                key={d}
                style={{
                  width: cell,
                  height: 92,
                  borderRadius: 14,
                  border: `3px solid ${colors.ink}`,
                  background: posted ? (mode === "fixed" ? colors.teal : colors.orange) : "#FFFFFF",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: fonts.sans,
                  fontWeight: 700,
                  fontSize: 30,
                }}
              >
                {posted ? "●" : ""}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------- B2 / C2. Ficha del pedido a domicilio ----------
const Burger: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  // Recorte de la hamburguesa de su publicación fijada (captura de Dani).
  const crop = { x: 900, y: 1700, w: 400, h: 300 };
  const s = Math.max(w / crop.w, h / crop.h);
  return (
    <div style={{ width: w, height: h, overflow: "hidden", position: "relative", borderRadius: 16 }}>
      <Img
        src={SHOT}
        style={{ position: "absolute", width: IMG_W * s, left: -crop.x * s + (w - crop.w * s) / 2, top: -crop.y * s + (h - crop.h * s) / 2 }}
      />
    </div>
  );
};

const OrderCard: React.FC<{ good: boolean; pulsePrice?: number; pulsePlate?: number; hatch?: number }> = ({
  good,
  pulsePrice = 0,
  pulsePlate = 0,
  hatch = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: LEFT + 110,
      top: 300,
      width: 630,
      height: 580,
      background: "#FFFFFF",
      border: `3px solid ${colors.ink}`,
      borderRadius: 30,
      boxShadow: "12px 12px 0 #000",
      overflow: "hidden",
      fontFamily: fonts.sans,
      color: colors.ink,
    }}
  >
    <div style={{ height: 50, background: "#EFECE6", display: "flex", alignItems: "center", padding: "0 20px", fontSize: 20, opacity: 0.7 }}>
      order.toasttab.com
    </div>
    {good ? (
      <div style={{ padding: 18 }}>
        <Burger w={594} h={380} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 38 }}>Dipped Burger</div>
          <div style={{ fontSize: 26, opacity: 0.7 }}>$ XX.XX</div>
        </div>
      </div>
    ) : (
      <div style={{ padding: 24, position: "relative", height: 480 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ transform: `scale(${1 + pulsePlate * 0.15})`, outline: pulsePlate ? `4px solid ${colors.orange}` : "none", borderRadius: 16 }}>
            <Burger w={110} h={84} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 30 }}>Dipped Burger</div>
        </div>
        <div
          style={{
            marginTop: 30,
            fontWeight: 700,
            fontSize: 150,
            letterSpacing: "-0.03em",
            transform: `scale(${1 + pulsePrice * 0.06})`,
            transformOrigin: "left center",
            color: pulsePrice ? "#C4532E" : colors.ink,
          }}
        >
          $XX.XX
        </div>
        {/* Espacios en blanco */}
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            top: 330,
            bottom: 24,
            borderRadius: 16,
            opacity: hatch,
            border: `3px dashed ${colors.orange}`,
            backgroundImage: `repeating-linear-gradient(45deg, rgba(244,162,97,0.28) 0 12px, transparent 12px 24px)`,
            display: "grid",
            placeItems: "center",
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "0.1em",
          }}
        >
          ESPACIO EN BLANCO
        </div>
      </div>
    )}
  </div>
);

const pulse = (frame: number, c: number, w = 16) => Math.max(0, 1 - Math.abs(frame - c) / w);

// ---------- Panel ----------
export const Panel: React.FC = () => {
  const frame = useCurrentFrame();
  const f = frame;
  let body: React.ReactNode = null;

  if (f < T.sin - LEAD) {
    body = (
      <>
        <Chip label="LO QUE HACEN BIEN" start={T.pero} />
        <ProfileShot />
      </>
    );
  } else if (f < T.primero2 - LEAD) {
    body = (
      <div style={{ position: "absolute", left: LEFT, top: 290, display: "flex", alignItems: "flex-end", gap: 28 }}>
        <div style={{ ...enter(f, T.sin), fontFamily: fonts.serif, fontWeight: 600, fontSize: 330, lineHeight: 0.8 }}>2</div>
        <div style={{ paddingBottom: 30 }}>
          <div style={{ ...enter(f, T.frentes), fontFamily: fonts.sans, fontWeight: 700, fontSize: 52, lineHeight: 1.1 }}>
            frentes que les
            <br />
            <Mark color={colors.orange} progress={sweep(f, T.frentes + 6, 10)}>quitan ventas</Mark>
          </div>
        </div>
      </div>
    );
  } else if (f < T.dos - LEAD) {
    body = (
      <>
        <Chip label="01 · CONSISTENCIA" start={T.primero2 - LEAD} />
        <Calendar mode="irregular" />
        <Badge ok={false} label="Sin consistencia" start={T.consistencia} style={{ right: 1080 - 940, top: 236 }} />
      </>
    );
  } else if (f < T.solucion - LEAD) {
    body = (
      <>
        <Chip label="02 · LINK DE DOMICILIO" start={T.dos - LEAD} />
        <OrderCard
          good={false}
          hatch={sweep(f, T.espacios - 2, 8)}
          pulsePrice={f >= T.precio ? Math.max(pulse(f, T.precio + 6, 20), f >= T.protagonismo ? 0 : 0.35) : 0}
          pulsePlate={pulse(f, T.plato + 6, 20)}
        />
        <Badge ok={false} label="El plato pierde protagonismo" start={T.protagonismo} style={{ left: LEFT + 60, top: 820 }} />
      </>
    );
  } else if (f < T.web - LEAD) {
    body = (
      <>
        <Chip label="LA SOLUCIÓN · 01" start={T.solucion - LEAD} />
        <Calendar mode="fixed" />
        <Badge ok label="2–3 posts por semana" start={T.tres} style={{ right: 1080 - 940, top: 236 }} />
        <Badge ok label="Mínimo 1 por semana" start={T.menos} style={{ left: LEFT + 40, top: 812 }} />
      </>
    );
  } else if (f < T.saben - LEAD) {
    const bad = f >= T.veo && f < T.aburro + 24;
    body = (
      <>
        <Chip label="LA SOLUCIÓN · 02" start={T.web - LEAD} />
        <OrderCard good={!bad} pulsePrice={bad ? 0.35 : 0} />
        {!bad && <Badge ok label="Da hambre" start={T.hambre} style={{ right: 1080 - 940 + 10, top: 250 }} />}
        {bad && <Badge ok={false} label="Primero el precio… me aburro" start={T.veo} style={{ left: LEFT + 60, top: 820 }} />}
      </>
    );
  } else if (f < T.noLes - LEAD) {
    body = (
      <>
        <div style={{ position: "absolute", left: LEFT, top: 300, opacity: 0.35 }}>
          <Burger w={W} h={560} />
        </div>
        <div style={{ position: "absolute", left: LEFT, right: 1080 - 940, top: 420, textAlign: "center" }}>
          {f >= T.grande - 6 && (
            <div style={{ ...enter(f, T.grande - 6), fontFamily: fonts.display, fontSize: 120, letterSpacing: "0.16em", color: colors.ink, lineHeight: 1 }}>
              PLATO GRANDE
            </div>
          )}
          {f >= T.pequeno - 4 && (
            <div style={{ ...enter(f, T.pequeno - 4), fontFamily: fonts.classic, fontWeight: 700, fontSize: 64, marginTop: 24 }}>
              <Mark color={colors.teal} progress={sweep(f, T.pequeno, 8)}>precio pequeño</Mark>
            </div>
          )}
        </div>
      </>
    );
  } else if (f < T.tu - LEAD) {
    return (
      <AbsoluteFill style={{ height: 960, background: colors.ink, color: colors.cream }}>
        <div style={{ position: "absolute", left: LEFT, right: 1080 - 940, top: 330 }}>
          <div style={{ ...enter(f, T.noLes), fontFamily: fonts.serif, fontSize: 74, lineHeight: 1.08, opacity: f >= T.mejorar - 18 ? 0.45 : 1 }}>
            No les digo qué está mal.
          </div>
          {f >= T.mejorar - 18 && (
            <div style={{ ...enter(f, T.mejorar - 18), fontFamily: fonts.serif, fontSize: 74, lineHeight: 1.08, marginTop: 24, color: colors.teal }}>
              Les digo qué mejorar.
            </div>
          )}
        </div>
      </AbsoluteFill>
    );
  } else {
    return (
      <AbsoluteFill style={{ height: 960, background: colors.ink, color: colors.cream }}>
        <div style={{ position: "absolute", left: LEFT, right: 1080 - 940, top: 290 }}>
          <div style={{ ...enter(f, T.tu), fontFamily: fonts.serif, fontSize: 62, lineHeight: 1.12 }}>
            ¿Le das follow a una cuenta que publica un día…
          </div>
          {f >= T.semanas - 6 && (
            <div style={{ ...enter(f, T.semanas - 6), fontFamily: fonts.serif, fontSize: 62, lineHeight: 1.12, color: colors.orange, marginTop: 8 }}>
              …y luego desaparece semanas?
            </div>
          )}
          {f >= T.comentarios - 6 && (
            <div
              style={{
                ...enter(f, T.comentarios - 6),
                marginTop: 44,
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                background: colors.teal,
                color: colors.ink,
                borderRadius: 22,
                padding: "16px 28px",
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 36,
              }}
            >
              Respóndeme en comentarios
            </div>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        height: 960,
        overflow: "hidden",
        backgroundColor: colors.cream,
        backgroundImage: "radial-gradient(rgba(46,196,182,0.28) 2.5px, transparent 2.5px)",
        backgroundSize: "44px 44px",
        backgroundPosition: "22px 22px",
      }}
    >
      {body}
    </AbsoluteFill>
  );
};
