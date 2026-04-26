import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const contentPath = path.join(projectRoot, "src", "data", "site-content.json");
const sourceDir = path.join(projectRoot, "src");
const generatedManifestPath = path.join(projectRoot, "src", "generated", "optimized-images.ts");

const extraImagePaths = [
  "/img/allgemein/Logo-neu.png",
  "/img/restaurant-kaminzimmer.jpg",
  "/img/fruehstueck/bueffet-theke.jpeg",
  "/img/fruehstueck/joghurt-muesli.jpeg",
  "/img/fruehstueck/warmes-bueffet.jpeg",
  "/img/fruehstueck/aufschnitt.jpeg",
  "/img/fruehstueck/kaese.jpeg",
  "/img/fruehstueck/broetchen.jpeg",
  "/img/fruehstueck/kraeuter-herz.jpeg",
];

function collectImagePaths(value, imagePaths) {
  if (typeof value === "string") {
    if (value.startsWith("/img/") && !value.startsWith("/img/optimized/")) {
      imagePaths.add(value);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectImagePaths(entry, imagePaths);
    }
    return;
  }

  if (value && typeof value === "object") {
    for (const entry of Object.values(value)) {
      collectImagePaths(entry, imagePaths);
    }
  }
}

function toOptimizedPath(src) {
  return src.replace(/^\/img\//, "/img/optimized/").replace(/\.[^.]+$/, ".webp");
}

function getResizeWidth(src) {
  if (src.includes("/allgemein/Logo-neu")) {
    return 640;
  }

  if (src.includes("/events/") || src.includes("/fruehstueck/")) {
    return 1440;
  }

  return 1600;
}

async function ensureDirectory(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function collectImagePathsFromSource(dir, imagePaths) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await collectImagePathsFromSource(fullPath, imagePaths);
      continue;
    }

    if (!/\.(json|ts|tsx)$/i.test(entry.name)) {
      continue;
    }

    if (fullPath === generatedManifestPath) {
      continue;
    }

    const rawSource = await fs.readFile(fullPath, "utf8");
    const matches = rawSource.matchAll(/(\/img\/[^"'`]+?\.(?:png|jpe?g|webp))/gi);

    for (const match of matches) {
      if (!match[1].startsWith("/img/optimized/")) {
        imagePaths.add(match[1]);
      }
    }
  }
}

async function optimizeImage(src) {
  const inputPath = path.join(publicDir, src.replace(/^\//, ""));
  const outputPath = path.join(publicDir, toOptimizedPath(src).replace(/^\//, ""));

  await ensureDirectory(outputPath);

  const transformer = sharp(inputPath, { failOn: "none" }).rotate();
  const metadata = await transformer.metadata();
  const width = metadata.width ? Math.min(metadata.width, getResizeWidth(src)) : getResizeWidth(src);

  await transformer
    .resize({
      width,
      withoutEnlargement: true,
    })
    .webp({
      quality: src.includes("/allgemein/Logo-neu") ? 82 : 74,
      effort: 6,
    })
    .toFile(outputPath);

  const sourceStat = await fs.stat(inputPath);
  const targetStat = await fs.stat(outputPath);

  return {
    src,
    optimized: toOptimizedPath(src),
    sourceKb: Math.round(sourceStat.size / 1024),
    targetKb: Math.round(targetStat.size / 1024),
  };
}

async function main() {
  const rawContent = await fs.readFile(contentPath, "utf8");
  const content = JSON.parse(rawContent);
  const imagePaths = new Set(extraImagePaths);

  collectImagePaths(content, imagePaths);
  await collectImagePathsFromSource(sourceDir, imagePaths);

  const manifestEntries = [];

  for (const src of [...imagePaths].sort()) {
    try {
      const result = await optimizeImage(src);
      manifestEntries.push(result);
      console.log(`${result.src} -> ${result.optimized} (${result.sourceKb} KB -> ${result.targetKb} KB)`);
    } catch (error) {
      console.warn(`Skipping ${src}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  await ensureDirectory(generatedManifestPath);

  const manifestSource = `export const optimizedImageMap = ${JSON.stringify(
    Object.fromEntries(manifestEntries.map((entry) => [entry.src, entry.optimized])),
    null,
    2,
  )} as const;\n`;

  await fs.writeFile(generatedManifestPath, manifestSource, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
