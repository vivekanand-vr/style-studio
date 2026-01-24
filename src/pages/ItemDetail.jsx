import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Edit2,
  Trash2,
  Tag,
  Palette,
  Ruler,
  Calendar,
  Clock,
  Heart,
  ShoppingBag,
  ArrowLeft,
  Search,
  Info,
} from "lucide-react";
import {
  getItemById,
  togglePurchased,
  toggleFavorite,
  deleteItem,
} from "../utils/localStorage";
import AddItemModal from "../components/modals/AddItemModal";
import PageHeader from "../components/PageHeader";
import ImageZoomModal from "../components/modals/ImageZoomModal";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageZoomOpen, setIsImageZoomOpen] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = () => {
    const itemData = getItemById(id);
    if (itemData) {
      setItem(itemData);
    } else {
      navigate("/items");
    }
  };

  const handleTogglePurchased = () => {
    togglePurchased(id);
    loadItem();
  };

  const handleToggleFavorite = () => {
    toggleFavorite(id);
    loadItem();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(id);
      navigate("/items");
    }
  };

  const handleItemUpdated = () => {
    loadItem();
    setIsEditModalOpen(false);
  };

  if (!item) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
          <Info size={32} className="text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400">Loading product...</p>
      </div>
    );
  }

  const imageUrl = item.thumbnail || item.image;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </motion.button>

      {/* Page Header */}
      <PageHeader
        title={item.title || item.sourceDomain || "Untitled Product"}
        subtitle={`${item.brand ? item.brand + " • " : ""}${item.category}${item.subcategory ? " / " + item.subcategory : ""}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="relative bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden mb-4 cursor-pointer group"
            onClick={() => imageUrl && setIsImageZoomOpen(true)}
          >
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={item.title || "Product"}
                  className="w-full h-125 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                      <Search size={18} />
                      <span>Click to zoom</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-125 flex items-center justify-center text-gray-400 dark:text-gray-500 text-8xl">
                📦
              </div>
            )}

            {/* Purchased Badge Overlay */}
            {item.purchased && (
              <div className="absolute top-4 left-4">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center gap-2">
                  <ShoppingBag size={16} />
                  Purchased
                </div>
              </div>
            )}

            {/* Favorite Badge */}
            {item.favorite && (
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                  <Heart size={18} className="fill-white" />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Price Section */}
          {!item.purchased && item.price && (
            <div className="bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-medium text-gray-600 dark:text-gray-400">
                  {item.currency || "INR"}
                </span>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {item.price}
                </p>
              </div>
            </div>
          )}

          {/* Attributes Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Product Details
            </h3>

            {item.type && (
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Tag
                    className="text-indigo-600 dark:text-indigo-400"
                    size={18}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    Type
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {item.type}
                  </span>
                </div>
              </div>
            )}

            {item.color && (
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Palette
                    className="text-purple-600 dark:text-purple-400"
                    size={18}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    Color
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {item.color}
                  </span>
                </div>
              </div>
            )}

            {item.size && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                  <Ruler
                    className="text-pink-600 dark:text-pink-400"
                    size={18}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    Size
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {item.size}
                  </span>
                </div>
              </div>
            )}

            {!item.type && !item.color && !item.size && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No additional details available
              </p>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {item.notes}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                item.favorite
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <Heart
                size={16}
                className={item.favorite ? "fill-current" : ""}
              />
              <span>{item.favorite ? "Unfavorite" : "Favorite"}</span>
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Edit Product"
            >
              <Edit2 size={16} />
            </button>

            <button
              onClick={handleTogglePurchased}
              className={`p-2 rounded-lg transition-colors ${
                item.purchased
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              title={item.purchased ? "Mark as Wishlist" : "Mark as Purchased"}
            >
              <ShoppingBag size={16} />
            </button>

            {item.sourceLink && (
              <a
                href={item.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="View Product Page"
              >
                <ExternalLink size={16} />
              </a>
            )}

            <button
              onClick={handleDelete}
              className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
              title="Delete Product"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 pt-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full text-xs font-medium">
              <Calendar size={14} />
              <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            {item.updatedAt !== item.createdAt && (
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-2 rounded-full text-xs font-medium">
                <Clock size={14} />
                <span>
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isEditModalOpen && (
          <AddItemModal
            editItem={item}
            onClose={() => setIsEditModalOpen(false)}
            onItemAdded={handleItemUpdated}
          />
        )}

        {isImageZoomOpen && imageUrl && (
          <ImageZoomModal
            imageUrl={imageUrl}
            alt={item.title || "Product"}
            onClose={() => setIsImageZoomOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
