# Nom Core

Nom Core is a powerful WebAssembly plugin system that enables secure, high-performance plugin architecture for modern applications.

![Nom Core](https://github.com/nom-cli/nom-core/raw/main/docs/src/assets/nom-logo.svg)

## Features

- 🔌 **Plugin Management**: Install, update, and manage WebAssembly plugins
- 🔒 **Secure Execution**: Run plugins in isolated WebAssembly environments
- 🚀 **High Performance**: Native-like performance with WebAssembly
- 🌐 **Cross-Platform**: Works on any platform that supports WebAssembly
- 📦 **Version Control**: Pin, rollback, and manage plugin versions

## Installation

```bash
# Using npm
npm install -g @teckmill/nom-cli

# Using yarn
yarn global add @teckmill/nom-cli

# Using bun
bun install -g @teckmill/nom-cli
```

## Quick Start

```bash
# Install a plugin
nom install @nom/example-plugin

# List installed plugins
nom list

# Update plugins
nom update --all

# Run a plugin
nom spin @nom/example-plugin
```

## Development

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/nom-cli/nom-core.git
cd nom-core

# Install dependencies
bun install

# Run in development mode
bun run dev

# Build the project
bun run build

# Run tests
bun test
```

## Creating Plugins

Nom supports plugins written in any language that compiles to WebAssembly. See the [plugin template](examples/plugin-template) for an example.

Basic steps:
1. Create a new project using the plugin template
2. Implement your plugin logic
3. Compile to WebAssembly
4. Publish your plugin

## CLI Commands

| Command | Description |
|---------|-------------|
| `nom install <plugin>` | Install a plugin |
| `nom update [plugin]` | Update plugins |
| `nom list` | List installed plugins |
| `nom spin <plugin>` | Run a plugin |
| `nom search <query>` | Search for plugins |
| `nom rollback <plugin>` | Rollback to a previous version |
| `nom pin <plugin>` | Pin a plugin to a specific version |

## Documentation

For full documentation, visit [nom-cli.github.io/nom-core](https://nom-cli.github.io/nom-core)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.
