import { TMDBMovie } from "@/types/movie";
import { getMoviePosterUrl, formatYear, formatRating } from "@/lib/tmdb";
import { Star, Play } from "lucide-react";

interface MovieCardProps {
  movie: TMDBMovie;
  onClick: () => void;
  className?: string;
}

export function MovieCard({ movie, onClick, className = "" }: MovieCardProps) {
  return (
    <div 
      className={`group cursor-pointer movie-card ${className}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={getMoviePosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-64 md:h-72 object-cover"
          loading="lazy"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-8 h-8 md:w-12 md:h-12 text-white mb-2 mx-auto" />
            <p className="text-white font-medium text-sm md:text-base">Watch Now</p>
          </div>
        </div>
        
        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-md">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">
                {formatRating(movie.vote_average)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Movie info */}
      <h3 className="mt-2 font-medium text-white group-hover:text-netflix-red transition-colors text-sm line-clamp-2">
        {movie.title}
      </h3>
      {movie.release_date && (
        <p className="text-muted-foreground text-sm">
          {formatYear(movie.release_date)}
        </p>
      )}
    </div>
  );
}

interface HorizontalMovieCardProps {
  movie: TMDBMovie;
  onClick: () => void;
}

export function HorizontalMovieCard({ movie, onClick }: HorizontalMovieCardProps) {
  return (
    <div 
      className="flex-none w-48 group cursor-pointer movie-card"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={getMoviePosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-72 object-cover"
          loading="lazy"
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-12 h-12 text-white mb-2 mx-auto" />
            <p className="text-white font-medium">Watch Now</p>
          </div>
        </div>
        
        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded-md">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">
                {formatRating(movie.vote_average)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Movie info */}
      <h3 className="mt-3 font-medium text-white group-hover:text-netflix-red transition-colors line-clamp-2">
        {movie.title}
      </h3>
      {movie.release_date && (
        <p className="text-muted-foreground text-sm">
          {formatYear(movie.release_date)}
        </p>
      )}
    </div>
  );
}
