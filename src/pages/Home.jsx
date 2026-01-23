import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getFavoriteItems } from '../utils/localStorage';
import { CATEGORIES } from '../utils/constants';

export default function Home() {
  const navigate = useNavigate();
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    setFavoriteItems(getFavoriteItems());
  }, []);
  const categories = [
    {
      name: CATEGORIES.TOPWEAR,
      icon: '👕',
      description: 'Shirts, T-Shirts, Jackets & More',
      color: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      name: CATEGORIES.BOTTOMWEAR,
      icon: '👖',
      description: 'Jeans, Chinos, Shorts & More',
      color: 'bg-green-100 hover:bg-green-200',
    },
    {
      name: CATEGORIES.FOOTWEAR,
      icon: '👟',
      description: 'Sneakers, Formal, Boots & More',
      color: 'bg-purple-100 hover:bg-purple-200',
    },
    {
      name: CATEGORIES.ACCESSORIES,
      icon: '👜',
      description: 'Belts, Watches, Bags & More',
      color: 'bg-orange-100 hover:bg-orange-200',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Your Wardrobe
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organize your fashion wishlist and create stunning outfits
        </p>
      </div>

      {/* Favorites Section */}
      {favoriteItems.length > 0 && (
        <div className="mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Favorites</h2>
            {favoriteItems.length > 4 && (
              <button
                onClick={() => navigate('/favorites')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                View All
                <div className="p-1 bg-blue-100 rounded-full">
                  <ArrowRight size={16} />
                </div>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favoriteItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/items/${item.id}`)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  {item.thumbnail || item.image ? (
                    <img
                      src={item.thumbnail || item.image}
                      alt={item.title || 'Item'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500 text-4xl">📦</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {item.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {item.brand || item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/category/${category.name}`}
            className={`${category.color} border border-gray-200 rounded-lg p-6 transition-all hover:shadow-md`}
          >
            <div className="text-5xl mb-4">{category.icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {category.name}
            </h2>
            <p className="text-sm text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
