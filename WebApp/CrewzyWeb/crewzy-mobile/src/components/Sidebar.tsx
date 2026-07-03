import { Home, Calendar, Compass, Users, User, Settings, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export function Sidebar() {
    const location = useLocation();

    // 1. Citim rolul salvat la login (dacă nu există, presupunem că e 'user' normal)
    const userRole = localStorage.getItem('userRole') || 'user';

    // 2. Meniul clasic pentru utilizatorii normali
    const personalNavItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Calendar, label: 'Events', path: '/calendar' },
        { icon: Compass, label: 'Discover', path: '/discover' },
        { icon: Users, label: 'Friends', path: '/friends' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    // 3. Meniul restrâns pentru conturile de Business (Localuri/Cluburi)
    const businessNavItems = [
        { icon: Briefcase, label: 'My Events', path: '/business-events' },
        { icon: Settings, label: 'Settings', path: '/settings' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    // 4. Alegem ce listă afișăm pe baza rolului!
    const navItems = userRole === 'business' ? businessNavItems : personalNavItems;

    return (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md flex flex-row items-center justify-around py-2 border-t border-gray-200/50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:relative md:w-20 md:h-screen md:flex-col md:justify-start md:py-8 md:gap-8 md:border-t-0 md:border-r md:shadow-sm">

            {/* Logo - Îl ascundem pe telefon (hidden) și îl arătăm pe web (md:flex) ca să salvăm spațiu */}
            <Link to="/" className="hidden md:flex transition-transform hover:scale-110">
                <Logo size={48} />
            </Link>

            {/* Navigation Items */}
            <nav className="flex flex-row w-full justify-around items-center md:flex-col md:gap-8">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center gap-1 md:gap-2 group"
                        >
                            <div
                                className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${isActive
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 md:w-5 md:h-5" />
                            </div>
                            <span
                                className={`text-[10px] font-medium ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'
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