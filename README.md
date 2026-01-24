# Wardrobe Wishlist

A modern, intuitive web application for managing your wardrobe wishlist and creating outfit combinations. Keep track of fashion products you want to buy, organize them by categories, and visualize complete outfits before making purchase decisions.

## Features

### Product Management

- **Add Products**: Manually add wardrobe products with detailed information:
  - Basic details (name, brand, price, currency)
  - Image URL for visual reference
  - Categorization (category, subcategory, type)
  - Tags for occasions and seasons
  - Source link to the product page
- **Edit Products**: Update any product's details at any time
- **Delete Products**: Remove products you're no longer interested in
- **Purchase Tracking**: Mark products as purchased (hides price, shows in purchased filter)
- **Smart Filters**: Filter products by brand, price range, and purchase status

### Category Organization

- **Four Main Categories**:
  - **Topwear**: T-shirts, Shirts, Jackets, Sweaters, Hoodies, etc.
  - **Bottomwear**: Jeans, Trousers, Shorts, Skirts, etc.
  - **Footwear**: Sneakers, Formal Shoes, Boots, Sandals, etc.
  - **Accessories**: Bags, Watches, Belts, Sunglasses, Jewelry, etc.
- **Detailed Subcategories**: Each category has specific subcategories for precise organization
- **Flexible Types**: Multiple item types within each subcategory

### Outfit Builder

- **Visual Canvas**: Advanced drag-and-drop interface powered by @dnd-kit for smooth repositioning
- **Mix & Match**: Combine products from different categories to visualize complete looks
- **Flexible Positioning**: Freely drag products around the canvas to perfect your outfit layout
- **Edit Existing Outfits**: Modify saved outfits by repositioning or removing products
- **Save Outfits**: Store your favorite combinations with auto-generated thumbnails
- **Outfit Gallery**: Browse all saved outfits with clickable cards
- **Outfit Details**: View full outfit layout with positioned products on canvas
- **Canvas Customization**: Optional manual thumbnail upload for outfit covers

### User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean Interface**: Modern UI with Tailwind CSS v4 styling and custom dropdown icons
- **Fast Navigation**: React Router-based routing for instant page transitions
- **Local Storage**: All data persisted locally (no account required)
- **Image Previews**: Visual thumbnails for all products and outfits
- **Touch Support**: Full touch device compatibility with @dnd-kit integration
- **Dark Mode Ready**: Interface prepared for theme switching

## Technology Stack

- **Frontend Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS v4.1.18 with PostCSS
- **Routing**: React Router DOM v7
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: Browser localStorage (Firebase integration planned)
- **Drag & Drop**: @dnd-kit/core for smooth drag-and-drop interactions
- **Icons**: Lucide React for modern, customizable icons
- **Canvas Capture**: html2canvas for generating outfit thumbnails

## Project Structure

```
v-wardrobe/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, icons, etc.
│   ├── components/           # Reusable React components
│   │   ├── Layout.jsx        # Navigation header
│   │   ├── ItemCard.jsx      # Product display card
│   │   ├── ItemFilters.jsx   # Filter controls
│   │   ├── AddItemModal.jsx  # Add/Edit product modal
│   │   ├── OutfitCard.jsx    # Outfit display card
│   │   └── OutfitBuilder.jsx # Drag-and-drop outfit creator
│   ├── pages/                # Route pages
│   │   ├── Home.jsx          # Category selection
│   │   ├── Category.jsx      # Subcategory navigation
│   │   ├── Items.jsx         # Products list with filters
│   │   ├── ItemDetail.jsx    # Single product view
│   │   ├── Outfits.jsx       # Outfits list
│   │   └── OutfitDetail.jsx  # Outfit canvas view
│   ├── utils/                # Utility functions
│   │   ├── localStorage.js   # Data persistence layer
│   │   └── constants.js      # App-wide constants
│   ├── App.jsx               # Route configuration
│   ├── App.css              # Global styles
│   ├── main.jsx             # Application entry point
│   └── index.css            # Tailwind imports
├── eslint.config.js         # ESLint configuration
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite build configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or download the project):

   ```bash
   cd v-wardrobe
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Adding Products

1. Navigate to **Products** page from the header
2. Click **"+ Add Product"** button
3. Fill in the form:
   - **Name**: Product title
   - **Brand**: Manufacturer/brand name
   - **Price & Currency**: Cost and currency code
   - **Image URL**: Direct link to product image
   - **Category/Subcategory**: Select from dropdowns
   - **Type**: Specific item type
   - **Tags**: Occasions and seasons (optional)
   - **Source Link**: URL to product page (optional)
4. Click \*\*"Save Product"

### Editing Products

1. Click on any product card to view details
2. Click **"Edit Product"** button
3. Update the fields you want to change
4. Click **"Update Product"** to save

### Managing Purchases

- **Mark as Purchased**: Click the purchase toggle on product detail page
- **Purchased products**: Price hidden, shows in "Purchased" filter
- **Mark as Wishlist**: Revert back to wishlist state

### Creating Outfits

1. Navigate to **Outfits** page
2. Click \*\*"Create New Outfit"
3. Drag products from the left panel onto the canvas
4. Position products to visualize the complete outfit
5. Click **"Save Outfit"** and provide a name
6. Browse saved outfits and click to view full details

### Filtering Products

Use the filter controls on the Products page:

