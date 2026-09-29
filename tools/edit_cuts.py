"""Acorta un video: quita pausas (las deja en ~0.12 s), elimina tramos
elegidos y acelera. Genera un MP4 editado que luego se transcribe de nuevo,
así todos los tiempos (subtítulos, animaciones) salen del video final.

Uso: python3 tools/edit_cuts.py <entrada> <salida> <velocidad> [inicio-fin ...]
Ej.: python3 tools/edit_cuts.py public/reel03/mrburger-original.mp4 public/reel03/mrburger-edit.mp4 1.12 28.86-39.02
"""
import re, subprocess, sys

src, out, speed, *drops = sys.argv[1:]
speed = float(speed)
drops = [tuple(map(float, d.split("-"))) for d in drops]

log = subprocess.run(["ffmpeg", "-v", "info", "-i", src, "-af", "silencedetect=noise=-32dB:d=0.12", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
dur = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", log).group(3)) + 60 * int(re.search(r"Duration: \d+:(\d+)", log).group(1))
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]

# Tramos con voz, con 0.06 s de aire a cada lado (pausa resultante ≈ 0.12 s).
speech, t = [], 0.0
for s, e in zip(starts, ends):
    if s > t: speech.append([max(0, t - 0.06), s + 0.06])
    t = e
if t < dur: speech.append([max(0, t - 0.06), dur])

# Quita los tramos eliminados.
keep = []
for a, b in speech:
    pieces = [(a, b)]
    for da, db in drops:
        nxt = []
        for x, y in pieces:
            if db <= x or da >= y: nxt.append((x, y))
            else:
                if x < da: nxt.append((x, da))
                if db < y: nxt.append((db, y))
        pieces = nxt
    keep += [p for p in pieces if p[1] - p[0] > 0.05]

# Une tramos que se solapan tras el acolchado.
merged = []
for a, b in keep:
    if merged and a <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], b)
    else: merged.append([a, b])

# Corta tramo por tramo (poca memoria) y une al final con el cambio de velocidad.
import os, tempfile
tmp = tempfile.mkdtemp(prefix="cuts_")
listing = []
FPS = 30
for i, (a, b) in enumerate(merged):
    # Cortes en fotogramas exactos: audio y video del tramo miden lo mismo,
    # así no se acumula desfase de labios al unir decenas de tramos.
    fa, fb = round(a * FPS), round(b * FPS)
    n = fb - fa
    a, secs = fa / FPS, n / FPS
    fade = min(0.01, secs / 4)
    seg = os.path.join(tmp, f"{i:03d}.mp4")
    # -ss antes de -i con recodificación es preciso al fotograma y no decodifica desde el inicio.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.6f}", "-i", src,
                    "-af", f"apad,atrim=0:{secs:.6f},"
                           f"afade=t=in:d={fade:.3f},afade=t=out:st={secs - fade:.3f}:d={fade:.3f}",
                    "-frames:v", str(n),
                    "-c:v", "libx264", "-preset", "veryfast", "-crf", "12", "-pix_fmt", "yuv420p", "-r", str(FPS),
                    "-c:a", "pcm_s16le", "-ar", "48000", seg.replace(".mp4", ".mov")], check=True)
    listing.append(f"file '{seg.replace('.mp4', '.mov')}'")
open(os.path.join(tmp, "list.txt"), "w").write("\n".join(listing))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", os.path.join(tmp, "list.txt"),
                "-filter_complex", f"[0:v]setpts=PTS/{speed},fps=30[v];[0:a]atempo={speed}[a]",
                "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "15",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
subprocess.run(["rm", "-rf", tmp])
kept = sum(b - a for a, b in merged)
print(f"{len(merged)} tramos | original {dur:.1f}s -> sin pausas/cortes {kept:.1f}s -> x{speed} = {kept / speed:.1f}s")
