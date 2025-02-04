import { join } from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { REGISTRY_CONFIG } from './config';
import { PluginValidator } from './validation';
import { mockRegistry } from './mockRegistry';
import { PluginMetadata } from '../types';
import { SingleBar, Presets } from 'cli-progress';
import chalk from 'chalk';
import { unlink } from 'fs/promises';
import { PluginManager } from '../runtime/PluginManager';
import { GithubRegistry } from './GithubRegistry';

export class RegistryManager {
  private githubRegistry: GithubRegistry;
  private registryPath: string;
  private cachePath: string;
  private pluginManager: PluginManager;

  constructor(pluginManager: PluginManager) {
    this.githubRegistry = new GithubRegistry();
    this.registryPath = join(process.cwd(), '.nom', 'registry');
    this.cachePath = join(process.cwd(), REGISTRY_CONFIG.cacheDir);
    this.pluginManager = pluginManager;
  }

  async init() {
    await mkdir(this.registryPath, { recursive: true });
    await mkdir(this.cachePath, { recursive: true });
  }

  async installPlugin(name: string, version?: string): Promise<Uint8Array | null> {
    const progressBar = new SingleBar({
      format: `${chalk.cyan('{bar}')} ${chalk.yellow('{percentage}%')} | ${chalk.green('{stage}')}`,
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
    }, Presets.shades_classic);

    try {
      console.log(chalk.bold(`\n📦 Installing ${chalk.blue(name)}${version ? chalk.gray(` @ ${version}`) : ''}\n`));
      
      const [registry, pluginName] = this.parsePluginName(name);
      progressBar.start(100, 0, { stage: `Fetching metadata...` });
      const metadata = await this.fetchPluginMetadata(registry, pluginName);
      
      if (!metadata) {
        progressBar.stop();
        return null; // Early return, error already logged by GithubRegistry
      }
      progressBar.update(20);

      // Version resolution
      const targetVersion = version || metadata.latestVersion;
      progressBar.update(30, { stage: `📋 Resolved version: ${targetVersion}` });
      if (!metadata.versions[targetVersion]) {
        progressBar.stop();
        throw new Error(`Version ${targetVersion} not found for plugin ${name}`);
      }

      // Check cache first
      progressBar.update(40, { stage: `🔍 Checking cache...` });
      const cachedPlugin = await this.loadFromCache(name, targetVersion);
      if (cachedPlugin) {
        const validation = await PluginValidator.validateWasm(cachedPlugin);
        if (validation.isValid) {
          progressBar.update(100, { stage: `✅ Using cached version` });
          progressBar.stop();
          return cachedPlugin;
        }
      }
      progressBar.update(50);

      // Download plugin
      progressBar.update(60, { stage: `⬇️  Downloading plugin...` });
      const wasmModule = await this.downloadPlugin(registry, pluginName, targetVersion);
      progressBar.update(70);
      
      // Validate downloaded module
      progressBar.update(80, { stage: `🔒 Validating plugin...` });
      const validation = await PluginValidator.validateWasm(wasmModule);
      if (!validation.isValid) {
        progressBar.stop();
        throw new Error(`Invalid plugin: ${validation.error}`);
      }
      progressBar.update(90);

      // Cache valid plugin
      progressBar.update(95, { stage: `💾 Caching plugin...` });
      await this.cachePlugin(name, targetVersion, wasmModule);
      
      progressBar.update(100, { stage: `✅ Plugin installed successfully` });
      progressBar.stop();
      return wasmModule;
    } catch (error: any) {
      progressBar.stop();
      console.error(chalk.red(`\n❌ Installation failed:`), error.message);
      return null;
    }
  }

  private parsePluginName(name: string): [string, string] {
    // Remove any leading '@' or 'github:' prefix
    const cleanName = name.replace(/^(@|github:)/, '');
    const parts = cleanName.split('/');
    
    // If only one part, assume it's a repo name and use default registry
    if (parts.length === 1) {
      return [REGISTRY_CONFIG.defaultRegistry, parts[0]];
    }
    
    // Otherwise, use the first part as owner and join the rest as repo name
    const [owner, ...repoParts] = parts;
    return ['github', `${owner}/${repoParts.join('/')}`];
  }

