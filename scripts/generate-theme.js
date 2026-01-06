import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import chroma from "chroma-js";

function convertColorToHex(colorValue) {
  const trimmed = colorValue.trim();

  try {
    // Try to parse the color with chroma.js
    const color = chroma(trimmed);

    // Check if the original color had transparency
    if (
      trimmed.includes("/") ||
      trimmed.includes("rgba") ||
      color.alpha() < 1
    ) {
      const rgba = color.rgba();
      return `rgba(${Math.round(rgba[0])}, ${Math.round(rgba[1])}, ${Math.round(rgba[2])}, ${rgba[3]})`;
    }

    // Return hex for opaque colors
    return color.hex();
  } catch (error) {
    // If chroma.js can't parse it, return the original value
    console.warn(
      `⚠️  Could not parse color "${trimmed}", keeping original format`,
    );
    return trimmed;
  }
}

function parseColorsFromMarkdown(content) {
  const colors = {};

  const codeBlockMatch = content.match(/```\n([\s\S]*?)\n```/);
  if (!codeBlockMatch) {
    console.warn("No color definitions found in colors.md");
    return colors;
  }

  const colorDefinitions = codeBlockMatch[1];
  const lines = colorDefinitions
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"));

  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts.join(":").trim();
      colors[key.trim()] = convertColorToHex(value);
    }
  }

  return colors;
}

function generateThemeCSS(colors) {
  const colorVars = Object.entries(colors)
    .map(([key, value]) => `    --color-${key}: ${value};`)
    .join("\n");

  return `@plugin "daisyui" {
    themes: light --default;
}

*::selection {
    @apply bg-primary/10 text-primary;
}

@plugin "daisyui/theme" {
    name: "finlay";
    default: true;
${colorVars}
    --radius-selector: 0.25rem;
    --radius-field: 0.25rem;
    --radius-box: 0.5rem;
    --size-selector: 0.21875rem;
    --size-field: 0.21875rem;
    --border: 0.5px;
    --depth: 1;
    --noise: 1;
}
`;
}

function generateThemeJSON(colors) {
  return {
    name: "finlay",
    default: true,
    colors: colors,
  };
}

function generateThemeTypes(colors) {
  const typeDefinitions = Object.entries(colors)
    .map(([key, value]) => `\t"${key}": "${value}",`)
    .join("\n");

  return `export default themeColors = {
${typeDefinitions}
};`;
}

try {
  console.log("🎨 Generating theme files from colors.md...");

  const colorsPath = join(process.cwd(), "content", "colors.md");
  const themeCSSPath = join(process.cwd(), "assets", "css", "theme.css");
  const themeJSONPath = join(process.cwd(), "assets", "theme.json");
  const themeTypesPath = join(process.cwd(), "types", "theme.d.ts");

  const colorsContent = readFileSync(colorsPath, "utf8");
  const colors = parseColorsFromMarkdown(colorsContent);

  if (Object.keys(colors).length === 0) {
    console.error("❌ No colors found in colors.md");
    process.exit(1);
  }

  // Ensure types directory exists
  mkdirSync(dirname(themeTypesPath), { recursive: true });

  // Generate CSS theme
  const themeCSS = generateThemeCSS(colors);
  writeFileSync(themeCSSPath, themeCSS);

  // Generate JSON theme
  const themeJSON = generateThemeJSON(colors);
  writeFileSync(themeJSONPath, JSON.stringify(themeJSON, null, 2));

  // Generate TypeScript types
  const themeTypes = generateThemeTypes(colors);
  writeFileSync(themeTypesPath, themeTypes);

  console.log(
    `✅ Generated theme.css, theme.json, and theme.d.ts with ${Object.keys(colors).length} colors`,
  );
  console.log("📝 Files created:");
  console.log("  - assets/css/theme.css");
  console.log("  - assets/theme.json");
  console.log("  - types/theme.d.ts");
  console.log("📝 Colors loaded:", Object.keys(colors).join(", "));
} catch (error) {
  console.error("❌ Error generating theme files:", error.message);
  process.exit(1);
}
