# Examples

Working code examples demonstrating `@sourcya/rusty-deno` usage.

## Available Examples

| Example | Description |
|---------|-------------|
| [Hello](./hello.md) | Basic usage with system information |

## Prerequisites

Before running any example, build the native library:

```bash
# From the project root
deno task build
```

## Running Examples

### From Project Root

```bash
deno task example:hello
```

### From Example Directory

```bash
cd examples/hello
deno task start
```

## Creating New Examples

Each example should be a complete Deno project with:

```
examples/your-example/
├── deno.json    # Project config with imports and tasks
├── main.ts      # Entry point
└── README.md    # Brief description (optional)
```

Use the [hello example](https://github.com/sourcya/rusty-deno/tree/main/examples/hello) as a template.