  private async fetchPluginMetadata(registry: string, name: string): Promise<PluginMetadata | null> {
    try {
      const { owner, repo } = this.githubRegistry.parsePluginIdentifier(name);
      return await this.githubRegistry.getPluginMetadata(owner, repo);
    } catch (error) {
      console.error('Failed to fetch plugin metadata:', error);
      return null;
    }
  }

  // Remove this duplicate implementation since there's another downloadPlugin method below

  async getPluginMetadata(name: string): Promise<PluginMetadata | null> {
    const [registry, pluginName] = this.parsePluginName(name);
    return this.fetchPluginMetadata(registry, pluginName);
  }

  private async downloadPlugin(_registry: string, _name: string, _version: string): Promise<Uint8Array> {
    // Return mock WASM module for development
    return new Uint8Array([0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00]);
  }

  private async loadFromCache(name: string, version: string): Promise<Uint8Array | null> {
    try {
      const safeName = name.replace('/', '_');
      const cachePath = join(this.cachePath, `${safeName}@${version}.wasm`);
      const cached = await readFile(cachePath);
      return new Uint8Array(cached);
    } catch {
      return null;
    }
  }

  private async cachePlugin(name: string, version: string, wasmModule: Uint8Array): Promise<void> {
    const safeName = name.replace('/', '_');
    const cachePath = join(this.cachePath, `${safeName}@${version}.wasm`);
    await writeFile(cachePath, wasmModule);
  }

  async uninstallPlugin(name: string, force: boolean = false): Promise<boolean> {
    const progressBar = new SingleBar({
      format: `${chalk.cyan('{bar}')} ${chalk.yellow('{percentage}%')} | ${chalk.green('{stage}')}`,
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
    }, Presets.shades_classic);

    try {
      progressBar.start(100, 0, { stage: 'Checking plugin metadata...' });
      const metadata = await this.getPluginMetadata(name);
      if (!metadata) {
        progressBar.stop();
        throw new Error('Plugin not found');
      }

      // Check if plugin is in use
      const plugin = this.pluginManager.getPlugin(name);
      if (!force && plugin) {
        progressBar.stop();
        throw new Error('Plugin is currently in use. Use --force to uninstall anyway.');
      }
      progressBar.update(30);

      // Rest of the uninstall process remains the same...
      // Remove all cached versions
      const versions = Object.keys(metadata.versions);
      progressBar.update(40, { stage: `Found ${versions.length} cached versions` });

      for (const [index, version] of versions.entries()) {
        const safeName = name.replace('/', '_');
        const cachePath = join(this.cachePath, `${safeName}@${version}.wasm`);
        await unlink(cachePath).catch(() => {});
        
        const progress = 40 + Math.floor((index + 1) / versions.length * 50);
        progressBar.update(progress, { stage: `Removing version ${version}...` });
      }

      progressBar.update(100, { stage: '✅ Plugin uninstalled successfully' });
      progressBar.stop();
      return true;
    } catch (error) {
      progressBar.stop();
      console.error(chalk.red(`Failed to uninstall plugin ${name}:`), error);
      return false;
    }
  }

  async searchPlugins(query: string): Promise<PluginMetadata[]> {
    const results = Object.values(mockRegistry).filter(plugin => 
      plugin.name.toLowerCase().includes(query.toLowerCase()) ||
      plugin.description.toLowerCase().includes(query.toLowerCase())
    );
    return results;
  }

  async updatePlugin(name: string): Promise<boolean> {
    const metadata = await this.getPluginMetadata(name);
    if (!metadata) {
      console.error(chalk.red(`Plugin ${name} not found`));
      return false;
    }

    const currentPlugin = await this.loadFromCache(name, metadata.latestVersion);
    if (currentPlugin) {
      console.log(chalk.green(`✓ ${name} is already up to date (v${metadata.latestVersion})`));
      return true;
    }

    console.log(chalk.yellow(`⬆️  Updating ${name} to v${metadata.latestVersion}...`));
    const success = await this.installPlugin(name, metadata.latestVersion);
    return !!success;
  }
}