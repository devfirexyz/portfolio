import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function run() {
  const page = read("app/page.tsx");
  const discord = read("components/DiscordPortfolio.tsx");
  const globals = read("app/globals.css");
  const layout = read("app/layout.tsx");

  assert(!page.includes("NeoFeatureGrid"), "Home page still includes NeoFeatureGrid section.");
  assert(!page.includes("NeoProcessSection"), "Home page still includes NeoProcessSection section.");
  assert(!page.includes("NeoCompareSection"), "Home page still includes NeoCompareSection section.");

  assert(
    discord.includes("onClick={() => handleSelectChannel(channel.id)}") ||
      discord.includes("onClick={() => setActiveChannel(channel.id)}"),
    "Discord panel channel switching handler missing."
  );
  assert(discord.includes("activeSection.points.map"), "Discord panel section render loop missing.");

  assert(globals.includes("--nb-background:"), "Neo-brutalist background token not found.");
  assert(globals.includes("--nb-accent:"), "Neo-brutalist accent token not found.");

  assert(layout.includes("portfolio-theme"), "Theme localStorage key is missing.");
  assert(layout.includes("data-theme"), "Theme data attribute initialization is missing.");
  assert(layout.includes('import "./globals.css";'), "Root layout is not using app/globals.css.");
  assert(!fs.existsSync(path.join(root, "styles/globals.css")), "Legacy styles/globals.css should not exist.");

  console.log("Smoke tests passed.");
}

run();
