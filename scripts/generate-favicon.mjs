import sharp from "sharp"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const SRC =
  "/Users/jeremie/.cursor/projects/Users-jeremie-Documents-Venqor-Acceuil/assets/Gemini_Generated_Image_4dhgfo4dhgfo4dhg-27402b45-74e7-4516-a228-b5457a8f0104.png"

const SRC_FALLBACK = resolve(root, "public/venqor-logo-square.png")

const CANVAS = 512
const LOGO_RATIO = 0.92
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

/** Rend transparents les pixels proches du fond clair (gris/blanc). */
function removeLightBackground(data, channels, threshold = 38) {
  if (channels !== 4) return data
  const out = Buffer.from(data)
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i]
    const g = out[i + 1]
    const b = out[i + 2]
    const brightness = (r + g + b) / 3
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
    // Fond uni clair ; préserve le bleu/noir du logo
    if (brightness > 200 && maxDiff < 28) {
      out[i + 3] = 0
    } else if (brightness > 230) {
      out[i + 3] = 0
    } else if (r > 220 && g > 220 && b > 220 && Math.abs(r - g) < threshold) {
      out[i + 3] = Math.min(out[i + 3], Math.max(0, 255 - (brightness - 200) * 4))
    }
  }
  return out
}

async function loadTransparentLogo(sourcePath) {
  const trimmed = await sharp(sourcePath)
    .trim({ threshold: 12 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = removeLightBackground(
    trimmed.data,
    trimmed.info.channels,
  )

  return sharp(rgba, {
    raw: {
      width: trimmed.info.width,
      height: trimmed.info.height,
      channels: 4,
    },
  }).png()
}

async function buildIcon(sourcePath, outPath, canvasSize) {
  const logo = await loadTransparentLogo(sourcePath)
  const meta = await logo.metadata()

  const scale = Math.min(
    (canvasSize * LOGO_RATIO) / meta.width,
    (canvasSize * LOGO_RATIO) / meta.height,
  )
  const w = Math.round(meta.width * scale)
  const h = Math.round(meta.height * scale)
  const padX = Math.floor((canvasSize - w) / 2)
  const padY = Math.floor((canvasSize - h) / 2)

  await logo
    .resize(w, h, { kernel: sharp.kernel.lanczos3 })
    .extend({
      top: padY,
      bottom: canvasSize - h - padY,
      left: padX,
      right: canvasSize - w - padX,
      background: TRANSPARENT,
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

  await sharp(master).resize(512, 512).png({ force: true }).toFile(resolve(root, "app/icon.png"))
  await sharp(master).resize(180, 180).png({ force: true }).toFile(resolve(root, "app/apple-icon.png"))

  console.log("✓ Favicons PNG transparents générés")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
