# API Reference

## Available Modules

| Module | Import Path | Description |
|--------|-------------|-------------|
| [Hello](./hello.md) | `@sourcya/rusty-deno/hello` | System information and hello message from Rust |

## Common Patterns

### Async/Await

All FFI functions return Promises and should be awaited:

```typescript
const result = await someFunction();
```

### Resource Cleanup

Always call `close()` when you're done to free native resources:

```typescript
import { hello, close } from "@sourcya/rusty-deno/hello";

const msg = await hello();
// ... use the module ...
close();
```

### Error Handling

FFI calls can throw errors for:
- Unsupported platform (non-Linux or non-x86_64)
- Missing native library (forgot to build)
- Memory allocation failures

```typescript
try {
  const msg = await hello();
} catch (error) {
  console.error("FFI error:", error.message);
}
```
