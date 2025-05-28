import { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearchClick: () => void;
  onMobileSearchClick: () => void;
  onMenuClick: () => void;
  isSearchOpen: boolean;
}

export function Header({ onSearchClick, onMobileSearchClick, onMenuClick, isSearchOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background' : 'bg-background/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className={`flex items-center space-x-2 transition-opacity duration-300 ${
            isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'
          }`}
        >
          <span className="text-netflix-red text-2xl font-bold">404</span>
          <span className="text-netflix-red text-2xl">|</span>
          <span className="text-foreground text-2xl font-bold">MOVIE</span>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Input
              type="text"
              placeholder="Search for movies, shows, and more..."
              onClick={onSearchClick}
              className="w-full bg-gradient-to-r from-muted to-muted/80 border-2 border-transparent hover:border-netflix-red/50 focus:border-netflix-red pl-12 pr-4 py-3 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
              readOnly
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-netflix-red w-5 h-5 transition-colors duration-300" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-netflix-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Mobile Search Icon */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden transition-opacity duration-300 ${
            isSearchOpen ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={onMobileSearchClick}
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`transition-opacity duration-300 ${
            isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'
          }`}
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
