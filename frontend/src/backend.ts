// frontend/src/backend.ts
import { Actor, HttpAgent } from "@dfinity/agent";
import {
  idlFactory as backend_idl,
  canisterId as backend_canister_id,
} from "../declarations/backend";

// ---- ExternalBlob type + value ----
// Caffeine uses this shape for external file/blob metadata.
// We export both a type and a runtime value so both TS and Rollup are happy.
export type ExternalBlob = {
  id: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  url?: string;
};

export const ExternalBlob = {} as ExternalBlob;

// ---- Actor factory ----

export const createBackendActor = (identity?: any) => {
  const agent = new HttpAgent({ identity });

  // Local dev: trust local replica root key
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Ensure you are running a local replica:",
        err
      );
    });
  }

  return Actor.createActor(backend_idl as any, {
    agent,
    canisterId: backend_canister_id as any,
  });
};

// Default unauthenticated actor (you can swap in the Internet Identity identity)
export const backend = createBackendActor();

// Default export for `import backend from "../backend"`
export default backend;