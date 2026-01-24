import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { getFavoriteItems, getItems, getOutfits } from '../utils/localStorage';
import { categories } from '../utils/constants';
import CategoryCard from '../components/CategoryCard';
import StatCard from '../components/StatCard';

export default function Home() {
  const navigate = useNavigate();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [stats, setStats] = useState({ items: 0, outfits: 0, favorites: 0 });

  useEffect(() => {
    const favorites = getFavoriteItems();
    const items = getItems();
    const outfits = getOutfits();
    
    setFavoriteItems(favorites);
    setStats({
      items: items.length,
      outfits: outfits.length,
      favorites: favorites.length,
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold lg:text-6xl  text-gray-900 dark:text-white mb-3">
          Your Style, Curated
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium">
          Build your dream wardrobe collection
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          icon={ShoppingBag}
          label="Total Items"
          value={stats.items}
          color="bg-blue-50 dark:bg-gray-800"
        />
        <StatCard
          icon={Heart}
          label="Favorites"
          value={stats.favorites}
          color="bg-pink-50 dark:bg-gray-800"
        />
        <StatCard
          icon={Sparkles}
          label="Outfits Created"
          value={stats.outfits}
          color="bg-purple-50 dark:bg-gray-800"
        />
      </div>

      {/* Categories Section */}
      <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 rounded-3xl p-8 lg:p-12 shadow-inner">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Browse by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover your perfect style across our collections
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
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
      </div>

      {/* Favorites Section */}
      {favoriteItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 lg:p-8 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <Heart className="text-pink-600 dark:text-pink-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Favorites</h2>
            </div>
            {favoriteItems.length > 4 && (
              <button
                onClick={() => navigate('/favorites')}
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
              >
                View All
                <ArrowRight size={18} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favoriteItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/items/${item.id}`)}
                className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  {item.thumbnail || item.image ? (
                    <img
                      src={item.thumbnail || item.image}
                      alt={item.title || 'Item'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500 text-4xl">📦</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                    {item.brand || item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Favorites */}
      {favoriteItems.length === 0 && (
        <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
            <Heart size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Favorites Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start adding items to your favorites to see them here
          </p>
          <button
            onClick={() => navigate('/items')}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Items
            <ArrowRight size={18} />
          </button>
        </div>
      )}

    </div>
  );
}
