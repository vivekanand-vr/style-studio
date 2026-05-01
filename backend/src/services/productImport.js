/**
 * Product Import Service
 * Routes a product URL to the appropriate data source:
 *   - amazon.in / amazon.com  → Amazon PA API
 *   - flipkart.com            → Flipkart Affiliate API
 *   - everything else         → AI text extraction (stub — requires extension or manual paste)
 *
 * Returns a partial Item object suitable for pre-filling the Add Item form.
 */

const { getProductFromAmazon } = require('./amazonApi');
const { getProductFromFlipkart } = require('./flipkartApi');
const { extractFromText } = require('./aiExtract');
const { autoCategorize } = require('./autoCategorize');

async function resolveProductUrl(url) {
  let hostname;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    throw Object.assign(new Error('Invalid URL'), { status: 400 });
  }

  let productData = null;

  if (/amazon\.(in|com)$/.test(hostname)) {
    const asin = extractAsin(url);
    if (asin) {
      productData = await getProductFromAmazon(asin);
    }
  } else if (/flipkart\.com$/.test(hostname)) {
    productData = await getProductFromFlipkart(url);
  }

  if (!productData) {
    // No API available for this store — return a stub telling the client
    // to use the extension or the manual paste flow
    return {
      sourceLink: url,
      sourceDomain: hostname,
      _importMethod: 'manual',
      _message:
        'This store does not have an official API. Use the Chrome extension or the "Paste page text" flow to fill in the product details.',
    };
  }

  // Auto-suggest category from title
  if (!productData.category && productData.title) {
    productData.category = autoCategorize(productData.title) || '';
  }

  return {
    ...productData,
    sourceLink: url,
    sourceDomain: hostname,
    _importMethod: hostname.includes('amazon') ? 'amazon_api' : 'flipkart_api',
  };
}

/** Extract ASIN from an Amazon URL — handles /dp/ASIN and /gp/product/ASIN */
function extractAsin(url) {
  const match = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

module.exports = { resolveProductUrl };
