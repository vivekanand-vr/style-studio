import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

export default function OutfitCard({ outfit, onDelete, onEdit }) {
  const navigate = useNavigate();
  // When coming from the API, itemIds are populated Item objects
  const items = Array.isArray(outfit.itemIds)
    ? outfit.itemIds.filter((i) => typeof i === 'object')
    : [];

  const handleCardClick = () => {
    navigate(`/outfits/${outfit._id || outfit.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(outfit._id || outfit.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(outfit);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer relative group"
    >
      {/* Edit & Delete Icons */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1 z-10">
        <button
          onClick={handleEditClick}
          className="p-1.5 sm:p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-600 dark:text-gray-400 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
          title="Edit Outfit"
        >
          <Edit2 size={14} className="sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1.5 sm:p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-600 dark:text-gray-400 rounded-full hover:bg-white dark:hover:bg-gray-800 hover:text-red-500 transition-colors shadow-lg"
          title="Delete Outfit"
        >
          <Trash2 size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Cover Image */}
      <div className="aspect-video bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden relative">
        {outfit.coverImage ? (
          <img
            src={outfit.coverImage}
            alt={outfit.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl opacity-30">👔</div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {outfit.name}
        </h3>

        {outfit.description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
            {outfit.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
          <span className="font-medium">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
          {outfit.occasion && (
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-1.5 sm:px-2 py-0.5 rounded text-xs">
              {outfit.occasion}
            </span>
          )}
        </div>

        {/* Item thumbnails */}
        {items.length > 0 && (
          <div className="flex -space-x-1.5 sm:-space-x-2">
            {items.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden"
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs">
                    📦
                  </div>
                )}
              </div>
            ))}
            {items.length > 4 && (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-800 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                +{items.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
