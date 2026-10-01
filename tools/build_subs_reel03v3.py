"""Subtítulos del reel 03 v3: tramo A del video + voz en off (datos corregidos).
Uso: python3 tools/build_subs_reel03v3.py  ->  src/reels/reel03v3-subs.json

FIX admite: reemplazar una palabra, dividirla en varias ("Analicé el") o
borrarla (None) cuando Whisper partió o duplicó una palabra.
"""
import json, re, subprocess

ASR, VIDEO, OUT = "tools/reel03v3-asr-small.json", "public/reel03/v3-voice.wav", "src/reels/reel03v3-subs.json"
chunks = json.load(open(ASR))["chunks"]
words = [{"w": c["text"].strip(), "t": c["timestamp"][0], "e": c["timestamp"][1]} for c in chunks]

FIX = [
    ("Andalícele", 0.1, "Analicé el"), ("7000", 3.9, "7.000"), ("aún", 6.9, "aumenten."), ("ven.", 7.0, None),
    ("perfil,", 11.0, "perfil"), ("es", 11.36, None), ("claro.", 11.4, "clara."), ("un", 12.4, "una"), ("avío", 12.6, "bio"),
    ("gret", 16.2, "grid"),
    ("aprovechen", 39.68, "aprovéchenlas"), ("las", 39.94, None), ("compreguntas", 40.12, "con preguntas"),
    ("que", 43.94, "qué"), ("que", 45.28, "qué"), ("Tu", 45.8, "¿Tú"), ("cree", 45.96, "qué le"),
    ("preguntarias", 46.24, "preguntarías"), ("favorito,", 47.24, "favorito?"), ("responden", 47.74, "Respóndeme"),
]
for src, t, dst in FIX:
    hit = [w for w in words if w["w"] == src and abs(w["t"] - t) < (0.05 if src in ("y", "es", "que") else 0.3) and not w.get("done")]
    assert len(hit) == 1, (src, t, hit)
    hit[0]["done"] = True
    hit[0]["w"] = dst
out = []
for w in words:
    if w["w"] is None:
        continue
    parts = w["w"].split()
    step = (w["e"] - w["t"]) / len(parts)
    for i, p in enumerate(parts):  # palabras divididas: reparte el tiempo
        out.append({"w": p, "t": w["t"] + i * step, "e": w["t"] + (i + 1) * step})
words = out

LINES = """Analicé el Instagram
de Mr. Burger,
un restaurante colombiano
que tiene un poco
más de 7.000 seguidores,
pero encontré algo
que de pronto podría
hacer que sus ventas
aumenten.
Pero quiero mencionar
que están haciendo cosas
que están realmente bien.
Primero, una foto
de perfil clara.
Segundo,
tienen una bio que
tiene la información completa
y una identidad visual
que es consistente.
Su grid tiene
mucha alineación
y mucha coherencia
y no es que
se vea solamente
bien en pantalla.
Yo fui personalmente
y la verdad
es que la comida
es deliciosa.
Sin embargo,
hay tres cosas
que los pueden llevar
al siguiente nivel.
Primero,
hoy publican
una vez por semana,
y eso está bien,
pero subir
dos o tres publicaciones
por semana
les daría un poco
más de alcance.
Segundo,
historias destacadas
con el menú,
lo que dicen
sus clientes
y cómo pedir
para que esa información
que no desaparezca
en 24 horas.
Y tercero,
ya hacen historias
todos los días,
así que aprovéchenlas
con preguntas y encuestas
que pongan
a sus clientes
a hablar con ustedes.
Así que recuerden,
no les digo
qué está mal,
tal vez solamente
les digo qué mejorar.
¿Tú qué le
preguntarías a tu
restaurante favorito?
Respóndeme en los comentarios.""".splitlines()

log = subprocess.run(["ffmpeg", "-v", "info", "-i", VIDEO, "-af", "silencedetect=noise=-32dB:d=0.1", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
onsets = [0.0] + [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
snap = lambda t: max([o for o in onsets if 0 <= t - o <= 0.3], default=t)

lines, k = [], 0
for text in LINES:
    n = len(text.split())
    chunk = words[k:k + n]
    assert " ".join(w["w"] for w in chunk) == text, (text, " ".join(w["w"] for w in chunk))
    start = snap(chunk[0]["t"])
    if lines:
        start = max(start, lines[-1]["start"] + 0.3)
    lines.append({"text": text, "start": round(start, 2), "last": chunk[-1]["e"]})
    k += n
assert k == len(words), ("sobran palabras", [w["w"] for w in words[k:]])
END = json.load(open("src/reels/reel03v3-timeline.json"))["duration"]
for i, l in enumerate(lines):
    nxt = lines[i + 1]["start"] if i + 1 < len(lines) else END
    l["end"] = round(nxt if nxt - l["last"] < 0.8 else l["last"] + 0.35, 2)
    del l["last"]
json.dump({"lines": lines, "words": [{"w": w["w"], "t": round(w["t"], 2)} for w in words]},
          open(OUT, "w"), ensure_ascii=False, indent=1)
long = [l["text"] for l in lines if len(l["text"].split()) > 4]
print(len(lines), "líneas | más de 4 palabras:", long)
