import { Command, CLI } from '../types';
import chalk from 'chalk';
import { PluginManager } from '../../runtime/PluginManager';

export const runCommand: Command = {
  name: 'run',
  description: 'Run a plugin function',
  
  action: async (pluginName: string = '', functionName: string = '', cli?: CLI) => {
    if (!cli) {
      throw new Error('CLI instance is required');
    }

    if (!pluginName || !functionName) {
      console.error(chalk.red('Plugin name and function name are required'));
      return;
    }

    const pluginManager = cli.pluginManager;
    if (!pluginManager) {
      console.error(chalk.red('Plugin manager not initialized'));
      return;
    }

    try {
      // Check if plugin is loaded
      const plugin = pluginManager.getPlugin(pluginName);
      if (!plugin) {
        console.error(chalk.red(`Plugin '${pluginName}' is not loaded. Use 'spin' command first.`));
        return;
      }

      // Call the plugin function
      console.log(chalk.dim(`\n🚀 Calling ${chalk.blue(pluginName)}::${chalk.yellow(functionName)}...\n`));
      
      await pluginManager.callPluginFunction(pluginName, functionName);
      
      console.log(chalk.green('\n✅ Function executed successfully\n'));

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(chalk.red(`Failed to run plugin function: ${errorMessage}`));
    }
  }
};