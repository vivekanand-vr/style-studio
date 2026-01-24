import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, color, accent }) {
  const accentColor = accent || "text-indigo-600 dark:text-indigo-300";

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className={`${color} border border-gray-200/80 dark:border-gray-700/70 rounded-xl sm:rounded-2xl p-3 sm:p-5 w-full shadow-sm flex items-center justify-between gap-3 sm:gap-4`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2.5 sm:p-3 rounded-xl bg-white/90 dark:bg-gray-800/80 border border-white/70 dark:border-gray-700/70 shadow-sm">
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${accentColor}`} />
        </div>
        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
          {label}
        </span>
      </div>

      <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-none">
        {value}
      </p>
    </motion.div>
  );
}
