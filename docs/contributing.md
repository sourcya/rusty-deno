# Contributing

## Project Structure

```
rusty-deno/
├── src/                 # TypeScript FFI wrappers
│   ├── mod.ts          # Main exports
│   ├── hello.ts        # Hello module wrapper
│   └── lib.ts          # FFI loader utilities
├── native/             # Rust source code
│   ├── Cargo.toml      # Workspace config
│   ├── build.sh        # Build script
│   └── hello/          # Hello module crate
├── lib/                # Compiled native libraries (after build)
├── examples/           # Example projects
├── docs/               # Documentation
└── .github/workflows/  # CI/CD
```

## Prerequisites

- [Rust toolchain](https://rustup.rs/) 1.85+ (for 2024 edition)
- [Deno](https://deno.land/) 2.x

## Development Setup

```bash
# Clone the repository
git clone https://github.com/sourcya/rusty-deno.git
cd rusty-deno

# Build native libraries
deno task build

# Run example to verify
deno task example:hello
```

## Available Tasks

| Task | Description |
|------|-------------|
| `deno task build` | Build native libraries |
| `deno task build:verbose` | Build with verbose output |
| `deno task clean` | Clean build artifacts |
| `deno task example:hello` | Run the hello example |
| `deno task check` | Type-check TypeScript sources |

## Adding a New Module

1. **Create Rust crate** in `native/your-module/`
2. **Add to workspace** in `native/Cargo.toml`
3. **Update build script** to copy the new `.so`
4. **Create TypeScript wrapper** in `src/your-module.ts`
5. **Export from** `src/mod.ts`
6. **Add to** `deno.json` exports
7. **Write docs** in `docs/api/your-module.md`
8. **Create example** in `examples/your-module/`

## Code Style

### Rust

- Use Rust 2024 edition
- `#[unsafe(no_mangle)]` for FFI functions
- `extern "C"` for C ABI compatibility
- Document all public functions

### TypeScript

- All FFI calls should be `nonblocking: true`
- Wrapper functions should be `async`
- Always provide `close()` for resource cleanup

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `deno task check` to verify types
5. Test with `deno task example:hello`
6. Submit a PR

## Questions?

Open an issue on [GitHub](https://github.com/sourcya/rusty-deno/issues).
