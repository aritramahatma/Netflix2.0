import { useEffect, useRef } from "react";
import { TMDBMovie } from "@/types/movie";
import { MovieCard } from "./movie-card";
import { LoadingIndicator, MovieGridSkeleton } from "./loading-indicator";

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

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        {icon}
        {title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {movies.map((movie, index) => (
          <MovieCard
            key={`grid-${movie.id}-${Math.floor(index / 20)}-${index % 20}`}
            movie={movie}
            onClick={() => onMovieClick(movie)}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="mt-8 text-center">
        {isLoadingMore && (
          <LoadingIndicator text="Loading more movies..." />
        )}
      </div>
    </div>
  );
}