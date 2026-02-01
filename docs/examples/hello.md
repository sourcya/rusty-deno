# Hello Example

Basic example demonstrating the hello module from `@sourcya/rusty-deno`.

## What It Does

- Calls Rust to get a "Hello World!" message
- Retrieves the current process ID
- Gets the number of CPU cores
- Measures current CPU usage percentage

## Source

```typescript
import {
  hello,
  getPid,
  getCpuCount,
  getCpuUsage,
  close,
} from "@sourcya/rusty-deno/hello.ts";

async function main() {
  console.log(`Message: ${await hello()}`);
  console.log(`Process ID: ${await getPid()}`);
  console.log(`CPU Cores: ${await getCpuCount()}`);
  console.log(`CPU Usage: ${(await getCpuUsage()).toFixed(2)}%`);
  close();
}

main();
```

## Running

### Option 1: Using deno task

```bash
# From project root
deno task example:hello

# Or from examples/hello directory
deno task start
```

### Option 2: Direct run

```bash
deno run --unstable-ffi --allow-ffi examples/hello/main.ts
```

## Expected Output

```
Message: Hello World! from Rust
Process ID: 12345
CPU Cores: 8
CPU Usage: 15.23%
```

## Required Permissions

| Flag | Purpose |
|------|---------|
| `--unstable-ffi` | Enables the FFI API |
| `--allow-ffi` | Allows loading native code |
