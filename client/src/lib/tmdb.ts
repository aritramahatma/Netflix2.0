import { TMDBConfiguration } from "@/types/movie";

let tmdbConfig: TMDBConfiguration | null = null;

export const getImageUrl = (path: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return '/api/placeholder/400/600';
  
  if (tmdbConfig) {
    return `${tmdbConfig.images.secure_base_url}${size}${path}`;
  }
  
  // Fallback to default TMDB image URL
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const initializeTMDBConfig = async () => {
  if (tmdbConfig) return tmdbConfig;
  
  try {
    const response = await fetch('/api/configuration');
    tmdbConfig = await response.json();
    return tmdbConfig;
  } catch (error) {
    console.error('Failed to fetch TMDB configuration:', error);
    return null;
  }
};

export const formatYear = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
};

export const formatRuntime = (minutes: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const getTelegramBotUrl = (movieTitle: string, movieYear: string): string => {
  const botUsername = process.env.VITE_TELEGRAM_BOT_USERNAME || 'movie404bot';
  const query = encodeURIComponent(`${movieTitle} ${movieYear}`);
  return `https://t.me/${botUsername}?start=${query}`;
};

export const getMoviePosterUrl = (posterPath: string | null): string => {
  if (!posterPath) {
    return 'https://via.placeholder.com/400x600/1f1f1f/888888?text=No+Poster';
  }
  return getImageUrl(posterPath, 'w500');
};

export const getMovieBackdropUrl = (backdropPath: string | null): string => {
  if (!backdropPath) {
    return 'https://via.placeholder.com/1280x720/1f1f1f/888888?text=No+Backdrop';
  }
  return getImageUrl(backdropPath, 'w780');
};

export const getActorProfileUrl = (profilePath: string | null): string => {
  if (!profilePath) {
    return 'https://via.placeholder.com/200x300/1f1f1f/888888?text=No+Photo';
  }
  return getImageUrl(profilePath, 'w500');
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
