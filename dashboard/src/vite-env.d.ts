interface ImportMetaEnv {
  readonly VITE_INDEXER_URL?: string;
  readonly VITE_STELLAR_EXPERT_NETWORK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
