"""Efectos del reel 03 (Mr Burger). Uso: python3 tools/sfx_reel03.py"""
import sys
sys.path.insert(0, "tools")
from sfxlib import at as _at, chime, click, load_words, pop, render, thump, tick, whoosh

W = load_words("src/reels/reel03-subs.json")
at = lambda word, after=0.0: _at(W, word, after)
HOOK_END = at("pero", 7) - 0.07

events = [
    (at("mr") - 0.02, pop(-28)),                         # aparece @mrburgerfl
    (at("7000") - 0.02, pop(-28)),                       # 7,036 seguidores
    (at("encontré") - 0.02, thump(-23)),                 # punch-in del gancho
    (HOOK_END - 0.18, whoosh(0.34, True, -25)),          # corte a pantalla dividida
    (at("primero", 10) - 0.02, tick(-25)),                  # cada acierto
    (at("segundo", 11) - 0.02, tick(-25)),
    (at("identidad") - 0.02, tick(-25)),
    (at("personalmente") + 0.10, chime(peak=-30)),       # probado en persona
    (at("sin", 22) - 0.02, thump(-24)),                  # "Sin embargo" + punch-in
    (at("primero", 26) - 0.12, whoosh(0.3, True, -29)),  # frente 1
    (at("consistencia") - 0.02, click(-26)),             # ✗ sin consistencia
    (at("dos", 31) - 0.12, whoosh(0.3, True, -29)),      # frente 2
    (at("precio", 37) - 0.02, click(-27)),
    (at("protagonismo") - 0.02, click(-26)),
    (at("solución") - 0.12, whoosh(0.35, True, -27)),    # la solución
    (at("tres", 41.5) - 0.02, chime((1046.5, 1568.0), 0.7, -29)),
    (at("web", 48) - 0.12, whoosh(0.3, True, -29)),
    (at("hambre", 51) - 0.02, chime((1318.5, 1975.5), 0.8, -29)),
    (at("grande") - 0.02, thump(-23)),                   # "plato grande" + punch-in
    (at("pequeño") - 0.02, pop(-28)),
    (at("no", 61.3) - 0.25, whoosh(0.4, False, -27)),    # pasa a negro
    (at("comentarios") - 0.02, chime((1318.5, 1975.5), 0.8, -28)),
]
render(events, 69.87, "public/reel03/sfx.wav")
