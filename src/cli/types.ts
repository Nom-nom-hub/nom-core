import { PluginManager } from '../runtime/PluginManager';

export interface CLI {
  pluginManager: PluginManager;
}

export interface Command {
  name: string;
  description: string;
  args?: string;
  action: (arg1?: string, arg2?: string, cli?: CLI) => Promise<void>;
}