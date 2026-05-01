# Style Studio — Comprehensive Enhancement Plan

> **Current State**: React 19 + Vite SPA, fully client-side, data stored in `localStorage`.  
> This document is a structured roadmap for evolving Style Studio into a full-stack, AI-powered wardrobe platform.

---

## Table of Contents

1. [Backend — Node.js + MongoDB](#1-backend--nodejs--mongodb)
2. [Smart Product Import — Paste a Link, Get Everything](#2-smart-product-import--paste-a-link-get-everything)
3. [Chrome Extension — Add to Wishlist from Any Store](#3-chrome-extension--add-to-wishlist-from-any-store)
4. [AI Features](#4-ai-features)
   - 4.1 [Auto Outfit Generation](#41-auto-outfit-generation)
   - 4.2 [Color & Style Matching Engine](#42-color--style-matching-engine)
   - 4.3 [Training Data Strategy](#43-training-data-strategy)
   - 4.4 [AI-Powered Search & Recommendations](#44-ai-powered-search--recommendations)
5. [User Authentication & Multi-Device Sync](#5-user-authentication--multi-device-sync)
6. [Price Tracking & Deal Alerts](#6-price-tracking--deal-alerts)
7. [Advanced Outfit Builder](#7-advanced-outfit-builder)
8. [Analytics & Wardrobe Insights](#8-analytics--wardrobe-insights)
9. [Progressive Web App (PWA)](#9-progressive-web-app-pwa)
10. [Additional Feature Ideas](#10-additional-feature-ideas)
11. [Implementation Priority Matrix](#11-implementation-priority-matrix)
12. [Architecture Diagram](#12-architecture-diagram)

---

## 1. Backend — Node.js + MongoDB

### Why

The current `localStorage` approach ties all data to a single browser on a single device. A backend unlocks multi-device sync, sharing, scheduled jobs (price tracking), and AI model calls.

### Proposed Stack

| Layer | Technology | Reason |
|---|---|---|
| Runtime | Node.js 20 LTS | Familiar JS ecosystem, async I/O fits scraping/price jobs |
| Framework | Express.js | Minimal, well-documented, vast middleware ecosystem |
| Database | MongoDB Atlas (free tier available) | Flexible schema matches the current item/outfit models, easy to evolve |
| ODM | Mongoose | Schema validation, virtuals, easy population of references |
| Auth | JWT + bcrypt (phase 2) | Stateless, mobile-friendly |
| Image Storage | Cloudinary (free tier) | Stores product images so original URLs don't 404 |
| Cache | Redis (optional, phase 3) | Cache scraped pages, price fetch results |
| Scheduler | node-cron | Runs price-check jobs nightly |

### API Design

**Base URL**: `https://api.stylestudio.app/v1`

#### Items

| Method | Route | Description |
|---|---|---|
| `GET` | `/items` | List all items (supports `?category=&brand=&minPrice=&maxPrice=&purchased=`) |
| `GET` | `/items/:id` | Get single item |
| `POST` | `/items` | Create item |
| `PATCH` | `/items/:id` | Update item fields |
| `DELETE` | `/items/:id` | Delete item + remove from outfits |
| `POST` | `/items/import-url` | **New**: scrape a product URL, return pre-filled item data |
| `PATCH` | `/items/:id/toggle-purchased` | Toggle purchased status |
| `PATCH` | `/items/:id/toggle-favorite` | Toggle favorite status |

#### Outfits

| Method | Route | Description |
|---|---|---|
| `GET` | `/outfits` | List all outfits |
| `GET` | `/outfits/:id` | Get outfit with populated items |
| `POST` | `/outfits` | Create outfit |
| `PATCH` | `/outfits/:id` | Update outfit |
| `DELETE` | `/outfits/:id` | Delete outfit |
| `POST` | `/outfits/generate` | **New**: AI-generate outfit from item pool |

#### Price Tracking

| Method | Route | Description |
|---|---|---|
| `GET` | `/prices/:itemId` | Get price history for an item |
| `POST` | `/prices/check` | Manually trigger price re-fetch for an item |

### MongoDB Schemas (Mongoose)

```js
// Item Schema
const ItemSchema = new Schema({
  title:       { type: String, required: true, trim: true },
  brand:       { type: String, required: true, trim: true },
  category:    { type: String, required: true },
  subcategory: { type: String, required: true },
  type:        { type: String },
  color:       { type: String },
  size:        { type: String },
  price:       { type: Number, default: null },
  currency:    { type: String, default: 'INR', enum: ['INR', 'USD', 'EUR', 'GBP'] },
  sourceLink:  { type: String },
  sourceDomain:{ type: String },
  image:       { type: String },       // original scraped URL
  imageBackup: { type: String },       // Cloudinary-hosted copy
  description: { type: String },
  notes:       { type: String },
  purchased:   { type: Boolean, default: false },
  favorite:    { type: Boolean, default: false },
  // AI fields
  colorVector: { type: [Number] },      // RGB embedding for color matching
  styleEmbedding: { type: [Number] },   // style/category embedding
  tags:        [{ type: String }],
}, { timestamps: true });

// Outfit Schema
const OutfitSchema = new Schema({
  name:        { type: String, required: true },
  description: { type: String },
  itemIds:     [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  occasion:    { type: String },
  season:      { type: String },
  coverImage:  { type: String },
  canvas: {
    nodes: [{ itemId: Schema.Types.ObjectId, x: Number, y: Number, z: Number }]
  },
  // AI fields
  aiGenerated: { type: Boolean, default: false },
  styleScore:  { type: Number },        // 0-100 confidence score
  colorHarmony:{ type: String },        // "complementary" | "analogous" | "monochromatic"
}, { timestamps: true });

// Price History Schema
const PriceHistorySchema = new Schema({
  itemId:    { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  price:     { type: Number, required: true },
  currency:  { type: String },
  fetchedAt: { type: Date, default: Date.now },
  source:    { type: String },          // domain the price was scraped from
});
```

### Migration from localStorage

The app already has a clean `localStorage.js` abstraction layer. Migration plan:

1. Build the backend with all endpoints
2. Add a one-click **"Migrate to Cloud"** button in the app Settings page
3. Button reads all `localStorage` data, POSTs it to `/items/bulk` and `/outfits/bulk` endpoints
4. After confirmation, clear `localStorage` and switch to API mode
5. Store a flag in `localStorage` (e.g., `storage_mode: "api"`) to route all calls through the backend

### Folder Structure (Backend)

```
style-studio-api/
├── src/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── controllers/     # Route handlers
│   ├── services/
│   │   ├── amazonApi.js     # Amazon PA API integration
│   │   ├── flipkartApi.js   # Flipkart Affiliate API integration
│   │   ├── aiExtract.js     # LLM-based text extraction fallback
│   │   ├── priceJob.js      # node-cron price tracking (API-backed items)
│   │   ├── ai.js            # AI outfit generation calls
│   │   └── cloudinary.js    # Image backup to Cloudinary
│   ├── middleware/      # Auth, validation, error handling
│   └── app.js
├── .env
└── package.json
```

---

## 2. Smart Product Import — Paste a Link, Get Everything

### Why Server-Side Scraping Is the Wrong Approach

Automatically fetching competitor product pages from **your own server** violates the Terms of Service of virtually every major retailer (Myntra, Amazon, Flipkart, Ajio, etc.). Beyond ToS violations, it raises legal risk under computer fraud statutes and creates brittle infrastructure that breaks whenever a site updates its HTML. It is not a good foundation for a product.

The right approaches are:

| Approach | How it works | Legal standing |
|---|---|---|
| **Official Affiliate / Product APIs** | Retailer grants you API access to their catalog | Fully legal, data is reliable and structured |
| **Chrome Extension (client-side extraction)** | User opens the product page themselves; extension reads the already-loaded DOM | Legal — the user is the one browsing, the extension is their agent (same model as Honey, Rakuten, CamelCamelCamel) |
| **AI-assisted manual entry** | User pastes the URL; an LLM reads the page content the user provides and extracts fields | Legal — no unauthorized server access |
| **User pastes product title / image URL** | Minimal friction manual flow with AI auto-categorization | Always legal |

---

### Approach A — Official Affiliate & Product APIs

Several major Indian retailers offer official APIs through their affiliate programs. These give structured, reliable product data (title, brand, price, images, description) in JSON format with no scraping needed.

| Store | Program | API access |
|---|---|---|
| Amazon.in / .com | **Amazon Product Advertising API 5.0** (PA API) | Free with approved Associates account — returns full product data including real-time prices and images |
| Flipkart | **Flipkart Affiliate API** | Free with approved affiliate account — product search, price, images |
| Myntra | No public API currently | Use extension approach (Section 3) |
| Ajio | No public API | Use extension approach |
| Nykaa | No public API | Use extension approach |

**Amazon PA API — how to use it:**

```js
// Backend: services/amazonApi.js
// Uses the official amazon-paapi npm package
const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');

const client = new ProductAdvertisingAPIv1.DefaultApi();

async function getProductByAsin(asin) {
  const request = new ProductAdvertisingAPIv1.GetItemsRequest();
  request.PartnerTag   = process.env.AMAZON_PARTNER_TAG;
  request.PartnerType  = 'Associates';
  request.ItemIds      = [asin];
  request.Resources    = [
    'ItemInfo.Title',
    'ItemInfo.ByLineInfo',       // brand
    'Offers.Listings.Price',
    'Images.Primary.Large',
    'ItemInfo.Classifications',  // category
    'ItemInfo.Features',
  ];

  const data = await client.getItems(request);
  const item = data.ItemsResult.Items[0];

  return {
    title:    item.ItemInfo.Title.DisplayValue,
    brand:    item.ItemInfo.ByLineInfo?.Brand?.DisplayValue,
    price:    item.Offers?.Listings?.[0]?.Price?.Amount,
    currency: item.Offers?.Listings?.[0]?.Price?.Currency,
    image:    item.Images?.Primary?.Large?.URL,
    sourceLink: item.DetailPageURL,
  };
}
```

The backend exposes `/items/import-url` — it parses the ASIN from an Amazon URL (e.g. `amazon.in/dp/B09XYZ`) and calls the PA API. No page fetching, no scraping, fully within Amazon's terms.

**Flipkart Affiliate API — how to use it:**

```js
// Backend: services/flipkartApi.js
async function searchFlipkartProduct(query) {
  const response = await fetch(
    `https://affiliate-api.flipkart.net/affiliate/1.0/feeds/${process.env.FLIPKART_AFFILIATE_ID}/category/search?query=${encodeURIComponent(query)}`,
    { headers: { 'Fk-Affiliate-Id': process.env.FLIPKART_AFFILIATE_ID,
                 'Fk-Affiliate-Token': process.env.FLIPKART_AFFILIATE_TOKEN } }
  );
  const data = await response.json();
  // data.products[0] has: title, brand, imageUrls, price.selling, productUrl
  return data.products[0];
}
```

**When a user pastes a Flipkart URL**, the backend extracts the product ID from the URL and queries the affiliate API directly.

---

### Approach B — AI-Assisted Link Import (No Scraping)

For stores without an official API (Myntra, Ajio, Zara, etc.), the cleanest approach is a combination of the Chrome extension (Section 3) **plus** an AI extraction fallback when the extension isn't installed:

**User flow (no extension):**
```
User pastes URL → "Open & Import" button found
       ↓
App opens the URL in a new tab — user's OWN browser loads the page
       ↓
App shows: "Copy the product page text and paste it below" (with instructions)
       ↓
User Ctrl+A, Ctrl+C on the product page and pastes into a text area
       ↓
LLM (GPT-4o mini) extracts structured data from the raw text:
  { title, brand, price, currency, color, description }
       ↓
Form auto-fills — user confirms and saves
```

This is a graceful fallback — always works, no legal risk, and the LLM extraction is fast and cheap (GPT-4o mini costs ~$0.00015 per call).

**LLM extraction prompt:**

```js
const extractionPrompt = `
You are a product data extractor. Extract the following fields from this 
raw product page text. Return ONLY valid JSON, nothing else.

Fields to extract:
- title (string): product name
- brand (string): brand/manufacturer
- price (number): numeric price only, no currency symbol
- currency (string): currency code like INR, USD, EUR
- color (string): color if mentioned
- description (string): short 1–2 sentence description

If a field cannot be found, use null.

Product page text:
${rawPageText}
`;
```

---

### Approach C — Auto-Categorization from Title

Regardless of data source, run the imported title through a keyword classifier to pre-fill category/subcategory:

```js
// utils/autoCategorize.js (frontend or backend)
const categoryHints = {
  topwear:    ['shirt', 't-shirt', 'tee', 'jacket', 'hoodie', 'sweater', 'kurta', 'blazer', 'sweatshirt', 'top', 'polo'],
  bottomwear: ['jeans', 'chinos', 'trousers', 'shorts', 'cargo', 'jogger', 'track pant', 'skirt', 'legging'],
  footwear:   ['shoes', 'sneakers', 'boots', 'sandals', 'loafers', 'chappal', 'heels', 'flip flop', 'slipper'],
  accessories:['watch', 'belt', 'bag', 'sunglasses', 'cap', 'hat', 'chain', 'ring', 'bracelet', 'perfume', 'backpack'],
};

export function autoCategorize(title = '') {
  const lower = title.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryHints)) {
    if (keywords.some(k => lower.includes(k))) return category;
  }
  return null; // user selects manually
}
```

---

## 3. Chrome Extension — Add to Wishlist from Any Store

### Why the Extension is the Right Approach for Stores Without APIs

The extension operates entirely within the user's own browser session. The user navigates to the product page themselves — the extension simply reads the DOM that's already loaded. This is the **same model used by Honey, Rakuten, CamelCamelCamel, and every legitimate price-comparison tool**. It is legal because:

- The user is the one making the HTTP request to the retailer's server
- The extension acts as the user's agent, performing actions on their behalf
- No retailer's server is accessed without the user's knowledge or consent
- This is explicitly permitted under most countries' computer access laws (no "unauthorized access")

This is fundamentally different from a server-side scraper that hits retailer servers without user involvement.

### Concept

A lightweight Chrome extension that adds a floating **"+ Add to Style Studio"** button on any supported e-commerce product page. One click sends the product data directly to the user's wishlist.

### Extension Architecture

```
style-studio-extension/
├── manifest.json            # Chrome extension manifest v3
├── content_script.js        # Injected into e-commerce pages
├── background.js            # Service worker (handles API calls)
├── popup/
│   ├── popup.html           # Extension popup UI
│   ├── popup.js
│   └── popup.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── options/
    ├── options.html         # Settings page (API URL, auth token)
    └── options.js
```

### `manifest.json` (v3)

```json
{
  "manifest_version": 3,
  "name": "Style Studio — Wishlist",
  "version": "1.0.0",
  "description": "Add products to your Style Studio wardrobe from any store.",
  "permissions": ["activeTab", "storage", "notifications"],
  "host_permissions": [
    "https://*.myntra.com/*",
    "https://*.flipkart.com/*",
    "https://*.amazon.in/*",
    "https://*.ajio.com/*",
    "https://*.nykaa.com/*",
    "https://*.meesho.com/*",
    "https://*.amazon.com/*",
    "https://*.hm.com/*",
    "https://*.zara.com/*"
  ],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content_script.js"],
    "run_at": "document_idle"
  }],
  "background": { "service_worker": "background.js" },
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": { "48": "icons/icon48.png" }
  },
  "options_page": "options/options.html"
}
```

### Content Script Flow

```
1. content_script.js detects supported domain (URL match)
2. Injects floating "Add to Style Studio ✚" button (bottom-right corner)
3. Attempts to extract product data from the page:
   - Reads JSON-LD <script> tags
   - Reads OpenGraph meta tags
   - Falls back to DOM selectors per-site
4. On button click → sends data to background.js via chrome.runtime.sendMessage
5. background.js POSTs to Style Studio API → /items
6. Shows Chrome notification: "Added to Style Studio!"
7. Button changes to "✓ In Wishlist" state
```

### Popup UI

The extension popup (clicking the toolbar icon) shows:
- Mini item form (pre-filled from current tab if on a product page)
- Category/subcategory selectors
- Quick add button
- Link to open the full Style Studio app
- Login status + API connection indicator

### Authentication

The extension uses an **API key** generated in the Style Studio app (Settings → Extensions → Generate Key). The key is stored in `chrome.storage.local` and sent as `Authorization: Bearer <key>` header.

---

## 4. AI Features

### 4.1 Auto Outfit Generation

The core AI feature: given the user's wardrobe, automatically suggest outfit combinations that work well together.

#### How It Works

**Step 1 — Item Embedding**  
When a product is added or edited, a background job creates embeddings:
- **Color vector**: Extract dominant color from the product image using `sharp` or `Jimp`; store as `[R, G, B]` (0–255) or as HSL for better perceptual matching
- **Style embedding**: Encode `(category, subcategory, type, occasion, season)` as a feature vector
- **Text embedding**: Run item title + description through an embedding model (OpenAI `text-embedding-3-small` or a locally-hosted `sentence-transformers` model) for semantic similarity

**Step 2 — Outfit Candidate Generation**  
The outfit generation algorithm builds candidate combinations:

```
For each Topwear item T:
  For each Bottomwear item B:
    score = colorHarmony(T.colorVector, B.colorVector)
          + styleCompatibility(T.styleVector, B.styleVector)
          + occasionMatch(T.occasion, B.occasion)
    
    For each Footwear item S:
      totalScore = score
               + colorHarmony(T, S) * 0.4
               + colorHarmony(B, S) * 0.6
               + styleCompatibility(T, S)
      
      For each Accessory A (optional):
        finalScore = totalScore + accessoryBonus(A, T, B, S)
      
      candidates.push({ items: [T,B,S,A], score: finalScore })

Return top 10 candidates sorted by score
```

**Step 3 — LLM Validation & Description (Optional)**  
Pass the top candidates through an LLM (GPT-4o mini / Gemini Flash) to:
- Validate the combination makes real-world fashion sense
- Generate a natural language outfit description ("A smart-casual summer look perfect for brunches")
- Suggest a suitable occasion/season tag

#### Color Harmony Rules

```js
// Color harmony scoring (HSL-based)
function colorHarmony(hsl1, hsl2) {
  const hueDiff = Math.abs(hsl1.h - hsl2.h);
  
  // Complementary: hues ~180° apart → great combination
  if (Math.abs(hueDiff - 180) < 20) return 1.0;
  
  // Analogous: hues within 30° → safe, cohesive look
  if (hueDiff < 30) return 0.8;
  
  // Triadic: hues ~120° apart → bold but balanced
  if (Math.abs(hueDiff - 120) < 20) return 0.7;
  
  // Neutral with anything: black, white, grey, navy, beige
  if (isNeutral(hsl1) || isNeutral(hsl2)) return 0.9;
  
  // Clashing: avoid
  return 0.3;
}

function isNeutral(hsl) {
  return hsl.s < 15 || ['black','white','grey','beige','navy','brown'].includes(hsl.name);
}
```

#### Style Compatibility Rules

| Topwear Type | Compatible Bottomwear | Compatible Footwear |
|---|---|---|
| Formal / Blazer | Trousers, Chinos | Formal Shoes, Loafers |
| Casual T-Shirt | Jeans, Shorts, Joggers | Sneakers, Sandals |
| Kurta / Ethnic | Trousers, Chinos, Joggers | Loafers, Formal Sandals |
| Activewear | Track Pants, Shorts, Joggers | Sports Shoes, Running Shoes |
| Hoodie / Sweatshirt | Jeans, Cargo, Joggers | Sneakers, Boots |

### 4.2 Color & Style Matching Engine

A standalone microservice (or a set of functions within the backend) responsible for all style intelligence:

```
POST /ai/analyze-item
  → Accepts an item image URL
  → Returns: dominantColor (hex), colorName, hsl, neutralFlag

POST /ai/generate-outfits
  → Accepts: { userId, occasion, season, count }
  → Returns: array of outfit objects with scores

POST /ai/style-score
  → Accepts: existing outfit (list of items)
  → Returns: { score, feedback, suggestions }

POST /ai/similar-items
  → Accepts: itemId
  → Returns: list of items from wardrobe with similarity scores
```

### 4.3 Training Data Strategy

The AI doesn't start from scratch — it leverages existing fashion knowledge:

#### Curated Fashion Datasets (Free & Public)
- **DeepFashion** (HKU) — 800K clothing images with categories, attributes, and landmark annotations
- **Fashion-MNIST** — 70K grayscale clothing images, good for initial classification
- **Polyvore Outfits Dataset** — 21K outfit sets with compatibility labels
- **iMaterialist Fashion** — 1M images with fine-grained attributes

#### In-App Feedback Loop
- When a user manually creates an outfit → that combination is treated as a **positive training signal** (implicit: "this works")
- When a user deletes an AI-suggested outfit → **negative signal**
- "Rate this outfit" prompt (thumbs up/down) → explicit labeled data
- Store all feedback in `outfit_feedback` MongoDB collection for periodic model fine-tuning

#### Few-Shot Prompting (LLM approach)
Until there's enough in-app data, use GPT-4o / Gemini with style-domain few-shot examples:

```
System: You are a fashion expert. Score the following outfit combination
        on a scale of 1–10 for style harmony, and briefly explain why.

User: Items:
  - Navy blue slim-fit chinos (Bottomwear, Casual)
  - White linen shirt (Topwear, Formal)
  - Brown loafers (Footwear, Formal)
  - Brown leather belt (Accessories)
```

### 4.4 AI-Powered Search & Recommendations

Beyond outfit generation, AI can power smarter discovery:

#### Natural Language Search
```
User types: "something to wear to a beach wedding"
→ AI maps to: { occasion: "Formal", season: "Summer", type: "Ethnic/Casual" }
→ Shows: relevant items + generated outfit suggestions
```

#### "Complete the Look" Feature  
- User opens any item detail page
- Clicks **"Complete the Look"**
- AI finds the best 2–3 matching items from the wardrobe to form a full outfit

#### Wardrobe Gap Analysis
- AI analyzes the existing wardrobe and identifies missing essentials
- Example: "You have 8 topwear pieces but only 2 footwear items. Consider adding Sneakers or Loafers."
- Suggests categories/brands to explore based on the user's style profile

#### Duplicate & Similar Item Detection
- When adding a new item, check `styleEmbedding` similarity against all existing items
- If similarity score > 0.85, show a warning: "You might already have something similar: [item name]"
- Prevents wardrobe clutter and accidental duplicate purchases

---

## 5. User Authentication & Multi-Device Sync

### Phase 1 — Anonymous Cloud Sync
- Generate a unique `deviceId` on first launch
- Sync data to MongoDB under that deviceId
- User can "claim" the account later by registering

### Phase 2 — Full Auth

| Method | Library | Notes |
|---|---|---|
| Email + Password | bcrypt + JWT | Classic, works offline |
| Google OAuth | Passport.js / NextAuth | Easiest for users |
| Magic Link (Passwordless) | nodemailer + short-lived JWT | No password to forget |

### Data Isolation
- All MongoDB documents include a `userId` field
- API middleware validates the JWT and filters all queries by `req.user.id`
- No user can ever read/write another user's data

### Shared Wishlists (Future)
- Generate a shareable read-only link for a category or a whole wardrobe
- Family members / friends can browse your wishlist for gift ideas
- Privacy control: public / friends-only / private

---

## 6. Price Tracking & Deal Alerts

### Data Sources (No Scraping)

Price tracking must use the same legal data sources as product import:

| Store | Price tracking method |
|---|---|
| Amazon.in / .com | **PA API** — re-query the same ASIN every N hours, always fresh and authorized |
| Flipkart | **Affiliate API** — re-fetch product by ID |
| Myntra / Ajio / others | **Extension-reported** — when the user visits the page, the extension silently reports back the current price (the user was going to open the page anyway); price is stored as a new history entry |

The extension approach for non-API stores is a pull-only model: the app never proactively hits those sites; it only records prices the user organically encounters.

### How It Works

1. When a product is added via Amazon/Flipkart API, the backend stores the import price as the first `PriceHistory` entry
2. A `node-cron` job runs nightly for **API-backed items only** (Amazon PA API, Flipkart Affiliate), re-fetching the current price
3. For extension-tracked items, the price is updated whenever the user visits the product page with the extension installed
4. New price is compared to the last known price:
   - **Price dropped**: store new entry, flag item as `priceDrop: true`
   - **Price rose**: store new entry
   - **Out of stock**: flag item as `outOfStock: true`
5. User receives a notification (in-app banner + optional email via Nodemailer / Resend)

### Price History Chart
- Item detail page shows a line chart of price over time (using `recharts`)
- Shows: current price, lowest ever price, date of lowest price, % change from when added
- Highlight "Lowest price ever!" badge when price matches historical minimum

### Smart Alert Settings
- Per-item threshold: "Alert me when price drops below ₹2,000"
- Global setting: "Alert me on any price drop > 10%"
- Weekly summary email: "Your wishlist price changes this week"

### Supported Price Formats
The scraper handles: `₹2,499`, `INR 2,499`, `$49.99`, `₹2,499.00 MRP ₹3,999.00` (extracts sale price, not MRP)

---

## 7. Advanced Outfit Builder

### Improvements to the Current DnD Canvas

| Feature | Description |
|---|---|
| **Layer Controls** | Z-index buttons to send items forward/backward in the canvas stack |
| **Resize Handles** | Drag corners to resize individual items on the canvas |
| **Grid Snap** | Optional grid snapping for cleaner layouts |
| **Background Themes** | Choose canvas background: white, wooden floor, marble, solid colors |
| **Mannequin Overlay** | Optional body silhouette to position clothes realistically |
| **Rotation** | Rotate items to any angle |
| **Mirror Flip** | Horizontal flip for items (useful for paired accessories) |
| **Lock Item** | Lock an item's position to prevent accidental dragging |
| **Undo / Redo** | Full action history with Ctrl+Z / Ctrl+Y |
| **Multi-select** | Select multiple items and move/delete them together |

### Outfit Templates
Pre-built layout templates users can start from:
- **Full Body**: Top + Bottom + Shoes laid out anatomically
- **Flat Lay**: Items spread horizontally like a fashion magazine flat lay
- **Grid**: Items arranged in a 2×2 or 3×2 grid

### Outfit Sharing
- Generate a shareable image (html2canvas already implemented) with a watermark
- One-click copy link, download as PNG/JPEG, share to WhatsApp/Instagram

---

## 8. Analytics & Wardrobe Insights

A dedicated **Insights** page with charts powered by `recharts` or `Chart.js`:

### Dashboard Cards (Additions to Current Stats)
| Metric | Description |
|---|---|
| Total Wardrobe Value | Sum of all item prices |
| Wishlist Value | Sum of unpurchased items |
| Purchased Value | Sum of purchased items |
| Average Item Price | Mean across all items |
| Most Expensive Item | Link to item detail |
| Brands Count | Unique brand names |
| Price Drop Alerts | Count of items with recent price drops |

### Charts
- **Category Breakdown**: Donut chart — % of Topwear / Bottomwear / Footwear / Accessories
- **Brand Distribution**: Horizontal bar chart — top 10 brands by item count
- **Price Distribution**: Histogram of item prices across ₹500 bins
- **Wishlist vs Purchased**: Stacked bar by category
- **Price History Overview**: Multi-line chart showing price trends of top 5 most watched items
- **Items Added Over Time**: Area chart — items added per month

### Style Profile
AI-generated paragraph summarizing the user's wardrobe preferences:
> "Your wardrobe leans towards casual styles, dominated by neutral colors. You have a strong footwear collection (8 items) but could benefit from adding more formal topwear. Your most-represented brand is H&M."

---

## 9. Progressive Web App (PWA)

### Why
- Install the app on phone's home screen like a native app
- Works offline (view existing wardrobe without internet)
- Push notifications for price drop alerts

### Implementation

**Vite PWA Plugin** (`vite-plugin-pwa`):

```js
// vite.config.js addition
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.stylestudio\.app\//,
        handler: 'NetworkFirst',
        options: { cacheName: 'api-cache', expiration: { maxAgeSeconds: 86400 } }
      }
    ]
  },
  manifest: {
    name: 'Style Studio',
    short_name: 'StyleStudio',
    theme_color: '#6366f1',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
})
```

### Offline Mode
- All wardrobe data is cached in IndexedDB via a Workbox strategy
- Read operations work fully offline
- Mutations (add/edit/delete) queue in a background sync queue and replay when online
- Subtle "Offline Mode" banner when disconnected

---

## 10. Additional Feature Ideas

### 10.1 Packing List Generator
- User selects a trip: destination, duration, occasions
- AI generates a packing list from existing wardrobe items
- Shows which outfits can be reused across days
- "Missing items" list with suggestions to buy

### 10.2 Calendar Integration
- Schedule saved outfits to specific dates (e.g., "I'll wear this to the wedding on 15th")
- Weekly outfit planner view
- Reminder notification the night before

### 10.3 Seasonal Rotation Reminders
- Track when seasons change (location-based or manual)
- Remind: "Winter is coming — here are your 5 stored sweaters and jackets"
- Archive off-season items without deleting them

### 10.4 Budget Tracker
- Set a monthly clothing budget (e.g., ₹5,000/month)
- Track actual purchases against budget
- "Remaining budget this month" widget on dashboard
- Overspend alerts

### 10.5 Item Condition Tracking
- For owned/purchased items, track condition: New → Good → Fair → Worn Out
- Suggest replacement when condition degrades
- Track item lifespan (purchase date → retirement)

### 10.6 Size & Fit Notes
- Detailed fit notes per item: "runs small, sized up to L normally M"
- Brand-level size consistency notes: "Zara shirts — always size up"
- Reference when recommending similar items

### 10.7 Virtual Lookbook / Moodboard
- Pinterest-style inspiration board separate from the outfit builder
- Drag in items, outfit screenshots, or external image URLs
- Add captions and style notes
- Export as a beautiful PDF or shareable link

### 10.8 Browser Bookmarklet
_For users who don't want to install an extension:_
- A JavaScript bookmarklet that extracts product info from any tab and opens a pre-filled "Add Item" modal in Style Studio
- No extension store approval required — just drag to bookmarks bar

### 10.9 Import from Other Apps
- Import from Amazon Wishlist (XML export)
- Import from Flipkart Wishlist (parse saved items page)
- Import from Notion / Airtable (CSV import)
- Export as JSON (backup), CSV (for spreadsheet use), or PDF (for shopping reference)

### 10.10 Social & Community Features (Long-term)
- Public outfit gallery: users can publish outfits and browse others
- Follow users with similar style
- "Wear this item" counter (track how often you actually wear purchased items)
- Outfit challenges (#SummerCasual, #OfficeWeek)

---

## 11. Implementation Priority Matrix

| Feature | Impact | Effort | Priority |
|---|---|---|---|
| Node.js + MongoDB Backend | 🔴 Critical | Medium | **P0** |
| User Auth (JWT/Google) | 🔴 Critical | Medium | **P0** |
| Smart Product Import (URL scraping) | 🔴 High | Medium | **P0** |
| Chrome Extension | 🟠 High | Medium | **P1** |
| Price Tracking + Alerts | 🟠 High | Medium | **P1** |
| AI Outfit Generation (rule-based) | 🟠 High | Medium | **P1** |
| Color Matching Engine | 🟡 Medium | Low | **P1** |
| PWA + Offline Mode | 🟡 Medium | Low | **P1** |
| Advanced Outfit Builder (resize, undo) | 🟡 Medium | Medium | **P2** |
| Analytics / Insights Page | 🟡 Medium | Low | **P2** |
| AI Natural Language Search | 🟡 Medium | High | **P2** |
| AI LLM Outfit Validation | 🟡 Medium | High | **P2** |
| Wardrobe Gap Analysis | 🟢 Nice to have | Medium | **P3** |
| Packing List Generator | 🟢 Nice to have | Medium | **P3** |
| Budget Tracker | 🟢 Nice to have | Low | **P3** |
| Calendar Integration | 🟢 Nice to have | High | **P3** |
| Social / Community Features | 🟢 Long-term | Very High | **P4** |

---

## 12. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│  ┌──────────────────┐    ┌─────────────────┐                   │
│  │  Style Studio    │    │  Chrome         │                   │
│  │  React App (PWA) │    │  Extension      │                   │
│  └────────┬─────────┘    └────────┬────────┘                   │
└───────────┼──────────────────────┼─────────────────────────────┘
            │  HTTPS REST + JWT     │
┌───────────▼──────────────────────▼─────────────────────────────┐
│                        API GATEWAY                              │
│              Node.js / Express  (Hosted: Railway / Render)      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Items   │  │  Outfits │  │  Prices  │  │  AI Service  │   │
│  │  Router  │  │  Router  │  │  Router  │  │  Router      │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
└───────┼─────────────┼─────────────┼────────────────┼───────────┘
        │             │             │                │
┌───────▼─────────────▼─────────────▼────────────────▼───────────┐
│                      SERVICES LAYER                             │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Scraper  │  │ node-    │  │Cloudinary│  │  OpenAI API  │   │
│  │(Puppeteer│  │  cron    │  │  Image   │  │ / Gemini API │   │
│  │ /Axios)  │  │ (price   │  │  Backup  │  │(outfit gen)  │   │
│  └────┬─────┘  │  jobs)   │  └────┬─────┘  └──────┬───────┘   │
│       │        └────┬─────┘       │                │           │
└───────┼─────────────┼─────────────┼────────────────┼───────────┘
        │             │             │                │
┌───────▼─────────────▼─────────────▼────────────────▼───────────┐
│                       DATA LAYER                                │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  MongoDB Atlas                          │    │
│  │  Collections: items, outfits, price_history,           │    │
│  │               users, outfit_feedback, api_keys         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌──────────────┐    ┌─────────────────────────────────┐       │
│  │  Redis Cache │    │  Cloudinary CDN (images)        │       │
│  │  (optional)  │    │                                 │       │
│  └──────────────┘    └─────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Suggested Phased Rollout

```
Phase 1 (Foundation)        Phase 2 (Smart Import)      Phase 3 (AI)
─────────────────────       ──────────────────────       ──────────────────
✓ Node.js + MongoDB         ✓ URL scraper endpoint       ✓ Color extraction
✓ Migrate localStorage      ✓ Chrome extension v1        ✓ Rule-based outfits
✓ JWT Auth (Google)         ✓ Auto-category detection    ✓ LLM validation
✓ Deploy to Railway/Render  ✓ Price tracking             ✓ Feedback loop
✓ PWA manifest              ✓ Price drop alerts          ✓ Gap analysis
```

---

*Document version: April 2026 | Style Studio Enhancement Plan*