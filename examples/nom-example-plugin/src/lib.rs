//! Example plugin for Nom CLI
//! 
//! This plugin demonstrates the basic structure and functionality
//! of a Nom plugin written in Rust.

/// Simple hello world function that prints a greeting
/// and returns a status code (0 for success)
#[no_mangle]
pub extern "C" fn hello() -> i32 {
    println!("Hello from Nom plugin!");
    0
}

/// Another example function that adds two numbers
/// 
/// # Arguments
/// 
/// * `a` - First number
/// * `b` - Second number
/// 
/// # Returns
/// 
/// The sum of a and b
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    println!("Adding {} + {} = {}", a, b, a + b);
    a + b
}

/// Initialize the plugin
/// This function is called when the plugin is loaded
#[no_mangle]
pub extern "C" fn init() -> i32 {
    println!("Initializing example plugin...");
    0
}
