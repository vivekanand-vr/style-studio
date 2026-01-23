import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavoriteItems, togglePurchased, toggleFavorite } from '../utils/localStorage';
import ItemCard from '../components/ItemCard';

export default function Favorites() {
  const navigate = useNavigate();
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favorites = getFavoriteItems();
    setFavoriteItems(favorites);
  };

  const handleTogglePurchased = (id) => {
    togglePurchased(id);
    loadFavorites();
  };

  const handleToggleFavorite = (id) => {
    toggleFavorite(id);
    loadFavorites();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Favorites</h1>
        <p className="text-gray-600 dark:text-gray-400">Your favorite wardrobe items</p>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No favorite items yet. Start adding items to your favorites!
          </p>
          <button
            onClick={() => navigate('/items')}
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Browse Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteItems.map((item) => (
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
  );
}
