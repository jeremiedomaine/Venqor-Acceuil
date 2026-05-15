import sharp from "sharp"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const SRC =
  "/Users/jeremie/.cursor/projects/Users-jeremie-Documents-Venqor-Acceuil/assets/Gemini_Generated_Image_4dhgfo4dhgfo4dhg-27402b45-74e7-4516-a228-b5457a8f0104.png"

// Fallback si chemin assets déplacé
const SRC_FALLBACK = resolve(root, "public/venqor-logo-square.png")

const BG = { r: 245, g: 245, b: 245, alpha: 1 }
const CANVAS = 512
const LOGO_RATIO = 0.92

async function buildIcon(sourcePath, outPath, canvasSize) {
  const trimmed = await sharp(sourcePath)
    .trim({ threshold: 12 })
    .toBuffer({ resolveWithObject: true })

  const scale = Math.min(
    (canvasSize * LOGO_RATIO) / trimmed.info.width,
    (canvasSize * LOGO_RATIO) / trimmed.info.height,
  )
  const w = Math.round(trimmed.info.width * scale)
  const h = Math.round(trimmed.info.height * scale)
  const padX = Math.floor((canvasSize - w) / 2)
  const padY = Math.floor((canvasSize - h) / 2)

  await sharp(trimmed.data)
    .resize(w, h, { kernel: sharp.kernel.lanczos3 })
    .extend({
      top: padY,
      bottom: canvasSize - h - padY,
      left: padX,
      right: canvasSize - w - padX,
      background: BG,
    })
    .png({ compressionLevel: 9, force: true })
    .toFile(outPath)
}

async function main() {
  let source = SRC
  try {
    await sharp(source).metadata()
  } catch {
    source = SRC_FALLBACK
  }

  const master = resolve(root, "public/icon.png")
  await buildIcon(source, master, CANVAS)

  const sizes = [
    { size: 32, path: "public/favicon.png" },
    { size: 180, path: "public/apple-icon.png" },
    { size: 192, path: "public/icon-192.png" },
  ]

  for (const { size, path } of sizes) {
    await sharp(master)
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .png({ force: true })
      .toFile(resolve(root, path))
  }

  await sharp(master)
    .resize(32, 32)
    .png({ force: true })
    .toFile(resolve(root, "app/icon.png"))

  await sharp(master)
    .resize(180, 180)
    .png({ force: true })
    .toFile(resolve(root, "app/apple-icon.png"))

  console.log("✓ Favicons PNG générés (logo agrandi, 512px master)")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
