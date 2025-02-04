#[no_mangle]
pub extern "C" fn hello() -> i32 {
    println!("Hello from Nom plugin!");
    0
}