import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import {
  getFavoriteItems,
  togglePurchased,
  toggleFavorite,
} from "../utils/localStorage";
import ItemCard from "../components/cards/ItemCard";
import PageHeader from "../components/PageHeader";

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
      <PageHeader
        title="Favorites"
        subtitle="Browse and manage your favorite wardrobe items"
      />

      <AnimatePresence mode="wait">
        {favoriteItems.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12 sm:py-20 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-4"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 sm:mb-6">
              <Heart
                size={32}
                className="sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500"
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              No favorite products yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
              Start adding products to your favorites to see them here!
            </p>
            <button
              onClick={() => navigate("/items")}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Heart size={18} className="sm:w-5 sm:h-5" />
              Browse Products
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {favoriteItems.map((item, index) => (
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
    </div>
  );
}
