use std::ffi::{c_char, CString};
use std::process;
use sysinfo::System;

/// Returns a "Hello World!" message from Rust.
/// The caller is responsible for freeing the returned string using `free_string`.
#[unsafe(no_mangle)]
pub extern "C" fn hello() -> *mut c_char {
    let message = CString::new("Hello World! from Rust").expect("CString creation failed");
    message.into_raw()
}

/// Returns the current process ID.
#[unsafe(no_mangle)]
pub extern "C" fn get_pid() -> u32 {
    process::id()
}

/// Returns the number of CPU cores.
#[unsafe(no_mangle)]
pub extern "C" fn get_cpu_count() -> u32 {
    let sys = System::new_all();
    sys.cpus().len() as u32
}

/// Returns the overall CPU usage percentage.
/// Note: This requires a short delay to get accurate readings.
/// For real-time monitoring, call this function periodically.
#[unsafe(no_mangle)]
pub extern "C" fn get_cpu_usage() -> f32 {
    let mut sys = System::new_all();
    sys.refresh_cpu_usage();
    std::thread::sleep(std::time::Duration::from_millis(200));
    sys.refresh_cpu_usage();
    sys.global_cpu_usage()
}

/// Frees a string that was allocated by Rust.
/// Must be called for any string returned by functions in this library.
#[unsafe(no_mangle)]
pub extern "C" fn free_string(ptr: *mut c_char) {
    if ptr.is_null() {
        return;
    }
    unsafe {
        let _ = CString::from_raw(ptr);
    }
}
