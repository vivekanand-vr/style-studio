import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Sparkles } from "lucide-react";
import { searchOutfits } from "../utils/localStorage";
import { useOutfits } from "../hooks/useOutfits";
import OutfitCard from "../components/cards/OutfitCard";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

export default function Outfits() {
  const navigate = useNavigate();
  const { outfits, remove } = useOutfits({ limit: 200 });
  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteOutfit = async (id) => {
    if (window.confirm("Are you sure you want to delete this outfit?")) {
      await remove(id);
    }
  };

  const handleEditOutfit = (outfit) => {
    navigate(`/outfits/edit/${outfit._id || outfit.id}`);
  };

  // Client-side search on the already-fetched list
  const filteredOutfits = searchOutfits(outfits, searchQuery);

  return (
    <div>
      <PageHeader
        title="Outfits"
        subtitle="Create and manage your outfit combinations"
      />

      {/* Search and Create Button */}
      <div className="flex flex-row gap-2.5 sm:gap-4 mb-6 sm:mb-8 items-center">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search outfits by name, occasion, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow"
          />
        </div>

        {/* Create Outfit Button */}
        <button
          onClick={() => navigate("/outfits/new")}
          className="bg-indigo-600 text-white text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-0.5 sm:gap-2 whitespace-nowrap"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Create Outfit</span>
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
