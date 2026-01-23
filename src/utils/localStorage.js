// LocalStorage utilities for Wardrobe Wishlist

const STORAGE_KEYS = {
  ITEMS: 'wardrobe_items',
  OUTFITS: 'wardrobe_outfits',
};

// Items CRUD
export const getItems = () => {
  const items = localStorage.getItem(STORAGE_KEYS.ITEMS);
  return items ? JSON.parse(items) : [];
};

export const getItemById = (id) => {
  const items = getItems();
  return items.find(item => item.id === id);
};

export const saveItem = (item) => {
  const items = getItems();
  const newItem = {
    ...item,
    id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: item.createdAt || Date.now(),
    updatedAt: Date.now(),
    purchased: item.purchased || false,
    thumbnail: item.image || item.thumbnail || '',
  };
  
  const existingIndex = items.findIndex(i => i.id === newItem.id);
  if (existingIndex >= 0) {
    items[existingIndex] = newItem;
  } else {
    items.push(newItem);
  }
  
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  return newItem;
};

export const deleteItem = (id) => {
  const items = getItems();
  const filteredItems = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(filteredItems));
  
  // Remove item from outfits
  const outfits = getOutfits();
  const updatedOutfits = outfits.map(outfit => ({
    ...outfit,
    itemIds: outfit.itemIds.filter(itemId => itemId !== id),
  }));
  localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(updatedOutfits));
};

export const togglePurchased = (id) => {
  const item = getItemById(id);
  if (item) {
    item.purchased = !item.purchased;
    saveItem(item);
  }
  return item;
};

export const toggleFavorite = (id) => {
  const item = getItemById(id);
  if (item) {
    item.favorite = !item.favorite;
    saveItem(item);
  }
  return item;
};

export const getFavoriteItems = () => {
  const items = getItems();
  return items.filter(item => item.favorite);
};

// Outfits CRUD
export const getOutfits = () => {
  const outfits = localStorage.getItem(STORAGE_KEYS.OUTFITS);
  return outfits ? JSON.parse(outfits) : [];
};

export const getOutfitById = (id) => {
  const outfits = getOutfits();
  return outfits.find(outfit => outfit.id === id);
};

export const saveOutfit = (outfit) => {
  const outfits = getOutfits();
  const newOutfit = {
    ...outfit,
    id: outfit.id || `outfit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: outfit.createdAt || Date.now(),
    updatedAt: Date.now(),
    itemIds: outfit.itemIds || [],
  };
  
  // Set cover image from first item if not provided
  if (!newOutfit.coverImage && newOutfit.itemIds.length > 0) {
    const firstItem = getItemById(newOutfit.itemIds[0]);
    newOutfit.coverImage = firstItem?.thumbnail || '';
  }
  
  const existingIndex = outfits.findIndex(o => o.id === newOutfit.id);
  if (existingIndex >= 0) {
    outfits[existingIndex] = newOutfit;
  } else {
    outfits.push(newOutfit);
  }
  
  localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(outfits));
  return newOutfit;
};

export const deleteOutfit = (id) => {
  const outfits = getOutfits();
  const filteredOutfits = outfits.filter(outfit => outfit.id !== id);
  localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(filteredOutfits));
};

// Filter utilities
export const filterItems = (items, filters) => {
  let filtered = [...items];
  
  // Category filter
  if (filters.category) {
    filtered = filtered.filter(item => item.category === filters.category);
  }
  
  // Subcategory filter
  if (filters.subcategory) {
    filtered = filtered.filter(item => item.subcategory === filters.subcategory);
  }
  
  // Brand filter (case-insensitive contains)
  if (filters.brand) {
    const brandLower = filters.brand.toLowerCase();
    filtered = filtered.filter(item => 
      item.brand && item.brand.toLowerCase().includes(brandLower)
    );
  }
  
  // Price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filtered = filtered.filter(item => {
      if (item.price === null || item.price === undefined) return false;
      const price = Number(item.price);
      if (filters.minPrice !== undefined && price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
      return true;
    });
  }
  
  // Purchased filter
  if (filters.showPurchased !== undefined) {
    if (!filters.showPurchased) {
      filtered = filtered.filter(item => !item.purchased);
    }
  }
  
  return filtered;
};
