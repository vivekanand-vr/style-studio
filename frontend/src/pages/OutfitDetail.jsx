import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Edit2, Trash2, Calendar, Clock } from "lucide-react";
import { useOutfit } from "../hooks/useOutfit";
import { togglePurchased as apiTogglePurchased, toggleFavorite as apiToggleFavorite } from "../api/items";
import PageHeader from "../components/PageHeader";
import ItemCard from "../components/cards/ItemCard";

export default function OutfitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { outfit, loading, remove, refresh } = useOutfit(id);

  // itemIds are populated Item objects by the backend
  const items = outfit?.itemIds || [];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this outfit?")) {
      await remove();
      navigate("/outfits");
    }
  };

  const handleTogglePurchased = async (itemId) => {
    await apiTogglePurchased(itemId);
    refresh();
  };

  const handleToggleFavorite = async (itemId) => {
    await apiToggleFavorite(itemId);
    refresh();
  };

  const handleItemClick = (itemId) => {
    navigate(`/items/${itemId}`);
  };

  const handleEdit = () => {
    navigate(`/outfits/edit/${outfit._id || outfit.id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!outfit) return null;

  return (
    <div>
      <motion.button
        onClick={() => navigate("/outfits")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 sm:mb-8 flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium"
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        Back to Outfits
      </motion.button>

      <PageHeader
        title={outfit.name}
        subtitle={outfit.description || `${items.length} items in this outfit`}
      />

      {/* Tags */}
      {(outfit.occasion || outfit.season) && (
        <div className="flex gap-2 mb-6 sm:mb-8">
          {outfit.occasion && (
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-medium">
              {outfit.occasion}
            </span>
          )}
          {outfit.season && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full font-medium">
              {outfit.season}
            </span>
          )}
        </div>
      )}

      {/* Canvas View */}
      {outfit.canvas?.nodes && outfit.canvas.nodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Outfit Canvas
          </h2>
          <div className="overflow-x-auto pb-2">
            <div
              className="relative bg-gray-50 dark:bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden inline-block"
              style={{
                width: "800px",
                height: "600px",
                minWidth: "640px",
                maxWidth: "100%",
              }}
            >
              {outfit.canvas.nodes.map((node, index) => {
                const item = items.find(
                  (i) => (i._id || i.id) === node.itemId,
                );
                if (!item) return null;

                return (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      zIndex: node.z || 0,
                    }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Items List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Products in this Outfit ({items.length})
        </h2>
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <ItemCard
                  item={item}
                  onTogglePurchased={handleTogglePurchased}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={() => handleItemClick(item._id || item.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Actions & Metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1.5 rounded-full font-medium">
              <Calendar size={14} />
              Created: {new Date(outfit.createdAt).toLocaleDateString()}
            </span>
            {outfit.updatedAt !== outfit.createdAt && (
              <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-1.5 rounded-full font-medium">
                <Clock size={14} />
                Updated: {new Date(outfit.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              title="Edit Outfit"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete Outfit"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
