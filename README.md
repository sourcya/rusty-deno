# @sourcya/rusty-deno

Native Rust FFI bindings for Deno applications.

[![JSR](https://jsr.io/badges/@sourcya/rusty-deno)](https://jsr.io/@sourcya/rusty-deno)

## Quick Start

```bash
deno add jsr:@sourcya/rusty-deno
```

```ts
import { hello, getPid, getCpuCount, getCpuUsage, close } from "@sourcya/rusty-deno";

console.log(await hello());       // "Hello World!"
console.log(await getPid());      // 12345
console.log(await getCpuCount()); // 8
console.log(await getCpuUsage()); // 15.23

close();
```

```bash
deno run --unstable-ffi --allow-ffi your-script.ts
```

## Documentation

| Section | Description |
|---------|-------------|
| [Getting Started](./docs/getting-started.md) | Installation and first steps |
| [API Reference](./docs/api/) | Module and function documentation |
| [Examples](./docs/examples/) | Working code examples |
| [Concepts](./docs/concepts/) | Technical deep-dives (ABI, FFI, memory) |
| [Contributing](./docs/contributing.md) | Development setup and guidelines |

## License

MIT
