import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const srcIcon = path.join(rootDir, 'public', 'pwa-512x512.png');
const resDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res');

const MIPMAP_SIZES = [
  { folder: 'mipmap-mdpi', size: 48, fgSize: 108, iconInner: 72 },
  { folder: 'mipmap-hdpi', size: 72, fgSize: 162, iconInner: 108 },
  { folder: 'mipmap-xhdpi', size: 96, fgSize: 216, iconInner: 144 },
  { folder: 'mipmap-xxhdpi', size: 144, fgSize: 324, iconInner: 216 },
  { folder: 'mipmap-xxxhdpi', size: 192, fgSize: 432, iconInner: 288 },
];

const SPLASH_SCREENS = [
  { folder: 'drawable', width: 480, height: 800, logoSize: 200 },
  { folder: 'drawable-port-mdpi', width: 320, height: 480, logoSize: 140 },
  { folder: 'drawable-port-hdpi', width: 480, height: 800, logoSize: 200 },
  { folder: 'drawable-port-xhdpi', width: 720, height: 1280, logoSize: 300 },
  { folder: 'drawable-port-xxhdpi', width: 960, height: 1600, logoSize: 400 },
  { folder: 'drawable-port-xxxhdpi', width: 1280, height: 1920, logoSize: 500 },
  { folder: 'drawable-land-mdpi', width: 480, height: 320, logoSize: 140 },
  { folder: 'drawable-land-hdpi', width: 800, height: 480, logoSize: 200 },
  { folder: 'drawable-land-xhdpi', width: 1280, height: 720, logoSize: 300 },
  { folder: 'drawable-land-xxhdpi', width: 1600, height: 960, logoSize: 400 },
  { folder: 'drawable-land-xxxhdpi', width: 1920, height: 1280, logoSize: 500 },
];

async function generateAssets() {
  console.log('Generating Android icons and splash screens from:', srcIcon);

  if (!fs.existsSync(srcIcon)) {
    throw new Error(`Source icon not found at ${srcIcon}`);
  }

  // 1. Generate Launcher Icons (standard, round, and adaptive foreground)
  for (const { folder, size, fgSize, iconInner } of MIPMAP_SIZES) {
    const targetFolder = path.join(resDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Standard Icon
    await sharp(srcIcon)
      .resize(size, size)
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher.png'));

    // Round Icon (circular mask)
    const circleSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff"/></svg>`
    );
    await sharp(srcIcon)
      .resize(size, size)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_round.png'));

    // Adaptive Foreground Icon (padded on transparent canvas)
    const resizedInner = await sharp(srcIcon)
      .resize(iconInner, iconInner)
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: fgSize,
        height: fgSize,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{
        input: resizedInner,
        top: Math.round((fgSize - iconInner) / 2),
        left: Math.round((fgSize - iconInner) / 2)
      }])
      .png()
      .toFile(path.join(targetFolder, 'ic_launcher_foreground.png'));

    console.log(`Generated launcher icons for ${folder} (${size}x${size}, fg: ${fgSize}x${fgSize})`);
  }

  // 2. Generate Splash Screens
  for (const { folder, width, height, logoSize } of SPLASH_SCREENS) {
    const targetFolder = path.join(resDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const resizedLogo = await sharp(srcIcon)
      .resize(logoSize, logoSize)
      .png()
      .toBuffer();

    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a theme dark slate
      }
    })
      .composite([{
        input: resizedLogo,
        top: Math.round((height - logoSize) / 2),
        left: Math.round((width - logoSize) / 2)
      }])
      .png()
      .toFile(path.join(targetFolder, 'splash.png'));

    console.log(`Generated splash for ${folder} (${width}x${height})`);
  }

  console.log('All Android icon and splash screen assets generated successfully!');
}

generateAssets().catch(err => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
