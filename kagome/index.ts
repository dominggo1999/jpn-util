import fs from "fs";
import Go from "./wasm_exec";
import path from "path";

const go = new Go();
const buf = fs.readFileSync(path.resolve("./kagome/kagome.wasm"));
const wasm = await WebAssembly.instantiate(
  new Uint8Array(buf),
  go.importObject,
);
go.run(wasm.instance);

export type KagomeTokenizer = (text: string) => {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: string;
  base_form: string;
  reading: string;
  pronunciation: string;
}[];

export const kagomeTokenizer = globalThis.kagomeTokenizer as KagomeTokenizer;
