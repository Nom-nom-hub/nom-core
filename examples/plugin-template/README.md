# My Nom Plugin

This is an example plugin for the Nom CLI.

## Building

```bash
cargo build --target wasm32-wasi --release

## Publishing
1. Build your plugin
2. Create a GitHub release
3. Upload plugin.wasm as a release asset
4. Update nom.json with the new version