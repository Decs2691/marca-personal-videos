import subs from "../reel03-subs.json";
import { makeTiming } from "../../lib/subs";
import { FPS } from "../../theme";

export const { lines, at } = makeTiming(subs);
export const DURATION_S = 69.87;
// Gancho vertical hasta "Pero quiero mencionar…"; luego pantalla dividida.
export const HOOK_END = at("pero", 7) - 2;
export { FPS };
