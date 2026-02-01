/**
 * FFI library loader utilities for rusty-deno
 * @see https://docs.deno.com/runtime/reference/ffi_api/
 */

const LIBRARY_NAME = "libsourcya_rusty_deno_hello.so";

/**
 * Get the path to the native library relative to this module
 */
function getLibraryPath(): string {
  const currentUrl = new URL(import.meta.url);
  const libPath = new URL(`../lib/${LIBRARY_NAME}`, currentUrl);
  return libPath.pathname;
}

/**
 * Ensure we're running on a supported platform
 */
function checkPlatform(): void {
  if (Deno.build.os !== "linux") {
    throw new Error(
      `Unsupported platform: ${Deno.build.os}. Only Linux is currently supported.`
    );
  }
  if (Deno.build.arch !== "x86_64") {
    throw new Error(
      `Unsupported architecture: ${Deno.build.arch}. Only x86_64 is currently supported.`
    );
  }
}

/**
 * Load a native library with the given symbols
 */
export function loadLibrary<T extends Deno.ForeignLibraryInterface>(
  symbols: T
): Deno.DynamicLibrary<T> {
  checkPlatform();
  const libPath = getLibraryPath();

  try {
    return Deno.dlopen(libPath, symbols);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to load native library at ${libPath}: ${error.message}. ` +
          `Make sure to build the native code first with 'deno task build'.`
      );
    }
    throw error;
  }
}

/**
 * Read a C string from a pointer and free it (sync version)
 */
export function readCString(
  ptr: Deno.PointerValue,
  freeFunc: (ptr: Deno.PointerValue) => void
): string {
  if (ptr === null) {
    return "";
  }
  const view = new Deno.UnsafePointerView(ptr);
  const str = view.getCString();
  freeFunc(ptr);
  return str;
}

/**
 * Read a C string from a pointer and free it (async version)
 * Used with nonblocking FFI calls
 */
export function readCStringAsync(
  ptr: Deno.PointerValue,
  freeFunc: (ptr: Deno.PointerValue) => void
): string {
  if (ptr === null) {
    return "";
  }
  const view = new Deno.UnsafePointerView(ptr);
  const str = view.getCString();
  freeFunc(ptr);
  return str;
}
