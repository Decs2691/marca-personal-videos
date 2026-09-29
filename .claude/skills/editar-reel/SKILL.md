---
name: editar-reel
description: Edita un reel nuevo de Dani (@soydandandan) con la estructura del reel 02. Gancho vertical con subtítulos y punch-in, pantalla dividida con motion graphics arriba y Dani abajo, subtítulos Cormorant + Marvin sincronizados con su voz real, efectos de sonido sintetizados. Úsala cuando Dani suba un video nuevo para editar o diga "editemos otro reel".
---

# Editar un reel nuevo (estructura del reel 02)

Referencias completas y funcionando:
- **Reel 03** (`src/reels/Reel03MrBurger.tsx` + `src/reels/reel03/`): usa las piezas reutilizables `src/components/SmartSubs.tsx`, `src/lib/subs.ts` (`makeTiming`) y `tools/sfxlib.py`. **Parte de este.**
- **Reel 02:** el formato original, con toma vertical + horizontal.

Lee también `CLAUDE.md`.

## 1. Recibir el video
- Dani lo sube por GitHub web (máx. 25 MB) → `git pull` → muévelo a `public/reelNN/<nombre>.mp4`. Remotion lee HEVC directo, así que no hace falta convertirlo.
- Pídele el guion aproximado, pero **manda lo que dice en el video**.
- Mide la toma:
  - `ffprobe`: resolución y duración.
  - Corte vertical → horizontal: `ffmpeg -vf "select='gt(scene,0.3)',showinfo"` sobre los primeros 10 s.
  - Franja horizontal dentro del cuadro vertical: filas no negras con numpy sobre un fotograma. En el reel 02 fue y = 875…1684 de 2560.

## 1b. Acortar (si Dani lo pide)
```bash
python3 tools/edit_cuts.py <original> public/reelNN/<nombre>-edit.mp4 1.12 [inicio-fin ...]
```
- Quita pausas (las deja en ~0.12 s), elimina tramos (segundos del original) y acelera.
- Corta en fotogramas exactos: audio y video deben medir lo mismo (compruébalo con `ffprobe`).
- Antes, propón a Dani qué tramos repetidos quitar. No recortes contenido sin su OK.
- El `-edit.mp4` pesa ~100 MB y va en `.gitignore`: se regenera con el mismo comando.
- A partir de aquí todo (transcripción, subtítulos, animación) se hace sobre el **video editado**.
- **Si la toma es solo horizontal:** el gancho sale de un recorte vertical 9:16 centrado en la cara (ver `HookVideo` en el reel 03).

## 2. Transcribir (tiempos por palabra)
```bash
tools/transcribe.sh public/reelNN/video.mp4 tools/reelNN-asr-small.json
```
- Tarda ~1.5 min por minuto de video.
- Whisper small se equivoca en algunas palabras:
  - Contrasta con el guion y con el sentido de la frase.
  - Las dudosas se marcan como **probable** y se le preguntan a Dani al entregar ("¿dijiste X o Y en el segundo N?").

## 3. Subtítulos
- Copia `tools/build_subs_reel03.py` como `tools/build_subs_reelNN.py` y ajusta rutas y salida (`src/reels/reelNN-subs.json`).
- `FIX`: correcciones puntuales (texto oído, segundo aprox., texto final). El texto final puede ser varias palabras ("Analicé el") o `None` para borrar duplicados.
- `LINES`: cortes a mano, 3–4 palabras, por frases naturales. El script verifica que sumen exactamente las palabras.
- `<SmartSubs lines={lines} keywords={KEYWORDS} mode=... />`: ajusta `KEYWORDS` al tema, en orden de prioridad (una por línea, en Marvin).

## 4. Animación de arriba (1080×960)
- Un concepto visual central que se transforma punto por punto. En el reel 02 fue un perfil de IG ficticio que se arregla sección por sección.
- **Chips de sección:** "01 · …", "02 · …", "+1 · BONUS".
- **Foco:** la parte activa resaltada y el resto atenuado.
- **Cierre:** fondo negro y CTA.
- Todos los tiempos salen de `at("palabra", desdeSegundo)` en `timing.ts`, nunca a mano. Los cambios de sección entran `LEAD = 4` frames antes de la palabra.
- Respeta la zona segura: contenido entre y = 230 y y = 900, x ≤ 940.

## 5. Punch-in y sonido
- **Punch-in:** en el giro del gancho y en 1–2 momentos clave, con escala 1.12–1.2 y origen en la cara. En la toma horizontal no pases de ~1.12, porque ya está ampliada.
- **Sonido:** copia `tools/sfx_reel03.py` (usa `tools/sfxlib.py`). Ancla cada efecto con `at()`:
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
6. Sonido: comparar por bandas, mezcla vs voz sola, en el momento de cada efecto:
   - golpes graves: `lowpass=f=120`;
   - tics y campanas: `highpass=f=1800`.

   Si un efecto queda tapado por la voz, súbelo 3–5 dB. Los tics a -30 dB se pierden sobre la voz; usa -25 dB.

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
