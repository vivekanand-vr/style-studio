import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter, Search, Package } from "lucide-react";
import {
  getItems,
  togglePurchased,
  toggleFavorite,
  searchItems,
} from "../utils/localStorage";
import ItemCard from "../components/cards/ItemCard";
import AddItemModal from "../components/modals/AddItemModal";
import FiltersModal from "../components/modals/FiltersModal";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

export default function Items() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    showPurchased: true,
  });

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    // Seed filters from URL query params for deep-linked category/subcategory pages
    const categoryParams = searchParams.getAll("category").filter(Boolean);
    const subcategoryParams = searchParams
      .getAll("subcategory")
      .filter(Boolean);

    if (categoryParams.length === 0 && subcategoryParams.length === 0) return;

    setFilters((prevFilters) => ({
      ...prevFilters,
      categories:
        categoryParams.length > 0 ? categoryParams : prevFilters.categories,
      subcategories:
        subcategoryParams.length > 0
          ? subcategoryParams
          : prevFilters.subcategories,
    }));
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [items, filters, searchQuery]);

  const loadItems = () => {
    const allItems = getItems();
    setItems(allItems);
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      filtered = searchItems(filtered, searchQuery);
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((item) =>
        filters.categories.includes(item.category),
      );
    }

    // Subcategory filter
    if (filters.subcategories && filters.subcategories.length > 0) {
      filtered = filtered.filter((item) =>
        filters.subcategories.includes(item.subcategory),
      );
    }

    // Brands filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((item) => filters.brands.includes(item.brand));
    }

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filtered = filtered.filter((item) => {
        if (item.price === null || item.price === undefined) return false;
        const price = Number(item.price);
        if (filters.minPrice !== undefined && price < filters.minPrice)
          return false;
        if (filters.maxPrice !== undefined && price > filters.maxPrice)
          return false;
        return true;
      });
    }

    // Purchased filter
    if (!filters.showPurchased) {
      filtered = filtered.filter((item) => !item.purchased);
    }

    setFilteredItems(filtered);
  };

  const handleTogglePurchased = (id) => {
    togglePurchased(id);
    loadItems();
  };

  const handleToggleFavorite = (id) => {
    toggleFavorite(id);
    loadItems();
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleItemAdded = () => {
    loadItems();
    setIsAddModalOpen(false);
  };

  const activeFiltersCount =
    (filters.categories?.length || 0) +
    (filters.subcategories?.length || 0) +
    (filters.brands?.length || 0) +
    (filters.minPrice !== undefined ? 1 : 0) +
    (filters.maxPrice !== undefined ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Products Collection"
        subtitle="Browse and manage your wardrobe wishlist"
      />

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-2xl pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-3 text-sm">
          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className="relative flex-1 sm:flex-none flex items-center justify-center gap-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
          >
            <Filter size={18} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Product</span>
          </button>
        </div>
      </motion.div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            message={
              items.length === 0
                ? "Start building your wardrobe by adding your first product!"
                : "Try adjusting your filters or add new products to get started."
            }
            buttonText="Add Your First Product"
            onButtonClick={() => setIsAddModalOpen(true)}
          />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ItemCard
                  item={item}
                  onTogglePurchased={handleTogglePurchased}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => navigate(`/items/${item.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddItemModal
            onClose={() => setIsAddModalOpen(false)}
            onItemAdded={handleItemAdded}
          />
        )}

        {isFiltersModalOpen && (
          <FiltersModal
            onClose={() => setIsFiltersModalOpen(false)}
            filters={filters}
            onApplyFilters={handleApplyFilters}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
