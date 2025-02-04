import { Registry } from './types';
import { PluginMetadata } from '../types';

export const mockRegistry: Record<string, PluginMetadata> = {
  '@nom/auth': {
    name: '@nom/auth',
    version: '1.0.0',
    versions: {
      '1.0.0': {
        url: 'https://github.com/nom-plugins/auth/releases/download/v1.0.0/auth.wasm',
        checksum: 'mock-checksum-1',
        size: 1024
      },
      '0.1.0': {
        url: 'https://github.com/nom-plugins/auth/releases/download/v0.1.0/auth.wasm',
        checksum: 'mock-checksum-2',
        size: 956
      }
    },
    latestVersion: '1.0.0',
    description: 'Authentication plugin for Nom',
    author: 'Nom Team'
  }
};