// frontend/declarations/backend.ts
// Minimal stub for Vite + local dev. Replace with real dfx-generated declarations later.

export const canisterId = "aaaaa-aa"; // placeholder; gets replaced once you run `dfx generate backend`

// DFX will normally pass in an { IDL } object; we don't care right now.
// Returning an empty service is enough to satisfy the Agent.
export const idlFactory = (_: any) => {
  return {} as any;
};