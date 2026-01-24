import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Sparkles } from "lucide-react";
import { getOutfits, deleteOutfit, searchOutfits } from "../utils/localStorage";
import OutfitCard from "../components/cards/OutfitCard";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

export default function Outfits() {
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setOutfits(getOutfits());
  };

  const handleDeleteOutfit = (id) => {
    if (window.confirm("Are you sure you want to delete this outfit?")) {
      deleteOutfit(id);
      loadData();
    }
  };

  const handleEditOutfit = (outfit) => {
    navigate(`/outfits/edit/${outfit.id}`);
  };

  // Filter outfits based on search query
  const filteredOutfits = searchOutfits(outfits, searchQuery);

  return (
    <div>
      <PageHeader
        title="Outfits"
        subtitle="Create and manage your outfit combinations"
      />

      {/* Search and Create Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search outfits by name, occasion, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-2xl pl-12 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow"
          />
        </div>

        {/* Create Outfit Button */}
        <button
          onClick={() => navigate("/outfits/new")}
          className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 whitespace-nowrap"
        >
          <Plus size={20} />
          Create Outfit
        </button>
      </div>

      {/* Outfits Grid */}
      <AnimatePresence mode="wait">
        {filteredOutfits.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={
              searchQuery ? "No outfits match your search" : "No outfits yet"
            }
            message={
              searchQuery
                ? "Try adjusting your search terms to find outfits."
                : "Create your first outfit combination to get started!"
            }
            buttonText="Create Outfit"
            onButtonClick={() => navigate("/outfits/new")}
            showButton={!searchQuery}
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredOutfits.map((outfit, index) => (
                <motion.div
                  key={outfit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OutfitCard
                    outfit={outfit}
                    onDelete={handleDeleteOutfit}
                    onEdit={handleEditOutfit}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
