# Marca personal: videos

Reels para IG y TikTok hechos con código ([Remotion](https://www.remotion.dev)), con la paleta de Col Ventures. No consume créditos de herramientas externas.

## Reels
| ID | Tema | Duración |
|---|---|---|
| `Reel01Hooks` | Qué es un hook + 3 tipos (01–03 de 20) | 34 s, 1080×1920 |
| `Reel02Bio` | 3 cosas + 1 bonus para que tu perfil no pierda clientes (pantalla dividida) | 51 s, 1080×1920 |
| `Reel03MrBurger` | Análisis de Mr Burger, v2 (**descartada**: 2 datos que el negocio corrigió) | 70 s, 1080×1920 |
| `Reel03MrBurgerV3` | Análisis de Mr Burger, **versión vigente**: lo que hacen bien + 3 recomendaciones en voz en off | 49.5 s, 1080×1920 |

## Cómo generarlo en tu Mac (solo la primera vez: pasos 1–3)
1. Instala Node.js LTS desde https://nodejs.org (el instalador .pkg), o con `brew install node` si usas Homebrew.
2. Abre la **Terminal** y descarga el proyecto:
   ```bash
   git clone https://github.com/Decs2691/marca-personal-videos.git
   cd marca-personal-videos
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Genera el video:
   ```bash
   npm run render
   ```
   El archivo queda en `out/reel01.mp4`. Para el reel 2: `npx remotion render Reel02Bio out/reel02.mp4`. El reel 3 necesita antes su video editado: `python3 tools/edit_cuts.py public/reel03/mrburger-original.mp4 public/reel03/mrburger-edit.mp4 1.12 28.86-39.02` (requiere ffmpeg). La primera vez descarga un navegador interno (~100 MB).

Para ver el video y ajustar cosas en vivo, ejecuta `npm run studio`. Se abre en el navegador.

## Antes de publicar
- El video sale **sin música**, a propósito. Añade un audio en tendencia desde la app de IG o TikTok. Así evitas problemas de derechos de autor.
- **CTA:** un solo CTA por video; en el copy no pidas otra acción distinta a la del video.

## Editar un reel nuevo
La estructura del reel 02 (gancho + pantalla dividida + subtítulos sincronizados + efectos) está documentada paso a paso en `.claude/skills/editar-reel/SKILL.md`, y las reglas de marca y del entorno en `CLAUDE.md`. Para transcribir un video: `tools/transcribe.sh <video> <salida.json>`.

## Reel 02: cómo está hecho
- Video fuente: `public/reel02/bio-original.mp4`. Gancho vertical hasta 3.3 s; luego la toma horizontal se recorta para llenar la mitad inferior.
- Efectos de sonido: `tools/sfx.py` los sintetiza (sin librerías externas) sobre palabras del audio y genera `public/reel02/sfx.wav`; volumen y lista de momentos se ajustan ahí.
- Subtítulos y animaciones salen de lo que dices en el video: transcripción con Whisper small (`tools/reel02-asr-small.json`, tiempos por palabra) + correcciones a mano en `tools/build_subs.py`, que genera `src/reels/reel02-subs.json`. Para cambiar un texto o un corte de línea, edita `FIX`/`LINES` en ese script y vuelve a correrlo.

## Estructura
- `src/theme.ts`: paleta, fuentes y zona segura. Todos los reels la reutilizan.
- `src/components/`: piezas reutilizables (`HookCard`, `Mark`, `Countdown`, `Scene`, `Typewriter`).
- `src/reels/`: un archivo por reel.
- `public/fonts/`: Fraunces, Space Grotesk, Cormorant Garamond y Montserrat (Google Fonts, licencia OFL). Van incluidas para que el render funcione sin internet. Los subtítulos del reel 02 combinan Cormorant (frase) + Marvin en mayúsculas (palabra clave; `marvin-demo.otf`, versión demo: revisar su licencia antes de uso comercial).

## Reglas de diseño
- Fondo crema `#F5F3EF` o negro `#000000`.
- El turquesa `#2EC4B6` y el durazno `#F4A261` se usan como **bloque detrás de texto negro**. Nunca como color de texto sobre crema, porque no se lee (contraste ~2:1). Sobre negro sí pueden ser texto.
- Respeta la zona segura: 220 px arriba, 480 px abajo y 140 px a la derecha (ahí está la interfaz de IG y TikTok). En `npm run studio`, la composición `Reel01Hooks-ZonasUI` muestra esas zonas en rojo para revisarlas.
- Usa cortes secos: sin zooms en las animaciones, sin emojis y sin subtítulos palabra por palabra. En tu toma real sí van 2–3 punch-in (acercamientos secos) en momentos clave.

## Licencia de Remotion
Es gratis para personas y empresas de hasta 3 empleados. Si Col Ventures crece más allá de eso, revisa https://www.remotion.dev/license.
