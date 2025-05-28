import { TMDBMovie } from "@/types/movie";
import { HorizontalMovieCard, MovieCard } from "./movie-card";
import { LoadingIndicator, MovieCardSkeleton, MovieGridSkeleton } from "./loading-indicator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface MovieSectionProps {
  title: string;
  icon?: React.ReactNode;
  movies: TMDBMovie[];
  onMovieClick: (movie: TMDBMovie) => void;
  loading?: boolean;
  layout?: 'horizontal' | 'grid';
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
}

export function MovieSection({ 
  title, 
  icon, 
  movies, 
  onMovieClick, 
  loading = false,
  layout = 'horizontal',
  onLoadMore,
  hasNextPage,
  isLoadingMore
}: MovieSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (loading && movies.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          {icon}
          {title}
        </h2>
        {layout === 'horizontal' ? (
          <div className="flex space-x-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <MovieGridSkeleton />
        )}
      </div>
    );
  }

  if (!loading && movies.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          {icon}
          {title}
        </h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No movies found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        {icon}
        {title}
      </h2>
      
      {layout === 'horizontal' ? (
        <div className="relative group">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Movie cards */}
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto horizontal-scroll pb-4"
          >
            {movies.map((movie) => (
              <HorizontalMovieCard
                key={movie.id}
                movie={movie}
                onClick={() => onMovieClick(movie)}
              />
            ))}
            
            {isLoadingMore && (
              <div className="flex-none w-48 flex items-center justify-center">
                <LoadingIndicator text="Loading more..." />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => onMovieClick(movie)}
              />
            ))}
          </div>
          
          {hasNextPage && onLoadMore && (
            <div className="mt-8 text-center">
              {isLoadingMore ? (
                <LoadingIndicator text="Loading more movies..." />
              ) : (
                <button
                  onClick={onLoadMore}
                  className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                >
                  Load More Movies
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
