# Marca personal: videos

Reels para IG y TikTok hechos con código ([Remotion](https://www.remotion.dev)), con la paleta de Col Ventures. No consume créditos de herramientas externas.

## Reels
| ID | Tema | Duración |
|---|---|---|
| `Reel01Hooks` | Qué es un hook + 3 tipos (01–03 de 20) | 34 s, 1080×1920 |

## Cómo generarlo en tu Mac (solo la primera vez: pasos 1–3)
1. Instala Node.js LTS desde https://nodejs.org (el instalador .pkg), o con `brew install node` si usas Homebrew.
2. Abre la **Terminal** y descarga el proyecto:
   ```bash
   git clone https://github.com/<tu-usuario>/marca-personal-videos.git
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
   El archivo queda en `out/reel01.mp4`. La primera vez descarga un navegador interno (~100 MB).

Para ver el video y ajustar cosas en vivo, ejecuta `npm run studio`. Se abre en el navegador.

## Antes de publicar
- El video sale **sin música**, a propósito. Añade un audio en tendencia desde la app de IG o TikTok. Así evitas problemas de derechos de autor.
- **CTA:** el video termina con "Comenta 2 y hago la parte 2". En el copy no pidas otra acción (guardar, seguir…): un solo CTA por video.

## Estructura
- `src/theme.ts`: paleta, fuentes y zona segura. Todos los reels la reutilizan.
- `src/components/`: piezas reutilizables (`HookCard`, `Mark`, `Countdown`, `Scene`).
- `src/reels/`: un archivo por reel.
- `public/fonts/`: Fraunces y Space Grotesk (Google Fonts, licencia OFL). Van incluidas para que el render funcione sin internet.

## Reglas de diseño
- Fondo crema `#F5F3EF` o negro `#000000`.
- El turquesa `#2EC4B6` y el durazno `#F4A261` se usan como **bloque detrás de texto negro**. Nunca como color de texto sobre crema, porque no se lee (contraste ~2:1). Sobre negro sí pueden ser texto.
- Deja libres el 15% inferior y la franja derecha de la pantalla (ahí está la interfaz de IG y TikTok).
- Usa cortes secos: sin zooms, sin emojis y sin subtítulos palabra por palabra.

## Licencia de Remotion
Es gratis para personas y empresas de hasta 3 empleados. Si Col Ventures crece más allá de eso, revisa https://www.remotion.dev/license.
