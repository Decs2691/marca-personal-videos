"""Subtítulos del reel 03 (Mr Burger) desde la transcripción del video YA editado.
Uso: python3 tools/build_subs_reel03.py  ->  src/reels/reel03-subs.json

FIX admite: reemplazar una palabra, dividirla en varias ("Analicé el") o
borrarla (None) cuando Whisper partió o duplicó una palabra.
"""
import json, re, subprocess

ASR, VIDEO, OUT = "tools/reel03-asr-small.json", "public/reel03/mrburger-edit.mp4", "src/reels/reel03-subs.json"
chunks = json.load(open(ASR))["chunks"]
words = [{"w": c["text"].strip(), "t": c["timestamp"][0], "e": c["timestamp"][1]} for c in chunks]

FIX = [
    ("Andalícele", 0.1, "Analicé el"), ("7000", 3.9, "7.000"), ("aún", 6.9, "aumenten."), ("ven.", 7.0, None),
    ("perfil.", 11.0, "perfil"), ("Esclaro.", 11.3, "clara."), ("un", 12.4, "una"), ("avío", 12.6, "bio"),
    ("gret", 16.2, "grid"), ("En", 22.9, "Sin"), ("postean", 27.4, "postean,"), ("sea", 30.0, "sea,"),
    ("convera", 50.9, "con ver"), ("de", 51.9, "dé"), ("ámbar", 52.1, "hambre"), ("de", 52.4, "dé"),
    ("que", 61.8, "qué"), ("que", 63.2, "qué"), ("Tú", 63.6, "¿Tú"), ("les", 63.7, "le"),
    ("follow", 64.2, "follow a"), ("nada,", 68.1, "nada?"), ("responden", 68.4, "Respóndeme en"),
    ("y", 69.32, None), ("déjame", 69.4, "déjamelo"), ("lo", 69.6, None),
]
for src, t, dst in FIX:
    hit = [w for w in words if w["w"] == src and abs(w["t"] - t) < (0.015 if src == "y" else 0.3) and not w.get("done")]
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
hay dos frentes
que tal vez
les están haciendo
perder un poco
de ventas.
El primero es que
un día postean,
el otro no,
una semana sí,
una semana no,
o sea,
no hay consistencia.
Y dos, el link
con el que redirigen
a las personas
para hacer domicilio
de forma directa
tiene muchos
espacios en blanco,
tal vez sobresale más
el precio
que el plato,
es decir el plato
está perdiendo protagonismo.
La solución es simple,
postear dos o tres
veces por semana
van a empezar
a solucionar las cosas,
o por lo menos
una vez por semana
deberían estar posteando.
Y sencillo,
en la página web
simplemente hagan que
el plato sea
el protagonista
que usted solo
con ver el plato,
le dé hambre
y le dé ganas
de comer,
eso me pasa
a mí,
pero como veo
primero el precio,
ya primero me aburro
y luego ya no
me da hambre,
al igual no es
nada costoso.
Así que ya saben,
plato grande,
precio pequeño,
así que recuerden,
no les digo
qué está mal,
tal vez solamente
les digo qué mejorar.
¿Tú le has dado
follow a una cuenta
que un día
te publica
y luego demora semanas
sin publicar absolutamente nada?
Respóndeme en los comentarios
y déjamelo saber.""".splitlines()

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
END = 69.87
for i, l in enumerate(lines):
    nxt = lines[i + 1]["start"] if i + 1 < len(lines) else END
    l["end"] = round(nxt if nxt - l["last"] < 0.8 else l["last"] + 0.35, 2)
    del l["last"]
json.dump({"lines": lines, "words": [{"w": w["w"], "t": round(w["t"], 2)} for w in words]},
          open(OUT, "w"), ensure_ascii=False, indent=1)
long = [l["text"] for l in lines if len(l["text"].split()) > 4]
print(len(lines), "líneas | más de 4 palabras:", long)
