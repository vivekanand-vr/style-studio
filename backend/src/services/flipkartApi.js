/**
 * Flipkart Affiliate API
 *
 * Prerequisites:
 *   1. Register at https://affiliate.flipkart.com/
 *   2. Set FLIPKART_AFFILIATE_ID and FLIPKART_AFFILIATE_TOKEN in .env
 *
 * Note: Flipkart's affiliate API provides product search by category/query.
 * For a specific product URL, we extract the product ID and search for it.
 */

const axios = require('axios');

const BASE_URL = 'https://affiliate-api.flipkart.net/affiliate/1.0/feeds';

async function getProductFromFlipkart(productUrl) {
  const { FLIPKART_AFFILIATE_ID, FLIPKART_AFFILIATE_TOKEN } = process.env;

  if (!FLIPKART_AFFILIATE_ID || !FLIPKART_AFFILIATE_TOKEN) {
    console.warn('[flipkartApi] Flipkart affiliate credentials not configured in .env');
    return null;
  }

  // Extract product name from the URL path as a search query
  // e.g. /p/prd/some-product-name → "some product name"
  let query = '';
  try {
    const path = new URL(productUrl).pathname;
    const slug = path.split('/').find((s) => s.length > 5 && !s.startsWith('p'));
    query = slug ? slug.replace(/-/g, ' ') : '';
  } catch {}

  if (!query) return null;

  try {
    const url = `${BASE_URL}/${FLIPKART_AFFILIATE_ID}/category/search`;
    const response = await axios.get(url, {
      params: { query, resultCount: 1 },
      headers: {
        'Fk-Affiliate-Id':    FLIPKART_AFFILIATE_ID,
        'Fk-Affiliate-Token': FLIPKART_AFFILIATE_TOKEN,
      },
      timeout: 10000,
    });

    const product = response.data?.products?.[0];
    if (!product) return null;

    return {
      title:    product.productBaseInfo?.productAttributes?.title || '',
      brand:    product.productBaseInfo?.productAttributes?.brand || '',
      price:    product.productBaseInfo?.productAttributes?.maximumRetailPrice?.amount
               ? Number(product.productBaseInfo.productAttributes.maximumRetailPrice.amount)
               : null,
      currency: 'INR',
      image:    product.productBaseInfo?.productAttributes?.imageUrls?.['400x400'] || '',
      description: product.productBaseInfo?.productAttributes?.productDescription || '',
    };
  } catch (err) {
    console.error('[flipkartApi] Error:', err.message);
    return null;
  }
}

module.exports = { getProductFromFlipkart };
