type GeneratedFactory = (options?: unknown) => Promise<unknown>;

export async function loadGeneratedModule(): Promise<GeneratedFactory | null> {
  try {
    const generatedModulePath = "../generated/adobeDng.js";
    const module = await import(/* @vite-ignore */ generatedModulePath);
    return (module.default || module) as GeneratedFactory;
  } catch {
    return null;
  }
}

export type { GeneratedFactory };
