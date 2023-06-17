import Movie from "../models/movie.js";
import { MovieRepository } from "../repository/movie_repo.js";

export default class MovieService {
    #movieRepo: MovieRepository
    constructor(movieRepo: MovieRepository) {
        this.#movieRepo = movieRepo
    }
    getMovies(page: number): Promise<Movie[]> {
        const limitMovies = 5
        page--
        const offset = limitMovies * page
        return this.#movieRepo.getMovies(limitMovies, offset)
    }
}