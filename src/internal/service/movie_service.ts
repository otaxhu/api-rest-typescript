import Movie from "../models/movie.js";
import { MovieRepository, RepositoryErrors } from "../repository/movie_repo.js";

export default class MovieService {
    #movieRepo: MovieRepository
    constructor(movieRepo: MovieRepository) {
        this.#movieRepo = movieRepo
    }
    getMovies(page: number): Promise<Movie[]> {
        const limitMovies = 5
        --page
        const offset = limitMovies * page
        return new Promise((resolve, reject) => {

            if (page < 0)
                return reject(ServiceErrors.ErrPageParamInvalid)

            this.#movieRepo.getMovies(limitMovies, offset)
                .then(movie => resolve(movie))
                .catch((err: RepositoryErrors) => {

                    if (err === RepositoryErrors.ErrNoRows)
                        return reject(ServiceErrors.ErrNotFound)

                    reject(ServiceErrors.ErrInternalServer)
                })
        })
    }
}

export enum ServiceErrors {
    ErrNotFound = "resource not found",
    ErrPageParamInvalid = "page param invalid",
    ErrInternalServer = "internal server error"
}