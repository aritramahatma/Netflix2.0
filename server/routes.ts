import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const TMDB_API_KEY = process.env.TMDB_API || process.env.TMDB_API_KEY || "7f325eb836c6c510bab73c65fa33d484";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(endpoint: string) {
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get trending movies
  app.get("/api/movies/trending", async (req, res) => {
    try {
      const timeWindow = req.query.time_window || 'day';
      const data = await fetchFromTMDB(`/trending/movie/${timeWindow}`);
      
      // Cache movies in storage
      await storage.cacheMovies(data.results);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      res.status(500).json({ error: "Failed to fetch trending movies" });
    }
  });

  // Get popular movies
  app.get("/api/movies/popular", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const data = await fetchFromTMDB(`/movie/popular?page=${page}`);
      
      // Cache movies in storage
      await storage.cacheMovies(data.results);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      res.status(500).json({ error: "Failed to fetch popular movies" });
    }
  });

  // Get now playing movies
  app.get("/api/movies/now-playing", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const data = await fetchFromTMDB(`/movie/now_playing?page=${page}`);
      
      // Cache movies in storage
      await storage.cacheMovies(data.results);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching now playing movies:", error);
      res.status(500).json({ error: "Failed to fetch now playing movies" });
    }
  });

  // Get top rated movies
  app.get("/api/movies/top-rated", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const data = await fetchFromTMDB(`/movie/top_rated?page=${page}`);
      
      // Cache movies in storage
      await storage.cacheMovies(data.results);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      res.status(500).json({ error: "Failed to fetch top rated movies" });
    }
  });

  // Get upcoming movies
  app.get("/api/movies/upcoming", async (req, res) => {
    try {
      const page = req.query.page || 1;
      const data = await fetchFromTMDB(`/movie/upcoming?page=${page}`);
      
      // Cache movies in storage
      await storage.cacheMovies(data.results);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      res.status(500).json({ error: "Failed to fetch upcoming movies" });
    }
  });

  // Search movies
  app.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.q;
      const page = req.query.page || 1;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query as string)}&page=${page}`);
      
      // Cache movies in storage
      await storage.cacheMovies(data.results);
      
      res.json(data);
    } catch (error) {
      console.error("Error searching movies:", error);
      res.status(500).json({ error: "Failed to search movies" });
    }
  });

  // Get movie details
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movieId = req.params.id;
      const data = await fetchFromTMDB(`/movie/${movieId}?append_to_response=credits,similar,videos`);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      res.status(500).json({ error: "Failed to fetch movie details" });
    }
  });

  // Get movie credits
  app.get("/api/movies/:id/credits", async (req, res) => {
    try {
      const movieId = req.params.id;
      const data = await fetchFromTMDB(`/movie/${movieId}/credits`);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching movie credits:", error);
      res.status(500).json({ error: "Failed to fetch movie credits" });
    }
  });

  // Get similar movies
  app.get("/api/movies/:id/similar", async (req, res) => {
    try {
      const movieId = req.params.id;
      const page = req.query.page || 1;
      const data = await fetchFromTMDB(`/movie/${movieId}/similar?page=${page}`);
      
      // Cache movies in storage
      await storage.cacheMovies(data.results);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      res.status(500).json({ error: "Failed to fetch similar movies" });
    }
  });

  // Get genres
  app.get("/api/genres", async (req, res) => {
    try {
      const data = await fetchFromTMDB("/genre/movie/list");
      
      // Cache genres in storage
      await storage.cacheGenres(data.genres);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });

  // Get movies by genre
  app.get("/api/genres/:id/movies", async (req, res) => {
    try {
      const genreId = req.params.id;
      const page = req.query.page || 1;
      const data = await fetchFromTMDB(`/discover/movie?with_genres=${genreId}&page=${page}`);
      
      // Cache movies in storage
      await storage.cacheMovies(data.results);
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
      res.status(500).json({ error: "Failed to fetch movies by genre" });
    }
  });

  // Get movie configuration
  app.get("/api/configuration", async (req, res) => {
    try {
      const data = await fetchFromTMDB("/configuration");
      res.json(data);
    } catch (error) {
      console.error("Error fetching configuration:", error);
      res.status(500).json({ error: "Failed to fetch configuration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
