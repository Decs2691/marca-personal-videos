#!/usr/bin/env bash
# Prepara Whisper small (una vez por sesión) y transcribe un video.
# Uso: tools/transcribe.sh public/reelNN/video.mp4 tools/reelNN-asr-small.json
#
# Por qué así: huggingface.co está bloqueado en la nube, pero el mismo modelo
# (Xenova/whisper-small, ONNX q8) existe en npm como "sts-whisper-small"
# (solo archivos del modelo, sin scripts). onnxruntime-node se instala con
# --ignore-scripts porque su postinstall intenta bajar binarios GPU de nuget.
set -euo pipefail
ASR=/tmp/asr
if [ ! -d "$ASR/small/package/models/Xenova/whisper-small" ]; then
  mkdir -p "$ASR/small" && (cd "$ASR/small" && npm pack sts-whisper-small --silent >/dev/null && tar xzf sts-whisper-small-*.tgz)
fi
if [ ! -d "$ASR/node_modules/@huggingface/transformers" ]; then
  (cd "$ASR" && npm init -y >/dev/null && npm install --silent --ignore-scripts @huggingface/transformers)
fi
cp "$(dirname "$0")/transcribe.mjs" "$ASR/transcribe.mjs"
node "$ASR/transcribe.mjs" "$(realpath "$1")" "$(realpath -m "$2")"
