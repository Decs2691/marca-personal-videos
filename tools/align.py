"""Alinea el guion con los tramos de voz (sin modelo de reconocimiento).

Reparte cada palabra dentro de los tramos hablados detectados con
silencedetect, proporcional a sus sílabas, y agrupa en líneas de 3-4
palabras sin cruzar pausas largas. Uso: python3 tools/align.py video guion.txt out.json
"""
import json, re, subprocess, sys

video, script_path, out = sys.argv[1:4]
log = subprocess.run(
    ["ffmpeg", "-v", "info", "-i", video, "-af", "silencedetect=noise=-32dB:d=0.18", "-f", "null", "-"],
    capture_output=True, text=True).stderr
dur = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", log).groups()[2]) + 60 * int(re.search(r"Duration: (\d+):(\d+)", log).group(2))
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
segs, t = [], 0.0
for s, e in zip(starts, ends):
    if s - t > 0.05: segs.append([t, s])
    t = e
if dur - t > 0.05: segs.append([t, dur])

def syl(w):
    return max(1, len(re.findall(r"[aeiouáéíóúü]+", w.lower())))

text = open(script_path).read().split()
total_speech = sum(e - s for s, e in segs)
total_syl = sum(syl(w) for w in text)
rate = total_syl / total_speech
# Recorre palabras llenando cada tramo hasta su capacidad en sílabas.
words, si, used = [], 0, 0.0
for w in text:
    n = syl(w)
    while si < len(segs) - 1 and used + n / rate > (segs[si][1] - segs[si][0]) * 1.0001 and used > 0:
        si += 1; used = 0.0
    s0 = segs[si][0] + used
    used += n / rate
    words.append({"w": w, "start": round(s0, 3), "end": round(min(segs[si][1], segs[si][0] + used), 3), "seg": si})

# Líneas de 3-4 palabras; corta antes si hay puntuación o cambio de tramo.
lines, cur = [], []
for i, w in enumerate(words):
    cur.append(w)
    nxt = words[i + 1] if i + 1 < len(words) else None
    punct = re.search(r"[.,:;?!…—]$", w["w"])
    if len(cur) >= 4 or not nxt or (len(cur) >= 3 and (punct or nxt["seg"] != w["seg"])) or (punct and w["w"].endswith((".", "?", "!", "…"))):
        lines.append({"text": " ".join(x["w"] for x in cur), "start": cur[0]["start"], "end": cur[-1]["end"]})
        cur = []
json.dump({"duration": dur, "rate_syl_s": round(rate, 2), "segments": segs, "lines": lines}, open(out, "w"), ensure_ascii=False, indent=1)
print(f"{len(segs)} tramos, {len(words)} palabras, {rate:.1f} síl/s, {len(lines)} líneas")
