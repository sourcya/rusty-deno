# Getting Started

## Installation

```bash
deno add @sourcya/rusty-deno
```

Or import directly:

```typescript
import { hello, getPid, getCpuCount, getCpuUsage } from "jsr:@sourcya/rusty-deno/hello";
```

## Quick Example

```typescript
import { hello, getPid, getCpuCount, getCpuUsage, close } from "@sourcya/rusty-deno/hello";

// All FFI calls are async and non-blocking
const message = await hello();
console.log(message); // "Hello World! from Rust"

console.log(`PID: ${await getPid()}`);
console.log(`CPU Cores: ${await getCpuCount()}`);
console.log(`CPU Usage: ${(await getCpuUsage()).toFixed(2)}%`);

// Clean up when done
close();
```

## Running Your Code

FFI requires special permissions:

```bash
deno run --unstable-ffi --allow-ffi your-script.ts
```

| Flag | Purpose |
|------|---------|
| `--unstable-ffi` | Enables the FFI API (unstable feature) |
| `--allow-ffi` | Allows loading and executing native code |

## Requirements

- **Deno** 2.x with FFI support
- **Linux x86_64** (other platforms not yet supported)

## Next Steps

- Browse the [API Reference](./api/) for all available functions
- Check out [Examples](./examples/) for complete working projects
- Read [Concepts](./concepts/motivation.md) to understand how FFI works
