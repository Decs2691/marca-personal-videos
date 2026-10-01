"""Efectos del reel 03 v3. Uso: python3 tools/sfx_reel03v3.py"""
import json, sys
sys.path.insert(0, "tools")
from sfxlib import at as _at, chime, click, load_words, pop, render, thump, tick, whoosh

W = load_words("src/reels/reel03v3-subs.json")
TL = json.load(open("src/reels/reel03v3-timeline.json"))
at = lambda word, after=0.0: _at(W, word, after)
HOOK_END = at("pero", 7) - 0.07

events = [
    # Tramo A (igual que la v2)
    (at("mr") - 0.02, pop(-28)),
    (at("7000") - 0.02, pop(-28)),
    (at("encontré") - 0.02, thump(-23)),
    (HOOK_END - 0.18, whoosh(0.34, True, -25)),
    (at("primero", 10) - 0.02, tick(-25)),
    (at("segundo", 11) - 0.02, tick(-25)),
    (at("identidad") - 0.02, tick(-25)),
    (at("personalmente") + 0.10, chime(peak=-30)),
    # Tramo B: voz en off
    (TL["B"][0] - 0.2, whoosh(0.4, True, -25)),          # entra pantalla completa
    (at("tres", 23) + 0.1, thump(-24)),                   # aparece el "3"
    (at("primero", 25) - 0.12, tick(-25)),
    (at("bien", 27.5) - 0.02, pop(-28)),                  # ✓ ya lo hacen
    (at("dos", 28) - 0.02, chime((1046.5, 1568.0), 0.7, -29)),  # se encienden casillas
    (at("segundo", 31) - 0.12, tick(-25)),
    (at("menú") - 0.02, pop(-28)),
    (at("clientes", 33.5) - 0.02, pop(-28)),
    (at("pedir") - 0.02, pop(-28)),
    (at("24") + 0.9, chime((1318.5, 1975.5), 0.8, -29)),   # "guardadas"
    (at("tercero", 37) - 0.12, tick(-25)),
    (at("preguntas") - 0.02, click(-26)),
    (at("encuestas") - 0.02, click(-26)),
    (at("hablar") - 0.02, chime((1046.5, 1318.5), 0.7, -29)),
    # Tramo C y D
    (TL["C"][0] - 0.15, whoosh(0.3, False, -27)),
    (TL["D"][0] - 0.15, whoosh(0.3, True, -27)),
    (at("comentarios") - 0.02, chime((1318.5, 1975.5), 0.8, -28)),
]
render(events, TL["duration"], "public/reel03/sfx-v3.wav")
