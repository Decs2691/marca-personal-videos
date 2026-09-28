// Transcribe un video en español con tiempos por palabra (Whisper small, local).
// Uso: node tools/transcribe.mjs <video> <salida.json>   (ver tools/transcribe.sh)
import { pipeline, env } from "@huggingface/transformers";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const [video, out] = process.argv.slice(2);
const MODELS = process.env.ASR_MODELS ?? "/tmp/asr/small/package/models/";
env.localModelPath = MODELS;
env.allowRemoteModels = false; // huggingface.co está bloqueado en la nube

const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", video, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], {
  maxBuffer: 1 << 30,
});
const audio = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.byteLength / 4);
const asr = await pipeline("automatic-speech-recognition", "Xenova/whisper-small", { dtype: "q8" });
const res = await asr(audio, {
  language: "spanish",
  task: "transcribe",
  chunk_length_s: 30,
  stride_length_s: 5,
  return_timestamps: "word",
});
fs.writeFileSync(out, JSON.stringify(res, null, 1));
console.log(res.text);
