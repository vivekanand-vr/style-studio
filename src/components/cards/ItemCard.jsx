import { Heart, ShoppingBag, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function ItemCard({
  item,
  onTogglePurchased,
  onToggleFavorite,
  onClick,
}) {
  const handlePurchaseClick = (e) => {
    e.stopPropagation();
    onTogglePurchased(item.id);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(item.id);
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
    if (item.sourceLink) {
      window.open(item.sourceLink, "_blank");
    }
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer relative group"
    >
      {/* Favorite Heart Icon */}
      <motion.button
        onClick={handleFavoriteClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-3 right-3 z-10 p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
        title={item.favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={20}
          className={
            item.favorite
              ? "fill-red-500 text-red-500"
              : "text-gray-600 dark:text-gray-400"
          }
        />
      </motion.button>

      {/* Image */}
      <div className="aspect-square bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden relative">
        {item.thumbnail || item.image ? (
          <img
            src={item.thumbnail || item.image}
            alt={item.title || "Product"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl opacity-30">📦</div>
        )}

        {/* Purchased Badge Overlay */}
        {item.purchased && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
              ✓ Purchased
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {item.title || item.sourceDomain || "Untitled"}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
          {item.brand && (
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {item.brand}
            </span>
          )}
          {item.brand && (item.category || item.subcategory) && (
            <span className="mx-1">•</span>
          )}
          {item.category}
          {item.subcategory && ` / ${item.subcategory}`}
        </p>

        {/* Price */}
        {!item.purchased && item.price && (
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.currency || "INR"}
            </span>{" "}
            {item.price}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handlePurchaseClick}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
              item.purchased
                ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <ShoppingBag size={16} />
            {item.purchased ? "Mark Wishlist" : "Mark Purchased"}
          </button>

          {item.sourceLink && (
            <button
              onClick={handleLinkClick}
              className="px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
              title="Open product link"
            >
              <ExternalLink
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
