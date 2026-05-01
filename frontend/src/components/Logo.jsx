import { motion } from "framer-motion";

export default function Logo() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 group">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-indigo-600 dark:bg-indigo-500 rounded-full"
      >
        <span className="text-white font-bold text-sm sm:text-base">S</span>
      </motion.div>
      <span className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
        Style Studio
      </span>
    </div>
  );
}
