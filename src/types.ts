export interface PluginVersion {
  url: string;
  checksum: string;
  size: number;
}

export interface PluginMetadata {
  name: string;
  description: string;
  author: string;
  latestVersion: string;
  versions: Record<string, PluginVersion>;
  version?: string;
}

export interface LoadedPlugin {
  name: string;
  wasm: Uint8Array;
  metadata: PluginMetadata;
}

export interface PluginError extends Error {
  code: string;
  plugin: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}