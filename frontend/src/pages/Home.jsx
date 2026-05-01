import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag, Sparkles, Tag } from "lucide-react";
import { useItems } from "../hooks/useItems";
import { useOutfits } from "../hooks/useOutfits";
import { CATEGORIES_DATA, DASHBOARD_STATS } from "../utils/constants";
import CategoryCard from "../components/cards/CategoryCard";
import StatCard from "../components/cards/StatCard";
import PageHeader from "../components/PageHeader";

export default function Home() {
  const navigate = useNavigate();

  // Fetch enough items to compute brand count and show favorites
  const { items: allItems, total: itemsTotal } = useItems({ limit: 200 });
  const { total: outfitsTotal } = useOutfits({ limit: 1 });

  const favoriteItems = useMemo(
    () => allItems.filter((i) => i.favorite),
    [allItems],
  );

  const brandCount = useMemo(
    () => new Set(allItems.map((i) => i.brand).filter(Boolean)).size,
    [allItems],
  );

  const stats = {
    items: itemsTotal,
    outfits: outfitsTotal,
    favorites: favoriteItems.length,
    brands: brandCount,
  };

  const statIcons = {
    ShoppingBag,
    Heart,
    Sparkles,
    Tag,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <PageHeader
        title="Your Style, Curated"
        subtitle="Build your dream wardrobe collection"
      />

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full"
      >
        {DASHBOARD_STATS.map((stat, index) => {
          const Icon = statIcons[stat.icon];
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className="w-full"
            >
              <StatCard
                icon={Icon}
                label={stat.label}
                value={stats[stat.key]}
                color={stat.color}
                accent={stat.accent}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Categories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-12 shadow-inner"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Browse by Category
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Discover your perfect style across our collections
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES_DATA.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              description={category.description}
              imageUrl={category.imageUrl}
              gradientFrom={category.gradientFrom}
              gradientTo={category.gradientTo}
            />
          ))}
        </div>
      </motion.div>

      {/* Favorites Section */}
      <AnimatePresence mode="wait">
        {favoriteItems.length > 0 ? (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 transition-colors"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Heart
                    className="text-pink-600 dark:text-pink-400"
                    size={20}
                  />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  Your Favorites
                </h2>
              </div>
              {favoriteItems.length > 4 && (
                <button
                  onClick={() => navigate("/favorites")}
                  className="flex items-center gap-1 sm:gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm sm:text-base font-semibold transition-colors"
                >
                  View All
                  <ArrowRight size={16} className="sm:w-4.5 sm:h-4.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {favoriteItems.slice(0, 4).map((item, index) => (
                <motion.div
                  key={item._id || item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={() => navigate(`/items/${item._id || item.id}`)}
                  className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                    {item.thumbnail || item.image ? (
                      <img
                        src={item.thumbnail || item.image}
                        alt={item.title || "Item"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-gray-400 dark:text-gray-500 text-4xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title || "Untitled"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                      {item.brand || item.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.5 }}
            className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
              <Heart size={32} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start adding products to your favorites to see them here
            </p>
            <button
              onClick={() => navigate("/items")}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse Products
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
