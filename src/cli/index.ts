import cac from 'cac';
import figlet from 'figlet';
import chalk from 'chalk';
import { SingleBar, Presets } from 'cli-progress';
import { PluginManager } from '../runtime/PluginManager';
import { RegistryManager } from '../registry/RegistryManager';
import { PluginMetadata } from '../types';  // Add this import
import semver from 'semver';

const CLI_VERSION = '0.1.0';

// Add welcome banner with version
const banner = figlet.textSync('Nom CLI', { 
  font: 'ANSI Shadow',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 120,
  whitespaceBreak: true
});

const lines = banner.split('\n');
const gradientColors = ['#00C6FF', '#0072FF', '#0072FF', '#00C6FF'];
const coloredBanner = lines.map((line, i) => {
  return chalk.hex(gradientColors[Math.min(i, gradientColors.length - 1)])(line);
}).join('\n');

// Center the banner and subtitle
const subtitle = 'Plugin Manager for WebAssembly';
console.log('\n' + coloredBanner);
console.log(chalk.dim(subtitle.padStart(subtitle.length + 35)) + chalk.yellow(` v${CLI_VERSION}`));
console.log(chalk.dim('─'.repeat(80)).padStart(95) + '\n');

// Wrap the initialization code in an async function
async function main() {
  const cli = cac('nom');
  const pluginManager = new PluginManager();
  const registry = new RegistryManager(pluginManager);

  // Initialize registry before running commands
  try {
    await registry.init();
  } catch (error: unknown) {
    console.error(chalk.red('Failed to initialize registry:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  cli
    .command('spin <plugin>', 'Start a plugin')
    .option('--version <version>', 'Specify plugin version')
    .action(async (plugin: string, options: { version?: string }) => {
      if (options.version && !semver.valid(options.version)) {
        console.error(chalk.red(`Invalid version format: ${options.version}`));
        return;
      }

      console.log(chalk.dim('\n📦 Installing plugin...'));
      let wasmModule: Uint8Array;
      let metadata: PluginMetadata;
      
      if (plugin.endsWith('.wasm')) {
        const fileData = await Bun.file(plugin).arrayBuffer();
        wasmModule = new Uint8Array(fileData);
        metadata = {
          name: plugin.split('/').pop()?.replace('_bg.wasm', '') || 'local-plugin',
          description: 'Local WASM plugin',
          author: 'Local',
          latestVersion: '0.0.1',
          versions: { 
            '0.0.1': {
              url: plugin,
              checksum: '',
              size: wasmModule.length
            }
          }
        };
      } else {
        const loadedModule = await registry.installPlugin(plugin, options.version);
        if (!loadedModule) {
          console.error(chalk.red(`Failed to load plugin: ${plugin}`));
          return;
        }
        wasmModule = loadedModule;
        const pluginMetadata = await registry.getPluginMetadata(plugin);
        if (!pluginMetadata) {
          console.error(chalk.red(`Failed to get metadata for plugin: ${plugin}`));
          return;
        }
        metadata = pluginMetadata;
      }
    
      if (!wasmModule) {
        console.error(chalk.red(`Failed to load plugin: ${plugin}`));
        return;
      }

      // Debug: Log WASM details
      console.log(chalk.dim('WASM file details:'));
      console.log(chalk.dim('├─ Size: ') + chalk.blue(`${wasmModule.length} bytes`));
      console.log(chalk.dim('└─ First 8 bytes: ') + chalk.blue(Array.from(wasmModule.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join(' ')));

      // Remove this line since we already have metadata
      // const metadata = await registry.getPluginMetadata(plugin);
      console.log('\n' + chalk.green('✨ Plugin Details:'));
      console.log(chalk.dim('├─') + ` Name: ${chalk.blue(metadata?.name)}`);
      console.log(chalk.dim('├─') + ` Version: ${chalk.yellow(options.version || metadata?.latestVersion)}`);
      console.log(chalk.dim('├─') + ` Author: ${chalk.cyan(metadata?.author)}`);
      console.log(chalk.dim('└─') + ` Description: ${metadata?.description}\n`);

      // In the spin command action:
      // Simplify the success message
      const success = await pluginManager.loadPlugin(plugin, wasmModule);
      if (success && metadata) {
        const pluginMetadata = {
          ...metadata,
          version: options.version || metadata.latestVersion
        };
        pluginManager.updatePluginMetadata(plugin, pluginMetadata);
        console.log(chalk.green(`✅ Plugin ${plugin} is ready to use`));
      } else {
        console.error(chalk.red(`Failed to load plugin: ${plugin}`));
      }
    });

  cli
    .command('list', 'List all installed plugins')
    .action(async () => {
      const plugins = await pluginManager.listPlugins();
      if (plugins.length === 0) {
        console.log(chalk.yellow('No plugins installed'));
        return;
      }

      console.log(chalk.green('\n📦 Installed Plugins:'));
      for (const pluginName of plugins) {
        const plugin = pluginManager.getPlugin(pluginName);
        console.log(chalk.dim('├─') + ` ${chalk.blue(pluginName)} ${chalk.gray(`v${plugin?.metadata?.version || 'unknown'}`)}`);
      }
      console.log();
    });

  cli
    .command('info <plugin>', 'Show detailed information about a plugin')
    .action(async (plugin: string) => {
      const metadata = await registry.getPluginMetadata(plugin);
      if (!metadata) {
        console.error(chalk.red(`Plugin ${plugin} not found`));
        return;
      }

      console.log(chalk.green('\n📦 Plugin Information:'));
      console.log(chalk.dim('├─') + ` Name: ${chalk.blue(metadata.name)}`);
      console.log(chalk.dim('├─') + ` Latest Version: ${chalk.yellow(metadata.latestVersion)}`);
      console.log(chalk.dim('├─') + ` Author: ${chalk.cyan(metadata.author)}`);
      console.log(chalk.dim('├─') + ` Description: ${metadata.description}`);
      console.log(chalk.dim('└─') + ` Available Versions: ${chalk.gray(Object.keys(metadata.versions).join(', '))}\n`);
    });

  cli
    .command('uninstall <plugin>', 'Uninstall a plugin')
    .option('--force', 'Force uninstall even if plugin is running')
    .action(async (plugin: string, options: { force?: boolean }) => {
      console.log(chalk.bold(`\n🗑️  Uninstalling ${chalk.blue(plugin)}...\n`));
      
      const success = await registry.uninstallPlugin(plugin, options.force);
      if (success) {
        console.log(chalk.green(`✅ Successfully uninstalled ${plugin}`));
      } else {
        console.error(chalk.red(`Failed to uninstall ${plugin}`));
      }
    });

  cli
    .command('search <query>', 'Search for plugins in the registry')
    .action(async (query: string) => {
      console.log(chalk.dim('\n🔍 Searching for plugins matching: ') + chalk.blue(query));
      const results = await registry.searchPlugins(query);
      
      if (results.length === 0) {
        console.log(chalk.yellow('\nNo plugins found matching your query'));
        return;
      }

      console.log(chalk.green(`\n📦 Found ${results.length} plugins:`));
      for (const plugin of results) {
        console.log(chalk.dim('├─') + ` ${chalk.blue(plugin.name)} ${chalk.gray(`v${plugin.latestVersion}`)}`);
        console.log(chalk.dim('│ ') + chalk.dim(plugin.description));
      }
      console.log();
    });

  cli
    .command('update [plugin]', 'Update plugins to their latest version')
    .option('--all', 'Update all installed plugins')
    .option('--force', 'Force update even if plugin is running')
    .action(async (plugin?: string, options?: { all?: boolean, force?: boolean }) => {
      const progressBar = new SingleBar({
        format: `${chalk.cyan('{bar}')} ${chalk.yellow('{percentage}%')} | ${chalk.green('{stage}')}`,
        barCompleteChar: '█',
        barIncompleteChar: '░',
        hideCursor: true,
      }, Presets.shades_classic);

      try {
        if (!plugin && !options?.all) {
          throw new Error('Please specify a plugin or use --all to update all plugins');
        }

        if (options?.all) {
          const plugins = await pluginManager.listPlugins();
          if (plugins.length === 0) {
            console.log(chalk.yellow('\nNo plugins installed'));
            return;
          }

          console.log(chalk.bold(`\n🔄 Updating ${plugins.length} plugins...\n`));
          progressBar.start(100, 0);
          let successCount = 0;
          let skippedCount = 0;
          
          for (const [index, name] of plugins.entries()) {
            const progress = Math.floor((index / plugins.length) * 100);
            progressBar.update(progress, { stage: `Checking ${name}...` });
            
            const isRunning = pluginManager.getPlugin(name);
            if (isRunning && !options.force) {
              skippedCount++;
              continue;
            }
            
            const success = await registry.updatePlugin(name);
            if (success) successCount++;
          }

          progressBar.update(100, { stage: '✅ Update complete' });
          progressBar.stop();

          if (skippedCount > 0) {
            console.log(chalk.yellow(`\n⚠️  Skipped ${skippedCount} running plugins - use --force to update anyway`));
          }
          console.log(chalk.green(`✨ Successfully updated ${successCount} plugins\n`));
          return;
        }

        if (plugin) {
          const isRunning = pluginManager.getPlugin(plugin);
          if (isRunning && !options?.force) {
            throw new Error(`Plugin ${plugin} is running. Use --force to update anyway`);
          }

          progressBar.start(100, 0, { stage: `Checking ${plugin}...` });
          const success = await registry.updatePlugin(plugin);
          
          if (success) {
            progressBar.update(100, { stage: '✅ Update complete' });
          } else {
            progressBar.update(100, { stage: '❌ Update failed' });
          }
          progressBar.stop();
        }
      } catch (error: unknown) {
        progressBar.stop();
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`\n❌ ${errorMessage}`));
      }
    });

  cli.help();
  cli.parse();
}

// Run the main function
main().catch((error: unknown) => {
  console.error(chalk.red('Fatal error:'), error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
});