const { Schema, model, Types } = require('mongoose');

const PriceHistorySchema = new Schema(
  {
    itemId: { type: Types.ObjectId, ref: 'Item', required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    // 'amazon_api' | 'flipkart_api' | 'extension' | 'manual'
    source: { type: String, default: 'manual' },
    fetchedAt: { type: Date, default: Date.now },
    // Whether the item was in stock when this price was recorded
    inStock: { type: Boolean, default: true },
  },
  {
    // Don't add createdAt/updatedAt — fetchedAt is the only timestamp needed
    timestamps: false,
  }
);

PriceHistorySchema.index({ itemId: 1, fetchedAt: -1 });

module.exports = model('PriceHistory', PriceHistorySchema);
