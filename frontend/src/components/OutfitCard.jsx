import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { getItemById } from '../utils/localStorage';

export default function OutfitCard({ outfit, onDelete, onEdit }) {
  const navigate = useNavigate();
  const items = outfit.itemIds?.map(id => getItemById(id)).filter(Boolean) || [];
  
  const handleCardClick = () => {
    navigate(`/outfits/${outfit.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(outfit.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(outfit);
  };
  
  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
    >
      {/* Edit & Delete Icons */}
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <button
          onClick={handleEditClick}
          className="p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
          title="Edit Outfit"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-red-600 dark:text-red-500 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
          title="Delete Outfit"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Cover Image */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {outfit.coverImage ? (
          <img
            src={outfit.coverImage}
            alt={outfit.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-500 text-4xl">👔</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {outfit.name}
        </h3>

        {outfit.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {outfit.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
          {outfit.occasion && (
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded text-xs">
              {outfit.occasion}
            </span>
          )}
        </div>

        {/* Item thumbnails */}
        {items.length > 0 && (
          <div className="flex -space-x-2 mb-3">
            {items.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden"
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
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
                +{items.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
