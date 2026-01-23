import { useState, useEffect } from 'react';
import { getOutfits, getItems, deleteOutfit } from '../utils/localStorage';
import OutfitBuilder from '../components/OutfitBuilder';
import OutfitCard from '../components/OutfitCard';

export default function Outfits() {
  const [outfits, setOutfits] = useState([]);
  const [items, setItems] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setOutfits(getOutfits());
    setItems(getItems());
  };

  const handleOutfitSaved = () => {
    loadData();
    setShowBuilder(false);
    setEditingOutfit(null);
  };

  const handleDeleteOutfit = (id) => {
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      deleteOutfit(id);
      loadData();
    }
  };

  const handleEditOutfit = (outfit) => {
    setEditingOutfit(outfit);
    setShowBuilder(true);
  };

  const handleCancelBuilder = () => {
    setShowBuilder(false);
    setEditingOutfit(null);
  };

  if (showBuilder) {
    return (
      <OutfitBuilder
        items={items}
        editOutfit={editingOutfit}
        onSave={handleOutfitSaved}
        onCancel={handleCancelBuilder}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Outfits</h1>
          <p className="text-gray-600 dark:text-gray-400">Create and manage your outfit combinations</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          + Create Outfit
        </button>
      </div>

      {outfits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No outfits yet. Create your first outfit!
          </p>
          <button
            onClick={() => setShowBuilder(true)}
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Create Outfit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onDelete={handleDeleteOutfit}
              onEdit={handleEditOutfit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
