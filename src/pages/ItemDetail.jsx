import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, Edit2, Check, Trash2, Tag, Palette, Ruler, Calendar, Clock, IndianRupee, Heart } from 'lucide-react';
import { getItemById, togglePurchased, toggleFavorite, deleteItem } from '../utils/localStorage';
import AddItemModal from '../components/AddItemModal';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = () => {
    const itemData = getItemById(id);
    if (itemData) {
      setItem(itemData);
    } else {
      navigate('/items');
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
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
      navigate('/items');
    }
  };

  const handleItemUpdated = () => {
    loadItem();
    setIsEditModalOpen(false);
  };

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  const imageUrl = item.thumbnail || item.image;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 flex items-center"
      >
        <span className="mr-2">←</span> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.title || 'Item'}
                className="w-full h-96 object-contain"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-gray-400 dark:text-gray-500 text-6xl">
                📦
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex-1">
              {item.title || item.sourceDomain || 'Untitled'}
            </h1>
            
            {/* Action Icons */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleToggleFavorite}
                className="p-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-300 dark:hover:border-red-500 transition-colors"
                title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={18}
                  className={item.favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}
                />
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
                title="Edit Item"
              >
                <Edit2 size={18} />
              </button>

              <button
                onClick={handleDelete}
                className="p-2 border-2 border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Delete Item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-gray-600 dark:text-gray-400">
              {item.brand && <span className="font-medium">{item.brand}</span>}
              {item.brand && ' · '}
              {item.category}
              {item.subcategory && ` / ${item.subcategory}`}
            </span>
          </div>

          {/* Price or Purchased Badge */}
          <div className="mb-6">
            {item.purchased ? (
              <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium px-3 py-1.5 rounded">
                ✓ Purchased
              </span>
            ) : item.price ? (
              <div className="flex items-center gap-1">
                <IndianRupee className="text-gray-900 dark:text-white"/>
                <p className="font-bold text-2xl text-gray-900 dark:text-white">
                  {item.price}
                </p>
              </div>
            ) : null}
          </div>

          {/* Attributes */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 space-y-3">
            {item.type && (
              <div className="flex items-center gap-3">
                <Tag className="text-gray-500 dark:text-gray-400" size={18} />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Type:</span>
                <span className="text-gray-900 dark:text-white font-medium">{item.type}</span>
              </div>
            )}
            {item.color && (
              <div className="flex items-center gap-3">
                <Palette className="text-gray-500 dark:text-gray-400" size={18} />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Color:</span>
                <span className="text-gray-900 dark:text-white font-medium">{item.color}</span>
              </div>
            )}
            {item.size && (
              <div className="flex items-center gap-3">
                <Ruler className="text-gray-500 dark:text-gray-400" size={18} />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Size:</span>
                <span className="text-gray-900 dark:text-white font-medium">{item.size}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {item.sourceLink && (
              <a
                href={item.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <ExternalLink size={18} />
                View Product Page
              </a>
            )}

            <button
              onClick={handleTogglePurchased}
              className={`flex items-center justify-center gap-2 flex-1 px-6 py-3 rounded-lg transition-colors font-medium ${
                item.purchased
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
              }`}
            >
              <Check size={18} />
              {item.purchased ? 'Mark as Wishlist' : 'Mark as Purchased'}
            </button>
          </div>

          {/* Metadata */}
          <div className="mt-8 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-xs">
              <Calendar size={14} />
              <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            {item.updatedAt !== item.createdAt && (
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs">
                <Clock size={14} />
                <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <AddItemModal
          editItem={item}
          onClose={() => setIsEditModalOpen(false)}
          onItemAdded={handleItemUpdated}
        />
      )}
    </div>
  );
}
