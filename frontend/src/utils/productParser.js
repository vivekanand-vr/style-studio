// Product link parser utility

// Multiple CORS proxies as fallbacks
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/raw?url=',
];

// Extract domain from URL
export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return '';
  }
};

// Extract Open Graph metadata from HTML
const extractMetadata = (html, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const getMetaContent = (property) => {
    const meta = doc.querySelector(`meta[property="${property}"]`) || 
                 doc.querySelector(`meta[name="${property}"]`);
    return meta?.getAttribute('content') || '';
  };

  const title = getMetaContent('og:title') || 
                getMetaContent('twitter:title') || 
                doc.querySelector('title')?.textContent || '';

  const description = getMetaContent('og:description') || 
                     getMetaContent('description') || 
                     getMetaContent('twitter:description') || '';

  const image = getMetaContent('og:image') || 
                getMetaContent('twitter:image') || '';

  // Try to extract price - multiple patterns
  const pricePatterns = [
    /₹\s*[\d,]+/,
    /Rs\.?\s*[\d,]+/,
    /INR\s*[\d,]+/,
    /"price":\s*"?([\d,]+)"?/,
    /"price":\s*(\d+)/
  ];
  
  let price = '';
  for (const pattern of pricePatterns) {
    const match = html.match(pattern);
    if (match) {
      price = match[0].replace(/[₹Rs.INR\s"]/g, '').replace(/,/g, '');
      break;
    }
  }

  // Try to extract brand from JSON-LD
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  let brand = '';
  
  jsonLdScripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      if (data.brand) {
        brand = typeof data.brand === 'string' ? data.brand : data.brand.name;
      }
    } catch (e) {
      // Ignore parse errors
    }
  });

  return {
    title: title.trim(),
    description: description.trim(),
    image: image.trim(),
    price: price ? parseFloat(price) : null,
    brand: brand.trim(),
    sourceDomain: extractDomain(url),
  };
};

// Fetch with timeout
const fetchWithTimeout = (url, timeout = 10000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// Fetch product details from URL with fallback proxies
export const fetchProductDetails = async (url) => {
  // Try each proxy in sequence
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetchWithTimeout(proxyUrl, 8000);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const html = await response.text();
      const metadata = extractMetadata(html, url);
      
      return {
        success: true,
        data: metadata,
      };
    } catch (error) {
      console.log(`Proxy ${i + 1} failed:`, error.message);
      // Continue to next proxy
      if (i === CORS_PROXIES.length - 1) {
        // All proxies failed
        return {
          success: false,
          error: 'Unable to fetch product details. Please fill manually.',
          data: {
            sourceDomain: extractDomain(url),
          },
        };
      }
    }
  }
};

// Detect if a string is a valid product URL
export const isProductUrl = (text) => {
  try {
    const url = new URL(text);
    const productDomains = [
      'flipkart.com',
      'amazon.in',
      'amazon.com',
      'myntra.com',
      'ajio.com',
      'nykaa.com',
      'meesho.com',
    ];
    return productDomains.some(domain => url.hostname.includes(domain));
  } catch (e) {
    return false;
  }
};
