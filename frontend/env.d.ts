/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_CANISTER_ID_BACKEND: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}