import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TMDBMovie } from "@/types/movie";
import { useSearchMovies } from "@/hooks/use-tmdb";
import { debounce } from "@/lib/tmdb";
import { MovieCard } from "./movie-card";
import { LoadingIndicator } from "./loading-indicator";
import { useLocation } from "wouter";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieClick: (movie: TMDBMovie) => void;
}

export function SearchOverlay({ isOpen, onClose, onMovieClick }: SearchOverlayProps) {
  const [, setLocation] = useLocation();
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
    onClose();
    setLocation(`/movie/${movie.id}`);
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Search header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4">
          <div className="container mx-auto">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-3 text-lg bg-muted border-border focus:border-netflix-red"
                autoFocus
              />
              <button
                onClick={handleClose}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search results */}
        <div className="container mx-auto px-4 py-8">
          {debouncedQuery.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Search for Movies</h3>
              <p className="text-muted-foreground">
                Enter a movie title to start searching
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
  const [, setLocation] = useLocation();
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
    onClose();
    setLocation(`/movie/${movie.id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-[70]">
      <div className="p-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-14 py-4 text-lg bg-gradient-to-r from-muted to-muted/80 border-2 border-transparent focus:border-netflix-red rounded-full shadow-lg"
            autoFocus
          />
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-netflix-red active:text-netflix-red transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick results */}
        {debouncedQuery.length > 0 && (
          <div className="mt-4 space-y-2">
            {isLoading ? (
              <div className="text-center py-4">
                <LoadingIndicator text="Searching..." />
              </div>
            ) : topResults.length > 0 ? (
              topResults.map((movie) => (
                <div
                  key={movie.id}
                  className="flex p-3 hover:bg-muted/50 rounded cursor-pointer"
                  onClick={() => handleMovieClick(movie)}
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