import type { GeneratedFactory } from "./loadGeneratedModule";

export async function createGeneratedRuntime(factory: GeneratedFactory): Promise<unknown> {
  // Adobe DNG is an optional runtime. Its binary is intentionally absent in
  // this repository, so keep the URL dynamic: bundlers can retain the
  // fallback adapter instead of failing the entire browser build on a file
  // that is only present in Adobe-enabled builds.
  const generatedWasmPath = "../generated/adobeDng.wasm";
  const url = new URL(generatedWasmPath, import.meta.url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load Adobe DNG wasm: ${response.status} ${response.statusText}`);
  }

  const wasmBinary = new Uint8Array(await response.arrayBuffer());
  return factory({ wasmBinary });
}
