/**
 * Color Analysis Service
 * Extracts the dominant color from a product image URL.
 * Uses `sharp` to resize the image and compute average RGB → HSL.
 */

const axios = require('axios');
let sharp;
try {
  sharp = require('sharp');
} catch {
  // sharp is an optional native dependency; feature degrades gracefully without it
}

async function extractDominantColor(imageUrl) {
  if (!sharp) {
    console.warn('[colorAnalysis] sharp not available — skipping color extraction');
    return null;
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      // Avoid getting blocked by CDNs
      headers: { 'User-Agent': 'style-studio-bot/1.0' },
    });

    const buffer = Buffer.from(response.data);

    // Resize to tiny 50×50 thumbnail for fast pixel averaging
    const { data, info } = await sharp(buffer)
      .resize(50, 50, { fit: 'cover' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const pixels = info.width * info.height;
    let r = 0, g = 0, b = 0;

    for (let i = 0; i < data.length; i += 3) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.round(r / pixels);
    g = Math.round(g / pixels);
    b = Math.round(b / pixels);

    const hsl = rgbToHsl(r, g, b);
    const colorName = getColorName(hsl);
    const isNeutral =
      hsl.s < 15 || ['black', 'white', 'grey', 'beige', 'navy', 'brown'].includes(colorName);

    return {
      rgb: [r, g, b],
      hsl,
      hex: rgbToHex(r, g, b),
      colorName,
      isNeutral,
    };
  } catch (err) {
    console.warn('[colorAnalysis] Failed for', imageUrl, '—', err.message);
    return null;
  }
}

/**
 * Score the color harmony between two items' HSL color values.
 * Returns a number 0.0 – 1.0.
 */
function colorHarmonyScore(hsl1, hsl2) {
  if (!hsl1 || !hsl2) return 0.5; // unknown — neutral score

  // Neutral items pair well with anything
  const n1 = hsl1.s < 15;
  const n2 = hsl2.s < 15;
  if (n1 || n2) return 0.9;

  const hueDiff = Math.abs(hsl1.h - hsl2.h);

  // Complementary: ~180° apart → strong visual contrast, great pairing
  if (Math.abs(hueDiff - 180) < 25) return 1.0;

  // Analogous: within 30° → safe, cohesive look
  if (hueDiff < 30 || hueDiff > 330) return 0.8;

  // Triadic: ~120° apart → bold but balanced
  if (Math.abs(hueDiff - 120) < 20 || Math.abs(hueDiff - 240) < 20) return 0.7;

  // Split-complementary: ~150° or ~210°
  if (Math.abs(hueDiff - 150) < 20 || Math.abs(hueDiff - 210) < 20) return 0.65;

  // Everything else — potential clash
  return 0.3;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function getColorName({ h, s, l }) {
  if (l < 10) return 'black';
  if (l > 90) return 'white';
  if (s < 15) {
    if (l < 40) return 'grey';
    if (l < 70) return 'grey';
    return 'beige';
  }
  if (h >= 345 || h < 15) return 'red';
  if (h >= 15 && h < 40) return 'orange';
  if (h >= 40 && h < 65) return 'yellow';
  if (h >= 65 && h < 165) return 'green';
  if (h >= 165 && h < 195) return 'teal';
  if (h >= 195 && h < 250) return l < 35 ? 'navy' : 'blue';
  if (h >= 250 && h < 290) return 'purple';
  if (h >= 290 && h < 345) return 'pink';
  return 'grey';
}

module.exports = { extractDominantColor, colorHarmonyScore };
