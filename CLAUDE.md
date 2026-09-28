# Marca personal de Dani Cantor (@soydandandan): reels

Reels para IG y TikTok (1080×1920, 30 fps) editados con código (Remotion). Para editar un video nuevo, sigue la skill `.claude/skills/editar-reel/SKILL.md`.

## Cómo trabajar con Dani
- Soy su **asesor**, no su asistente. Antes de darle la razón, cuestiono la suposición y señalo lo que pasa por alto.
- Etiqueto las afirmaciones como **seguro / probable / superposición**.
- Respuestas concisas y en español.
- Tiene poco tiempo y no es técnico. Dale **un solo camino** con pasos concretos; nada de opciones abiertas en terminal.
- **Verifica antes de entregar.** Lo pidió explícitamente: render → fotogramas del MP4 final → sincronía contra la voz. Solo después, enviar.

## Decisiones de marca (ya tomadas, no re-preguntar)
- Paleta idéntica a Col Ventures: crema `#F5F3EF`, negro `#000000`, turquesa `#2EC4B6`, durazno `#F4A261`. Los acentos van como bloque detrás de texto negro, nunca como texto sobre crema.
- **Subtítulos:**
  - Frase en **Cormorant Garamond 700** (blanco) y palabra clave en **Marvin** mayúsculas espaciadas, amarillo sobrio `#F3E2A0`, que se "enciende" (color + salto vertical) cuando se pronuncia.
  - 3–4 palabras por línea.
  - Borde fino semitransparente + sombra difusa, **no** borde negro grueso.
  - Marvin es `marvin-demo.otf`: versión demo sin signos de puntuación (los signos van en la serif). Pendiente: que Dani confirme la licencia comercial.
- **Posición de subtítulos:**
  - Gancho vertical: tercio superior del área segura (centro y = 330).
  - Pantalla dividida: centrados sobre la línea de división (y = 960).
- **Zona segura:** 220 px arriba, 480 px abajo, 140 px a la derecha. Composición `*-ZonasUI` para comprobarla.
- **Formato "reel explicativo":**
  - Gancho vertical con punch-in (acercamiento seco ~1.15–1.2×) en el giro de la frase.
  - Luego pantalla dividida: arriba motion graphics hechos en código que ilustran cada punto; abajo Dani (toma horizontal recortada).
  - Máximo 2–3 punch-in por reel.
- **Efectos de sonido:** sintetizados (`tools/sfx.py`), anclados a palabras, 10–15 dB bajo la voz, ~15–20 por reel. Nada de librerías con licencia.
- **Música:** no va en el render; Dani la añade en la app.
- **CTA:** uno solo por video (framework de la skill `content-creator`).
- **Imágenes:** nunca de perfiles de terceros. Mockups ficticios hechos en código, o material de Dani.

## Entorno (nube): lo que funciona y lo que no
- **Bloqueados:** huggingface.co, Google Drive, Dropbox, WeTransfer. **Disponibles:** npm, PyPI, raw.githubusercontent.com.
- **Transcripción:** `tools/transcribe.sh` (Whisper small desde npm `sts-whisper-small`). Nunca repartir un guion por pausas; Dani cambia palabras y el orden al grabar.
- **Chromium para Remotion:** `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`. El `chrome` normal falla por headless antiguo.
- **Fuentes:** van en `public/fonts/`. Google Fonts desde el navegador falla por el certificado del proxy; se descargan con `npm pack @fontsource/...`.
- **Cómo Dani sube videos:** GitHub web → Add file → Upload files (máx. 25 MB por archivo). Si pesa más, que lo codifique en Finder (clic derecho → Codificar → 1080p, HEVC). El chat no acepta video.
- **Envío al usuario:** `SendUserFile` tiene límite de 30 MB. Reencoda una versión móvil (`libx264 -crf 20`, ~16 MB).

## Pendientes conocidos
- El repo es **público** y contiene videos de Dani y la fuente demo. Hay que pedirle que lo haga privado.
- Su perfil real necesita destacadas y contacto antes de publicar el reel 02.
