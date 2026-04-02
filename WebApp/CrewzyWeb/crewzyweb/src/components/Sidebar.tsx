import { Home, Calendar, Compass, Users, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Calendar, label: 'Events', path: '/calendar' },
    { icon: Compass, label: 'Discover', path: '/discover' },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="w-20 bg-white/80 backdrop-blur-md flex flex-col items-center py-8 gap-8 border-r border-gray-200/50 shadow-sm">
      {/* Logo */}
      <Link to="/" className="transition-transform hover:scale-110">
        <Logo size={48} />
      </Link>

      {/* Navigation Items */}
      <nav className="flex flex-col items-center gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`p-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}