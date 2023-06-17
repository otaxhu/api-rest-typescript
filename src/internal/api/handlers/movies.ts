import { Request, Response } from "express";
import MovieService, { ServiceErrors } from "../../service/movie_service.js";

export default class HandlerMovies {
    #service: MovieService
    constructor(service: MovieService) {
        this.#service = service
    }
    public getMovies(req: Request, res: Response) {
        const page = parseInt(req.params.page)
        this.#service.getMovies(page)
            .then(movies => res.json(movies))
            .catch((err: ServiceErrors) => {
                if (err === ServiceErrors.ErrPageParamInvalid)
                    return res.status(400).send(err)

                if (err === ServiceErrors.ErrNotFound)
                    return res.status(404).send(err)

                if (err === ServiceErrors.ErrInternalServer)
                    return res.status(500).send(err)
            })
    }
}