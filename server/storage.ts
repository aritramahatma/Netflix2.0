import { users, movies, genres, type User, type InsertUser, type Movie, type Genre } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Movie-related methods
  cacheMovies(movies: Movie[]): Promise<void>;
  getCachedMovies(page: number, pageSize: number): Promise<Movie[]>;
  getCachedMovie(id: number): Promise<Movie | undefined>;
  
  // Genre-related methods
  cacheGenres(genres: Genre[]): Promise<void>;
  getCachedGenres(): Promise<Genre[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private movies: Map<number, Movie>;
  private genres: Map<number, Genre>;
  private moviesList: Movie[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.movies = new Map();
    this.genres = new Map();
    this.moviesList = [];
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async cacheMovies(movies: Movie[]): Promise<void> {
    movies.forEach(movie => {
      this.movies.set(movie.id, movie);
      // Add to list if not already present
      if (!this.moviesList.find(m => m.id === movie.id)) {
        this.moviesList.push(movie);
      }
    });
  }

  async getCachedMovies(page: number, pageSize: number): Promise<Movie[]> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return this.moviesList.slice(startIndex, endIndex);
  }

  async getCachedMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async cacheGenres(genres: Genre[]): Promise<void> {
    genres.forEach(genre => {
      this.genres.set(genre.id, genre);
    });
  }

  async getCachedGenres(): Promise<Genre[]> {
    return Array.from(this.genres.values());
  }
}

export const storage = new MemStorage();
