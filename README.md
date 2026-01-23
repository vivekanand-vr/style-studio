# Wardrobe Wishlist

A modern, intuitive web application for managing your wardrobe wishlist and creating outfit combinations. Keep track of fashion items you want to buy, organize them by categories, and visualize complete outfits before making purchase decisions.

## Features

### Item Management
- **Add Items**: Manually add wardrobe items with detailed information:
  - Basic details (name, brand, price, currency)
  - Image URL for visual reference
  - Categorization (category, subcategory, type)
  - Tags for occasions and seasons
  - Source link to the product page
- **Edit Items**: Update any item's details at any time
- **Delete Items**: Remove items you're no longer interested in
- **Purchase Tracking**: Mark items as purchased (hides price, shows in purchased filter)
- **Smart Filters**: Filter items by brand, price range, and purchase status

### Category Organization
- **Four Main Categories**:
  - **Topwear**: T-shirts, Shirts, Jackets, Sweaters, Hoodies, etc.
  - **Bottomwear**: Jeans, Trousers, Shorts, Skirts, etc.
  - **Footwear**: Sneakers, Formal Shoes, Boots, Sandals, etc.
  - **Accessories**: Bags, Watches, Belts, Sunglasses, Jewelry, etc.
- **Detailed Subcategories**: Each category has specific subcategories for precise organization
- **Flexible Types**: Multiple item types within each subcategory

### Outfit Builder
- **Visual Canvas**: Drag-and-drop interface for creating outfit combinations
- **Mix & Match**: Combine items from different categories to visualize complete looks
- **Save Outfits**: Store your favorite combinations for future reference
- **Outfit Gallery**: Browse all saved outfits with clickable cards
- **Outfit Details**: View full outfit layout with positioned items

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean Interface**: Modern UI with Tailwind CSS v4 styling
- **Fast Navigation**: React Router-based routing for instant page transitions
- **Local Storage**: All data persisted locally (no account required)
- **Image Previews**: Visual thumbnails for all items and outfits

## Technology Stack

- **Frontend Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS v4.1.18 with PostCSS
- **Routing**: React Router DOM v7
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: Browser localStorage (Firebase integration planned)
- **Drag & Drop**: Native HTML5 Drag and Drop API

## Project Structure

```
v-wardrobe/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, icons, etc.
│   ├── components/           # Reusable React components
│   │   ├── Layout.jsx        # Navigation header
│   │   ├── ItemCard.jsx      # Item display card
│   │   ├── ItemFilters.jsx   # Filter controls
│   │   ├── AddItemModal.jsx  # Add/Edit item modal
│   │   ├── OutfitCard.jsx    # Outfit display card
│   │   └── OutfitBuilder.jsx # Drag-and-drop outfit creator
│   ├── pages/                # Route pages
│   │   ├── Home.jsx          # Category selection
│   │   ├── Category.jsx      # Subcategory navigation
│   │   ├── Items.jsx         # Items list with filters
│   │   ├── ItemDetail.jsx    # Single item view
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

### Adding Items

1. Navigate to **Items** page from the header
2. Click **"+ Add Item"** button
3. Fill in the form:
   - **Name**: Item title
   - **Brand**: Manufacturer/brand name
   - **Price & Currency**: Cost and currency code
   - **Image URL**: Direct link to product image
   - **Category/Subcategory**: Select from dropdowns
   - **Type**: Specific item type
   - **Tags**: Occasions and seasons (optional)
   - **Source Link**: URL to product page (optional)
4. Click **"Save Item"**

### Editing Items

1. Click on any item card to view details
2. Click **"Edit Item"** button
3. Update the fields you want to change
4. Click **"Update Item"** to save

### Managing Purchases

- **Mark as Purchased**: Click the purchase toggle on item detail page
- **Purchased items**: Price hidden, shows in "Purchased" filter
- **Mark as Wishlist**: Revert back to wishlist state

### Creating Outfits

1. Navigate to **Outfits** page
2. Click **"Create New Outfit"**
3. Drag items from the left panel onto the canvas
4. Position items to visualize the complete outfit
5. Click **"Save Outfit"** and provide a name
6. Browse saved outfits and click to view full details

### Filtering Items

Use the filter controls on the Items page:
- **Brand**: Filter by specific brand
- **Price Range**: Set minimum and maximum price
- **Status**: Show All / Wishlist Only / Purchased Only

### Navigation

- **Home**: Browse main categories (Topwear, Bottomwear, Footwear, Accessories)
- **Category Pages**: Select subcategories within each main category
- **Items**: View all items with filtering options
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

- **Firebase Integration**: Cloud storage for multi-device access
- **User Authentication**: Personal accounts with secure login
- **Social Sharing**: Share outfits with friends
- **Price Tracking**: Monitor price changes from source links
- **Wardrobe Statistics**: Analytics on spending, brands, categories
- **AI Recommendations**: Smart outfit suggestions based on existing items
- **Export/Import**: Backup and restore data as JSON
- **Dark Mode**: Toggle between light and dark themes
- **Multi-language**: Support for multiple languages

## Contributing

This is a personal project, but suggestions and feedback are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Share improvement ideas
