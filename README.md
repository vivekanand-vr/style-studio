# Style Studio

A personal wardrobe management app — one place to save, organize, and visualize clothing and accessories from any online store. Instead of scattering wishlist items across Myntra, Amazon, Ajio, and Flipkart, Style Studio brings everything together with smart categorization, an outfit builder, and price tracking.

---

## Features

### Wardrobe Management
- Add products manually with name, brand, price, image, and source link
- Organize items across four categories — Topwear, Bottomwear, Footwear, and Accessories — each with detailed subcategories
- Mark items as purchased or keep them on the wishlist
- Filter by brand, price range, and purchase status
- Full-text search across the entire wardrobe
- Toggle favorites for quick access

### Smart Product Import
- Paste an Amazon or Flipkart product URL to auto-fill all item details via official affiliate APIs
- Keyword-based auto-detection of category and subcategory from the product title
- AI-assisted text extraction fallback (via GPT-4o mini) for stores without an official API

### Outfit Builder
- Drag-and-drop canvas to build and visualize complete outfits
- Combine items across categories to see how they look together
- Save outfits with auto-generated thumbnails
- Browse the outfit gallery and view full canvas layouts
- Edit existing outfits — reposition or swap items

### AI Outfit Generation
- Auto-generates outfit suggestions from your wardrobe using color harmony rules (complementary, analogous, triadic) and style compatibility scoring
- Scores each suggestion out of 100 based on color matching and style type consistency
- Detects the dominant color of each product image automatically

### Price Tracking
- Tracks price history for Amazon and Flipkart items via their official APIs
- Nightly automated price refresh with cron job
- View price history charts with lowest-ever price and percentage change
- Extension-reported price updates for other stores when user visits the page

### Favorites & Discovery
- Dedicated Favorites page for quick access to saved items
- Home dashboard with wardrobe stats — total items, favorites, outfits, and brands

---

## Technology Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS v4** with PostCSS
- **React Router v7** for client-side routing
- **@dnd-kit** for drag-and-drop in the outfit builder
- **Framer Motion** for animations
- **Lucide React** for icons
- **html2canvas** for outfit thumbnail generation

### Backend
- **Node.js 20 LTS** with Express
- **MongoDB 7** via Docker, with Mongoose as the ODM
- **node-cron** for scheduled price check jobs
- **express-validator** for request validation
- **Helmet + rate-limiting** for security
- **sharp** for server-side image color extraction

### Infrastructure
- **Docker Compose** — MongoDB + Mongo Express (database UI)
- Designed for deployment on Railway or Render
- Cloudinary-ready for image backup (credentials optional)

### External Integrations (optional, configured via .env)
- **Amazon Product Advertising API 5.0** — product data and price tracking for Amazon items
- **Flipkart Affiliate API** — product data for Flipkart items
- **OpenAI API (GPT-4o mini)** — AI text extraction for stores without an official API

---

## Project Structure

The repository is a monorepo with separate `frontend` and `backend` workspaces.

- `frontend/` — React app (pages, components, utils)
- `backend/` — Express API (models, routes, controllers, services)
- `docker-compose.yml` — MongoDB and Mongo Express containers
- `package.json` — root workspace with convenience scripts

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Docker Desktop (for MongoDB)

---

## Setup

**1. Install dependencies**

From the root of the repository, install dependencies for both workspaces:

> `npm install` in both the `frontend/` and `backend/` directories, or use the root workspace scripts.

**2. Configure the backend**

Copy `backend/.env.example` to `backend/.env`. The app works out of the box with just the MongoDB URI pre-filled for Docker. External API keys (Amazon, Flipkart, OpenAI) are optional — the app degrades gracefully without them.

**3. Start MongoDB**

Run `docker compose up -d` from the root. This starts:
- MongoDB on port **27017**
- Mongo Express (database UI) on port **8082** → http://localhost:8082

**4. Start the backend**

Run `npm run dev` from the `backend/` directory. The API starts on **http://localhost:3001**.

**5. Start the frontend**

Run `npm run dev` from the `frontend/` directory. The app opens on **http://localhost:5173**.

**To run both simultaneously**, use `npm run dev` from the root (requires both workspaces installed).

---

## API Overview

All endpoints are under `/api/v1`.

| Resource | Endpoints |
|---|---|
| Items | CRUD, toggle purchased/favorite, bulk import, URL import |
| Outfits | CRUD, AI outfit generation, bulk import |
| Prices | Price history per item, manual price refresh trigger |

The health check endpoint is available at `GET /health`.

---

## Roadmap

- **Chrome Extension** — one-click add to wishlist from any store's product page
- **User Authentication** — Google OAuth and email/password login with JWT
- **Multi-device Sync** — cloud storage via MongoDB Atlas replacing localStorage
- **Price Drop Alerts** — email notifications when a wishlisted item drops in price
- **AI Natural Language Search** — find items with queries like "something casual for summer"
- **Advanced Outfit Builder** — undo/redo, resize handles, layer controls, outfit templates
- **Wardrobe Analytics** — spending breakdown, brand distribution, price history charts
- **Progressive Web App** — installable on mobile with offline support
- **Packing List Generator** — AI-curated packing lists from saved outfits for trips
- **Budget Tracker** — monthly clothing budget with overspend alerts

---

## Contributing

Personal project — suggestions and feedback welcome via issues.
