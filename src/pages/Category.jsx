import { Link, useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES, SUBCATEGORIES } from '../utils/constants';

export default function Category() {
  const { category } = useParams();
  const navigate = useNavigate();
  
  const subcategories = SUBCATEGORIES[category] || [];
  
  if (!CATEGORIES[category.toUpperCase().replace(/\s/g, '_')]) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Category not found
        </h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 flex items-center"
        >
          <span className="mr-2">←</span> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{category}</h1>
        <p className="text-gray-600 dark:text-gray-400">Select a subcategory to browse items</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.name}
            to={`/items?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory.name)}`}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <img
                src={subcategory.image}
                alt={subcategory.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-gray-900 dark:text-white text-center">{subcategory.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
