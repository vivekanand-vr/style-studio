import { Link, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Wardrobe Wishlist
            </Link>
            
            <div className="flex items-center gap-4">
              <nav className="flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-gray-900 dark:bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/items"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/items')
                      ? 'bg-gray-900 dark:bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Items
                </Link>
                <Link
                  to="/favorites"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/favorites')
                      ? 'bg-gray-900 dark:bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Favorites
                </Link>
                <Link
                  to="/outfits"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/outfits')
                      ? 'bg-gray-900 dark:bg-gray-700 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Outfits
                </Link>
              </nav>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
