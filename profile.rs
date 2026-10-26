
use std::io::{self, Write};

const PURPLE: &str = "\x1b[38;5;99m";
const WHITE: &str = "\x1b[97m";
const GRAY: &str = "\x1b[90m";
const RESET: &str = "\x1b[0m";
const BOLD: &str = "\x1b[1m";

fn heading(text: &str) {
    println!("\n{PURPLE}{BOLD}## {text}{RESET}");
    println!("{GRAY}{}", "-".repeat(text.len() + 3));
}

fn link(label: &str, url: &str) {
    println!("{WHITE}{label}{RESET}: {PURPLE}{url}{RESET}");
}

fn main() {
    let mut stdout = io::stdout();

    let _ = stdout.flush();

    println!("{PURPLE}{BOLD}");
    println!("╔══════════════════════════════════════════════╗");
    println!("║             SAPTARSHI SAMANTA                ║");
    println!("║                 RISHI FORGE                  ║");
    println!("╚══════════════════════════════════════════════╝");
    println!("{RESET}");

    println!("{WHITE}API Developer{RESET}");
    println!("{WHITE}Graphic Poster Designer{RESET}");
    println!("{WHITE}Android App Developer{RESET}");
    println!("{WHITE}Web Apps & Streaming Platforms{RESET}");

    heading("Connect");

    link("Instagram", "https://instagram.com/saaptaarshii");
    link("GitHub", "https://github.com/saptarshiorg");
    link("Email", "saptarshirishi11@gmail.com");

    heading("About");

    println!(
        "Hi, I'm Saptarshi, a developer and creator. \
         I build websites, software and digital experiences."
    );

    println!(
        "My work includes fast web pages, clean interfaces, \
         APIs, Android applications and graphic design."
    );

    println!("\n{PURPLE}Code. Build. Create. Repeat.{RESET}");

    println!("\nName:    Saptarshi Samanta");
    println!("Brand:   RISHI FORGE");
    println!("Base:    Kolkata, West Bengal");
    println!("Focus:   Web, APIs, apps and design");

    heading("Location");

    println!("Kolkata, West Bengal, India");
    println!("Nearest airport: Netaji Subhas Chandra Bose");
    println!("International Airport");
    println!("Airport code: CCU");
    println!("Approximate distance: 13 km from city centre");

    link(
        "Kolkata Maps",
        "https://www.google.com/maps/search/?api=1&query=Kolkata%2C%20West%20Bengal",
    );

    link(
        "CCU Airport Maps",
        "https://www.google.com/maps/search/?api=1&query=22.6547%2C88.4467",
    );

    heading("Project: EV STREAMS");

    println!("All global OTT, sports, IPTV and live TV.");
    println!("A free streaming hub with a responsive interface.");
    println!("Categories: Football, cricket, basketball, tennis,");
    println!("motorsports, entertainment and live television.");

    link("Open EV STREAMS", "https://evstreams.pages.dev");

    link(
        "Source Code",
        "https://github.com/saptarshiorg/saptarshiorg.github.io",
    );

    heading("Technology Stack");

    println!("Languages:");
    println!("  Python, C, C++, Java, Rust");

    println!("\nWeb:");
    println!("  HTML, CSS, JavaScript, APIs, Responsive UI");

    println!("\nTools:");
    println!("  Git, GitHub, GitHub Pages, Android Studio");

    println!("\nDesign:");
    println!("  UI/UX, Branding, Poster Design");

    heading("Let's Build Something");

    link("Email", "mailto:saptarshirishi11@gmail.com");

    println!(
        "\n{GRAY}© Saptarshi Samanta. \
         Forge your ideas. Build the future.{RESET}"
    );

    println!("\nPress Enter to exit...");

    let mut input = String::new();
    let _ = io::stdin().read_line(&mut input);
}
