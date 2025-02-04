export const REGISTRY_CONFIG = {
  defaultRegistry: 'github',
  githubApiUrl: 'https://api.github.com',
  githubToken: process.env.NOM_GITHUB_TOKEN,
  cacheDir: '.nom/cache',
  configFile: '.nomrc',
  pluginFileName: 'plugin.wasm',
  pluginMetadataFile: 'nom.json'
};