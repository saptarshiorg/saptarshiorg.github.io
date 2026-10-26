use std::env;
use std::fs::File;
use std::io::{self, BufWriter, Write};
use std::path::Path;

const DEFAULT_SIZE_MB: usize = 20;
const CHUNK_SIZE: usize = 64 * 1024;

/// Generate deterministic demonstration bytes.
/// This is demo data, not cryptographically secure randomness.
fn fill_demo_data(buffer: &mut [u8], state: &mut u64) {
    for byte in buffer.iter_mut() {
        *state ^= *state << 13;
        *state ^= *state >> 7;
        *state ^= *state << 17;
        *byte = (*state & 0xff) as u8;
    }
}

fn generate_file(path: &Path, size_bytes: usize) -> io::Result<()> {
    let file = File::create(path)?;
    let mut writer = BufWriter::new(file);
    let mut buffer = vec![0_u8; CHUNK_SIZE];
    let mut remaining = size_bytes;
    let mut state = 0x9E37_79B9_7F4A_7C15_u64;

    while remaining > 0 {
        let count = remaining.min(buffer.len());
        fill_demo_data(&mut buffer[..count], &mut state);
        writer.write_all(&buffer[..count])?;
        remaining -= count;
    }

    writer.flush()
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = env::args().collect();
    let output = args.get(1).map(String::as_str).unwrap_or("demo_data.bin");
    let size_mb = args
        .get(2)
        .map(|value| value.parse::<usize>())
        .transpose()?
        .unwrap_or(DEFAULT_SIZE_MB);

    if size_mb == 0 {
        eprintln!("Size must be greater than zero.");
        std::process::exit(2);
    }

    let size_bytes = size_mb
        .checked_mul(1_000_000)
        .ok_or("Requested size is too large")?;

    generate_file(Path::new(output), size_bytes)?;

    println!("Created demo file: {output}");
    println!("Size: {size_bytes} bytes ({size_mb} MB decimal)");
    println!("The generated file is demo data, not Rust source code.");
    Ok(())
}
