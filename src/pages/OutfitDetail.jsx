import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOutfitById, getItemById, deleteOutfit } from '../utils/localStorage';

export default function OutfitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadOutfit();
  }, [id]);

  const loadOutfit = () => {
    const outfitData = getOutfitById(id);
    if (outfitData) {
      setOutfit(outfitData);
      const outfitItems = outfitData.itemIds.map(itemId => getItemById(itemId)).filter(Boolean);
      setItems(outfitItems);
    } else {
      navigate('/outfits');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      deleteOutfit(id);
      navigate('/outfits');
    }
  };

  if (!outfit) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/outfits')}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 flex items-center"
      >
        <span className="mr-2">←</span> Back to Outfits
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{outfit.name}</h1>
        {outfit.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">{outfit.description}</p>
        )}
        <div className="flex gap-2">
          {outfit.occasion && (
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm px-3 py-1 rounded-full">
              {outfit.occasion}
            </span>
          )}
          {outfit.season && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm px-3 py-1 rounded-full">
              {outfit.season}
            </span>
          )}
        </div>
      </div>

      {/* Canvas View */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 mb-6">
        <div 
          className="relative mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
          style={{ 
            width: '800px', 
            height: '600px',
            maxWidth: '100%',
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {outfit.canvas?.nodes?.map((node, index) => {
            const item = items.find(i => i.id === node.itemId);
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
                <div className="w-24 h-24 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-lg">
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

      {/* Items List */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Items in this Outfit ({items.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/items/${item.id}`)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded mb-2 overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-2xl">
                    📦
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.title || item.sourceDomain || 'Untitled'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {item.brand}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          className="px-6 py-2 border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Delete Outfit
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
        <p>Created: {new Date(outfit.createdAt).toLocaleDateString()}</p>
        {outfit.updatedAt !== outfit.createdAt && (
          <p>Updated: {new Date(outfit.updatedAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}
