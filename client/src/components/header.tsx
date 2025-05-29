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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/98 backdrop-blur-xl shadow-2xl border-b border-border/20' 
          : 'bg-background/95 backdrop-blur-lg'
      }`}
    >
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
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
        <div className="hidden md:flex flex-1 max-w-lg mx-10">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/20 via-transparent to-netflix-red/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <Input
              type="text"
              placeholder="Search for movies, shows, and more..."
              onClick={onSearchClick}
              className="relative w-full bg-gradient-to-r from-muted/90 to-muted/70 border-2 border-border/30 hover:border-netflix-red/60 focus:border-netflix-red pl-14 pr-6 py-4 text-base rounded-full cursor-pointer transition-all duration-400 shadow-xl hover:shadow-2xl backdrop-blur-lg group-hover:scale-[1.02] hover:shadow-netflix-red/10"
              readOnly
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground group-hover:text-netflix-red w-5 h-5 transition-all duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-netflix-red/10 via-transparent to-netflix-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"></div>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            className={`md:hidden p-4 transition-all duration-300 hover:bg-netflix-red/20 active:bg-netflix-red/30 hover:scale-110 active:scale-95 rounded-2xl ${
              isSearchOpen ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={onMobileSearchClick}
          >
            <Search className="w-7 h-7 text-muted-foreground hover:text-netflix-red transition-colors duration-300" />
          </Button>

          {/* Menu Button */}
          <Button
            variant="ghost"
            className={`p-3 transition-opacity duration-300 hover:bg-netflix-red/20 active:bg-netflix-red/30 ${
              isSearchOpen ? 'opacity-0 md:opacity-100' : 'opacity-100'
            }`}
            onClick={onMenuClick}
          >
            <Menu className="w-9 h-9" />
          </Button>
        </div>
      </div>
    </header>
  );
}
