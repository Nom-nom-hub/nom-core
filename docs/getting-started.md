# Getting Started with Nom Core

This guide will help you get up and running with Nom Core, a powerful WebAssembly plugin system.

## Installation

Install Nom CLI globally using your preferred package manager:

```bash
# Using npm
npm install -g @teckmill/nom-cli

# Using yarn
yarn global add @teckmill/nom-cli

# Using bun
bun install -g @teckmill/nom-cli
```

## Basic Usage

Once installed, you can use the `nom` command in your terminal:

```bash
# Check the installed version
nom --version

# Get help
nom --help
```

## Installing Plugins

To install a plugin:

```bash
nom install @nom/example-plugin
```

## Listing Installed Plugins

To see what plugins you have installed:

```bash
nom list
```

## Running Plugins

To run a plugin:

```bash
nom spin @nom/example-plugin
```

## Creating Your First Plugin

### Prerequisites

- Rust installed on your system
- Basic knowledge of Rust programming

### Steps

1. Create a new directory for your plugin:

```bash
mkdir my-nom-plugin
cd my-nom-plugin
```

2. Initialize a new Rust project:

```bash
cargo init --lib
```

3. Update your Cargo.toml:

```toml
[package]
name = "my-nom-plugin"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

4. Create a simple plugin in src/lib.rs:

```rust
#[no_mangle]
pub extern "C" fn hello() -> i32 {
    println!("Hello from my first Nom plugin!");
    0
}
```

5. Build your plugin:

```bash
cargo build --target wasm32-wasi --release
```

6. Create a nom.json file:

```json
{
  "name": "@your-username/my-plugin",
  "version": "0.1.0",
  "description": "My first Nom plugin",
  "author": "Your Name",
  "latestVersion": "0.1.0",
  "versions": {
    "0.1.0": {
      "sha256": "auto-generated-on-release",
      "published": "2023-11-01"
    }
  }
}
```

7. Test your plugin locally:

```bash
nom spin ./target/wasm32-wasi/release/my_nom_plugin.wasm
```

## Next Steps

- Check out the [full documentation](https://nom-cli.github.io/nom-core)
- Explore the [example plugins](https://github.com/nom-cli/nom-core/tree/main/examples)
- Join our community to share your plugins