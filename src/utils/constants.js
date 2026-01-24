// Category and Subcategory data structure

export const CATEGORIES = {
  TOPWEAR: 'Topwear',
  BOTTOMWEAR: 'Bottomwear',
  FOOTWEAR: 'Footwear',
  ACCESSORIES: 'Accessories',
};

export const categories = [
  {
    name: CATEGORIES.TOPWEAR,
    description: 'Shirts, T-Shirts, Jackets & More',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop',
    gradientFrom: 'from-blue-100/90',
    gradientTo: 'to-blue-200/90',
  },
  {
    name: CATEGORIES.BOTTOMWEAR,
    description: 'Jeans, Chinos, Shorts & More',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop',
    gradientFrom: 'from-green-100/90',
    gradientTo: 'to-green-200/90',
  },
  {
    name: CATEGORIES.FOOTWEAR,
    description: 'Sneakers, Formal, Boots & More',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop',
    gradientFrom: 'from-purple-100/90',
    gradientTo: 'to-purple-200/90',
  },
  {
    name: CATEGORIES.ACCESSORIES,
    description: 'Belts, Watches, Bags & More',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop',
    gradientFrom: 'from-orange-100/90',
    gradientTo: 'to-orange-200/90',
  },
];

export const SUBCATEGORIES = {
  [CATEGORIES.TOPWEAR]: [
    { name: 'Shirts', image: 'https://images.unsplash.com/photo-1603252110971-b8a57087be18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNoaXJ0fGVufDB8MHwwfHx8MA%3D%3D' },
    { name: 'T-Shirts', image: 'https://plus.unsplash.com/premium_photo-1718913931807-4da5b5dd27fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dCUyMHNoaXJ0c3xlbnwwfDB8MHx8fDA%3D' },
    { name: 'Jackets', image: 'https://images.unsplash.com/photo-1706765779494-2705542ebe74?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amFja2V0c3xlbnwwfDB8MHx8fDA%3D' },
    { name: 'Sweaters', image: 'https://plus.unsplash.com/premium_photo-1758839789830-23ed31552719?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fHN3ZWF0ZXJzfGVufDB8MHwwfHx8MA%3D%3D' },
    { name: 'Sweatshirts', image: 'https://images.unsplash.com/photo-1607160199580-1b0c9b736b66?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzl8fHN3ZWF0c2hpcnRzfGVufDB8fDB8fHww' },
    { name: 'Hoodies', image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9vZGllfGVufDB8MHwwfHx8MA%3D%3D' },
    { name: 'Kurta', image: 'https://images.unsplash.com/photo-1622780432053-767528938f34?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a3VydGF8ZW58MHx8MHx8fDA%3D' },
    { name: 'Blazers', image: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJsYXplcnxlbnwwfHwwfHx8MA%3D%3D' },
  ],
  [CATEGORIES.BOTTOMWEAR]: [
    { name: 'Jeans', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Chinos', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Shorts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Track Pants', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Trousers', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
  ],
  [CATEGORIES.FOOTWEAR]: [
    { name: 'Sneakers', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Formal', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Sandals', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Boots', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Loafers', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
  ],
  [CATEGORIES.ACCESSORIES]: [
    { name: 'Belts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Watches', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Bags', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Hats', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Ties', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
    { name: 'Perfumes', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpcnR8ZW58MHx8MHx8fDA%3D' },
  ],
};

export const TYPES = ['Casual', 'Formal', 'Activewear', 'Ethnic', 'Party'];

export const OCCASIONS = ['Casual', 'Work', 'Party', 'Formal', 'Sports'];

export const SEASONS = ['Summer', 'Winter', 'Spring', 'Fall', 'All Season'];

export const CURRENCIES = {
  INR: 'INR',
  USD: 'USD',
  EUR: 'EUR',
};
