import { Application } from "express";
import HandlerMovies from "../handlers/movies.js";
import MovieService from "../../service/movie_service.js";

export function registerMoviesRoutes(app: Application, service: MovieService) {
    const handlerMovies = new HandlerMovies(service)
    app.get("/movies/:page", handlerMovies.getMovies.bind(handlerMovies))
}