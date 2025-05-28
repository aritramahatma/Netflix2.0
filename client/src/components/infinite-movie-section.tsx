import { useEffect, useRef } from "react";
import { TMDBMovie } from "@/types/movie";
import { MovieCard, HorizontalMovieCard } from "./movie-card";
import { LoadingIndicator, MovieGridSkeleton, MovieCardSkeleton } from "./loading-indicator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface InfiniteMovieSectionProps {
  title: string;
  icon?: React.ReactNode;
  movies: TMDBMovie[];
  onMovieClick: (movie: TMDBMovie) => void;
  onLoadMore: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
}

export function InfiniteMovieSection({ 
  title, 
  icon, 
  movies, 
  onMovieClick, 
  onLoadMore,
  hasNextPage,
  isLoadingMore
}: InfiniteMovieSectionProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isLoadingMore, onLoadMore]);

  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          {icon}
          {title}
        </h2>
        <MovieGridSkeleton />
      </div>
    );
  }

  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
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

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        {icon}
        {title}
      </h2>
      
      {isMobile ? (
        <div className="relative group">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          {/* Horizontal scrolling movie cards */}
          <div 
            ref={scrollContainerRef}
            className="flex space-x-3 overflow-x-auto horizontal-scroll pb-4"
          >
            {movies.map((movie, index) => (
              <HorizontalMovieCard
                key={`${movie.id}-${index}`}
                movie={movie}
                onClick={() => onMovieClick(movie)}
              />
            ))}
            
            {isLoadingMore && (
              <div className="flex-none w-40 flex items-center justify-center">
                <LoadingIndicator text="Loading..." />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {movies.map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${index}`}
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

      {/* Infinite scroll trigger for mobile */}
      {isMobile && (
        <div ref={loadMoreRef} className="mt-4 text-center">
          {/* This div triggers infinite scroll on mobile */}
        </div>
      )}
    </div>
  );
}