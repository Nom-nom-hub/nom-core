import { WasmFs } from '@wasmer/wasmfs';
import { WASI } from '@wasmer/wasi';
import { PluginMetadata } from '../types';

interface LoadedPlugin {
  name: string;
  wasm: Uint8Array;
  metadata: PluginMetadata | null;
  instance?: WebAssembly.Instance;
  exports?: WebAssembly.Exports;
  wasi?: WASI;  // Add WASI instance
}

export class PluginManager {
  private activePlugins: Map<string, LoadedPlugin>;
  private wasmFs: WasmFs;

  constructor() {
    this.activePlugins = new Map();
    this.wasmFs = new WasmFs();
    
    const originalWriteSync = this.wasmFs.fs.writeSync.bind(this.wasmFs.fs);
    
    type TEncoding = 'utf8' | 'utf-8' | 'ascii' | 'binary';
    
    interface WriteSyncFunction {
      (fd: number, buffer: Uint8Array | Buffer, offset?: number, length?: number, position?: number): number;
      (fd: number, str: string, position?: number, encoding?: TEncoding): number;
    }

    const customWriteSync: WriteSyncFunction = (
      fd: number,
      data: string | Uint8Array | Buffer,
      offsetOrPosition?: number,
      lengthOrEncoding?: number | TEncoding,
      position?: number
    ): number => {
      if (typeof data === 'string') {
        // Handle string data with proper type checking for encoding
        const encoding = lengthOrEncoding as TEncoding | undefined;
        const position = offsetOrPosition as number | undefined;
        // Ensure encoding is strictly 'utf8' instead of 'utf-8' to match the expected type
        const normalizedEncoding = encoding === 'utf-8' ? 'utf8' : encoding;
        return originalWriteSync(fd, data, position, normalizedEncoding);
      }
      
      const text = new TextDecoder().decode(data);
      if (fd === 1) console.log(text);
      if (fd === 2) console.error(text);
      return originalWriteSync(fd, data, offsetOrPosition, lengthOrEncoding as number, position);
    };

    this.wasmFs.fs.writeSync = customWriteSync as typeof this.wasmFs.fs.writeSync;
  }

  async loadPlugin(name: string, wasmModule: Uint8Array): Promise<boolean> {
    try {
      console.log("Compiling WASM module...");
      const module = await WebAssembly.compile(wasmModule);
      
      // Debug module info
      console.log("Module Exports:", WebAssembly.Module.exports(module));
      console.log("Module Imports:", WebAssembly.Module.imports(module));
      
      // Create shared memory with larger initial size
      const memory = new WebAssembly.Memory({ initial: 17, shared: false });
      
      console.log("Setting up imports...");
      const importObject: WebAssembly.Imports = {
        env: {
          memory
        },
        wbg: {
          __wbindgen_init_externref_table: () => {
            // Function should return void, the module exports its own table
          }
        }
      };

      console.log("Instantiating WASM module...");
      const instance = await WebAssembly.instantiate(module, importObject);
      
      // Call __wbindgen_start to initialize the module
      if (typeof instance.exports.__wbindgen_start === 'function') {
        (instance.exports.__wbindgen_start as Function)();
      }
      
      console.log("Module exports:");
      Object.entries(instance.exports).forEach(([name, exp]) => {
        const type = exp instanceof WebAssembly.Memory ? "memory" :
                    exp instanceof WebAssembly.Table ? "table" :
                    exp instanceof WebAssembly.Global ? "global" :
                    typeof exp === "function" ? "function" : "unknown";
        console.log(`- ${name}: ${type}`);
      });

      this.activePlugins.set(name, {
        name,
        wasm: wasmModule,
        metadata: null,
        instance,
        exports: instance.exports
      });

      return true;
    } catch (error) {
      console.error('Failed to load plugin:', error);
      console.error('Error details:', (error as Error).stack);
      return false;
    }
  }

  async listPlugins(): Promise<string[]> {
    return Array.from(this.activePlugins.keys());
  }

  updatePluginMetadata(name: string, metadata: PluginMetadata): void {
    const plugin = this.activePlugins.get(name);
    if (plugin) {
      plugin.metadata = metadata;
    }
  }

  getPlugin(name: string): LoadedPlugin | undefined {
    return this.activePlugins.get(name);
  }

  killPlugin(name: string): boolean {
    return this.activePlugins.delete(name);
  }

  killAll(): void {
    this.activePlugins.clear();
  }

  async initPlugin(name: string): Promise<boolean> {
      const plugin = this.activePlugins.get(name);
      if (!plugin) return false;
  
      try {
        // Use the existing instance instead of creating a new one
        if (plugin.instance && typeof plugin.instance.exports.init === 'function') {
          await (plugin.instance.exports.init as Function)();
        }
        return true;
      } catch (error) {
        console.error(`Failed to initialize plugin ${name}:`, error);
        return false;
      }
    }
  
    async cleanupPlugin(name: string): Promise<boolean> {
      const plugin = this.activePlugins.get(name);
      if (!plugin) return false;
  
      try {
        // Call cleanup if available
        if (typeof plugin.instance?.exports.cleanup === 'function') {
          await (plugin.instance.exports.cleanup as Function)();
        }
        return this.killPlugin(name);
      } catch (error) {
        console.error(`Failed to cleanup plugin ${name}:`, error);
        return false;
      }
    }
  async callPluginFunction(name: string, functionName: string, ...args: any[]): Promise<any> {
      const plugin = this.activePlugins.get(name);
      if (!plugin || !plugin.instance) {
        throw new Error(`Plugin ${name} not found or not initialized`);
      }
  
      const fn = plugin.instance.exports[functionName];
      if (typeof fn !== 'function') {
        throw new Error(`Plugin ${name} does not have function: ${functionName}`);
      }
  
      return await (fn as Function)(...args);
    }
}