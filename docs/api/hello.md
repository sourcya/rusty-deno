# Hello Module

```typescript
import { hello, getPid, getCpuCount, getCpuUsage, close } from "@sourcya/rusty-deno/hello";
```

Provides system information and a hello message from Rust. All functions are async and run on separate threads.

## Functions

### `hello()`

Returns a greeting message from Rust.

```typescript
const message = await hello();
// "Hello World! from Rust"
```

| | |
|--|--|
| **Returns** | `Promise<string>` |
| **Throws** | On platform mismatch or library load failure |

---

### `getPid()`

Returns the current process ID.

```typescript
const pid = await getPid();
// 12345
```

| | |
|--|--|
| **Returns** | `Promise<number>` |

---

### `getCpuCount()`

Returns the number of CPU cores on the host system.

```typescript
const cores = await getCpuCount();
// 8
```

| | |
|--|--|
| **Returns** | `Promise<number>` |

---

### `getCpuUsage()`

Returns the current CPU usage percentage. Takes approximately 200ms for accurate readings.

```typescript
const usage = await getCpuUsage();
// 15.23
```

| | |
|--|--|
| **Returns** | `Promise<number>` (0-100) |
| **Note** | Takes ~200ms to measure accurately |

---

### `close()`

Closes the native library and frees resources. Call this when you're done using the module.

```typescript
close();
```

| | |
|--|--|
| **Returns** | `void` |

## Complete Example

```typescript
import { hello, getPid, getCpuCount, getCpuUsage, close } from "@sourcya/rusty-deno/hello";

console.log(`Message: ${await hello()}`);
console.log(`PID: ${await getPid()}`);
console.log(`CPU Cores: ${await getCpuCount()}`);
console.log(`CPU Usage: ${(await getCpuUsage()).toFixed(2)}%`);

close();
```

## Notes

- All functions except `close()` are non-blocking and run on separate OS threads
- The library is loaded lazily on first function call
- Only one instance of the library is loaded per process
