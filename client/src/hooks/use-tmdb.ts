import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { TMDBMovie, TMDBMovieResponse, TMDBGenre, TMDBGenreResponse } from "@/types/movie";

// Trending movies
export const useTrendingMovies = (timeWindow: 'day' | 'week' = 'day') => {
  return useQuery<TMDBMovieResponse>({
    queryKey: ['/api/movies/trending', timeWindow],
    queryFn: () => fetch(`/api/movies/trending?time_window=${timeWindow}`).then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Popular movies with infinite scroll
export const usePopularMovies = () => {
  return useInfiniteQuery<TMDBMovieResponse>({
    queryKey: ['/api/movies/popular'],
    queryFn: ({ pageParam = 1 }) => 
      fetch(`/api/movies/popular?page=${pageParam}`).then(res => res.json()),
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// Now playing movies
export const useNowPlayingMovies = () => {
  return useQuery<TMDBMovieResponse>({
    queryKey: ['/api/movies/now-playing'],
    queryFn: () => fetch('/api/movies/now-playing').then(res => res.json()),
    staleTime: 5 * 60 * 1000,
  });
};

// Top rated movies
export const useTopRatedMovies = () => {
  return useQuery<TMDBMovieResponse>({
    queryKey: ['/api/movies/top-rated'],
    queryFn: () => fetch('/api/movies/top-rated').then(res => res.json()),
    staleTime: 10 * 60 * 1000, // 10 minutes for top rated
  });
};

// Upcoming movies
export const useUpcomingMovies = () => {
  return useQuery<TMDBMovieResponse>({
    queryKey: ['/api/movies/upcoming'],
    queryFn: () => fetch('/api/movies/upcoming').then(res => res.json()),
    staleTime: 10 * 60 * 1000,
  });
};

// Search movies
export const useSearchMovies = (query: string, enabled: boolean = true) => {
  return useInfiniteQuery<TMDBMovieResponse>({
    queryKey: ['/api/movies/search', query],
    queryFn: ({ pageParam = 1 }) => 
      fetch(`/api/movies/search?q=${encodeURIComponent(query)}&page=${pageParam}`).then(res => res.json()),
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Movie details
export const useMovieDetails = (movieId: number | null) => {
  return useQuery<TMDBMovie>({
    queryKey: ['/api/movies', movieId],
    queryFn: () => fetch(`/api/movies/${movieId}`).then(res => res.json()),
    enabled: movieId !== null,
    staleTime: 10 * 60 * 1000,
  });
};

// Similar movies
export const useSimilarMovies = (movieId: number | null) => {
  return useQuery<TMDBMovieResponse>({
    queryKey: ['/api/movies', movieId, 'similar'],
    queryFn: () => fetch(`/api/movies/${movieId}/similar`).then(res => res.json()),
    enabled: movieId !== null,
    staleTime: 10 * 60 * 1000,
  });
};

// Genres
export const useGenres = () => {
  return useQuery<TMDBGenreResponse>({
    queryKey: ['/api/genres'],
    queryFn: () => fetch('/api/genres').then(res => res.json()),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Movies by genre
export const useMoviesByGenre = (genreId: number | null) => {
  return useInfiniteQuery<TMDBMovieResponse>({
    queryKey: ['/api/genres', genreId, 'movies'],
    queryFn: ({ pageParam = 1 }) => 
      fetch(`/api/genres/${genreId}/movies?page=${pageParam}`).then(res => res.json()),
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: genreId !== null,
    staleTime: 5 * 60 * 1000,
  });
};
