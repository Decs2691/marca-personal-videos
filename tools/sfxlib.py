"""Banco de efectos de sonido sintetizados (numpy) + utilidades para anclarlos
a palabras del audio. Lo usan los scripts tools/sfx*.py de cada reel.
Niveles pensados para una voz de ~-24 dB de media: picos de -34 a -22 dB.
"""
import json, re, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def load_words(subs_json):
    return json.load(open(subs_json))["words"]


def at(words, word, after=0.0):
    for w in words:
        clean = re.sub(r"[.,:;—…?!¿¡]", "", w["w"]).lower()  # igual que src/lib/subs.ts
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




def render(events, dur, out):
    track = np.zeros(int(dur * SR) + SR)
    for start, snd in events:
        i = int(max(0, start) * SR)
        track[i:i + len(snd)] += snd[: len(track) - i]
    track = np.clip(track, -1, 1)
    pcm = (np.stack([track, track], axis=1) * 32767).astype("<i2")
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"{len(events)} efectos -> {out} (pico {20*np.log10(np.max(np.abs(track))):.1f} dB)")
