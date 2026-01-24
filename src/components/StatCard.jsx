export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`${color} border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="p-3 bg-white dark:bg-gray-700 rounded-full">
          <Icon size={24} className="text-gray-700 dark:text-gray-300" />
        </div>
      </div>
    </div>
  );
}