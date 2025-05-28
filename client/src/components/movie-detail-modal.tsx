import { TMDBMovie, TMDBCastMember } from "@/types/movie";
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
import { X, Star, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingIndicator } from "./loading-indicator";
import { MovieCard } from "./movie-card";

interface MovieDetailModalProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onMovieClick: (movie: TMDBMovie) => void;
}

export function MovieDetailModal({ movieId, isOpen, onClose, onMovieClick }: MovieDetailModalProps) {
  const { data: movie, isLoading: isMovieLoading } = useMovieDetails(movieId);
  const { data: similarMovies } = useSimilarMovies(movieId);

  const handleWatchOnTelegram = () => {
    if (movie) {
      const telegramUrl = getTelegramBotUrl(movie.title, formatYear(movie.release_date));
      window.open(telegramUrl, '_blank');
    }
  };

  const handleSimilarMovieClick = (similarMovie: TMDBMovie) => {
    onMovieClick(similarMovie);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto modal-overlay animate-fadeIn">
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
        <div className="bg-card rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden modal-content animate-scaleIn">
          {isMovieLoading || !movie ? (
            <div className="h-96 flex items-center justify-center">
              <LoadingIndicator text="Loading movie details..." />
            </div>
          ) : (
            <>
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={getMovieBackdropUrl(movie.backdrop_path)}
                  alt={movie.title}
                  className="w-full h-64 object-cover -z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"></div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-black/50 hover:bg-black/70 rounded-full w-8 h-8 sm:w-10 sm:h-10 z-10"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <ScrollArea className="h-[calc(95vh-12rem)] sm:h-[calc(90vh-16rem)]">
                <div className="p-3 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Movie Poster */}
                    <div className="md:col-span-1">
                      <img
                        src={getMoviePosterUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>

                    {/* Movie Info */}
                    <div className="md:col-span-2">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{movie.title}</h1>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                        {movie.vote_average > 0 && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="font-medium">{formatRating(movie.vote_average)}</span>
                          </div>
                        )}
                        
                        {movie.release_date && (
                          <span className="text-muted-foreground">
                            {formatYear(movie.release_date)}
                          </span>
                        )}
                        
                        {movie.runtime && (
                          <span className="text-muted-foreground">
                            {formatRuntime(movie.runtime)}
                          </span>
                        )}
                        
                        {!movie.adult && (
                          <Badge variant="secondary">PG-13</Badge>
                        )}
                      </div>

                      {/* Genres */}
                      {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {movie.genres.map((genre) => (
                            <Badge key={genre.id} className="bg-netflix-red hover:bg-netflix-red/80">
                              {genre.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Overview */}
                      {movie.overview && (
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {movie.overview}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                        <Button 
                          className="bg-netflix-red hover:bg-red-700 font-semibold text-sm sm:text-base transition-fast hover-lift hover-glow"
                          onClick={handleWatchOnTelegram}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch on Telegram
                        </Button>
                        <Button variant="secondary" className="font-semibold text-sm sm:text-base transition-fast hover-lift">
                          <Plus className="w-4 h-4 mr-2" />
                          Add to List
                        </Button>
                      </div>

                      {/* Cast Section */}
                      {movie.credits && movie.credits.cast.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg sm:text-xl font-semibold mb-3">Cast</h3>
                          <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 cast-scroll">
                            {movie.credits.cast.slice(0, 10).map((actor: TMDBCastMember) => (
                              <div key={actor.id} className="flex-none text-center min-w-[80px] sm:min-w-[100px]">
                                <div className="flex flex-col items-center">
                                  <img
                                    src={getActorProfileUrl(actor.profile_path)}
                                    alt={actor.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-2 mx-auto"
                                  />
                                  <p className="text-xs sm:text-sm font-medium line-clamp-2 text-center">{actor.name}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1 text-center">{actor.character}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Similar Movies */}
                      {similarMovies && similarMovies.results.length > 0 && (
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold mb-3">Similar Movies</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {similarMovies.results.slice(0, 6).map((similarMovie) => (
                              <div
                                key={similarMovie.id}
                                className="group cursor-pointer transition-smooth hover-lift"
                                onClick={() => handleSimilarMovieClick(similarMovie)}
                              >
                                <img
                                  src={getMoviePosterUrl(similarMovie.poster_path)}
                                  alt={similarMovie.title}
                                  className="w-full h-24 sm:h-32 object-cover rounded group-hover:scale-105 transition-fast"
                                />
                                <p className="text-xs sm:text-sm mt-1 transition-fast line-clamp-2">
                                  {similarMovie.title}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
