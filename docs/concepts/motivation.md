# Motivation

## Why This Project Exists

This repository is part of a learning initiative by system engineers at [sourcya.io](https://sourcya.io) to explore Rust in a practical, intuitive way. Rather than learning Rust in isolation, we connect it directly to our everyday work with the Deno runtime. This repo documents that journey.

## The Power and Danger of FFI

Running FFI (Foreign Function Interface) code is both **powerful** and **dangerous**:

- FFI can execute arbitrary native code with full system access
- It can make syscalls, access memory directly, and do anything the host OS permits
- There's no sandbox—you're running at the same privilege level as the Deno process
- A bug in FFI code can crash your entire application or corrupt memory

This is why Deno requires explicit `--allow-ffi` permission—it's acknowledging you're stepping outside the secure sandbox.

## Why Deno Makes This Worth Exploring

Deno's design philosophy makes FFI exploration particularly compelling:

- **Security-first model** - The contrast between Deno's sandbox and raw FFI access teaches you what the sandbox protects
- **TypeScript native** - Write type-safe wrappers around unsafe native code
- **Modern tooling** - JSR publishing, built-in tasks, and first-class FFI support
- **Permission system** - Understand the boundary between safe and unsafe code

## Native Code Approaches Compared

| Approach | Performance | Safety | Complexity | Use Case |
|----------|-------------|--------|------------|----------|
| **FFI (this repo)** | Fastest | Lowest (unsafe) | Medium | CPU-intensive, syscalls, existing C/Rust libs |
| **WebAssembly** | Fast | High (sandboxed) | Low | Portable compute, no syscalls needed |
| **Custom Deno Runtime** | Fastest | Variable | Highest | Deep integration, custom ops |

### FFI
- Direct native code execution
- Full system access
- No overhead beyond the call itself
- Requires managing memory manually

### WebAssembly
- Runs in a sandboxed VM
- Cannot make syscalls directly
- Portable across platforms
- Memory-safe by design

### Custom Deno Runtime
- Modify Deno itself with custom "ops"
- Maximum control and performance
- Requires forking/building Deno
- Highest maintenance burden

---

# Technical Concepts

## A. What is an ABI?

**ABI (Application Binary Interface)** defines how functions are called at the machine level:

- How arguments are passed (registers vs stack)
- How return values are delivered
- How the stack is managed (caller vs callee cleanup)
- Name mangling conventions

Think of it as the "calling convention contract" between compiled code. When Deno calls your Rust function, both sides must agree on the ABI, or arguments will be misinterpreted and crashes will occur.

The most universal ABI is the **C ABI**—it's the lingua franca of native code interop.

## B. Why We Annotate `extern "C"` in Rust

```rust
pub extern "C" fn get_pid() -> u32 {
    process::id()
}
```

Rust has its own ABI that can change between compiler versions. By writing `extern "C"`, we tell Rust:

1. **Use the C calling convention** - Arguments and returns follow C ABI rules
2. **Make it callable from other languages** - Any language that can call C can call this
3. **Stable interface** - The C ABI is stable; Rust's internal ABI is not

Without `extern "C"`, Deno's FFI couldn't reliably call our functions.

## C. Real Parallelism and Multithreading with FFI

JavaScript is famously single-threaded. Even with `async/await`, you're just scheduling tasks on one thread. **FFI with `nonblocking: true` changes this.**

```typescript
const symbols = {
  get_cpu_usage: {
    parameters: [],
    result: "f32",
    nonblocking: true,  // ← This is the magic
  },
}
```

When `nonblocking: true`:

1. Deno spawns a **separate OS thread** for the FFI call
2. The JavaScript thread continues executing immediately
3. The FFI call returns a `Promise` that resolves when the native code completes
4. **True parallelism** - both threads run simultaneously on different CPU cores

This is why our CPU-intensive Rust functions don't block the event loop—they're literally running on different threads.

## D. Why We Return Buffers, Not Strings or Complex Types

FFI operates at the binary level. The only types that cross the FFI boundary safely are:

| Safe FFI Types | Why |
|----------------|-----|
| Integers (`u8`, `u32`, `i64`) | Fixed size, no allocation |
| Floats (`f32`, `f64`) | Fixed size, IEEE 754 standard |
| Pointers (`*mut u8`) | Just a memory address |

**Strings are problematic because:**
- Rust strings are UTF-8, length-prefixed
- C strings are null-terminated
- JavaScript strings are UTF-16 internally
- Each language allocates memory differently

So we return a **pointer to a buffer** (raw bytes), then:
1. Deno reads from that pointer
2. Converts bytes to a JavaScript string
3. We call `free_string()` to let Rust deallocate

```rust
// Rust allocates and returns a pointer
pub extern "C" fn hello() -> *mut c_char {
    let message = CString::new("Hello").unwrap();
    message.into_raw()  // Rust forgets about this memory
}

// Rust deallocates when we're done
pub extern "C" fn free_string(ptr: *mut c_char) {
    unsafe { CString::from_raw(ptr); }  // Rust takes ownership and drops
}
```

## E. How Deno's FFI API Glues Things Together

Deno's `Deno.dlopen()` is the bridge between TypeScript and native code:

```typescript
const lib = Deno.dlopen("./lib/libhello.so", {
  get_pid: { parameters: [], result: "u32" },
});

const pid = lib.symbols.get_pid();
```

**What happens under the hood:**

1. **`dlopen`** - Loads the `.so` file into memory (uses OS dynamic linker)
2. **Symbol lookup** - Finds `get_pid` function by name in the binary
3. **Type marshalling** - Converts JS values to C types based on your schema
4. **Call** - Invokes the native function
5. **Return marshalling** - Converts C return value back to JS

The "symbols" object you define tells Deno how to interpret the raw bytes going in and out.

## F. Why We Use `#[unsafe(no_mangle)]` in Rust

```rust
#[unsafe(no_mangle)]
pub extern "C" fn hello() -> *mut c_char { ... }
```

### `no_mangle`

Rust normally **mangles** function names—turning `hello` into something like `_ZN5hello17h8a4f2b3c1d0e9f8aE`. This encodes:
- Module path
- Type information
- A hash for uniqueness

Mangling prevents name collisions but makes it impossible to find functions by their original name. `#[no_mangle]` preserves the exact name `hello` in the compiled binary.

### Why `unsafe(...)`?

In Rust 2024 edition, `no_mangle` is considered unsafe because:
- It affects linking behavior
- It could cause name collisions with other libraries
- It exposes internal functions to external callers

The `#[unsafe(no_mangle)]` syntax makes this explicit—you're acknowledging the risks.

---

## Further Reading

- [Deno FFI API Documentation](https://docs.deno.com/runtime/reference/ffi_api/)
- [The Rust FFI Omnibus](http://jakegoulding.com/rust-ffi-omnibus/)
- [System V AMD64 ABI](https://refspecs.linuxbase.org/elf/x86_64-abi-0.99.pdf) (Linux x64 calling convention)
