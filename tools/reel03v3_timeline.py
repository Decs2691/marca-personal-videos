"""Línea de tiempo del reel 03 v3 (voz unida + tramos de video).
A: edit 0–A_END (gancho + lo que hacen bien) · B: voz en off (3 recomendaciones)
C: edit C_START–C_END ("Así que recuerden…") · D: voz en off (CTA)
Genera public/reel03/v3-voice.wav y src/reels/reel03v3-timeline.json
"""
import json, subprocess

A_END, C_START, C_END, TAIL = 22.86, 60.70, 63.62, 0.8
dur = lambda p: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                     capture_output=True, text=True).stdout)
B, D = dur("public/reel03/vo-main.wav"), dur("public/reel03/vo-cta.wav")
EDIT = "public/reel03/mrburger-edit.mp4"
graph = (f"[0:a]atrim=0:{A_END},asetpts=PTS-STARTPTS,aresample=44100,aformat=channel_layouts=stereo[a];"
         f"[1:a]aresample=44100,aformat=channel_layouts=stereo[b];"
         f"[0:a]atrim={C_START}:{C_END},asetpts=PTS-STARTPTS,aresample=44100,aformat=channel_layouts=stereo,"
         f"afade=t=in:d=0.01,afade=t=out:st={C_END - C_START - 0.01}:d=0.01[c];"
         f"[2:a]aresample=44100,aformat=channel_layouts=stereo,apad=pad_dur={TAIL}[d];"
         f"[a][b][c][d]concat=n=4:v=0:a=1[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", EDIT, "-i", "public/reel03/vo-main.wav", "-i", "public/reel03/vo-cta.wav",
                "-filter_complex", graph, "-map", "[out]", "public/reel03/v3-voice.wav"], check=True)
t = {"A": [0, A_END], "B": [A_END, A_END + B], "C": [A_END + B, A_END + B + (C_END - C_START)],
     "D": [A_END + B + (C_END - C_START), A_END + B + (C_END - C_START) + D + TAIL], "cStartInEdit": C_START}
t["duration"] = t["D"][1]
json.dump(t, open("src/reels/reel03v3-timeline.json", "w"), indent=1)
print(json.dumps(t), "| wav:", dur("public/reel03/v3-voice.wav"))
