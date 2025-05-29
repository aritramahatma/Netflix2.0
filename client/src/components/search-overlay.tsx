import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TMDBMovie } from "@/types/movie";
import { useSearchMovies } from "@/hooks/use-tmdb";
import { debounce } from "@/lib/tmdb";
import { MovieCard } from "./movie-card";
import { LoadingIndicator } from "./loading-indicator";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieClick: (movie: TMDBMovie) => void;
}

export function SearchOverlay({ isOpen, onClose, onMovieClick }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const debouncedSearch = debounce((query: string) => {
      setDebouncedQuery(query);
    }, 300);

    debouncedSearch(searchQuery);
  }, [searchQuery]);

  const { 
    data: searchResults, 
    isLoading, 
    fetchNextPage, 
    hasNextPage,
    isFetchingNextPage 
  } = useSearchMovies(debouncedQuery, isOpen && debouncedQuery.length > 0);

  const allMovies = searchResults?.pages.flatMap(page => page.results) || [];

  const handleClose = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    onClose();
  };

  const handleMovieClick = (movie: TMDBMovie) => {
    onMovieClick(movie);
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 overflow-y-auto animate-in fade-in-0 duration-300">
      <div className="min-h-screen">
        {/* Search header */}
        <div className="sticky top-0 bg-gradient-to-b from-background via-background/98 to-background/95 backdrop-blur-xl border-b border-border/50 p-6 shadow-2xl">
          <div className="container mx-auto">
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/5 to-transparent rounded-2xl blur-xl"></div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-netflix-red w-6 h-6 animate-pulse" />
                <Input
                  type="text"
                  placeholder="Discover amazing movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-14 py-4 text-lg bg-gradient-to-r from-muted/80 to-muted/60 border-2 border-border/50 hover:border-netflix-red/50 focus:border-netflix-red rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl focus:shadow-2xl"
                  autoFocus
                />
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-netflix-red transition-all duration-200 hover:scale-110 p-1 rounded-full hover:bg-netflix-red/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search results */}
        <div className="container mx-auto px-6 py-12">
          {debouncedQuery.length === 0 ? (
            <div className="text-center py-24 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-netflix-red/10 rounded-full blur-2xl w-32 h-32 mx-auto"></div>
                <Search className="w-20 h-20 text-netflix-red mx-auto relative animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Discover Movies</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                Start typing to explore thousands of amazing movies
              </p>
            </div>
          ) : isLoading ? (
            <div className="py-16">
              <LoadingIndicator text="Searching movies..." />
            </div>
          ) : allMovies.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Search Results for "{debouncedQuery}"
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => handleMovieClick(movie)}
                  />
                ))}
              </div>

              {hasNextPage && (
                <div className="mt-8 text-center">
                  {isFetchingNextPage ? (
                    <LoadingIndicator text="Loading more results..." />
                  ) : (
                    <button
                      onClick={() => fetchNextPage()}
                      className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                    >
                      Load More Results
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieClick: (movie: TMDBMovie) => void;
}

export function MobileSearchOverlay({ isOpen, onClose, onMovieClick }: MobileSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const debouncedSearch = debounce((query: string) => {
      setDebouncedQuery(query);
    }, 300);

    debouncedSearch(searchQuery);
  }, [searchQuery]);

  const { data: searchResults, isLoading } = useSearchMovies(
    debouncedQuery, 
    isOpen && debouncedQuery.length > 0
  );

  const topResults = searchResults?.pages[0]?.results.slice(0, 5) || [];

  const handleClose = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    onClose();
  };

  const handleMovieClick = (movie: TMDBMovie) => {
    onMovieClick(movie);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-black/98 backdrop-blur-2xl z-[70] animate-in fade-in-0 slide-in-from-top-4 duration-300">
      <div className="p-6 pt-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-red/10 via-transparent to-netflix-red/5 rounded-3xl blur-xl"></div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-netflix-red w-6 h-6" />
            <Input
              type="text"
              placeholder="Search amazing movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-16 py-5 text-lg bg-gradient-to-r from-muted/90 to-muted/70 border-2 border-border/30 focus:border-netflix-red rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-300 focus:shadow-netflix-red/20"
              autoFocus
            />
            <button
              onClick={handleClose}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-netflix-red active:text-netflix-red transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-netflix-red/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick results */}
        {debouncedQuery.length > 0 && (
          <div className="mt-8 space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {isLoading ? (
              <div className="text-center py-8">
                <LoadingIndicator text="Discovering movies..." />
              </div>
            ) : topResults.length > 0 ? (
              topResults.map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                  className="flex items-center space-x-5 p-5 bg-gradient-to-r from-muted/90 to-muted/70 rounded-2xl cursor-pointer hover:from-muted hover:to-muted/90 active:scale-[0.98] transition-all duration-300 backdrop-blur-lg border border-border/30 hover:border-netflix-red/30 shadow-lg hover:shadow-xl group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-14 h-20 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/56x80/1f1f1f/888888?text=No+Image';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white line-clamp-2 mb-1">{movie.title}</h4>
                    <p className="text-muted-foreground text-sm">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
                    </p>
                    {movie.vote_average > 0 && (
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-muted-foreground text-sm ml-1">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
