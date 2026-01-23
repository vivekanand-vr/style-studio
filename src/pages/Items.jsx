import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getItems, filterItems, togglePurchased, toggleFavorite } from '../utils/localStorage';
import ItemCard from '../components/ItemCard';
import AddItemModal from '../components/AddItemModal';
import ItemFilters from '../components/ItemFilters';

export default function Items() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    brand: '',
    minPrice: undefined,
    maxPrice: undefined,
    showPurchased: true,
  });

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const filtered = filterItems(items, filters);
    setFilteredItems(filtered);
  }, [items, filters]);

  const loadItems = () => {
    const allItems = getItems();
    setItems(allItems);
  };

  const handleTogglePurchased = (id) => {
    togglePurchased(id);
    loadItems();
  };

  const handleToggleFavorite = (id) => {
    toggleFavorite(id);
    loadItems();
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleItemAdded = () => {
    loadItems();
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Items</h1>
          {filters.category && (
            <p className="text-gray-600 dark:text-gray-400">
              {filters.category}
              {filters.subcategory && ` > ${filters.subcategory}`}
            </p>
          )}
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          + Add Item
        </button>
      </div>

      <ItemFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="mt-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No items found. Add your first item to get started!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Add Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onTogglePurchased={handleTogglePurchased}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => navigate(`/items/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddItemModal
          onClose={() => setIsAddModalOpen(false)}
          onItemAdded={handleItemAdded}
          initialCategory={filters.category}
          initialSubcategory={filters.subcategory}
        />
      )}
    </div>
  );
}
