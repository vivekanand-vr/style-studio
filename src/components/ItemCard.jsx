import { Heart } from 'lucide-react';

export default function ItemCard({ item, onTogglePurchased, onToggleFavorite, onClick }) {
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
      window.open(item.sourceLink, '_blank');
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer relative"
    >
      {/* Favorite Heart Icon */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
        title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          size={18}
          className={item.favorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}
        />
      </button>

      {/* Image */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {item.thumbnail || item.image ? (
          <img
            src={item.thumbnail || item.image}
            alt={item.title || 'Item'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">📦</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
          {item.title || item.sourceDomain || 'Untitled'}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {item.brand && <span>{item.brand} · </span>}
          {item.category}
          {item.subcategory && ` / ${item.subcategory}`}
        </p>

        {/* Price or Purchased Badge */}
        {item.purchased ? (
          <div className="mb-3">
            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Purchased
            </span>
          </div>
        ) : item.price ? (
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            {item.currency || 'INR'} {item.price}
          </p>
        ) : (
          <div className="mb-3 h-7"></div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handlePurchaseClick}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              item.purchased
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {item.purchased ? 'Mark Wishlist' : 'Mark Purchased'}
          </button>
          
          {item.sourceLink && (
            <button
              onClick={handleLinkClick}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              title="Open product link"
            >
              🔗
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
