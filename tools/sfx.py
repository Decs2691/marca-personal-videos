"""Efectos de sonido del reel 02, sintetizados con numpy (sin librerías de
sonidos ni licencias). Cada efecto se coloca sobre una palabra del audio
(src/reels/reel02-subs.json), así quedan sincronizados con la voz.

Uso: python3 tools/sfx.py  ->  public/reel02/sfx.wav
Niveles: la voz está en ~-24 dB de media; los efectos quedan entre -34 y -22 dB
de pico para acompañar sin tapar.
"""
import json, wave
import numpy as np

SR = 44100
DUR = 50.92
rng = np.random.default_rng(7)
words = json.load(open("src/reels/reel02-subs.json"))["words"]


def at(word, after=0.0):
    for w in words:
        clean = w["w"].strip(".,:;—…?!¿¡").lower()
        if w["t"] >= after - 0.01 and clean == word:
            return w["t"]
    raise KeyError(word)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def db(x):
    return 10 ** (x / 20)


def env(sec, attack=0.004, tau=0.08):
    tt = t(sec)
    return np.minimum(tt / attack, 1) * np.exp(-tt / tau)


def lowpass(x, cutoff):
    # Filtro de un polo, suficiente para suavizar ruido.
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def norm(x, peak_db):
    return x / (np.max(np.abs(x)) + 1e-9) * db(peak_db)


# ---- banco de sonidos (sobrios) ----
def whoosh(sec=0.35, up=True, peak=-24):
    n = rng.standard_normal(int(sec * SR))
    tt = t(sec)
    shape = np.sin(np.pi * tt / sec) ** 2  # sube y baja
    x = lowpass(n, 900) - lowpass(n, 180)  # banda media, sin siseo agudo
    sweep = np.linspace(0.6, 1.0, len(x)) if up else np.linspace(1.0, 0.6, len(x))
    return norm(x * shape * sweep, peak)


def thump(peak=-22):
    tt = t(0.28)
    f = 95 * np.exp(-tt * 6)  # golpe grave que cae
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.28, 0.003, 0.09)
    return norm(x, peak)


def tick(peak=-30):
    tt = t(0.05)
    x = np.sin(2 * np.pi * 2200 * tt) * env(0.05, 0.001, 0.012)
    return norm(x, peak)


def pop(peak=-27):
    tt = t(0.09)
    f = 520 + 900 * np.exp(-tt * 40)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.09, 0.002, 0.03)
    return norm(x, peak)


def chime(freqs=(1318.5, 1975.5, 2637.0), sec=0.9, peak=-26):
    tt = t(sec)
    x = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt / (0.35 / (i + 1))) for i, f in enumerate(freqs))
    return norm(x * env(sec, 0.003, 10), peak)


def click(peak=-26):
    n = rng.standard_normal(int(0.03 * SR))
    return norm(lowpass(n, 3000) * env(0.03, 0.0005, 0.006), peak)


# ---- partitura: (segundo, sonido) ----
PUNCH1 = at("y", 2.2)
CUT = 3.3
events = [
    (PUNCH1 - 0.02, thump(-23)),                      # punch-in del gancho
    (CUT - 0.18, whoosh(0.34, True, -25)),            # corte a pantalla dividida
    (at("3") - 0.02, pop(-27)),                       # aparece el "3"
    (at("bonus") - 0.02, chime(peak=-29)),            # "+1 bonus"
    (at("aprovecha") - 0.45, whoosh(0.4, True, -28)), # entra la tarjeta del perfil
    (at("primero") - 0.12, tick()),                   # etiquetas de sección
    (at("random") + 0.10, pop(-28)),                  # usuario corregido ✓
    (at("segundo") - 0.12, tick()),
    (at("tercero") - 0.02, thump(-24)),               # segundo punch-in
    (at("pon", 30.5) - 0.12, tick()),                 # sección contacto
    (at("dm") - 0.02, click(-27)),
    (at("whatsapp") - 0.02, click(-27)),
    (at("web") - 0.02, click(-27)),
    (at("bonus", 37) - 0.12, tick()),
    (at("entender") - 0.02, chime((1046.5, 1568.0), 0.7, -28)),  # "entiende si le sirves"
    (at("no", 46) - 0.25, whoosh(0.4, False, -27)),   # pasa a negro
    (at("perder") - 0.02, click(-25)),                # botón Seguir → Siguiendo
    (at("perder") + 0.05, chime((1318.5, 1975.5), 0.8, -28)),
]

track = np.zeros(int(DUR * SR) + SR)
for start, snd in events:
    i = int(max(0, start) * SR)
    track[i:i + len(snd)] += snd[: len(track) - i]

track = np.clip(track, -1, 1)
pcm = (np.stack([track, track], axis=1) * 32767).astype("<i2")
with wave.open("public/reel02/sfx.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"{len(events)} efectos -> public/reel02/sfx.wav (pico {20*np.log10(np.max(np.abs(track))):.1f} dB)")
for s, _ in events:
    print(f"  {s:6.2f}s")
