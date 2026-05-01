/**
 * Amazon Product Advertising API 5.0 (PA API)
 *
 * Prerequisites:
 *   1. Create an Amazon Associates account at https://affiliate-program.amazon.in/
 *   2. Request PA API access from your Associates dashboard
 *   3. Set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG in .env
 *
 * npm install paapi5-nodejs-sdk
 */

let paapi;
try {
  paapi = require('paapi5-nodejs-sdk');
} catch {
  // SDK not installed yet — stub returns null
}

async function getProductFromAmazon(asin) {
  if (!paapi) {
    console.warn('[amazonApi] paapi5-nodejs-sdk not installed — run: npm install paapi5-nodejs-sdk');
    return null;
  }

  const { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_PARTNER_TAG, AMAZON_HOST, AMAZON_REGION } =
    process.env;

  if (!AMAZON_ACCESS_KEY || !AMAZON_SECRET_KEY || !AMAZON_PARTNER_TAG) {
    console.warn('[amazonApi] Amazon PA API credentials not configured in .env');
    return null;
  }

  try {
    const defaultClient = paapi.ApiClient.instance;
    defaultClient.accessKey   = AMAZON_ACCESS_KEY;
    defaultClient.secretKey   = AMAZON_SECRET_KEY;
    defaultClient.host        = AMAZON_HOST || 'webservices.amazon.in';
    defaultClient.region      = AMAZON_REGION || 'eu-west-1';

    const api = new paapi.DefaultApi();
    const request = new paapi.GetItemsRequest();

    request.PartnerTag  = AMAZON_PARTNER_TAG;
    request.PartnerType = paapi.PartnerType.ASSOCIATES;
    request.ItemIds     = [asin];
    request.Resources   = [
      paapi.GetItemsResource.ITEMINFO_TITLE,
      paapi.GetItemsResource.ITEMINFO_BYLINEINFO,
      paapi.GetItemsResource.OFFERS_LISTINGS_PRICE,
      paapi.GetItemsResource.IMAGES_PRIMARY_LARGE,
      paapi.GetItemsResource.ITEMINFO_CLASSIFICATIONS,
      paapi.GetItemsResource.ITEMINFO_FEATURES,
    ];

    const data = await api.getItems(request);
    const item = data?.ItemsResult?.Items?.[0];
    if (!item) return null;

    const price   = item.Offers?.Listings?.[0]?.Price?.Amount;
    const currency = item.Offers?.Listings?.[0]?.Price?.Currency || 'INR';

    return {
      title:    item.ItemInfo?.Title?.DisplayValue || '',
      brand:    item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || '',
      price:    price ? Number(price) : null,
      currency,
      image:    item.Images?.Primary?.Large?.URL || '',
      description: item.ItemInfo?.Features?.DisplayValues?.join(' ') || '',
    };
  } catch (err) {
    console.error('[amazonApi] Error fetching ASIN', asin, err.message);
    return null;
  }
}

module.exports = { getProductFromAmazon };
