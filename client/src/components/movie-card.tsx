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
        
        {/* Touch-optimized overlay for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-all duration-300 flex items-center justify-center touch-manipulation">
          <div className="text-center transform translate-y-4 group-hover:translate-y-0 group-active:translate-y-0 transition-transform duration-300">
            <div className="bg-netflix-red hover:bg-red-700 active:bg-red-800 rounded-full p-4 mb-3 mx-auto inline-flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
            <p className="text-white font-semibold text-base tracking-wide drop-shadow-lg">WATCH NOW</p>
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
      <h3 className="mt-2 font-medium text-white transition-colors text-sm line-clamp-2">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-[#db143c]">
            <div className="bg-netflix-red hover:bg-red-700 rounded-full p-4 mb-3 mx-auto inline-flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200 cursor-pointer">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
            <p className="text-white font-semibold text-base tracking-wide">WATCH NOW</p>
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
      <h3 className="mt-3 font-medium text-white transition-colors line-clamp-2">
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
