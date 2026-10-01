"""Prepara una voz en off para que empate con el video editado:
toma tramos [inicio-fin] del audio, recorta pausas (~0.12 s), ecualiza,
acelera igual que el video (1.12x) e iguala el volumen (LUFS) al del video.

Uso: python3 tools/vo_prep.py <audio> <salida.wav> <ref_video> <eq> <tramo> [<tramo>...]
  eq: filtros ffmpeg separados por coma (o "none"); tramo: inicio-fin en segundos.
"""
import json, re, subprocess, sys

src, out, ref, eq, *spans = sys.argv[1:]
SR = 48000

def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)

def lufs(path, flt=""):
    log = run(["ffmpeg", "-hide_banner", "-i", path, "-vn", "-af", (flt + "," if flt else "") + "loudnorm=print_format=json", "-f", "null", "-"]).stderr
    return float(json.loads(log[log.rindex("{"):])["input_i"])

parts = []
for k, sp in enumerate(spans):
    a, b = map(float, sp.split("-"))
    # pausas internas: quedan en 0.12 s
    log = run(["ffmpeg", "-v", "info", "-ss", str(a), "-to", str(b), "-i", src, "-af", "silencedetect=noise=-35dB:d=0.25", "-f", "null", "-"]).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    keep, t = [], 0.0
    for s, e in zip(st, en):
        keep.append((t, s + 0.06)); t = max(t, e - 0.06)
    keep.append((t, b - a))
    for i, (x, y) in enumerate(keep):
        if y - x < 0.03: continue
        f = f"/tmp/vo_{k}_{i:03d}.wav"
        fade = min(0.008, (y - x) / 4)
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a + x:.4f}", "-t", f"{y - x:.4f}", "-i", src, "-ac", "1", "-ar", str(SR),
             "-af", f"afade=t=in:d={fade},afade=t=out:st={y - x - fade:.4f}:d={fade}", f])
        parts.append(f)
open("/tmp/vo_list.txt", "w").write("\n".join(f"file '{p}'" for p in parts))
chain = ("" if eq == "none" else eq + ",") + "atempo=1.12"
run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", "/tmp/vo_list.txt", "-af", chain, "-ar", str(SR), "/tmp/vo_tmp.wav"])
gain = lufs(ref) - lufs("/tmp/vo_tmp.wav")
run(["ffmpeg", "-v", "error", "-y", "-i", "/tmp/vo_tmp.wav", "-af", f"volume={gain:.2f}dB,alimiter=limit=0.95", "-ac", "2", "-ar", "44100", out])
dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).stdout)
print(f"{out}: {dur:.2f}s | ajuste {gain:+.1f} dB | LUFS video {lufs(ref):.1f} / voz {lufs(out):.1f}")
