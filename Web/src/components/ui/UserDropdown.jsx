import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:text-emerald-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-emerald-700 rounded-md px-2 py-1"
      >
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <User className="h-5 w-5 text-emerald-700" />
        </div>
        <span className="hidden md:block text-sm font-medium">
          {user?.username || 'Usuario'}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.username || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'usuario@ejemplo.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* My Profile */}
              <Link
                to="/perfil"
                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-emerald-500" />
                Mi Perfil
              </Link>

              {/* Publish Article */}
              <Link
                to="/publicar"
                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="mr-3 h-4 w-4 text-gray-400 group-hover:text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Publicar Artículo
              </Link>

              {/* My Articles */}
              <Link
                to="/mis-articulos"
                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="mr-3 h-4 w-4 text-gray-400 group-hover:text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Mis Artículos
              </Link>

              {/* Settings */}
              <Link
                to="/configuracion"
                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-emerald-500" />
                Configuración
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100"></div>

            {/* Logout */}
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                role="menuitem"
              >
                <LogOut className="mr-3 h-4 w-4 text-red-500" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
