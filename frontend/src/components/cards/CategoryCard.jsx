import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({
  name,
  description,
  imageUrl,
  gradientFrom,
  gradientTo,
}) {
  return (
    <Link
      to={`/category/${name}`}
      className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 h-48 sm:h-64 md:h-80"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/30 to-transparent z-10"></div>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-end p-3 sm:p-4 md:p-6 z-20">
        {/* Decorative gradient bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        ></div>

        <div className="space-y-1 sm:space-y-2 md:space-y-3">
          <div>
            <h3
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-1 sm:mb-2 drop-shadow-lg group-hover:translate-x-1 transition-transform duration-300"
              style={{
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {name}
            </h3>
            <p
              className="text-xs sm:text-sm text-white/90 font-medium drop-shadow-md"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {description}
            </p>
          </div>

          <div
            className="hidden sm:flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <span className="text-xs sm:text-sm">Explore Collection</span>
            <div className="p-1 sm:p-1.5 bg-white/20 backdrop-blur-sm rounded-full group-hover:bg-white/30 transition-colors">
              <ArrowRight size={14} className="sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </Link>
  );
}
