const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'images');

// Ensure output directory exists
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// Image definitions: source filename -> output configs
const images = [
  // Hero image: 1600w and 800w
  {
    src: 'derrick-pare-TdhqDEjeNuM-unsplash.jpg',
    outputs: [
      { name: 'hero-1600.webp', width: 1600, quality: 80 },
      { name: 'hero-800.webp', width: 800, quality: 80 },
    ]
  },
  // About image: 900w and 450w
  {
    src: 'kyle-mackie-effAM7L50fI-unsplash.jpg',
    outputs: [
      { name: 'about-900.webp', width: 900, quality: 80 },
      { name: 'about-450.webp', width: 450, quality: 80 },
    ]
  },
  // Area card images: 600w each
  {
    src: 'gabriella-clare-marino-WgqZ1q_nkPE-unsplash.jpg',
    outputs: [{ name: 'area-gabriella-600.webp', width: 600, quality: 75 }]
  },
  {
    src: '_95787611_gettyimages-647011416.jpg',
    outputs: [{ name: 'area-gettyimages-600.webp', width: 600, quality: 75 }]
  },
  {
    src: 'brown-headed-sheep-looking-at-the-preview-19727.jpg',
    outputs: [{ name: 'area-sheep-600.webp', width: 600, quality: 75 }]
  },
  {
    src: 'inigo-de-la-maza-LQJg_PXPPUs-unsplash.jpg',
    outputs: [{ name: 'area-inigo-600.webp', width: 600, quality: 75 }]
  },
  {
    src: 'madie-hamilton-l9vXx8aEYJ8-unsplash.jpg',
    outputs: [{ name: 'area-madie-600.webp', width: 600, quality: 75 }]
  },
  {
    src: 'thapanee-srisawat-ahnczgYo2Fo-unsplash.jpg',
    outputs: [{ name: 'area-thapanee-600.webp', width: 600, quality: 75 }]
  },
  {
    src: 'images.jfif',
    outputs: [{ name: 'area-images1-600.webp', width: 600, quality: 75 }]
  },
  {
    src: 'images (1).jfif',
    outputs: [{ name: 'area-images2-600.webp', width: 600, quality: 75 }]
  },
  {
    src: 'images (2).jfif',
    outputs: [{ name: 'area-images3-600.webp', width: 600, quality: 75 }]
  },
];

async function optimize() {
  let totalSaved = 0;

  for (const img of images) {
    const srcPath = path.join(ROOT, img.src);
    
    if (!fs.existsSync(srcPath)) {
      console.error(`MISSING: ${img.src}`);
      continue;
    }

    const srcSize = fs.statSync(srcPath).size;
    console.log(`\nSource: ${img.src} (${(srcSize / 1024).toFixed(1)} KB)`);

    for (const out of img.outputs) {
      const outPath = path.join(OUT, out.name);

      try {
        await sharp(srcPath)
          .resize({ width: out.width, withoutEnlargement: true })
          .webp({ quality: out.quality })
          .toFile(outPath);

        const outSize = fs.statSync(outPath).size;
        const saved = srcSize - outSize;
        totalSaved += saved;

        console.log(`  -> ${out.name}: ${(outSize / 1024).toFixed(1)} KB (saved ${(saved / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  ERROR on ${out.name}: ${err.message}`);
      }
    }
  }

  console.log(`\n=== Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB ===`);
}

optimize().catch(console.error);
