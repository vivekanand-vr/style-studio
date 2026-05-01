/**
 * Auto-Categorize Service
 * Keyword-based category and subcategory suggestions from a product title.
 */

const CATEGORY_HINTS = {
  Topwear: [
    'shirt', 't-shirt', 'tee', 'jacket', 'hoodie', 'sweater', 'kurta', 'blazer',
    'sweatshirt', 'polo', 'top', 'kurti', 'vest', 'blouse', 'cardigan', 'pullover',
  ],
  Bottomwear: [
    'jeans', 'chinos', 'trousers', 'shorts', 'cargo', 'jogger', 'track pant',
    'skirt', 'legging', 'pant', 'denim', 'palazzo',
  ],
  Footwear: [
    'shoes', 'sneakers', 'boots', 'sandals', 'loafers', 'chappal', 'heels',
    'flip flop', 'slipper', 'moccasin', 'espadrille', 'oxford', 'derby', 'wedge',
  ],
  Accessories: [
    'watch', 'belt', 'bag', 'sunglasses', 'cap', 'hat', 'chain', 'ring',
    'bracelet', 'perfume', 'backpack', 'wallet', 'purse', 'sunglass', 'scarf',
    'glove', 'tie', 'pocket square', 'cufflink',
  ],
};

const SUBCATEGORY_HINTS = {
  // Topwear
  'Shirts':      ['shirt'],
  'T-Shirts':    ['t-shirt', 'tee', 'polo'],
  'Jackets':     ['jacket'],
  'Sweaters':    ['sweater', 'pullover', 'cardigan'],
  'Sweatshirts': ['sweatshirt'],
  'Hoodies':     ['hoodie'],
  'Kurta':       ['kurta', 'kurti'],
  'Blazers':     ['blazer'],
  // Bottomwear
  'Jeans':       ['jeans', 'denim'],
  'Chinos':      ['chino'],
  'Trousers':    ['trouser', 'pant'],
  'Shorts':      ['short'],
  'Cargo':       ['cargo'],
  'Joggers':     ['jogger'],
  'Track Pants': ['track pant'],
  // Footwear
  'Sneakers':    ['sneaker'],
  'Formal':      ['oxford', 'derby', 'formal shoe'],
  'Sandals':     ['sandal'],
  'Boots':       ['boot'],
  'Loafers':     ['loafer', 'moccasin'],
  'Flip Flops':  ['flip flop', 'slipper', 'chappal'],
  'Sports Shoes':['sport', 'running shoe', 'training shoe'],
  // Accessories
  'Watches':     ['watch'],
  'Bags':        ['bag', 'backpack', 'purse', 'wallet'],
  'Belts':       ['belt'],
  'Sunglasses':  ['sunglass', 'sunglasses'],
  'Hats':        ['cap', 'hat'],
  'Perfumes':    ['perfume', 'fragrance', 'cologne', 'deodorant'],
  'Chains':      ['chain', 'necklace'],
  'Bracelets':   ['bracelet', 'bangle'],
  'Rings':       ['ring'],
};

/**
 * @param {string} title
 * @returns {{ category: string|null, subcategory: string|null }}
 */
function autoCategorize(title = '') {
  const lower = title.toLowerCase();

  let category = null;
  for (const [cat, keywords] of Object.entries(CATEGORY_HINTS)) {
    if (keywords.some((k) => lower.includes(k))) {
      category = cat;
      break;
    }
  }

  let subcategory = null;
  for (const [subcat, keywords] of Object.entries(SUBCATEGORY_HINTS)) {
    if (keywords.some((k) => lower.includes(k))) {
      subcategory = subcat;
      break;
    }
  }

  return { category, subcategory };
}

module.exports = { autoCategorize };
