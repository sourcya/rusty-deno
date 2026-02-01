# Concepts

Technical deep-dives and background information.

## Articles

| Document | Description |
|----------|-------------|
| [Motivation](./motivation.md) | Why this project exists, FFI vs alternatives, and technical concepts |

## Topics Covered

- **ABI (Application Binary Interface)** - How functions are called at the machine level
- **`extern "C"`** - Why Rust needs C calling conventions for FFI
- **Non-blocking FFI** - How we achieve true parallelism in JavaScript
- **Memory Management** - Why we return pointers and how to free them
- **`no_mangle`** - Symbol naming and why it matters
