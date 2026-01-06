import { readdir, readFile, writeFile, access, stat } from "fs/promises";
import { join, extname, dirname, basename } from "path";
import sharp from "sharp";
import { encode } from "blurhash";
import yaml from "js-yaml";

const MEDIA_DIR = "content/media";

const CATEGORY_MAPPING = {
  small: "small",
  medium: "medium",
  large: "large",
  panoramic: "panoramic",
  portrait: "portrait",
};

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Ensure directory exists
async function ensureDir(dir) {
  try {
    await access(dir);
  } catch {
    const { mkdir } = await import("fs/promises");
    await mkdir(dir, { recursive: true });
  }
}

async function moveLooseImageFile(imagePath) {
  try {
    const fileName = basename(imagePath, extname(imagePath));
    const fileExt = extname(imagePath);

    // Create new directory structure
    const newDirPath = join(MEDIA_DIR, fileName);
    await ensureDir(newDirPath);

    const newImagePath = join(newDirPath, `photo${fileExt}`);
    const yamlPath = join(newDirPath, "index.yaml");

    // Check if the target already exists to avoid overwriting
    try {
      await access(newImagePath);
      console.log(
        `⚠️  Skipping ${imagePath}: target ${newImagePath} already exists`,
      );
      return false;
    } catch {
      // File doesn't exist, safe to proceed
    }

    // Move the image file
    const { rename } = await import("fs/promises");
    await rename(imagePath, newImagePath);

    // Generate image metadata
    const imageData = await generateImageData(newImagePath);
    if (!imageData) {
      console.error(`Failed to generate metadata for ${newImagePath}`);
      return false;
    }

    const category = determineCategory(
      fileName,
      imageData.width,
      imageData.height,
    );

    const yamlData = {
      title: generateTitleFromFilename(fileName),
      description: `Image: ${fileName}`,
      image: `photo${fileExt}`,
      metadata: {
        width: imageData.width,
        height: imageData.height,
        size: imageData.size,
        format: imageData.format,
        category,
      },
      blurhash: imageData.blurhash,
    };

    const yamlContent = yaml.dump(yamlData, {
      indent: 2,
      lineWidth: -1,
    });

    await writeFile(yamlPath, yamlContent);

    console.log(
      `✓ Moved ${imagePath} → ${newImagePath} with metadata (${imageData.width}x${imageData.height}, ${category})`,
    );
    return true;
  } catch (error) {
    console.error(`Error moving loose image ${imagePath}:`, error);
    return false;
  }
}

function generateTitleFromFilename(filename) {
  return filename
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function isLooseImageFile(filePath, fileName) {
  const ext = extname(fileName).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext) && dirname(filePath) === MEDIA_DIR;
}

// Determine category based on directory name and image dimensions
function determineCategory(directoryName, width, height) {
  // First check if directory name contains a category keyword
  for (const [keyword, category] of Object.entries(CATEGORY_MAPPING)) {
    if (directoryName.toLowerCase().includes(keyword)) {
      return category;
    }
  }

  const aspectRatio = width / height;
  const totalPixels = width * height;

  // Portrait: height > width
  if (aspectRatio < 0.8) {
    return "portrait";
  }

  // Panoramic: very wide aspect ratio
  if (aspectRatio > 2.5) {
    return "panoramic";
  }

  // Size-based categories for regular aspect ratios
  if (totalPixels > 1500000) {
    // > 1.5MP
    return "large";
  } else if (totalPixels > 400000) {
    // > 0.4MP
    return "medium";
  } else {
    return "small";
  }
}

// Generate blurhash and extract metadata for an image
async function generateImageData(imagePath) {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Get file size
    const fileStats = await stat(imagePath);
    const size = fileStats.size;

    // Generate blurhash
    const { data, info } = await image
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer({ resolveWithObject: true });

    const blurhash = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      8,
      8,
    );

    return {
      blurhash,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size,
    };
  } catch (error) {
    console.error(`Error processing image ${imagePath}:`, error);
    return null;
  }
}

// Process a media item
async function processMediaItem(itemPath) {
  try {
    const files = await readdir(itemPath);
    const yamlFile = files.find(
      (f) => f.endsWith(".yaml") || f.endsWith(".yml"),
    );
    const imageFiles = files.filter((f) => {
      const ext = extname(f).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });

    if (!yamlFile || imageFiles.length === 0) {
      console.log(`Skipping ${itemPath}: missing YAML or image files`);
      return;
    }

    const yamlPath = join(itemPath, yamlFile);
    const yamlContent = await readFile(yamlPath, "utf-8");
    const data = yaml.load(yamlContent);

    // Process first image file (assuming one image per item)
    const imagePath = join(itemPath, imageFiles[0]);
    const imageData = await generateImageData(imagePath);

    if (imageData) {
      const directoryName = basename(itemPath);
      const category = determineCategory(
        directoryName,
        imageData.width,
        imageData.height,
      );

      const updatedData = {
        ...data,
        image: imageFiles[0],
        metadata: {
          width: imageData.width,
          height: imageData.height,
          size: imageData.size,
          format: imageData.format,
          category,
          // Preserve existing metadata fields if they exist
          ...(data.metadata || {}),
        },
        blurhash: imageData.blurhash,
      };

      const updatedYaml = yaml.dump(updatedData, {
        indent: 2,
        lineWidth: -1,
      });

      await writeFile(yamlPath, updatedYaml);
      console.log(
        `✓ Generated metadata for ${itemPath} - ${imageData.width}x${imageData.height} (${category})`,
      );
    }
  } catch (error) {
    console.error(`Error processing ${itemPath}:`, error);
  }
}

async function processLooseImages() {
  console.log("📂 Processing loose image files...");

  try {
    const mediaItems = await readdir(MEDIA_DIR);
    let movedCount = 0;

    for (const item of mediaItems) {
      const itemPath = join(MEDIA_DIR, item);
      const stats = await stat(itemPath);

      if (stats.isFile() && isLooseImageFile(itemPath, item)) {
        const moved = await moveLooseImageFile(itemPath);
        if (moved) movedCount++;
      }
    }

    if (movedCount > 0) {
      console.log(
        `✨ Moved ${movedCount} loose image(s) to proper directory structure`,
      );
    } else {
      console.log("✓ No loose images found to reorganize");
    }
  } catch (error) {
    console.error("Error processing loose images:", error);
  }
}

// Main function
async function generateBlurhashes() {
  console.log("🎨 Generating blurhashes and metadata for media items...");

  try {
    await ensureDir(MEDIA_DIR);

    await processLooseImages();

    // Now process all directories (including newly created ones)
    const mediaItems = await readdir(MEDIA_DIR);

    for (const item of mediaItems) {
      const itemPath = join(MEDIA_DIR, item);
      const stats = await stat(itemPath);

      if (stats.isDirectory()) {
        await processMediaItem(itemPath);
      }
    }

    console.log("✨ Blurhash and metadata generation complete!");
  } catch (error) {
    console.error("Error generating blurhashes and metadata:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateBlurhashes();
}

export { generateBlurhashes };
