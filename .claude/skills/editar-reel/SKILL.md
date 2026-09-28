---
name: editar-reel
description: Edita un reel nuevo de Dani (@soydandandan) con la estructura del reel 02. Gancho vertical con subtítulos y punch-in, pantalla dividida con motion graphics arriba y Dani abajo, subtítulos Cormorant + Marvin sincronizados con su voz real, efectos de sonido sintetizados. Úsala cuando Dani suba un video nuevo para editar o diga "editemos otro reel".
---

# Editar un reel nuevo (estructura del reel 02)

Referencia completa y funcionando: `src/reels/Reel02Bio.tsx` + `src/reels/reel02/` + `tools/`. Copia su patrón; no reinventes. Lee también `CLAUDE.md`.

## 1. Recibir el video
- Dani lo sube por GitHub web (máx. 25 MB) → `git pull` → muévelo a `public/reelNN/<nombre>.mp4`. Remotion lee HEVC directo, así que no hace falta convertirlo.
- Pídele el guion aproximado, pero **manda lo que dice en el video**.
- Mide la toma:
  - `ffprobe`: resolución y duración.
  - Corte vertical → horizontal: `ffmpeg -vf "select='gt(scene,0.3)',showinfo"` sobre los primeros 10 s.
  - Franja horizontal dentro del cuadro vertical: filas no negras con numpy sobre un fotograma. En el reel 02 fue y = 875…1684 de 2560.

## 2. Transcribir (tiempos por palabra)
```bash
tools/transcribe.sh public/reelNN/video.mp4 tools/reelNN-asr-small.json
```
- Tarda ~1.5 min por minuto de video.
- Whisper small se equivoca en algunas palabras:
  - Contrasta con el guion y con el sentido de la frase.
  - Las dudosas se marcan como **probable** y se le preguntan a Dani al entregar ("¿dijiste X o Y en el segundo N?").

## 3. Subtítulos
- Copia `tools/build_subs.py` como `tools/build_subs_reelNN.py` y ajusta rutas y salida (`src/reels/reelNN-subs.json`).
- `FIX`: correcciones puntuales (texto oído, segundo aprox., texto final).
- `LINES`: cortes a mano, 3–4 palabras, por frases naturales. El script verifica que sumen exactamente las palabras.
- En `Subtitles.tsx`, ajusta la lista `KEYWORDS` al tema: una palabra clave por línea, en Marvin.

## 4. Animación de arriba (1080×960)
- Un concepto visual central que se transforma punto por punto. En el reel 02 fue un perfil de IG ficticio que se arregla sección por sección.
- **Chips de sección:** "01 · …", "02 · …", "+1 · BONUS".
- **Foco:** la parte activa resaltada y el resto atenuado.
- **Cierre:** fondo negro y CTA.
- Todos los tiempos salen de `at("palabra", desdeSegundo)` en `timing.ts`, nunca a mano. Los cambios de sección entran `LEAD = 4` frames antes de la palabra.
- Respeta la zona segura: contenido entre y = 230 y y = 900, x ≤ 940.

## 5. Punch-in y sonido
- **Punch-in:** en el giro del gancho y en 1–2 momentos clave, con escala 1.12–1.2 y origen en la cara. En la toma horizontal no pases de ~1.12, porque ya está ampliada.
- **Sonido:** copia `tools/sfx.py`. Ancla cada efecto con `at()`:
  - golpe grave → punch-in;
  - whoosh → cortes y cambios grandes;
  - tick → secciones;
  - click → botones;
  - campana suave → logros y cierre.

## 6. Verificar ANTES de entregar (obligatorio)
1. `npx tsc --noEmit`
2. Render de stills en cada momento clave; revisar que la imagen coincide con lo que se dice.
3. Composición `ReelNN-ZonasUI`: nada importante en rojo.
4. Render final → extraer fotogramas **del MP4** y mirarlos.
5. Sincronía:
   - `tools/transcribe.sh out/reelNN.mp4 /tmp/check.json`;
   - comparar el inicio de cada línea con la palabra oída (tolerancia: aparece 0–0.4 s antes);
   - revisar a mano las que el chequeo no pueda comparar.
6. Sonido: medir en un silencio de la voz que el efecto está en la mezcla (RMS de la mezcla por encima del original).

## 7. Entregar
- Versión móvil:
  ```bash
  ffmpeg -i out/reelNN.mp4 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 192k -movflags +faststart <scratchpad>/reelNN-vX.mp4
  ```
  Luego `SendUserFile` con `display: render`.
- Commit + push a `main`.
- Resumen corto para Dani:
  - qué cambió;
  - qué se verificó;
  - palabras dudosas con su segundo;
  - pendientes (licencias, repo público, perfil).
