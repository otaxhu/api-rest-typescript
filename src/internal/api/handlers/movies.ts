import { Request, Response } from "express";
import MovieService from "../../service/movie_service.js";

export default class HandlerMovies {
    #service: MovieService
    constructor(service: MovieService) {
        this.#service = service
    }
    public getMovies(req: Request, res: Response) {
        const page = parseInt(req.params.page)
        this.#service.getMovies(page)
            .then(movies => res.json(movies))
            .catch(err => res.status(500).json("hubo un error"))
    }
}