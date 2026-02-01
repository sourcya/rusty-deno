/**
 * Hello module - provides system information from Rust FFI.
 *
 * All functions are async and run on separate threads (non-blocking).
 *
 * @example
 * ```ts
 * import { hello, getPid, getCpuCount, close } from "@sourcya/rusty-deno/hello";
 *
 * console.log(await hello()); // "Hello World!"
 * console.log("PID:", await getPid());
 * console.log("CPU cores:", await getCpuCount());
 *
 * close();
 * ```
 *
 * @see https://docs.deno.com/runtime/reference/ffi_api/
 * @module
 */

import { loadLibrary, readCStringAsync } from "./lib.ts";

const symbols = {
  hello: {
    parameters: [],
    result: "pointer",
    nonblocking: true,
  },
  get_pid: {
    parameters: [],
    result: "u32",
    nonblocking: true,
  },
  get_cpu_count: {
    parameters: [],
    result: "u32",
    nonblocking: true,
  },
  get_cpu_usage: {
    parameters: [],
    result: "f32",
    nonblocking: true,
  },
  free_string: {
    parameters: ["pointer"],
    result: "void",
  },
} as const;

let lib: Deno.DynamicLibrary<typeof symbols> | null = null;

function getLib(): Deno.DynamicLibrary<typeof symbols> {
  if (!lib) {
    lib = loadLibrary(symbols);
  }
  return lib;
}

/**
 * Returns a "Hello World!" message from Rust
 */
export async function hello(): Promise<string> {
  const library = getLib();
  const ptr = await library.symbols.hello();
  return readCStringAsync(ptr, library.symbols.free_string);
}

/**
 * Returns the current process ID
 */
export async function getPid(): Promise<number> {
  return await getLib().symbols.get_pid();
}

/**
 * Returns the number of CPU cores
 */
export async function getCpuCount(): Promise<number> {
  return await getLib().symbols.get_cpu_count();
}

/**
 * Returns the overall CPU usage percentage
 * Note: This function takes ~200ms to return accurate readings
 */
export async function getCpuUsage(): Promise<number> {
  return await getLib().symbols.get_cpu_usage();
}

/**
 * Close the library and free resources
 * Call this when you're done using the module
 */
export function close(): void {
  if (lib) {
    lib.close();
    lib = null;
  }
}
