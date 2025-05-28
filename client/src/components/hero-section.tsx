import { TMDBMovie } from "@/types/movie";
import { getMovieBackdropUrl, formatYear, formatRating, getTelegramBotUrl } from "@/lib/tmdb";
import { Star, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  movie: TMDBMovie | null;
  onWatchNow?: () => void;
  onAddToList?: () => void;
}

export function HeroSection({ movie, onWatchNow, onAddToList }: HeroSectionProps) {
  if (!movie) {
    return (
      <section className="relative h-[70vh] md:h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        
        {/* Skeleton loading */}
        <div className="w-full h-full bg-muted animate-pulse"></div>
        
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl space-y-4">
              <div className="h-16 bg-muted rounded animate-pulse"></div>
              <div className="h-24 bg-muted rounded animate-pulse"></div>
              <div className="flex space-x-4">
                <div className="h-12 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-12 w-32 bg-muted rounded animate-pulse"></div>
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
      const telegramUrl = getTelegramBotUrl(movie.title, formatYear(movie.release_date));
      window.open(telegramUrl, '_blank');
    }
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh]">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
      
      {/* Backdrop image */}
      <img
        src={getMovieBackdropUrl(movie.backdrop_path)}
        alt={movie.title}
        className="w-full h-full object-cover"
        loading="eager"
      />
      
      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fadeIn">
              {movie.title}
            </h1>
            
            {movie.overview && (
              <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed animate-fadeIn">
                {movie.overview}
              </p>
            )}
            
            {/* Movie details */}
            <div className="flex items-center space-x-4 mb-8 animate-fadeIn">
              {movie.vote_average > 0 && (
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium">
                    {formatRating(movie.vote_average)}
                  </span>
                </div>
              )}
              
              {movie.release_date && (
                <span className="text-muted-foreground">
                  {formatYear(movie.release_date)}
                </span>
              )}
              
              {movie.runtime && (
                <span className="text-muted-foreground">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-4 animate-fadeIn">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-semibold px-8"
                onClick={handleWatchNow}
              >
                <Play className="w-5 h-5 mr-2" />
                Play
              </Button>
              
              <Button
                size="lg"
                variant="secondary"
                className="bg-gray-600/80 hover:bg-gray-600 font-semibold px-8"
                onClick={onAddToList}
              >
                <Plus className="w-5 h-5 mr-2" />
                My List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
