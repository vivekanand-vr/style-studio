import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

export default function ImageZoomModal({ imageUrl, alt, onClose }) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.3, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.3, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "r" || e.key === "R") handleRotate();
      if (e.key === "0") handleReset();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-linear-to-b from-black/50 to-transparent p-3 sm:p-4 md:p-6 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg truncate pr-2">
              {alt}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm shrink-0"
            >
              <X size={20} className="text-white sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div
          className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <motion.img
            src={imageUrl}
            alt={alt}
            animate={{
              scale,
              rotate: rotation,
              x: position.x,
              y: position.y,
            }}
            transition={{ type: "tween", duration: 0.2 }}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent p-3 sm:p-4 md:p-6 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={handleZoomOut}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
              title="Zoom Out (-)"
            >
              <ZoomOut size={18} className="text-white sm:w-5 sm:h-5" />
            </button>

            <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="text-white font-medium text-sm sm:text-base">
                {Math.round(scale * 100)}%
              </span>
            </div>

            <button
              onClick={handleZoomIn}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
              title="Zoom In (+)"
            >
              <ZoomIn size={18} className="text-white sm:w-5 sm:h-5" />
            </button>

            <div className="w-px h-6 sm:h-8 bg-white/20 mx-1 sm:mx-2"></div>

            <button
              onClick={handleRotate}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
              title="Rotate (R)"
            >
              <RotateCw size={18} className="text-white sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={handleReset}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm text-white font-medium text-xs sm:text-sm"
              title="Reset (0)"
            >
              <span className="hidden sm:inline">Reset</span>
              <span className="sm:hidden">🔄</span>
            </button>
          </div>

          <div className="text-center mt-3 sm:mt-4 text-white/60 text-[10px] sm:text-xs px-2">
            <p className="hidden sm:block">
              Use mouse wheel or +/- keys to zoom • Drag to pan • R to rotate •
              0 to reset • ESC to close
            </p>
            <p className="sm:hidden">Pinch to zoom • Drag to pan</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
