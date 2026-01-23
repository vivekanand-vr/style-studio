import { useState } from 'react';

export default function ItemFilters({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleBrandChange = (e) => {
    const newFilters = { ...localFilters, brand: e.target.value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    const newFilters = { ...localFilters, minPrice: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    const newFilters = { ...localFilters, maxPrice: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleShowPurchasedChange = (e) => {
    const newFilters = { ...localFilters, showPurchased: e.target.checked };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: filters.category,
      subcategory: filters.subcategory,
      brand: '',
      minPrice: undefined,
      maxPrice: undefined,
      showPurchased: true,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Brand Filter */}
        <div className="flex-1 min-w-50">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Brand
          </label>
          <input
            type="text"
            value={localFilters.brand}
            onChange={handleBrandChange}
            placeholder="Search by brand..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
          />
        </div>

        {/* Price Range */}
        <div className="flex gap-2 flex-1 min-w-50">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Min Price
            </label>
            <input
              type="number"
              value={localFilters.minPrice || ''}
              onChange={handleMinPriceChange}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Price
            </label>
            <input
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={handleMaxPriceChange}
              placeholder="∞"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Show Purchased */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.showPurchased}
              onChange={handleShowPurchasedChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Show Purchased</span>
          </label>
        </div>

        {/* Clear Filters */}
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
