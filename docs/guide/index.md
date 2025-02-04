# Introduction

Nom Core is a powerful plugin system that allows you to extend your applications using WebAssembly modules. It provides a secure, high-performance way to load and execute plugins at runtime.

## Why Nom Core?

- 🔌 **Plugin Architecture**: Build extensible applications with ease
- 🚀 **WebAssembly Performance**: Near-native speed for your plugins
- 🔒 **Secure by Design**: Sandboxed execution environment
- 📦 **Simple Distribution**: Distribute plugins via GitHub releases
- 🛠 **Language Agnostic**: Write plugins in Rust, C++, or any WASM-compatible language

## Quick Example

```typescript
import { PluginManager } from '@nom-core/cli';

// Initialize the plugin manager
const manager = new PluginManager();

// Load a plugin
await manager.loadPlugin('@nom/validator');

// Use the plugin
const validator = manager.getPlugin('@nom/validator');
const isValid = validator.validateEmail('user@example.com');