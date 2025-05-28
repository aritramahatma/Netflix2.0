import { Home, Film, TrendingUp, Tags, Bookmark, Settings, HelpCircle } from "lucide-react";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

export function SideMenu({ isOpen, onClose, onNavigate }: SideMenuProps) {
  const menuItems = [
    { icon: Home, label: "Home", key: "home" },
    { icon: Film, label: "Movies", key: "movies" },
    { icon: TrendingUp, label: "Trending", key: "trending" },
    { icon: Tags, label: "Genres", key: "genres" },
    { icon: Bookmark, label: "My List", key: "watchlist" },
  ];

  const secondaryItems = [
    { icon: Settings, label: "Settings", key: "settings" },
    { icon: HelpCircle, label: "Help", key: "help" },
  ];

  const handleItemClick = (key: string) => {
    onNavigate(key);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Side menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-card transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleItemClick(item.key)}
                className="w-full flex items-center text-left text-foreground hover:text-netflix-red transition-colors py-2 text-lg"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
            
            <hr className="border-border my-4" />
            
            {secondaryItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleItemClick(item.key)}
                className="w-full flex items-center text-left text-foreground hover:text-netflix-red transition-colors py-2 text-lg"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
