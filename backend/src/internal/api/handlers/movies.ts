import { Request, Response } from "express";
import MovieService, { ServiceErrors } from "../../service/movie_service.js";
import Movie from "../../models/movie.js";

export default class HandlerMovies {
    #service: MovieService
    constructor(service: MovieService) {
        this.#service = service
    }
    getMovies(req: Request, res: Response) {
        const page = parseInt(req.query.page as string)

        this.#service.getMovies(page)
            .then(movies => res.json(movies))
            .catch((err: ServiceErrors) => {
                if (err === ServiceErrors.ErrPageParamInvalid)
                    return res.status(400).send(err)

                if (err === ServiceErrors.ErrNotFound)
                    return res.status(404).send(err)

                res.status(500).send(err)
            })
    }

    getMovieById(req: Request, res: Response) {
        const id = parseInt(req.params.id)
        this.#service.getMovieById(id)
            .then(movie => res.json(movie))
            .catch((err: ServiceErrors) => {

                if (err === ServiceErrors.ErrNotFound)
                    return res.status(404).send(err)

                res.status(500).send(err)
            })
    }

    postMovie(req: Request, res: Response) {
        const movie: Movie = req.body
        movie.cover_url = `${req.protocol}://${req.hostname}:${req.app.get("port")}/${req.file?.path.replace(/\\/g, "/")}`
        this.#service.saveMovie(movie)
            .then(() => res.status(201).send())
            .catch((err: ServiceErrors) => {
                if (err === ServiceErrors.ErrInvalidMovie)
                    return res.status(400).send(err)

                res.status(500).send(err)
            })
    }
}