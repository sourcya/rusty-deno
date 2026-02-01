/**
 * Hello Example - Demonstrates basic usage of the hello module.
 * All FFI calls are non-blocking and run on separate CPU threads.
 */

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
