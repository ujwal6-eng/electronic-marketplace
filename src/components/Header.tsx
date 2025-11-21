import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { to: '/', label: 'Home' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/services', label: 'Services' },
    { to: '/forum', label: 'Forum' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-heading font-bold text-xl gradient-rainbow text-gradient">Electro</span>
          </Link>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};
