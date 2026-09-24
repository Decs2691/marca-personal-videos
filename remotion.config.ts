import { Config } from "@remotion/cli/config";

// Ajustes para IG Reels / TikTok: H.264, yuv420p (rango limitado) y BT.709,
// que es lo que esperan las apps; con yuvj420p/BT.470 los colores se desplazan
// al recomprimir. CRF bajo = archivo de origen con margen de calidad, porque
// ambas plataformas vuelven a comprimir al subir.
Config.setVideoImageFormat("png");
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setColorSpace("bt709");
Config.setCrf(14);
Config.setOverwriteOutput(true);
