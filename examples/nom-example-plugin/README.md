# Nom Example Plugin

This is a simple example plugin for the Nom CLI that demonstrates the basic functionality of Nom plugins.

## Features

- Simple "hello world" function
- Demonstrates WebAssembly integration with Nom
- Shows proper plugin structure

## Building

```bash
# Build the plugin
cargo build --target wasm32-wasi --release

# The output will be in target/wasm32-wasi/release/nom_example_plugin.wasm
```

## Testing Locally

After building, you can test the plugin locally with:

```bash
# Using the local WASM file
nom spin ./target/wasm32-wasi/release/nom_example_plugin.wasm

# Call the hello function
nom run nom_example_plugin hello
```

## Plugin Structure

This example demonstrates the minimal required structure for a Nom plugin:

1. A Cargo.toml file with `crate-type = ["cdylib"]`
2. A nom.json file with metadata
3. At least one exported function

## Publishing

1. Build your plugin
2. Create a GitHub release
3. Upload the WASM file as a release asset
4. Update the nom.json with the new version and SHA256 hash

## Learn More

For more information on creating plugins, see the [Nom documentation](https://nom-cli.github.io/nom-core).