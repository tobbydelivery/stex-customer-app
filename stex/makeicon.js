const fs = require("fs");
const path = require("path");

// Create a simple 1024x1024 PNG with red background
// PNG header and minimal valid PNG structure
const width = 1;
const height = 1;

// We'll copy the existing icon if it exists, or create a minimal placeholder
const iconDir = path.join(__dirname, "assets", "images");
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Check if any PNG exists to copy
const files = fs.readdirSync(iconDir);
console.log("Files in assets/images:", files);

if (files.length === 0) {
  console.log("No icon files found! Please add an icon.png to assets/images/");
} else {
  // Copy first PNG as icon if icon.png doesn't exist
  const firstPng = files.find(f => f.endsWith(".png"));
  if (firstPng && !files.includes("icon.png")) {
    fs.copyFileSync(
      path.join(iconDir, firstPng),
      path.join(iconDir, "icon.png")
    );
    console.log("Copied", firstPng, "as icon.png");
  }
  console.log("Done!");
}