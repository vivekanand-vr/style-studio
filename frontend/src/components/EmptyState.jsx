import { motion } from "framer-motion";

export default function EmptyState({
  icon: Icon,
  title,
  message,
  buttonText,
  onButtonClick,
  showButton = true,
}) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-12 sm:py-20 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-4"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 sm:mb-6">
        <Icon
          size={28}
          className="sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500"
        />
      </div>
      <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
        {message}
      </p>
      {showButton && (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-indigo-700 transition-colors"
        >
          <Icon size={18} className="sm:w-5 sm:h-5" />
          {buttonText}
        </button>
      )}
    </motion.div>
  );
}
