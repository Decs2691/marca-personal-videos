"""Construye src/reels/reel02-subs.json desde la transcripción de Whisper small
(tiempos por palabra) + correcciones de texto revisadas a mano.

Uso: python3 tools/build_subs.py tools/reel02-asr-small.json public/reel02/bio-original.mp4
"""
import json, re, subprocess, sys

asr_path, video = sys.argv[1:3]
chunks = json.load(open(asr_path))["chunks"]
words = [{"w": c["text"].strip(), "t": c["timestamp"][0], "e": c["timestamp"][1]} for c in chunks]

# Correcciones: (texto reconocido, segundo aprox.) -> texto final.
# Donde Whisper escucha mal una palabra; el resto se deja tal cual lo dices.
FIX = [
    ("tres", 6.6, "3"), ("en", 20.4, "Mi"), ("recomendación", 20.6, "recomendación:"),
    ("ese", 22.7, "este"), ("es", 23.5, "se"), ("alta.", 23.7, "salta:"),
    ("tres", 25.8, "3"), ("claro", 19.9, "claro."), ("haces", 30.1, "hacer"), ("Por", 30.7, "Pon"),
    ("como", 32.0, "cómo"), ("dién.", 34.7, "DM."), ("Te", 35.0, "Tú"),
    ("whatsapp,", 35.9, "WhatsApp,"), ("testimonios,", 41.1, "testimonios."),
    ("cuándo", 41.7, "Cuando"), ("que", 46.5, "qué"),
]
for src, t, dst in FIX:
    hit = [w for w in words if w["w"] == src and abs(w["t"] - t) < 0.4]
    assert len(hit) == 1, (src, t, hit)
    hit[0]["w"] = dst

# Inicios de voz reales (silencedetect): se usan para no adelantar/atrasar líneas.
log = subprocess.run(["ffmpeg", "-v", "info", "-i", video, "-af", "silencedetect=noise=-32dB:d=0.18", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
onsets = [0.0] + [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]

def snap(t):
    near = [o for o in onsets if 0 <= t - o <= 0.35]
    return max(near) if near else t

# Líneas de 3-4 palabras cortadas por frases naturales. Deben sumar
# exactamente las palabras corregidas, en orden (se verifica abajo).
LINES = """Tu perfil de Instagram
está perdiendo clientes
y no es por
lo que crees.
No es el contenido,
no es la estética.
Son 3 cosas puntuales
que casi nadie revisa.
Y al final
te voy a dar
un bonus que casi
nadie aprovecha.
Primero,
tu nombre de usuario.
Tiene que ser claro,
no un código random.
Segundo,
tu foto de perfil
tiene que ser clara
o tu logo,
si es una empresa,
tiene que ser claro.
Mi recomendación:
que sea tu cara.
Tercero, y este es
el que más se salta:
La bio tiene que
responder 3 preguntas
en una línea cada una.
¿Qué haces?
¿Qué resultados tienes?
¿Y qué hacer ahora?
Pon lo que sea,
pero que tengan
cómo contratarte.
Nadie tiene que adivinarlo.
Yo lo hago por DM.
Tú lo puedes hacer
por tu WhatsApp,
por tu página web
y el bonus son
tus historias destacadas.
Pon quién soy,
qué hago,
testimonios.
Cuando está claro,
cualquiera que llegue
a tu perfil
va a entender
si le sirves
o qué tiene que
hacer después.
No te digo
qué está mal,
te digo cómo mejorar.
Y sígueme si quieres
dejar de perder clientes.""".splitlines()

merged, k = [], 0
for text in LINES:
    n = len(text.split())
    chunk = words[k:k + n]
    assert " ".join(w["w"] for w in chunk) == text, (text, " ".join(w["w"] for w in chunk))
    start = snap(chunk[0]["t"])
    if merged:  # nunca antes (ni pegada) a la línea anterior
        start = max(start, merged[-1]["start"] + 0.3)
    merged.append({"text": text, "start": round(start, 2), "last": chunk[-1]["e"]})
    k += n
assert k == len(words), "sobran palabras sin línea"

for i, l in enumerate(merged):
    nxt = merged[i + 1]["start"] if i + 1 < len(merged) else 50.92
    # Sin huecos cortos (parpadeo), pero la línea se va si hay una pausa larga.
    l["end"] = round(nxt if nxt - l["last"] < 0.8 else l["last"] + 0.35, 2)
    del l["last"]

json.dump({"lines": merged, "words": [{"w": w["w"], "t": round(w["t"], 2)} for w in words]},
          open("src/reels/reel02-subs.json", "w"), ensure_ascii=False, indent=1)
for l in merged:
    print(f"{l['start']:6.2f}-{l['end']:6.2f}  {l['text']}")
