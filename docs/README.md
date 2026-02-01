# @sourcya/rusty-deno

Native Rust FFI bindings for Deno applications.

[![JSR](https://jsr.io/badges/@sourcya/rusty-deno)](https://jsr.io/@sourcya/rusty-deno)

## Features

- 🦀 **Native Rust performance** - Execute Rust code directly from Deno
- 🔒 **Type-safe** - Full TypeScript types for all exports
- 🐧 **Linux x64 support** - Built for Linux x86_64 systems
- 📦 **Modular** - Import only what you need
- ⚡ **Non-blocking** - All FFI calls run on separate threads

## Quick Start

```bash
deno add @sourcya/rusty-deno
```

```typescript
import { hello, getPid, getCpuCount, getCpuUsage, close } from "@sourcya/rusty-deno/hello";

console.log(await hello());           // "Hello World! from Rust"
console.log(await getPid());          // 12345
console.log(await getCpuCount());     // 8
console.log(await getCpuUsage());     // 15.23

close();
```

```bash
deno run --unstable-ffi --allow-ffi your-script.ts
```

## Documentation

| Section | Description |
|---------|-------------|
| [Getting Started](./getting-started.md) | Installation and first steps |
| [API Reference](./api/) | Module and function documentation |
| [Examples](./examples/) | Working code examples |
| [Concepts](./concepts/) | Technical deep-dives (ABI, FFI, memory) |
| [Contributing](./contributing.md) | Development setup and guidelines |

## Why This Project?

A learning initiative by [sourcya.io](https://sourcya.io) engineers to explore Rust through practical Deno FFI work. See [concepts/motivation.md](./concepts/motivation.md) for the full story.

## License

MIT License - see [LICENSE](../LICENSE) for details.
