import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { TMDBMovie } from "@/types/movie";
import { useMoviesByGenre, useGenres } from "@/hooks/use-tmdb";
import { initializeTMDBConfig } from "@/lib/tmdb";
import { Header } from "@/components/header";
import { InfiniteMovieSection } from "@/components/infinite-movie-section";
import { SearchOverlay, MobileSearchOverlay } from "@/components/search-overlay";
import { SideMenu } from "@/components/side-menu";
import { MovieDetailModal } from "@/components/movie-detail-modal";
import { Button } from "@/components/ui/button";
import { ChevronUp, Tags, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function GenrePage() {
  const [, params] = useRoute("/genre/:id");
  const genreId = params?.id ? parseInt(params.id) : null;
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch genre data
  const { data: genresData } = useGenres();
  const { 
    data: genreMoviesData, 
    fetchNextPage: fetchNextGenreMovies,
    hasNextPage: hasNextGenrePage,
    isFetchingNextPage: isFetchingNextGenrePage
  } = useMoviesByGenre(genreId);

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

  // Get all genre movies from all pages
  const allGenreMovies = genreMoviesData?.pages.flatMap(page => page.results) || [];
  
  // Find current genre name
  const currentGenre = genresData?.genres.find(g => g.id === genreId);

  const handleMovieClick = (movie: TMDBMovie) => {
    setSelectedMovieId(movie.id);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  const handleNavigation = (section: string, genreId?: number) => {
    setIsMenuOpen(false);
    
    switch (section) {
      case 'home':
        window.location.href = '/';
        break;
      case 'genre':
        if (genreId) {
          window.location.href = `/genre/${genreId}`;
        }
        break;
      default:
        console.log('Navigate to:', section);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMoreGenreMovies = () => {
    if (hasNextGenrePage && !isFetchingNextGenrePage) {
      fetchNextGenreMovies();
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
        {/* Page Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-netflix-red/20">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold flex items-center">
                <Tags className="w-8 h-8 text-netflix-red mr-4" />
                {currentGenre?.name || 'Genre'} Movies
              </h1>
              <p className="text-muted-foreground mt-2">
                Discover the best {currentGenre?.name?.toLowerCase()} movies
              </p>
            </div>
          </div>
        </div>

        {/* Genre Movies Grid */}
        <section className="pb-12">
          <InfiniteMovieSection
            title=""
            movies={allGenreMovies}
            onMovieClick={handleMovieClick}
            onLoadMore={handleLoadMoreGenreMovies}
            hasNextPage={hasNextGenrePage}
            isLoadingMore={isFetchingNextGenrePage}
          />
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