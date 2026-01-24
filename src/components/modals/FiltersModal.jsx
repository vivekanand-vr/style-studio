import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { CATEGORIES, SUBCATEGORIES } from "../../utils/constants";
import { getAllBrands } from "../../utils/localStorage";

export default function FiltersModal({ onClose, filters, onApplyFilters }) {
  const defaultFilters = {
    categories: [],
    subcategories: [],
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    showPurchased: true,
  };

  const [selectedCategories, setSelectedCategories] = useState(
    filters.categories || [],
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    filters.subcategories || [],
  );
  const [selectedBrands, setSelectedBrands] = useState(filters.brands || []);
  const [minPrice, setMinPrice] = useState(filters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || "");
  const [showPurchased, setShowPurchased] = useState(
    filters.showPurchased ?? true,
  );

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const [availableBrands, setAvailableBrands] = useState([]);

  useEffect(() => {
    const brands = getAllBrands();
    setAvailableBrands(brands);
  }, []);

  const categoryOptions = Object.values(CATEGORIES);

  const subcategoryOptions =
    selectedCategories.length > 0
      ? selectedCategories
          .flatMap((cat) => SUBCATEGORIES[cat] || [])
          .map((sub) => sub.name)
      : Object.values(SUBCATEGORIES).flatMap((subs) => subs.map((s) => s.name));

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const toggleSubcategory = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory],
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handleApply = () => {
    onApplyFilters({
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      brands: selectedBrands,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      showPurchased,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setShowPurchased(true);
    onApplyFilters(defaultFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex justify-between items-center z-10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            Filter Products
          </h2>
          <button
            onClick={handleReset}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X
              size={20}
              className="sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400"
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Categories and Subcategories Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Categories Multi-Select */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                Categories
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex justify-between items-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <span
                    className={
                      selectedCategories.length === 0 ? "text-gray-400" : ""
                    }
                  >
                    {selectedCategories.length === 0
                      ? "Select categories"
                      : `${selectedCategories.length} selected`}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`sm:w-5 sm:h-5 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {categoryOptions.map((category) => (
                      <label
                        key={category}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="ml-3 text-gray-900 dark:text-white">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {selectedCategories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {category}
                      <button
                        onClick={() => toggleCategory(category)}
                        className="hover:text-indigo-900 dark:hover:text-indigo-100"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategories Multi-Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Subcategories
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setSubcategoryDropdownOpen(!subcategoryDropdownOpen)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex justify-between items-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <span
                    className={
                      selectedSubcategories.length === 0 ? "text-gray-400" : ""
                    }
                  >
                    {selectedSubcategories.length === 0
                      ? "Select subcategories"
                      : `${selectedSubcategories.length} selected`}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${subcategoryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {subcategoryDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {subcategoryOptions.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                        No subcategories available
                      </div>
                    ) : (
                      subcategoryOptions.map((subcategory) => (
                        <label
                          key={subcategory}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubcategories.includes(
                              subcategory,
                            )}
                            onChange={() => toggleSubcategory(subcategory)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-gray-900 dark:text-white">
                            {subcategory}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
              {selectedSubcategories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSubcategories.map((subcategory) => (
                    <span
                      key={subcategory}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {subcategory}
                      <button
                        onClick={() => toggleSubcategory(subcategory)}
                        className="hover:text-indigo-900 dark:hover:text-indigo-100"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Brands and Purchased Toggle Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Brands Multi-Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Brands
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-left flex justify-between items-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <span
                    className={
                      selectedBrands.length === 0 ? "text-gray-400" : ""
                    }
                  >
                    {selectedBrands.length === 0
                      ? "Select brands"
                      : `${selectedBrands.length} selected`}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${brandDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {brandDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {availableBrands.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                        No brands available
                      </div>
                    ) : (
                      availableBrands.map((brand) => (
                        <label
                          key={brand}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-3 text-gray-900 dark:text-white">
                            {brand}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
              {selectedBrands.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedBrands.map((brand) => (
                    <span
                      key={brand}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {brand}
                      <button
                        onClick={() => toggleBrand(brand)}
                        className="hover:text-indigo-900 dark:hover:text-indigo-100"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Show Purchased Toggle */}
            <div className="flex items-end">
              <label className="flex items-center justify-between cursor-pointer w-full pb-1">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Show Purchased Products
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showPurchased}
                    onChange={(e) => setShowPurchased(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex gap-2 sm:gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
