import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { ArrowUpTrayIcon, PhotoIcon, ArrowLeftOnRectangleIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/AuthStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'File Manager', href: '/file-manager', icon: PhotoIcon },
  { name: 'Upload', href: '/upload', icon: ArrowUpTrayIcon },
];

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
        <DialogPanel className="fixed inset-0 flex w-full max-w-xs flex-col bg-gray-900">
          <div className="flex h-16 justify-end px-4">
            <button onClick={() => setSidebarOpen(false)} className="text-white">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-grow px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 py-2 text-sm ${
                  location.pathname === item.href ? 'text-white' : 'text-gray-400'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center justify-center gap-2 py-2 text-sm text-gray-400 hover:text-white"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </DialogPanel>
      </Dialog>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-gray-900 lg:px-4 lg:py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-2 py-2 text-sm ${
                location.pathname === item.href ? 'text-white' : 'text-gray-400'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 py-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      {/* Sidebar Toggle Button for Mobile */}
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
        <Bars3Icon className="h-6 w-6 text-gray-700" />
      </button>
    </>
  );
};

export default Sidebar;