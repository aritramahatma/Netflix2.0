
import { useParams } from "wouter";
import { TMDBMovie } from "@/types/movie";
import { 
  getMovieBackdropUrl, 
  getMoviePosterUrl, 
  getActorProfileUrl,
  formatYear, 
  formatRating, 
  formatRuntime,
  getTelegramBotUrl 
} from "@/lib/tmdb";
import { useMovieDetails, useSimilarMovies } from "@/hooks/use-tmdb";
import { Star, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingIndicator } from "@/components/loading-indicator";
import { MovieCard } from "@/components/movie-card";
import { Header } from "@/components/header";
import { useLocation } from "wouter";
import { useState } from "react";
import { SideMenu } from "@/components/side-menu";
import { SearchOverlay } from "@/components/search-overlay";

export default function MovieDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const movieId = params.id ? parseInt(params.id) : null;
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: movieDetails, isLoading: detailsLoading } = useMovieDetails(movieId);
  const { data: similarMovies, isLoading: similarLoading } = useSimilarMovies(movieId);

  if (!movieId) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header
          onSearchClick={() => {}}
          onMobileSearchClick={() => {}}
          onMenuClick={() => {}}
          isSearchOpen={false}
        />
        <div className="pt-20 p-8 text-center">
          <h1 className="text-2xl font-bold">Movie not found</h1>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header
          onSearchClick={() => {}}
          onMobileSearchClick={() => {}}
          onMenuClick={() => {}}
          isSearchOpen={false}
        />
        <div className="pt-20">
          <LoadingIndicator text="Loading movie details..." />
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header
          onSearchClick={() => {}}
          onMobileSearchClick={() => {}}
          onMenuClick={() => {}}
          isSearchOpen={false}
        />
        <div className="pt-20 p-8 text-center">
          <h1 className="text-2xl font-bold">Movie details not available</h1>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const handleMovieClick = (movie: TMDBMovie) => {
    setLocation(`/movie/${movie.id}`);
  };

  const handleWatchNow = () => {
    const telegramUrl = getTelegramBotUrl(movieDetails.title, movieDetails.release_date);
    window.open(telegramUrl, '_blank');
  };

  const handleNavigation = (section: string, genreId?: number) => {
    setIsMenuOpen(false);
    
    switch (section) {
      case 'home':
        setLocation('/');
        break;
      case 'trending':
      case 'movies':
      case 'watchlist':
      case 'settings':
      case 'help':
        setLocation('/');
        break;
      default:
        console.log('Navigate to:', section);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onSearchClick={() => setIsSearchOpen(true)}
        onMobileSearchClick={() => setIsSearchOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
        isSearchOpen={isSearchOpen}
      />

      <div className="pt-20">
        {/* Movie Details */}
        <div className="relative">
          {/* Backdrop */}
          <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            <img
              src={getMovieBackdropUrl(movieDetails.backdrop_path)}
              alt={movieDetails.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative -mt-32 z-10 px-4 md:px-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={getMoviePosterUrl(movieDetails.poster_path)}
                  alt={movieDetails.title}
                  className="w-48 md:w-64 rounded-lg shadow-2xl mx-auto md:mx-0"
                />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                    {movieDetails.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {movieDetails.release_date && (
                      <span>{formatYear(movieDetails.release_date)}</span>
                    )}
                    {movieDetails.runtime && (
                      <span>{formatRuntime(movieDetails.runtime)}</span>
                    )}
                    {movieDetails.vote_average > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{formatRating(movieDetails.vote_average)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Genres */}
                {movieDetails.genres && movieDetails.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movieDetails.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Overview */}
                {movieDetails.overview && (
                  <p className="text-muted-foreground max-w-3xl leading-relaxed">
                    {movieDetails.overview}
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleWatchNow}
                    className="bg-netflix-red hover:bg-red-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2 fill-white" />
                    Watch Now
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to List
                  </Button>
                </div>
              </div>
            </div>

            {/* Cast */}
            {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
                <ScrollArea className="w-full">
                  <div className="flex space-x-4 pb-4">
                    {movieDetails.credits.cast.slice(0, 10).map((actor) => (
                      <div key={actor.id} className="flex-none w-32 text-center">
                        <img
                          src={getActorProfileUrl(actor.profile_path)}
                          alt={actor.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                        />
                        <p className="text-sm font-medium text-white line-clamp-1">
                          {actor.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Similar Movies */}
            {similarMovies && similarMovies.results.length > 0 && (
              <div className="mt-12 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
                <ScrollArea className="w-full">
                  <div className="flex space-x-4 pb-4">
                    {similarMovies.results.slice(0, 10).map((movie) => (
                      <div key={movie.id} className="flex-none w-48">
                        <MovieCard
                          movie={movie}
                          onClick={() => handleMovieClick(movie)}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onMovieClick={handleMovieClick}
      />

      {/* Side Menu */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigation}
      />
    </div>
  );
}
