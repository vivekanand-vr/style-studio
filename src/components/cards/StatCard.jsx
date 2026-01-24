import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 16 }}
      className={`${color} border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl px-2.5 py-2 sm:p-5 w-full inline-flex items-center sm:items-start gap-2 sm:gap-3 shadow-sm`}
    >
      <div className="p-2 sm:p-3 bg-white dark:bg-gray-700 rounded-full shrink-0">
        <Icon
          size={18}
          className="sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 leading-tight">
          {value}
        </p>
        <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 font-medium leading-tight">
          {label}
        </p>
      </div>
    </motion.div>
  );
}
