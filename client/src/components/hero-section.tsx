import { TMDBMovie } from "@/types/movie";
import { getMovieBackdropUrl, formatYear, formatRating, getTelegramBotUrl } from "@/lib/tmdb";
import { Star, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  movies?: TMDBMovie[];
  movie?: TMDBMovie | null;
  onWatchNow?: () => void;
  onAddToList?: () => void;
}

export function HeroSection({ movies, movie, onWatchNow, onAddToList }: HeroSectionProps) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Use movies array if provided, otherwise fall back to single movie
  const moviesList = movies && movies.length > 0 ? movies : (movie ? [movie] : []);
  const currentMovie = moviesList[currentMovieIndex];

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (moviesList.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMovieIndex((prevIndex) => 
          prevIndex === moviesList.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 150);
    }, 3000);

    return () => clearInterval(interval);
  }, [moviesList.length]);

  if (!currentMovie) {
    return (
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        
        {/* Skeleton loading */}
        <div className="w-full h-full bg-muted animate-pulse"></div>
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-xl sm:max-w-2xl space-y-3 sm:space-y-4">
              <div className="h-12 sm:h-16 bg-muted rounded animate-pulse"></div>
              <div className="h-16 sm:h-24 bg-muted rounded animate-pulse"></div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="h-10 sm:h-12 w-full sm:w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-10 sm:h-12 w-full sm:w-32 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleWatchNow = () => {
    if (onWatchNow) {
      onWatchNow();
    } else {
      // Open Telegram bot as fallback
      const telegramUrl = getTelegramBotUrl(currentMovie.title, formatYear(currentMovie.release_date));
      window.open(telegramUrl, '_blank');
    }
  };

  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
      
      {/* Backdrop image with transition */}
      <div className={`w-full h-full transition-all duration-300 ${isTransitioning ? 'opacity-80 scale-105' : 'opacity-100 scale-100'}`}>
        <img
          src={getMovieBackdropUrl(currentMovie.backdrop_path)}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>
      
      {/* Movie indicators */}
      {moviesList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {moviesList.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentMovieIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-xl sm:max-w-2xl">
            <h1 className={`text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-4 animate-fadeIn transition-all duration-500 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
              {currentMovie.title}
            </h1>
            
            {currentMovie.overview && (
              <p className={`text-sm sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 leading-relaxed animate-fadeIn line-clamp-3 sm:line-clamp-none transition-all duration-500 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
                {currentMovie.overview}
              </p>
            )}
            
            {/* Movie details */}
            <div className={`flex items-center flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 animate-fadeIn text-sm sm:text-base transition-all duration-500 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}>
              {currentMovie.vote_average > 0 && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">
                    {formatRating(currentMovie.vote_average)}
                  </span>
                </div>
              )}
              
              {currentMovie.release_date && (
                <span className="text-muted-foreground">
                  {formatYear(currentMovie.release_date)}
                </span>
              )}
              
              {currentMovie.runtime && (
                <span className="text-muted-foreground hidden sm:inline">
                  {Math.floor(currentMovie.runtime / 60)}h {currentMovie.runtime % 60}m
                </span>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 animate-fadeIn">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-semibold px-6 sm:px-8 text-sm sm:text-base"
                onClick={handleWatchNow}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Play
              </Button>
              
              <Button
                size="lg"
                variant="secondary"
                className="bg-gray-600/80 hover:bg-gray-600 font-semibold px-6 sm:px-8 text-sm sm:text-base"
                onClick={onAddToList}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                My List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
