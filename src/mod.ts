/**
 * @sourcya/rusty-deno - Native Rust FFI bindings for Deno applications
 *
 * This module provides high-performance system information utilities
 * powered by native Rust code via Deno's FFI API. All functions are
 * async and run on separate threads (non-blocking).
 *
 * @example Basic usage
 * ```ts
 * import { hello, getPid, getCpuCount, getCpuUsage, close } from "@sourcya/rusty-deno";
 *
 * // Get a hello message from Rust
 * console.log(await hello()); // "Hello World!"
 *
 * // Get system information
 * console.log("PID:", await getPid());
 * console.log("CPU cores:", await getCpuCount());
 * console.log("CPU usage:", await getCpuUsage(), "%");
 *
 * // Clean up when done
 * close();
 * ```
 *
 * @module
 */

export * from "./hello.ts";
