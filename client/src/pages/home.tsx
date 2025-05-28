import { useState, useEffect } from "react";
import { TMDBMovie } from "@/types/movie";
import { 
  useTrendingMovies, 
  usePopularMovies,
  useNowPlayingMovies,
  useTopRatedMovies 
} from "@/hooks/use-tmdb";
import { initializeTMDBConfig } from "@/lib/tmdb";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { MovieSection } from "@/components/movie-section";
import { InfiniteMovieSection } from "@/components/infinite-movie-section";
import { SearchOverlay, MobileSearchOverlay } from "@/components/search-overlay";
import { SideMenu } from "@/components/side-menu";
import { MovieDetailModal } from "@/components/movie-detail-modal";
import { Button } from "@/components/ui/button";
import { ChevronUp, TrendingUp, Star, Clock, Film } from "lucide-react";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch movie data
  const { data: trendingData, isLoading: trendingLoading } = useTrendingMovies();
  const { 
    data: popularData, 
    fetchNextPage: fetchNextPopular,
    hasNextPage: hasNextPopular,
    isFetchingNextPage: isFetchingNextPopular
  } = usePopularMovies();
  const { data: nowPlayingData, isLoading: nowPlayingLoading } = useNowPlayingMovies();
  const { data: topRatedData, isLoading: topRatedLoading } = useTopRatedMovies();

  // Initialize TMDB configuration
  useEffect(() => {
    initializeTMDBConfig();
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get featured movie (first trending movie)
  const featuredMovie = trendingData?.results[0] || null;

  // Get all popular movies from all pages
  const allPopularMovies = popularData?.pages.flatMap(page => page.results) || [];

  const handleMovieClick = (movie: TMDBMovie) => {
    setSelectedMovieId(movie.id);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  const handleNavigation = (section: string) => {
    // Close menu first
    setIsMenuOpen(false);
    
    // Handle navigation to different sections
    switch (section) {
      case 'home':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'trending':
        scrollToSection('trending-section');
        break;
      case 'movies':
      case 'genres':
        scrollToSection('popular-section');
        break;
      case 'watchlist':
        // TODO: Implement watchlist functionality
        console.log('Watchlist functionality coming soon!');
        break;
      case 'settings':
        // TODO: Implement settings
        console.log('Settings functionality coming soon!');
        break;
      case 'help':
        // TODO: Implement help
        console.log('Help functionality coming soon!');
        break;
      default:
        console.log('Navigate to:', section);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMorePopular = () => {
    if (hasNextPopular && !isFetchingNextPopular) {
      fetchNextPopular();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onMobileSearchClick={() => setIsMobileSearchOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
        isSearchOpen={isSearchOpen || isMobileSearchOpen}
      />

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection movie={featuredMovie} />

        {/* Movie Sections */}
        <section className="py-12 space-y-12">
          {/* Trending Movies */}
          <div id="trending-section">
            <MovieSection
              title="Trending Now"
              icon={<TrendingUp className="w-6 h-6 text-netflix-red mr-3" />}
              movies={trendingData?.results || []}
              onMovieClick={handleMovieClick}
              loading={trendingLoading}
              layout="horizontal"
            />
          </div>

          {/* Now Playing Movies */}
          <MovieSection
            title="Now Playing"
            icon={<Film className="w-6 h-6 text-netflix-red mr-3" />}
            movies={nowPlayingData?.results || []}
            onMovieClick={handleMovieClick}
            loading={nowPlayingLoading}
            layout="horizontal"
          />

          {/* Top Rated Movies */}
          <MovieSection
            title="Top Rated"
            icon={<Clock className="w-6 h-6 text-netflix-red mr-3" />}
            movies={topRatedData?.results || []}
            onMovieClick={handleMovieClick}
            loading={topRatedLoading}
            layout="horizontal"
          />

          {/* Popular Movies Grid with Infinite Scroll */}
          <div id="popular-section">
            <InfiniteMovieSection
              title="Popular Movies"
              icon={<Star className="w-6 h-6 text-netflix-red mr-3" />}
              movies={allPopularMovies}
              onMovieClick={handleMovieClick}
              onLoadMore={handleLoadMorePopular}
              hasNextPage={hasNextPopular}
              isLoadingMore={isFetchingNextPopular}
            />
          </div>
        </section>
      </main>

      {/* Search Overlays */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onMovieClick={handleMovieClick}
      />

      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        onMovieClick={handleMovieClick}
      />

      {/* Side Menu */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigation}
      />

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movieId={selectedMovieId}
        isOpen={selectedMovieId !== null}
        onClose={handleCloseModal}
        onMovieClick={handleMovieClick}
      />

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-netflix-red hover:bg-red-700 text-white rounded-full w-12 h-12 p-0 shadow-lg z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
