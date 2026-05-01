const { Schema, model } = require('mongoose');

const ItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Topwear', 'Bottomwear', 'Footwear', 'Accessories'],
    },
    subcategory: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Casual', 'Formal', 'Activewear', 'Ethnic', 'Party', ''],
      default: '',
    },
    color: { type: String, trim: true, default: '' },
    size: { type: String, trim: true, default: '' },
    price: { type: Number, default: null, min: 0 },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP'],
    },
    sourceLink: { type: String, trim: true, default: '' },
    sourceDomain: { type: String, trim: true, default: '' },
    // Original URL from the retailer
    image: { type: String, trim: true, default: '' },
    // Cloudinary-hosted backup so images never 404
    imageBackup: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    purchased: { type: Boolean, default: false },
    favorite: { type: Boolean, default: false },
    tags: [{ type: String }],

    // ── AI fields (populated by colorAnalysis service) ────────────────────
    // Dominant color stored as [R, G, B]
    colorVector: { type: [Number], default: undefined },
    // HSL representation for harmony scoring  { h, s, l }
    colorHsl: {
      h: { type: Number },
      s: { type: Number },
      l: { type: Number },
    },
    colorHex: { type: String },
    colorName: { type: String },
    isNeutralColor: { type: Boolean },
  },
  { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
ItemSchema.index({ category: 1 });
ItemSchema.index({ subcategory: 1 });
ItemSchema.index({ brand: 1 });
ItemSchema.index({ purchased: 1 });
ItemSchema.index({ favorite: 1 });
ItemSchema.index({ price: 1 });
// Text index for search
ItemSchema.index(
  { title: 'text', brand: 'text', description: 'text', color: 'text', notes: 'text' },
  { name: 'item_text_search' }
);

module.exports = model('Item', ItemSchema);
