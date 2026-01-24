import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Trash2, X } from "lucide-react";
import html2canvas from "html2canvas";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { saveOutfit } from "../utils/localStorage";
import { OCCASIONS, SEASONS } from "../utils/constants";
import PageHeader from "./PageHeader";

// Draggable sidebar item component
function SidebarItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sidebar-${item.id}`,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-2 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-none"
    >
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden shrink-0">
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
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
            {item.title || item.brand || "Untitled"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {item.category}
          </p>
        </div>
      </div>
    </div>
  );
}

// Draggable canvas item component
function CanvasItem({ canvasItem, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `canvas-${index}`,
    });

  const style = {
    position: "absolute",
    left: `${canvasItem.x}px`,
    top: `${canvasItem.y}px`,
    zIndex: canvasItem.z,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-move group touch-none"
    >
      <div className="relative">
        <div className="w-24 h-24 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-lg group-hover:border-indigo-500 dark:group-hover:border-indigo-400 transition-colors">
          {canvasItem.item.thumbnail ? (
            <img
              src={canvasItem.item.thumbnail}
              alt={canvasItem.item.title}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              📦
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove(index);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Droppable canvas component
function Canvas({ canvasRef, canvasItems, onRemove }) {
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        canvasRef.current = node;
      }}
      className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg relative overflow-hidden h-105 md:h-130 lg:h-150"
    >
      {canvasItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
          Drag items from the sidebar onto this canvas
        </div>
      )}

      {canvasItems.map((canvasItem, index) => (
        <CanvasItem
          key={index}
          canvasItem={canvasItem}
          index={index}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export default function OutfitBuilder({ items, editOutfit, onSave, onCancel }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [canvasItems, setCanvasItems] = useState([]);
  const [outfitName, setOutfitName] = useState("");
  const [outfitDescription, setOutfitDescription] = useState("");
  const [occasion, setOccasion] = useState("");
  const [season, setSeason] = useState("");
  const [manualThumbnail, setManualThumbnail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState(null);
  const canvasRef = useRef(null);

  // Load edit data
  useEffect(() => {
    if (editOutfit) {
      setOutfitName(editOutfit.name || "");
      setOutfitDescription(editOutfit.description || "");
      setOccasion(editOutfit.occasion || "");
      setSeason(editOutfit.season || "");
      setManualThumbnail(editOutfit.coverImage || "");

      // Reconstruct canvas items from saved outfit
      if (editOutfit.canvas?.nodes) {
        const reconstructedItems = editOutfit.canvas.nodes
          .map((node) => {
            const item = items.find((i) => i.id === node.itemId);
            if (item) {
              return {
                item,
                x: node.x,
                y: node.y,
                z: node.z || 0,
              };
            }
            return null;
          })
          .filter(Boolean);
        setCanvasItems(reconstructedItems);
      }
    }
  }, [editOutfit, items]);

  const filteredItems = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, delta, over } = event;
    setActiveId(null);

    if (!over || over.id !== "canvas") return;

    const id = active.id;

    // Check if it's a sidebar item (string starts with 'sidebar-')
    if (typeof id === "string" && id.startsWith("sidebar-")) {
      const itemId = id.replace("sidebar-", "");
      const item = items.find((i) => i.id === itemId);

      if (!item) return;

      // Check if item is already on canvas
      if (!canvasItems.find((ci) => ci.item.id === item.id)) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        setCanvasItems([
          ...canvasItems,
          {
            item,
            x: Math.max(
              0,
              Math.min(
                event.activatorEvent.clientX - rect.left - 50,
                rect.width - 100,
              ),
            ),
            y: Math.max(
              0,
              Math.min(
                event.activatorEvent.clientY - rect.top - 50,
                rect.height - 100,
              ),
            ),
            z: canvasItems.length,
          },
        ]);
      }
    } else if (typeof id === "string" && id.startsWith("canvas-")) {
      // It's a canvas item being repositioned
      const canvasIndex = parseInt(id.replace("canvas-", ""));

      if (
        !isNaN(canvasIndex) &&
        canvasIndex >= 0 &&
        canvasIndex < canvasItems.length
      ) {
        setCanvasItems((prev) =>
          prev.map((item, index) =>
            index === canvasIndex
              ? {
                  ...item,
                  x: Math.max(0, item.x + delta.x),
                  y: Math.max(0, item.y + delta.y),
                }
              : item,
          ),
        );
      }
    }
  };

  const handleRemoveFromCanvas = (index) => {
    setCanvasItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!outfitName.trim()) {
      alert("Please enter an outfit name");
      return;
    }

    if (canvasItems.length === 0) {
      alert("Please add at least one item to the canvas");
      return;
    }

    let coverImage = manualThumbnail.trim();

    // Capture canvas as image if no manual thumbnail provided
    if (!coverImage && canvasRef.current) {
      try {
        const canvas = await html2canvas(canvasRef.current, {
          backgroundColor: "#f3f4f6",
          scale: 0.5, // Reduce quality to keep file size smaller
          logging: false,
        });
        coverImage = canvas.toDataURL("image/png");
      } catch (error) {
        console.error("Failed to capture canvas:", error);
        // Fallback to first item's thumbnail
        coverImage =
          canvasItems[0]?.item.thumbnail || canvasItems[0]?.item.image || "";
      }
    }

    const outfitData = {
      ...(editOutfit && { id: editOutfit.id, createdAt: editOutfit.createdAt }),
      name: outfitName,
      description: outfitDescription,
      itemIds: canvasItems.map((ci) => ci.item.id),
      occasion: occasion || undefined,
      season: season || undefined,
      coverImage,
      canvas: {
        nodes: canvasItems.map((ci) => ({
          itemId: ci.item.id,
          x: ci.x,
          y: ci.y,
          z: ci.z,
        })),
      },
    };

    saveOutfit(outfitData);
    onSave();
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-12 min-h-[calc(100vh-4rem)]"
      >
        <div className="mb-8 flex justify-between items-start">
          <PageHeader
            title={editOutfit ? "Edit Outfit" : "Create Outfit"}
            subtitle="Drag items onto the canvas to create your outfit combination"
          />
          <button
            onClick={onCancel}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar - Items List */}
          <div className="col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Items
            </h3>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-3 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            />

            <div className="space-y-2">
              {filteredItems.map((item) => (
                <SidebarItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-3 space-y-4">
            <Canvas
              canvasRef={canvasRef}
              canvasItems={canvasItems}
              onRemove={handleRemoveFromCanvas}
            />

            {/* Outfit Details Form */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Outfit Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Outfit Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    placeholder="E.g., Summer Casual Look"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={outfitDescription}
                    onChange={(e) => setOutfitDescription(e.target.value)}
                    placeholder="Describe this outfit..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thumbnail URL (optional)
                  </label>
                  <input
                    type="url"
                    value={manualThumbnail}
                    onChange={(e) => setManualThumbnail(e.target.value)}
                    placeholder="https://example.com/image.jpg (leave empty to auto-generate from canvas)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  />
                  {manualThumbnail && (
                    <div className="mt-2">
                      <img
                        src={manualThumbnail}
                        alt="Thumbnail preview"
                        className="h-20 object-cover rounded border border-gray-300 dark:border-gray-600"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Occasion
                  </label>
                  <div className="relative">
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent appearance-none"
                    >
                      <option value="">Select occasion</option>
                      {OCCASIONS.map((occ) => (
                        <option key={occ} value={occ}>
                          {occ}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Season
                  </label>
                  <div className="relative">
                    <select
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent appearance-none"
                    >
                      <option value="">Select season</option>
                      {SEASONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={onCancel}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                  Save Outfit
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </DndContext>
  );
}
