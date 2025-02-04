export interface Plugin {
  name: string;
  version: string;
  status: 'loaded' | 'running' | 'stopped' | 'error';
  instance?: any;
}

export interface PluginMetadata {
  name: string;
  version: string;
  latestVersion: string;
  description: string;
  author: string;
  versions: Record<string, { checksum: string }>;
}