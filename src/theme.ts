import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Paleta compartida con Col Ventures (cg-audit/src/app/globals.css).
// Regla: turquesa y durazno solo como bloque detrás de texto negro sobre
// crema; como texto únicamente sobre negro (contraste ~10:1).
export const colors = {
  ink: "#000000",
  cream: "#F5F3EF",
  teal: "#2EC4B6",
  orange: "#F4A261",
} as const;

// Fuentes variables (Google Fonts, licencia OFL) incluidas en public/fonts
// para que el render no dependa de internet.
export const fonts = {
  serif: "Fraunces",
  sans: "Space Grotesk",
  // Subtítulos del reel 02: serif clásica + mayúsculas geométricas espaciadas.
  classic: "Cormorant Garamond",
  display: "Marvin",
};

loadFont({
  family: fonts.serif,
  url: staticFile("fonts/fraunces.woff2"),
  weight: "100 900",
});
// Marvin (versión demo que subiste). Solo tiene letras y números: los signos
// de puntuación se dibujan con la serif.
loadFont({
  family: fonts.display,
  url: staticFile("fonts/marvin-demo.otf"),
  weight: "400",
});
loadFont({
  family: fonts.classic,
  url: staticFile("fonts/cormorant-600.woff2"),
  weight: "600",
});
loadFont({
  family: fonts.classic,
  url: staticFile("fonts/cormorant-700.woff2"),
  weight: "700",
});
loadFont({
  family: fonts.sans,
  url: staticFile("fonts/spacegrotesk.woff2"),
  weight: "300 700",
});

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Zona segura: la UI de IG/TikTok tapa arriba (pestañas), abajo (usuario,
// caption, audio) y la franja derecha (botones). Mismos valores que
// components/SafeZoneOverlay; el contenido se centra dentro de este margen.
export const safe = {
  top: 220,
  left: 88,
  right: 180,
  bottom: 480,
};
