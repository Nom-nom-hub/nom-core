export interface PluginVersion {
  checksum: string;
}

export interface PluginMetadata {
  name: string;
  versions: Record<string, PluginVersion>;
  latestVersion: string;
  description: string;
  author: string;
}

export type Registry = Record<string, PluginMetadata>;