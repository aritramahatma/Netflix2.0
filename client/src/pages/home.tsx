import { useState, useEffect } from "react";
import { TMDBMovie } from "@/types/movie";
import { 
  useTrendingMovies, 
  usePopularMovies,
  useNowPlayingMovies,
  useTopRatedMovies,
  useMoviesByGenre 
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
import { ChevronUp, TrendingUp, Star, Clock, Film, Tags } from "lucide-react";

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

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

  // Genre movies data
  const { 
    data: genreMoviesData, 
    fetchNextPage: fetchNextGenreMovies,
    hasNextPage: hasNextGenrePage,
    isFetchingNextPage: isFetchingNextGenrePage
  } = useMoviesByGenre(selectedGenreId);

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
  const allTrendingMovies = trendingData?.results || [];

  // Get all popular movies from all pages
  const allPopularMovies = popularData?.pages.flatMap(page => page.results) || [];

  // Get all genre movies from all pages
  const allGenreMovies = genreMoviesData?.pages.flatMap(page => page.results) || [];

  const handleMovieClick = (movie: TMDBMovie) => {
    setSelectedMovieId(movie.id);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  const handleNavigation = (section: string, genreId?: number) => {
    // Close menu first
    setIsMenuOpen(false);

    // Handle navigation to different sections
    switch (section) {
      case 'home':
        setSelectedGenreId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'trending':
        setSelectedGenreId(null);
        scrollToSection('trending-section');
        break;
      case 'movies':
        setSelectedGenreId(null);
        scrollToSection('popular-section');
        break;
      case 'genre':
        if (genreId) {
          setSelectedGenreId(genreId);
          // Scroll to genre section or create one
          setTimeout(() => {
            scrollToSection('genre-section');
          }, 100);
        }
        break;
      case 'watchlist':
        setSelectedGenreId(null);
        console.log('Watchlist functionality coming soon!');
        break;
      case 'settings':
        setSelectedGenreId(null);
        console.log('Settings functionality coming soon!');
        break;
      case 'help':
        setSelectedGenreId(null);
        console.log('Help functionality coming soon!');
        break;
      default:
        setSelectedGenreId(null);
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
        <HeroSection
          movies={allTrendingMovies.slice(0, 5)} // Use first 5 trending movies for rotation
          onWatchNow={() => {
            const currentMovie = allTrendingMovies[0]; // Always use first movie for watch now
            if (currentMovie) handleMovieClick(currentMovie);
          }}
          onAddToList={() => {
            // Add to list functionality
            console.log('Add to list clicked');
          }}
        />

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

          {/* Genre Movies Section */}
          {selectedGenreId && allGenreMovies.length > 0 && (
            <div id="genre-section">
              <InfiniteMovieSection
                title="Genre Movies"
                icon={<Tags className="w-6 h-6 text-netflix-red mr-3" />}
                movies={allGenreMovies}
                onMovieClick={handleMovieClick}
                onLoadMore={() => fetchNextGenreMovies()}
                hasNextPage={hasNextGenrePage}
                isLoadingMore={isFetchingNextGenrePage}
              />
            </div>
          )}
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