- **Brand**: Filter by specific brand
- **Price Range**: Set minimum and maximum price
- **Status**: Show All / Wishlist Only / Purchased Only

### Navigation

- **Home**: Browse main categories (Topwear, Bottomwear, Footwear, Accessories)
- **Category Pages**: Select subcategories within each main category
- **Products**: View all products with filtering options
- **Outfits**: Browse and create outfit combinations

## Data Model

### Item Object

```javascript
{
  id: "uuid",
  name: "Slim Fit Casual Shirt",
  brand: "Brand Name",
  price: 2999,
  currency: "INR",
  image: "https://example.com/image.jpg",
  category: "topwear",
  subcategory: "shirts",
  type: "casual",
  occasions: ["casual", "work"],
  seasons: ["summer", "spring"],
  sourceLink: "https://example.com/product",
  purchased: false,
  createdAt: "2025-01-15T10:30:00.000Z",
  updatedAt: "2025-01-15T10:30:00.000Z"
}
```

### Outfit Object

```javascript
{
  id: "uuid",
  name: "Summer Casual Look",
  items: ["item-id-1", "item-id-2", "item-id-3"],
  canvas: {
    nodes: [
      {
        id: "item-id-1",
        position: { x: 100, y: 50 },
        size: { width: 150, height: 150 }
      }
    ]
  },
  thumbnail: "data:image/png;base64,...",
  createdAt: "2025-01-15T10:30:00.000Z"
}
```

## Future Enhancements

### High Priority

- **Live Price Tracking**: Automatically fetch and update prices from product URLs
- **Image Auto-Fetch**: Extract product images directly from source links
- **Product Link Integration**: Keep product details synced with retailer websites
- **Price History**: Track price changes over time with historical graphs
- **Price Drop Alerts**: Notifications when wishlisted items go on sale
- **Multi-Currency Support**: Automatic currency conversion with live exchange rates

### Smart Features

- **AI Outfit Suggestions**: Machine learning-based recommendations using existing items
- **Color Matching**: Suggest complementary colors based on color theory
- **Seasonal Recommendations**: Auto-suggest items based on current season and weather
- **Style Analysis**: Get insights on your wardrobe style preferences
- **Duplicate Detection**: Identify similar products to avoid redundant purchases
- **Budget Tracking**: Set monthly budgets and spending limits with analytics

### Social & Sharing

- **Social Sharing**: Share outfits on social media platforms
- **Collaborative Wardrobes**: Share wardrobes with friends/family for gift ideas
- **Community Gallery**: Browse public outfits from other users for inspiration
- **Style Polls**: Get feedback from friends on outfit combinations
- **Influencer Mode**: Public profile with follower system

### Advanced Organization

- **Custom Tags**: Create unlimited custom tags beyond occasions/seasons
- **Smart Collections**: Auto-generated collections (e.g., "Under $50", "Recently Added")
- **Capsule Wardrobes**: Create minimalist wardrobes with essential products
- **Packing Lists**: Generate travel packing lists from outfits
- **Laundry Schedule**: Track when products need washing/dry cleaning
- **Size Management**: Store multiple sizes and track fit preferences

### Shopping Features

- **Wishlist Priority**: Rank products by purchase priority
- **Similar Items Finder**: Find alternative products at different price points
- **Store Locator**: Find nearby stores that carry wishlisted products
- **Deal Aggregator**: Compare prices across multiple retailers
- **Cashback Integration**: Track cashback and rewards from purchases
- **Shopping Cart Export**: Export wishlist to retailer shopping carts

### Analytics & Insights

- **Wardrobe Statistics**: Cost per wear, total investment, brand breakdown
- **Wear Frequency**: Track how often you wear each outfit
- **ROI Calculator**: Calculate cost per wear for purchased products
- **Style Evolution**: Timeline view of wardrobe changes over time
- **Carbon Footprint**: Sustainability metrics for clothing purchases
- **Trend Analysis**: Identify your most worn brands, colors, and styles

### Technical Improvements

- **Firebase Integration**: Cloud storage for multi-device access
- **User Authentication**: Secure login with Google/email
- **Progressive Web App**: Install as mobile/desktop app
- **Offline Mode**: Full functionality without internet
- **Export/Import**: Backup as JSON/CSV, import from other apps
- **Dark Mode**: Toggle between light and dark themes
- **Multi-language**: Support for international users
- **Accessibility**: WCAG 2.1 AAA compliance
- **Keyboard Shortcuts**: Power user navigation

### Visual Enhancements

- **Virtual Try-On**: AR visualization using device camera
- **3D Item View**: Rotate and zoom product images
- **Outfit Animation**: Animated transitions in outfit builder
- **Style Quiz**: Interactive quiz to define personal style
- **Mood Board**: Pinterest-style inspiration boards
- **Measurement Guide**: Virtual fitting room with body measurements

### Integration Ideas

- **Calendar Integration**: Schedule outfits for specific dates/events
- **Weather API**: Outfit suggestions based on forecast
- **Email Parser**: Auto-add items from retailer emails
- **Browser Extension**: Quick-add button on shopping websites
- **Mobile App**: Native iOS/Android companion app
- **Smart Mirror**: Connect to smart mirror devices
- **Closet Camera**: Snap photos of existing wardrobe items

## Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to:

- Report bugs or issues
- Suggest new features
- Share improvement ideas
