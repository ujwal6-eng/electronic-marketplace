import { Home, ShoppingBag, Wrench, MessageSquare, User } from 'lucide-react';
import { NavLink } from './NavLink';

export const BottomNav = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/marketplace', icon: ShoppingBag, label: 'Shop' },
    { to: '/services', icon: Wrench, label: 'Services' },
    { to: '/forum', icon: MessageSquare, label: 'Forum' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </div>
    </nav>
  );
};
