import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-6 sm:mb-10"
    >
      <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
        {title}
      </h1>
      <p className="text-sm sm:text-md lg:text-lg text-gray-600 dark:text-gray-400 font-medium">
        {subtitle}
      </p>
    </motion.div>
  );
}
