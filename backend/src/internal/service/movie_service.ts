import Joi from "joi";
import Movie from "../models/movie.js";
import { MovieRepository, RepositoryErrors } from "../repository/movie_repo.js";
import { movieSaveValidator } from "./movie_validator.js";

export default class MovieService {
    #movieRepo: MovieRepository
    #movieSaveValidator: Joi.ObjectSchema<Movie>

    constructor(movieRepo: MovieRepository) {
        this.#movieSaveValidator = movieSaveValidator
        this.#movieRepo = movieRepo
    }

    getMovies(page: number): Promise<Movie[]> {
        return new Promise((resolve, reject) => {

            const limitMovies = 5
            --page
            const offset = limitMovies * page

            if (page < 0)
                return reject(ServiceErrors.ErrPageParamInvalid)

            this.#movieRepo.getMovies(limitMovies, offset)
                .then(movie => resolve(movie))
                .catch((err: RepositoryErrors) => {

                    if (err === RepositoryErrors.ErrNoRows)
                        return reject(ServiceErrors.ErrNotFound)

                    if (err === RepositoryErrors.ErrLimitParamInvalid || err === RepositoryErrors.ErrOffsetParamInvalid)
                        return reject(ServiceErrors.ErrPageParamInvalid)

                    reject(ServiceErrors.ErrInternalServer)
                })
        })
    }

    saveMovie(movie: Movie): Promise<void> {
        return new Promise((resolve, reject) => {
            const { error, value } = this.#movieSaveValidator.validate(movie)

            if (error)
                return reject(ServiceErrors.ErrInvalidMovie)

            this.#movieRepo.insertMovie(value)
                .then(() => resolve())
                .catch(() => reject(ServiceErrors.ErrInternalServer))
        })
    }

    getMovieById(id: number): Promise<Movie> {
        return new Promise((resolve, reject) => {
            this.#movieRepo.getMovieById(id)
                .then(movie => resolve(movie))
                .catch(err => {
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
    ErrInternalServer = "internal server error",
    ErrInvalidMovie = "invalid movie object to save"
}