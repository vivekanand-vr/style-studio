import { Link, useParams, useNavigate } from "react-router-dom";
import { CATEGORIES, SUBCATEGORIES } from "../utils/constants";

// CategoryCard Component
function CategoryCard({ name, imageUrl, linkTo }) {
  return (
    <Link
      to={linkTo}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 group"
    >
      <div className="aspect-4/5 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {name}
        </h3>
      </div>
    </Link>
  );
}

export default function Category() {
  const { category } = useParams();
  const navigate = useNavigate();

  const subcategories = SUBCATEGORIES[category] || [];

  if (!CATEGORIES[category.toUpperCase().replace(/\s/g, "_")]) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Category not found
        </h2>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 flex items-center font-medium transition-colors"
        >
          <span className="mr-2 text-xl">←</span> Back
        </button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {category}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select a subcategory to browse products
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {subcategories.map((subcategory) => (
          <CategoryCard
            key={subcategory.name}
            name={subcategory.name}
            imageUrl={subcategory.image}
            linkTo={`/items?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory.name)}`}
          />
        ))}
      </div>
    </div>
  );
}
