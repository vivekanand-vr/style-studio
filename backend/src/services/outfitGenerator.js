/**
 * Outfit Generator Service
 * Implements the rule-based color harmony + style compatibility algorithm
 * described in ENHANCEMENTS.md §4.1.
 *
 * Takes an array of Item documents and returns ranked outfit suggestions.
 * No external API calls — runs entirely in-process.
 */

const { colorHarmonyScore } = require('./colorAnalysis');

// ── Style compatibility matrix ────────────────────────────────────────────────
const STYLE_COMPAT = {
  Formal:      { Formal: 1.0, Casual: 0.3, Ethnic: 0.5, Activewear: 0.1, Party: 0.7 },
  Casual:      { Formal: 0.3, Casual: 1.0, Ethnic: 0.5, Activewear: 0.5, Party: 0.6 },
  Ethnic:      { Formal: 0.5, Casual: 0.5, Ethnic: 1.0, Activewear: 0.1, Party: 0.7 },
  Activewear:  { Formal: 0.1, Casual: 0.5, Ethnic: 0.1, Activewear: 1.0, Party: 0.2 },
  Party:       { Formal: 0.7, Casual: 0.6, Ethnic: 0.7, Activewear: 0.2, Party: 1.0 },
};

// Subcategory-level compatibility overrides
const SUBCAT_COMPAT = {
  'Blazers':     ['Trousers', 'Chinos'],
  'Shirts':      ['Trousers', 'Chinos', 'Jeans'],
  'T-Shirts':    ['Jeans', 'Shorts', 'Joggers', 'Cargo'],
  'Kurta':       ['Trousers', 'Chinos', 'Joggers'],
  'Hoodies':     ['Jeans', 'Cargo', 'Joggers', 'Track Pants'],
  'Sweatshirts': ['Jeans', 'Cargo', 'Joggers', 'Track Pants'],
  'Jackets':     ['Jeans', 'Chinos', 'Trousers'],
};

function styleScore(item1, item2) {
  const t1 = item1.type || 'Casual';
  const t2 = item2.type || 'Casual';
  const base = STYLE_COMPAT[t1]?.[t2] ?? 0.5;

  // Bonus if subcategories are known-compatible pairs
  const compatible = SUBCAT_COMPAT[item1.subcategory];
  const bonus = compatible?.includes(item2.subcategory) ? 0.2 : 0;

  return Math.min(base + bonus, 1.0);
}

function occasionScore(items) {
  const occasions = items.map((i) => i.occasion || i.type).filter(Boolean);
  if (occasions.length < 2) return 0.7; // unknown — neutral
  const dominant = occasions[0];
  const consistency = occasions.filter((o) => o === dominant).length / occasions.length;
  return consistency;
}

// ── Core algorithm ─────────────────────────────────────────────────────────────

/**
 * @param {Array} items - Mongoose Item documents
 * @param {Object} opts - { occasion?, season?, count? }
 * @returns Array of { items: Item[], score, colorHarmony }
 */
function generateOutfits(items, { occasion, season, count = 5 } = {}) {
  const byCategory = {
    Topwear:     items.filter((i) => i.category === 'Topwear'),
    Bottomwear:  items.filter((i) => i.category === 'Bottomwear'),
    Footwear:    items.filter((i) => i.category === 'Footwear'),
    Accessories: items.filter((i) => i.category === 'Accessories'),
  };

  if (byCategory.Topwear.length === 0 || byCategory.Bottomwear.length === 0) {
    return []; // Need at minimum a top and bottom
  }

  const candidates = [];

  for (const top of byCategory.Topwear) {
    for (const bottom of byCategory.Bottomwear) {
      const colorTop_Bottom = colorHarmonyScore(top.colorHsl, bottom.colorHsl);
      const styleTop_Bottom = styleScore(top, bottom);
      const baseScore = colorTop_Bottom * 0.5 + styleTop_Bottom * 0.5;

      if (byCategory.Footwear.length > 0) {
        for (const shoe of byCategory.Footwear) {
          const colorBottomShoe = colorHarmonyScore(bottom.colorHsl, shoe.colorHsl);
          const colorTopShoe    = colorHarmonyScore(top.colorHsl, shoe.colorHsl);
          const styleTopShoe    = styleScore(top, shoe);
          const shoeScore =
            baseScore
            + (colorBottomShoe * 0.35 + colorTopShoe * 0.15 + styleTopShoe * 0.3) * 0.5;

          // Optional accessory layer
          const accessorySet = byCategory.Accessories.length > 0 ? byCategory.Accessories : [null];
          for (const acc of accessorySet) {
            let finalScore = shoeScore;
            if (acc) {
              const colorAccShoe = colorHarmonyScore(acc.colorHsl, shoe.colorHsl);
              finalScore += colorAccShoe * 0.05;
            }

            const outfitItems = [top, bottom, shoe, ...(acc ? [acc] : [])];
            finalScore *= occasionScore(outfitItems);
            finalScore = Math.round(Math.min(finalScore, 1) * 100);

            const harmony = detectHarmony(top.colorHsl, bottom.colorHsl);

            candidates.push({ items: outfitItems, score: finalScore, colorHarmony: harmony });
          }
        }
      } else {
        // No footwear — just top + bottom
        const finalScore = Math.round(baseScore * occasionScore([top, bottom]) * 100);
        candidates.push({
          items: [top, bottom],
          score: finalScore,
          colorHarmony: detectHarmony(top.colorHsl, bottom.colorHsl),
        });
      }
    }
  }

  // Deduplicate by item ID set and return top N by score
  const seen = new Set();
  return candidates
    .sort((a, b) => b.score - a.score)
    .filter((c) => {
      const key = c.items
        .map((i) => i._id.toString())
        .sort()
        .join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, count);
}

function detectHarmony(hsl1, hsl2) {
  if (!hsl1 || !hsl2 || hsl1.s < 15 || hsl2.s < 15) return 'neutral';
  const diff = Math.abs(hsl1.h - hsl2.h);
  if (Math.abs(diff - 180) < 25) return 'complementary';
  if (diff < 30 || diff > 330) return 'analogous';
  if (Math.abs(diff - 120) < 20 || Math.abs(diff - 240) < 20) return 'triadic';
  return 'mixed';
}

module.exports = { generateOutfits };
